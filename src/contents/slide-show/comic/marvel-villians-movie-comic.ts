import { staticFile } from "remotion";

const mcu = (name: string, ext: "jpg" | "jpeg" | "webp") =>
  staticFile(`comic/marvel/${name} (movies).${ext}`);

export const data = [
  // --- PHẦN 1: HOOK ---
  {
    topImageSrc: staticFile("comic/marvel/Scarlet Witch.jpg"),
    bottomImageSrc: mcu("Wanda Maximoff", "webp"),
    topTitle: "Wanda Maximoff",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 132,
    },
    topObjectPosition: {
      x: 0,
      y: 107,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Taskmaster.jpg"),
    bottomImageSrc: mcu("Taskmaster", "webp"),
    topTitle: "Taskmaster",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 133,
    },
    topObjectPosition: {
      x: 0,
      y: 156,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Green Goblin.jpg"),
    bottomImageSrc: mcu("Green Goblin", "webp"),
    topTitle: "Green Goblin",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 59,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Gorr the God Butcher.jpg"),
    bottomImageSrc: mcu("Gorr the God Butcher", "jpg"),
    topTitle: "Gorr the God Butcher",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 116,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Mysterio.jpg"),
    bottomImageSrc: mcu("Mysterio", "webp"),
    topTitle: "Mysterio",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 105,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Baron Zemo.jpg"),
    bottomImageSrc: mcu("Baron Zemo", "webp"),
    topTitle: "Baron Zemo",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 154,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Hela.jpg"),
    bottomImageSrc: mcu("Hela", "webp"),
    topTitle: "Hela",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 139,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Kingpin.jpg"),
    bottomImageSrc: mcu("Kingpin", "webp"),
    topTitle: "Kingpin",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 88,
    },
    topObjectPosition: {
      x: 0,
      y: 248,
    },
  },

  // --- PHẦN 2: BUILD-UP ---
  {
    topImageSrc: staticFile("comic/marvel/Loki.jpg"),
    bottomImageSrc: mcu("Loki", "jpg"),
    topTitle: "Loki",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 174,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Red Skull.jpg"),
    bottomImageSrc: mcu("Red Skull", "webp"),
    topTitle: "Red Skull",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 132,
    },
    topObjectPosition: {
      x: 0,
      y: 93,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Doctor Octopus.jpg"),
    bottomImageSrc: mcu("Doctor Octopus", "webp"),
    topTitle: "Doctor Octopus",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 138,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Vulture.jpg"),
    bottomImageSrc: mcu("Vulture", "jpg"),
    topTitle: "Vulture",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 88,
    },
    topObjectPosition: {
      x: 0,
      y: 120,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Abomination.jpg"),
    bottomImageSrc: mcu("Abomination", "webp"),
    topTitle: "Abomination",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 116,
    },
    topObjectPosition: {
      x: 0,
      y: 96,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Arnim Zola.jpg"),
    bottomImageSrc: staticFile("comic/marvel/Arnim Zola (movies).png"),
    topTitle: "Arnim Zola",
    bottomTitle: "",
  },
  {
    topImageSrc: staticFile("comic/marvel/Winter Soldier.jpg"),
    bottomImageSrc: staticFile("comic/marvel/Winter Soldier (movies).png"),
    topTitle: "Winter Soldier",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 124,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Iron Monger.jpg"),
    bottomImageSrc: mcu("Iron Monger", "webp"),
    topTitle: "Iron Monger",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 179,
    },
    bottomObjectPosition: {
      x: 0,
      y: 89,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Whiplash.jpg"),
    bottomImageSrc: mcu("Whiplash", "jpg"),
    topTitle: "Whiplash",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 181,
    },
    topObjectPosition: {
      x: 0,
      y: 135,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Aldrich Killian.jpg"),
    bottomImageSrc: mcu("Aldrich Killian", "webp"),
    topTitle: "Aldrich Killian",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 73,
    },
    topObjectPosition: {
      x: 0,
      y: 37,
    },
  },

  // --- PHẦN 3: MID-POINT ---
  {
    topImageSrc: staticFile("comic/marvel/The Mandarin.jpg"),
    bottomImageSrc: mcu("The Mandarin", "jpeg"),
    topTitle: "The Mandarin",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 82,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Ultron.jpg"),
    bottomImageSrc: mcu("Ultron", "jpg"),
    topTitle: "Ultron",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 132,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Agatha Harkness.jpg"),
    bottomImageSrc: mcu("Agatha Harkness", "webp"),
    topTitle: "Agatha Harkness",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 107,
    },
    topObjectPosition: {
      x: 0,
      y: 123,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Crossbones.jpg"),
    bottomImageSrc: mcu("Crossbones", "jpeg"),
    topTitle: "Crossbones",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 153,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Shocker.jpg"),
    bottomImageSrc: mcu("Shocker", "webp"),
    topTitle: "Shocker",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 155,
    },
    topObjectPosition: {
      x: 0,
      y: 95,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Tinkerer.jpg"),
    bottomImageSrc: mcu("Tinkerer", "webp"),
    topTitle: "Tinkerer",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 107,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Malekith the Accursed.jpg"),
    bottomImageSrc: mcu("Malekith", "webp"),
    topTitle: "Malekith",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 154,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Ronan the Accuser.jpg"),
    bottomImageSrc: mcu("Ronan the Accuser", "webp"),
    topTitle: "Ronan the Accuser",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 88,
    },
    topObjectPosition: {
      x: 0,
      y: 208,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Kaecilius.jpg"),
    bottomImageSrc: mcu("Kaecilius", "jpg"),
    topTitle: "Kaecilius",
    bottomTitle: "",
  },
  {
    topImageSrc: staticFile("comic/marvel/Ghost.jpg"),
    bottomImageSrc: mcu("Ghost", "jpg"),
    topTitle: "Ghost",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 137,
    },
  },

  // --- PHẦN 4 ---
  {
    topImageSrc: staticFile("comic/marvel/Corvus Glaive.jpg"),
    bottomImageSrc: mcu("Corvus Glaive", "webp"),
    topTitle: "Corvus Glaive",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 167,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Proxima Midnight.jpg"),
    bottomImageSrc: mcu("Proxima Midnight", "webp"),
    topTitle: "Proxima Midnight",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 265,
    },
    topObjectPosition: {
      x: 0,
      y: 140,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Cull Obsidian.jpg"),
    bottomImageSrc: mcu("Cull Obsidian", "webp"),
    topTitle: "Cull Obsidian",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 129,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Ebony Maw.jpg"),
    bottomImageSrc: mcu("Ebony Maw", "webp"),
    topTitle: "Ebony Maw",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 187,
    },
    topObjectPosition: {
      x: 0,
      y: 152,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Dar-Benn.webp"),
    bottomImageSrc: mcu("Dar-Benn", "webp"),
    topTitle: "Dar-Benn",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 375,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Gravik.webp"),
    bottomImageSrc: mcu("Gravik", "webp"),
    topTitle: "Gravik",
    bottomTitle: "",
  },
  {
    topImageSrc: staticFile("comic/marvel/Namor.jpg"),
    bottomImageSrc: mcu("Namor", "webp"),
    topTitle: "Namor",
    bottomTitle: "",
  },
  {
    topImageSrc: staticFile("comic/marvel/Kang the Conqueror.jpg"),
    bottomImageSrc: mcu("Kang the Conqueror", "webp"),
    topTitle: "Kang the Conqueror",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 89,
    },
    bottomObjectPosition: {
      x: 0,
      y: 64,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/High Evolutionary.jpg"),
    bottomImageSrc: mcu("The High Evolutionary", "webp"),
    topTitle: "The High Evolutionary",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 132,
    },
    topObjectPosition: {
      x: 0,
      y: 141,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Cassandra Nova.jpg"),
    bottomImageSrc: mcu("Cassandra Nova", "webp"),
    topTitle: "Cassandra Nova",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 108,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Galactus.jpg"),
    bottomImageSrc: mcu("Galactus", "jpg"),
    topTitle: "Galactus",
    bottomTitle: "",
  },
  {
    topImageSrc: staticFile("comic/marvel/Red Hulk.jpg"),
    bottomImageSrc: mcu("Red Hulk", "webp"),
    topTitle: "Red Hulk",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 150,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/The Leader.jpg"),
    bottomImageSrc: mcu("The Leader", "webp"),
    topTitle: "The Leader",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 78,
    },
  },

  // --- PHẦN 5: CLIMAX ---
  {
    topImageSrc: staticFile("comic/marvel/Surtur.jpg"),
    bottomImageSrc: mcu("Surtur", "webp"),
    topTitle: "Surtur",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 88,
    },
    topObjectPosition: {
      x: 0,
      y: 230,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Klaw.jpg"),
    bottomImageSrc: mcu("Ulysses Klaue", "webp"),
    topTitle: "Ulysses Klaue",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 167,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Yellowjacket.jpg"),
    bottomImageSrc: mcu("Yellowjacket", "webp"),
    topTitle: "Yellowjacket",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 141,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Venom.jpg"),
    bottomImageSrc: mcu("Venom", "webp"),
    topTitle: "Venom",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 151,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Mephisto.jpg"),
    bottomImageSrc: mcu("Mephisto", "jpg"),
    topTitle: "Mephisto",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 0,
      y: 75,
    },
    topObjectPosition: {
      x: 0,
      y: 177,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Ego.jpg"),
    bottomImageSrc: mcu("Ego the Living Planet", "webp"),
    topTitle: "Ego the Living Planet",
    bottomTitle: "",
    bottomObjectPosition: {
      x: 129,
      y: 0,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Erik Killmonger.jfif"),
    bottomImageSrc: mcu("Killmonger", "webp"),
    topTitle: "Killmonger",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 134,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Dormammu.jpg"),
    bottomImageSrc: mcu("Dormammu", "jpg"),
    topTitle: "Dormammu",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 156,
    },
  },
  {
    topImageSrc: staticFile("comic/marvel/Thanos.jpg"),
    bottomImageSrc: mcu("Thanos", "jpg"),
    topTitle: "Thanos",
    bottomTitle: "",
    topObjectPosition: {
      x: 0,
      y: 104,
    },
  },
];
