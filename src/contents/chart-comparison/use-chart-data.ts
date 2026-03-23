import { useMemo } from "react";
import { ChartComparisonProps } from "./index";

export type ChartDataState = {
  values: Float32Array; // [frame * numItems + itemIndex]
  ranks: Uint16Array; // [frame * numItems + itemIndex]
  deathFrames: Int32Array; // [itemIndex] -1 if never dies
  itemTitles: string[];
};

const toMonths = (dateStr: string) => {
  const [m, y] = dateStr.split("/").map(Number);
  return y * 12 + (m - 1);
};

export const useChartData = ({
  items: allItems,
  animationDuration,
  fps,
  growthMonths,
  maxItems,
  jumpDuration,
  barSpacing,
  barItemHeight,
}: ChartComparisonProps & { fps: number }) => {
  // 1. Memoize basic setup

  // 2. Pre-calculate Timeline Segments (Reuse logic from index.tsx but extracted)
  const timelineSegments = useMemo(() => {
    const jumpDurationInFrames = Math.max(1, jumpDuration * fps);
    const totalFrames = animationDuration * fps;

    // Filter items logic (same as original to get 'items' subset if needed,
    // but here we process ALL items for the caching to be safe and simple
    // OR we repeat the exact logic to determine which items are 'active' at what time)
    // Actually, the original logic filters `allItems` into `items` based on the simulation.
    // We MUST replicate that filtering logic first because `items` in `index.tsx`
    // is NOT `allItems` passed to props, it's a processed list with `deathMonth`.

    // Let's replicate the "Simulation" to determine active set and death months
    const processedItems: ((typeof allItems)[0] & { deathMonth?: number })[] =
      [];
    const activeItems: {
      title: string;
      startTime: number;
      gross: number;
      currentVal: number;
      resultIndex: number;
    }[] = [];

    for (const item of allItems) {
      const itemStartMonth = toMonths(item.startTime);

      // Update currentVal
      activeItems.forEach((act) => {
        const monthsDiff = itemStartMonth - act.startTime;
        const progress = Math.min(Math.max(monthsDiff / growthMonths, 0), 1);
        act.currentVal = act.gross * progress;
      });

      // Sort
      activeItems.sort((a, b) => b.currentVal - a.currentVal);

      if (activeItems.length < maxItems) {
        const newIndex = processedItems.push({ ...item }) - 1;
        activeItems.push({
          ...item,
          startTime: itemStartMonth,
          currentVal: 0,
          resultIndex: newIndex,
        });
      } else {
        const minItem = activeItems[maxItems - 1];
        if (item.gross > minItem.currentVal) {
          // Replacement logic
          let victimIndex = -1;
          for (let i = activeItems.length - 1; i >= 0; i--) {
            const act = activeItems[i];
            const age = itemStartMonth - act.startTime;
            if (age >= growthMonths) {
              victimIndex = i;
              break;
            }
          }
          if (victimIndex === -1) victimIndex = maxItems - 1;

          const victim = activeItems[victimIndex];
          if (processedItems[victim.resultIndex]) {
            processedItems[victim.resultIndex].deathMonth = itemStartMonth;
          }
          activeItems.splice(victimIndex, 1);

          const newIndex = processedItems.push({ ...item }) - 1;
          activeItems.push({
            ...item,
            startTime: itemStartMonth,
            currentVal: 0,
            resultIndex: newIndex,
          });
        }
      }
    }

    // Now we have the final list of items that will appear in the chart
    const items = processedItems;

    // --- Segment Building (Copied from index.tsx) ---
    type Segment = {
      type: "growth" | "jump";
      itemIndex: number;
      startFrame: number;
      endFrame: number;
      startMonth: number;
      endMonth: number;
    };
    const segments: Segment[] = [];

    // First pass stats
    let totalJumpFrames = 0;
    let zeroGrowthItemsCount = 0;

    for (let i = 0; i < items.length; i++) {
      const itemStart = toMonths(items[i].startTime);
      const nextStart =
        i < items.length - 1 ? toMonths(items[i + 1].startTime) : Infinity;
      const growthEnd = Math.min(itemStart + growthMonths, nextStart);

      if (growthEnd === itemStart) zeroGrowthItemsCount++;

      if (i < items.length - 1 && nextStart > growthEnd) {
        let curr = growthEnd;
        while (curr < nextStart) {
          const step = nextStart - curr > 12 ? 12 : 1;
          totalJumpFrames += jumpDurationInFrames;
          curr += step;
        }
      }
    }

    const validGrowthCount = items.length - zeroGrowthItemsCount;
    // Fix: Avoid division by zero
    const framesPerGrowth =
      validGrowthCount > 0
        ? (totalFrames - totalJumpFrames) / validGrowthCount
        : 0;

    let currentFrame = 0;
    items.forEach((item, i) => {
      const itemStart = toMonths(item.startTime);
      const nextStart =
        i < items.length - 1 ? toMonths(items[i + 1].startTime) : Infinity;
      const growthEnd = Math.min(itemStart + growthMonths, nextStart);

      let segDur = framesPerGrowth;
      if (growthEnd === itemStart) segDur = 0;

      const growthEndFrame = currentFrame + segDur;

      segments.push({
        type: "growth",
        itemIndex: i,
        startFrame: currentFrame,
        endFrame: growthEndFrame,
        startMonth: itemStart,
        endMonth: growthEnd,
      });

      currentFrame = growthEndFrame;

      if (i < items.length - 1 && nextStart > growthEnd) {
        let curr = growthEnd;
        while (curr < nextStart) {
          const step = nextStart - curr > 12 ? 12 : 1;
          const jumpEnd = currentFrame + jumpDurationInFrames;
          segments.push({
            type: "jump",
            itemIndex: i,
            startFrame: currentFrame,
            endFrame: jumpEnd,
            startMonth: curr,
            endMonth: curr + step,
          });
          currentFrame = jumpEnd;
          curr += step;
        }
      }
    });

    return { segments, items };
  }, [allItems, maxItems, growthMonths, animationDuration, fps, jumpDuration]);

  // 3. Pre-calculate All Frames
  const frameCache = useMemo(() => {
    const { segments, items } = timelineSegments;
    const totalFrames = Math.ceil(animationDuration * fps);
    const numItems = items.length;

    // Flattened arrays for performance
    // values[frame * numItems + index]
    const values = new Float32Array(totalFrames * numItems);
    const ranks = new Uint16Array(totalFrames * numItems);
    const months = new Float32Array(totalFrames);

    // Helper to write to cache
    const setValue = (f: number, idx: number, val: number) => {
      if (f >= 0 && f < totalFrames) values[f * numItems + idx] = val;
    };
    const setRank = (f: number, idx: number, r: number) => {
      if (f >= 0 && f < totalFrames) ranks[f * numItems + idx] = r;
    };
    const setMonth = (f: number, m: number) => {
      if (f >= 0 && f < totalFrames) months[f] = m;
    };

    // ... (rest of logic)

    // We need a temp buffer for sorting ranks
    const sortBuffer = new Array(numItems)
      .fill(0)
      .map((_, i) => ({ index: i, value: 0 }));

    for (const seg of segments) {
      const startF = Math.floor(seg.startFrame);
      const endF = Math.ceil(seg.endFrame); // exclusive-ish, handle overlaps carefully

      for (let f = startF; f < endF; f++) {
        if (f >= totalFrames) break;

        const progress =
          (f - seg.startFrame) / (seg.endFrame - seg.startFrame || 1);
        const monthDisp =
          seg.startMonth + progress * (seg.endMonth - seg.startMonth);

        setMonth(f, monthDisp);

        // Calculate values for ALL items up to current segment itemIndex
        // ... (rest of loop)

        for (let i = 0; i < numItems; i++) {
          const item = items[i];
          let val = 0;

          if (i <= seg.itemIndex) {
            // Check death
            if (item.deathMonth !== undefined && monthDisp >= item.deathMonth) {
              val = 0;
            } else {
              const itemStart = toMonths(item.startTime);
              const p = Math.min(
                Math.max((monthDisp - itemStart) / growthMonths, 0),
                1,
              );
              val = item.gross * p;
            }
          }

          setValue(f, i, val);
          sortBuffer[i].index = i;
          sortBuffer[i].value = val;
        }

        // Calculate Ranks
        // Sort by value descending
        sortBuffer.sort((a, b) => b.value - a.value);

        // Apply Visual Rank Logic with unique ranks
        // Strategy:
        // 1. Initially, the top `maxItems` in sortBuffer are "visible".
        // 2. Identify "Intro Items" that are currently NOT in the top `maxItems`.
        // 3. Force them in by displacing the lowest-ranking "Non-Intro" items from the visible set.
        // 4. Assign ranks 0..maxItems-1 to the final visible set, preserving value order.

        // Initial visibility set (by index in sortBuffer)
        const isVisibleInChart = new Uint8Array(numItems); // 0 or 1
        // Mark top maxItems as visible initially
        for (let k = 0; k < numItems; k++) {
          isVisibleInChart[sortBuffer[k].index] = k < maxItems ? 1 : 0;
        }

        // Identify items that MUST be visible (Intro items)
        // And items that CAN be dropped (Non-intro items currently visible)
        const introIndicesExluded: number[] = [];

        // We only check excluded items (from maxItems onwards)
        for (let k = maxItems; k < numItems; k++) {
          const idx = sortBuffer[k].index;
          const item = items[idx];
          // Only care if item is actually active (value > 0 or just started)
          // Intro condition:
          // Re-check intro condition
          const start = toMonths(item.startTime);
          const isIntro =
            monthDisp >= start && monthDisp < start + growthMonths;
          // Also must be <= seg.itemIndex to be "born"
          if (isIntro && idx <= seg.itemIndex) {
            introIndicesExluded.push(k); // Store sortBuffer index
          }
        }

        // Processing swaps
        if (introIndicesExluded.length > 0) {
          let candidatesFound = 0;
          // Find victims from bottom of visible list up
          for (let k = maxItems - 1; k >= 0; k--) {
            if (candidatesFound >= introIndicesExluded.length) break;

            const idx = sortBuffer[k].index;
            const item = items[idx];
            const start = toMonths(item.startTime);
            const isIntro =
              monthDisp >= start && monthDisp < start + growthMonths;

            // If NOT intro, it is a victim
            if (!isIntro) {
              // Swap visibility
              // We don't change sortBuffer order, just the 'isVisibleInChart' flag?
              // No, to assign ranks correctly based on value, it's better if we just mark them
              // and then iterate sortBuffer to assign 0..N ranks to those marked visible.

              isVisibleInChart[idx] = 0; // Drop this one

              // Enable the corresponding excluded intro item
              const introInfosBufferIdx = introIndicesExluded[candidatesFound];
              isVisibleInChart[sortBuffer[introInfosBufferIdx].index] = 1;

              candidatesFound++;
            }
          }
        }

        // Now assign final ranks
        // We iterate through sortBuffer (which is sorted by value).
        // If an item is marked visible, it gets the next available rank (0, 1, ...).
        // If not, it gets pushed to the end (maxItems, maxItems+1...).

        let visibleRankCounter = 0;
        let invisibleRankCounter = maxItems;

        for (let k = 0; k < numItems; k++) {
          const idx = sortBuffer[k].index;
          if (isVisibleInChart[idx] === 1) {
            setRank(f, idx, visibleRankCounter++);
          } else {
            setRank(f, idx, invisibleRankCounter++);
          }
        }
      }
    }

    // Fill remaining frames if any (timeAfter)
    const lastSeg = segments[segments.length - 1];
    if (lastSeg && lastSeg.endFrame < totalFrames) {
      // Just copy the last frame state to end
      const sourceF = Math.floor(lastSeg.endFrame) - 1;
      if (sourceF >= 0) {
        for (let f = Math.floor(lastSeg.endFrame); f < totalFrames; f++) {
          setMonth(f, months[sourceF]);
          for (let i = 0; i < numItems; i++) {
            setValue(f, i, values[sourceF * numItems + i]);
            setRank(f, i, ranks[sourceF * numItems + i]);
          }
        }
      }
    }

    return { values, ranks, months, totalFrames, numItems };
  }, [timelineSegments, animationDuration, fps, growthMonths, maxItems]);

  const { items } = timelineSegments;

  const getDataAtFrame = (frame: number) => {
    // Clamp frame
    const f = Math.min(
      Math.max(0, Math.floor(frame)),
      frameCache.totalFrames - 1,
    );
    const { values, ranks, months, numItems } = frameCache;

    // Retrieve data for this frame
    const frameValues: Record<string, number> = {};
    const frameRanks: Record<string, number> = {};

    // Optimization: Only return data for items that have value > 0 or are just about to/have just died?
    // For safety, return all map. The loop is 150 items, fast enough.

    for (let i = 0; i < numItems; i++) {
      const title = items[i].title;
      frameValues[title] = values[f * numItems + i];
      frameRanks[title] = ranks[f * numItems + i];
    }

    return { values: frameValues, ranks: frameRanks, monthDisp: months[f] };
  };

  const getSmoothY = (
    itemIndex: number,
    currentFrame: number,
    windowSize = 8,
  ) => {
    const { ranks, numItems, totalFrames } = frameCache;
    let total = 0;

    for (let j = 0; j < windowSize; j++) {
      const f = Math.min(
        Math.max(0, Math.floor(currentFrame - j)),
        totalFrames - 1,
      );
      const r = ranks[f * numItems + itemIndex];
      // We need to convert rank to Y position immediately?
      // Or just return average rank.
      // The bar calculation uses: visualRank * (barHeight + barSpacing)
      // So average rank is enough.
      total += r;
    }
    return (total / windowSize) * (barItemHeight + barSpacing);
  };

  return {
    items,
    getDataAtFrame,
    getSmoothY,
    // also expose useful cache/segments if needed
    totalFrames: frameCache.totalFrames,
    timelineSegments: timelineSegments.segments,
  };
};
