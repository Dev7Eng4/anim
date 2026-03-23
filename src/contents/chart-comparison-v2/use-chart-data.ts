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

type Segment = {
  type: "growth" | "jump";
  itemIndex: number;
  startFrame: number;
  endFrame: number;
  startMonth: number;
  endMonth: number;
};

export const useChartData = ({
  items: allItems,
  fps,
  growthMonths,
  maxItems,
  secondsPerMonth,
  barSpacing,
  barItemHeight,
}: ChartComparisonProps & { fps: number }) => {
  const framesPerMonth = secondsPerMonth * fps;
  const framesPerYear = 12 * framesPerMonth;
  const jumpDurationInFrames = 0.5 * framesPerMonth; // Fixed transition 0.5 month

  // 1. Pre-calculate Timeline Segments
  const timelineSegments = useMemo(() => {
    const isTimeSeries = allItems.length > 0 && !!allItems[0].data;

    if (isTimeSeries) {
      // --- Time Series Logic ---
      let minYear = Infinity;
      let maxYear = -Infinity;

      allItems.forEach((item) => {
        item.data?.forEach((d) => {
          if (d.year < minYear) minYear = d.year;
          if (d.year > maxYear) maxYear = d.year;
        });
      });

      if (minYear === Infinity) minYear = 2000;
      if (maxYear === -Infinity) maxYear = 2024;

      const segments: Segment[] = [];
      let currentFrame = 0;

      for (let y = minYear; y < maxYear; y++) {
        const yearGrowthFrames = framesPerYear - jumpDurationInFrames;
        const yearEndFrame = currentFrame + yearGrowthFrames;
        segments.push({
          type: "growth",
          itemIndex: -1,
          startFrame: currentFrame,
          endFrame: yearEndFrame,
          startMonth: y * 12,
          endMonth: y * 12 + 11.5,
        });
        currentFrame = yearEndFrame;

        const jumpEndFrame = currentFrame + jumpDurationInFrames;
        segments.push({
          type: "jump",
          itemIndex: -1,
          startFrame: currentFrame,
          endFrame: jumpEndFrame,
          startMonth: y * 12 + 11.5,
          endMonth: (y + 1) * 12,
        });
        currentFrame = jumpEndFrame;
      }

      return { segments, items: allItems.map(it => ({...it})), isTimeSeries, totalFrames: currentFrame };
    }

    // --- Original Birth-based Logic ---
    const processedItems: (((typeof allItems)[0] & { deathMonth?: number; [key: string]: any }))[] = [];
    const activeItems: {
      title: string;
      startTime: number;
      gross: number;
      currentVal: number;
      resultIndex: number;
    }[] = [];

    for (const item of allItems) {
      const { startTime, gross, title, ...rest } = item;
      const itemStartMonth = toMonths(startTime!);
      activeItems.forEach((act) => {
        const monthsDiff = itemStartMonth - act.startTime;
        const progress = Math.min(Math.max(monthsDiff / growthMonths, 0), 1);
        act.currentVal = (act.gross || 0) * progress;
      });
      activeItems.sort((a, b) => b.currentVal - a.currentVal);

      if (activeItems.length < maxItems) {
        const newIndex = processedItems.push({ startTime, gross, title, ...rest } as any) - 1;
        activeItems.push({
          title,
          gross: gross || 0,
          startTime: itemStartMonth,
          currentVal: 0,
          resultIndex: newIndex,
          ...rest,
        } as any);
      } else {
        const minItem = activeItems[maxItems - 1];
        if ((gross || 0) > minItem.currentVal) {
          let victimIndex = -1;
          for (let i = activeItems.length - 1; i >= 0; i--) {
            const act = activeItems[i];
            if (itemStartMonth - act.startTime >= growthMonths) {
              victimIndex = i;
              break;
            }
          }
          if (victimIndex === -1) victimIndex = maxItems - 1;
          const victim = activeItems[victimIndex];
          if (processedItems[victim.resultIndex]) {
            (processedItems[victim.resultIndex] as any).deathMonth = itemStartMonth;
          }
          activeItems.splice(victimIndex, 1);
          const newIndex = processedItems.push({ startTime, gross, title, ...rest } as any) - 1;
          activeItems.push({
            title,
            gross: gross || 0,
            startTime: itemStartMonth,
            currentVal: 0,
            resultIndex: newIndex,
            ...rest,
          } as any);
        }
      }
    }

    const segments: Segment[] = [];
    const framesPerGrowth = growthMonths * framesPerMonth;
    let currentFrame = 0;

    processedItems.forEach((item, i) => {
      const itemStart = toMonths(item.startTime!);
      const nextStart = i < processedItems.length - 1 ? toMonths(processedItems[i + 1].startTime!) : Infinity;
      const growthEnd = Math.min(itemStart + growthMonths, nextStart);
      const segDur = growthEnd === itemStart ? 0 : framesPerGrowth;
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

      if (i < processedItems.length - 1 && nextStart > growthEnd) {
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

    return { segments, items: processedItems, isTimeSeries: false, totalFrames: currentFrame };
  }, [allItems, maxItems, growthMonths, fps, secondsPerMonth, framesPerYear, jumpDurationInFrames, framesPerMonth]);

  // 2. Pre-calculate All Frames
  const frameCache = useMemo(() => {
    const { segments, items, isTimeSeries, totalFrames: calculatedTotalFrames } = timelineSegments;
    const totalFramesInt = Math.ceil(calculatedTotalFrames);
    const numItems = items.length;

    // Helper type for birth-based items that may have deathMonth
    type BirthItem = (typeof items)[0] & { deathMonth?: number };

    const values = new Float32Array(totalFramesInt * numItems);
    const ranks = new Uint16Array(totalFramesInt * numItems);
    const months = new Float32Array(totalFramesInt);

    const sortBuffer = new Array(numItems).fill(0).map((_, i) => ({ index: i, value: 0 }));

    for (const seg of segments) {
      const startF = Math.floor(seg.startFrame);
      const endF = Math.ceil(seg.endFrame);

      for (let f = startF; f < endF; f++) {
        if (f >= totalFramesInt) break;

        const progress = (f - seg.startFrame) / (seg.endFrame - seg.startFrame || 1);
        const monthDisp = seg.startMonth + progress * (seg.endMonth - seg.startMonth);
        months[f] = monthDisp;

        for (let i = 0; i < numItems; i++) {
          const item = items[i];
          let val = 0;

          if (isTimeSeries) {
            const currentYear = Math.floor(monthDisp / 12);
            const nextYear = currentYear + 1;
            const yearProgress = (monthDisp % 12) / 12;

            const valThisYear = item.data?.find((d) => d.year === currentYear)?.value || 0;
            const valNextYear = item.data?.find((d) => d.year === nextYear)?.value || 0;
            val = valThisYear + (valNextYear - valThisYear) * yearProgress;
          } else {
            if (i <= seg.itemIndex) {
              const deathM = (item as BirthItem).deathMonth;
              if (deathM !== undefined && monthDisp >= deathM) {
                val = 0;
              } else {
                const itemStart = toMonths(item.startTime!);
                const p = Math.min(Math.max((monthDisp - itemStart) / growthMonths, 0), 1);
                val = (item.gross || 0) * p;
              }
            }
          }

          values[f * numItems + i] = val;
          sortBuffer[i].index = i;
          sortBuffer[i].value = val;
        }

        sortBuffer.sort((a, b) => b.value - a.value);

        const isVisibleInChart = new Uint8Array(numItems);
        for (let k = 0; k < numItems; k++) {
          isVisibleInChart[sortBuffer[k].index] = k < maxItems ? 1 : 0;
        }

        if (!isTimeSeries) {
          const introIndicesExluded: number[] = [];
          for (let k = maxItems; k < numItems; k++) {
            const idx = sortBuffer[k].index;
            const item = items[idx];
            const start = toMonths(item.startTime!);
            const deathM = (item as BirthItem).deathMonth;
            const isDead = deathM !== undefined && monthDisp >= deathM;
            
            if (!isDead && monthDisp >= start && monthDisp < start + growthMonths && idx <= seg.itemIndex) {
              introIndicesExluded.push(k);
            }
          }

          if (introIndicesExluded.length > 0) {
            let candidatesFound = 0;
            for (let k = maxItems - 1; k >= 0; k--) {
              if (candidatesFound >= introIndicesExluded.length) break;
              const idx = sortBuffer[k].index;
              const item = items[idx];
              const start = toMonths(item.startTime!);
              if (!(monthDisp >= start && monthDisp < start + growthMonths)) {
                isVisibleInChart[idx] = 0;
                isVisibleInChart[sortBuffer[introIndicesExluded[candidatesFound]].index] = 1;
                candidatesFound++;
              }
            }
          }
        }

        let visibleRankCounter = 0;
        let invisibleRankCounter = maxItems;
        for (let k = 0; k < numItems; k++) {
          const idx = sortBuffer[k].index;
          ranks[f * numItems + idx] = isVisibleInChart[idx] === 1 ? visibleRankCounter++ : invisibleRankCounter++;
        }
      }
    }

    return { values, ranks, months, totalFrames: totalFramesInt, numItems };
  }, [timelineSegments, growthMonths, maxItems]);

  const { items } = timelineSegments;

  const getDataAtFrame = (frame: number) => {
    const f = Math.min(Math.max(0, Math.floor(frame)), frameCache.totalFrames - 1);
    const { values, ranks, months, numItems } = frameCache;
    if (!values) return { values: {}, ranks: {}, monthDisp: 0 };
    
    const frameValues: Record<string, number> = {};
    const frameRanks: Record<string, number> = {};
    for (let i = 0; i < numItems; i++) {
      const title = items[i].title;
      frameValues[title] = values[f * numItems + i];
      frameRanks[title] = ranks[f * numItems + i];
    }
    return { values: frameValues, ranks: frameRanks, monthDisp: months[f] };
  };

  const getSmoothY = (itemIndex: number, currentFrame: number, windowSize = 8) => {
    const { ranks, numItems, totalFrames } = frameCache;
    if (!ranks) return 0;
    
    let total = 0;
    for (let j = 0; j < windowSize; j++) {
      const f = Math.min(Math.max(0, Math.floor(currentFrame - j)), totalFrames - 1);
      total += ranks[f * numItems + itemIndex];
    }
    return (total / windowSize) * (barItemHeight + barSpacing);
  };

  return {
    items,
    getDataAtFrame,
    getSmoothY,
    totalFrames: frameCache.totalFrames,
    timelineSegments: timelineSegments.segments,
  };
};
