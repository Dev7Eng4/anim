import { staticFile } from "remotion";

const dc = (name: string) => staticFile(`comic/dc/${name}`);

export const data = [
  {
    topTitle: "Superman",
    bottomTitle: "Superman Prime One Million",
    topImageSrc: dc("Superman.jpg"),
    bottomImageSrc: dc("Superman One Million.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 64,
    },
    topObjectPosition: {
      x: 0,
      y: 136,
    },
  },
  {
    topTitle: "Batman",
    bottomTitle: "God of Knowledge",
    topImageSrc: dc("Batman.jpg"),
    bottomImageSrc: dc("God of knowledge.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 59,
    },
    topObjectPosition: {
      x: 0,
      y: 90,
    },
  },
  {
    topTitle: "Flash",
    bottomTitle: "God of Death",
    topImageSrc: dc("Flash.jpg"),
    bottomImageSrc: dc("God of death.jpg"),
    topObjectPosition: {
      x: 0,
      y: 129,
    },
  },
  {
    topTitle: "Wally West",
    bottomTitle: "Mobius Chair Power",
    topImageSrc: dc("Wally West.jpg"),
    bottomImageSrc: dc("Mobius Chair Power.jpg"),
    topObjectPosition: {
      x: 0,
      y: 114,
    },
  },
  {
    topTitle: "Green Lantern",
    bottomTitle: "Spectre",
    topImageSrc: dc("Green Lantern.jpg"),
    bottomImageSrc: dc("Spectre.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 87,
    },
    topObjectPosition: {
      x: 0,
      y: 158,
    },
  },
  {
    topTitle: "Raven",
    bottomTitle: "Dark Winged Queen",
    topImageSrc: dc("Raven.jpg"),
    bottomImageSrc: dc("dark winged queen.avif"),
    topObjectPosition: {
      x: 0,
      y: 144,
    },
  },
  {
    topTitle: "Wonder Woman",
    bottomTitle: "Goddess of War",
    topImageSrc: dc("Wonder Woman.jpg"),
    bottomImageSrc: dc("Goddness of war.webp"),
    bottomObjectPosition: {
      x: 0,
      y: 145,
    },
    topObjectPosition: {
      x: 0,
      y: 182,
    },
  },
  {
    topTitle: "Martian Manhunter",
    bottomTitle: "Fernus",
    topImageSrc: dc("Martian Manhunter.jpg"),
    bottomImageSrc: dc("Fernus.jpg"),
    topObjectPosition: {
      x: 0,
      y: 202,
    },
  },
  {
    topTitle: "Aquaman",
    bottomTitle: "Waterwraith",
    topImageSrc: dc("Aquaman.jpg"),
    bottomImageSrc: dc("Waterwraith.jpg"),
    topObjectPosition: {
      x: 0,
      y: 53,
    },
  },
  {
    topTitle: "Brainiac",
    bottomTitle: "God Brainiac",
    topImageSrc: dc("Brainiac.jpg"),
    bottomImageSrc: dc("God Brainiac.jpg"),
    topObjectPosition: {
      x: 0,
      y: 184,
    },
    bottomObjectPosition: {
      x: 0,
      y: 151,
    },
  },
  {
    topTitle: "Supergirl",
    bottomTitle: "Dark Supergirl",
    topImageSrc: dc("Supergirl.jpg"),
    bottomImageSrc: dc("Dark supergirl.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 40,
    },
    topObjectPosition: {
      x: 0,
      y: 86,
    },
  },
  {
    topTitle: "Shazam",
    bottomTitle: "King Shazam",
    topImageSrc: dc("Shazam.jpg"),
    bottomImageSrc: dc("King Shazam.webp"),
    topObjectPosition: {
      x: 0,
      y: 93,
    },
  },
  {
    topTitle: "Nightwing",
    bottomTitle: "Super Nightwing",
    topImageSrc: dc("Nightwing.jpg"),
    bottomImageSrc: dc("Super Nightwing.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 118,
    },
    topObjectPosition: {
      x: 0,
      y: 191,
    },
  },
  {
    topTitle: "Wonder Woman",
    bottomTitle: "Witchmarked",
    topImageSrc: dc("Wonder Woman.jpg"),
    bottomImageSrc: dc("Witchmarked.jpg"),
    topObjectPosition: {
      x: 0,
      y: 182,
    },
  },
  {
    topTitle: "Hawkman",
    bottomTitle: "Sky Tyrant",
    topImageSrc: dc("Hawkman.jpg"),
    bottomImageSrc: dc("Sky Tyrant.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 85,
    },
    topObjectPosition: {
      x: 0,
      y: 159,
    },
  },
  {
    topTitle: "Lex Luthor",
    bottomTitle: "God of Apokolips",
    topImageSrc: dc("Lex Luthor.jpg"),
    bottomImageSrc: dc("god of apokolips.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 112,
    },
  },
  {
    topTitle: "Joker",
    bottomTitle: "Emperor Joker",
    topImageSrc: dc("Joker.jpg"),
    bottomImageSrc: dc("Emperor joker.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 102,
    },
  },
  {
    topTitle: "Beast Boy",
    bottomTitle: "Garro",
    topImageSrc: dc("Beast Boy.jpg"),
    bottomImageSrc: dc("Garro.jpg"),
  },
  {
    topTitle: "Poison Ivy",
    bottomTitle: "The Green Queen",
    topImageSrc: dc("Poison Ivy.jpg"),
    bottomImageSrc: dc("The green queen.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 36,
    },
    topObjectPosition: {
      x: 0,
      y: 191,
    },
  },
  {
    topTitle: "Superman",
    bottomTitle: "Super God",
    topImageSrc: dc("Superman.jpg"),
    bottomImageSrc: dc("Super god.webp"),
    bottomObjectPosition: {
      x: 0,
      y: 77,
    },
    topObjectPosition: {
      x: 0,
      y: 140,
    },
  },
  {
    topTitle: "Lois Lane",
    bottomTitle: "Red Tornado Lane",
    topImageSrc: dc("Lois Lane.jpg"),
    bottomImageSrc: dc("Red Tornado Lane.jpg"),
    topObjectPosition: {
      x: 0,
      y: 102,
    },
    bottomObjectPosition: {
      x: 0,
      y: 141,
    },
  },
  {
    topTitle: "Brainiac",
    bottomTitle: "Brainiac 13",
    topImageSrc: dc("Brainiac.jpg"),
    bottomImageSrc: dc("Brainiac 13.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 279,
    },
    topObjectPosition: {
      x: 0,
      y: 176,
    },
  },
  {
    topTitle: "Batman",
    bottomTitle: "Hellbat",
    topImageSrc: dc("Batman.jpg"),
    bottomImageSrc: dc("Hellbat.jpg"),
    topObjectPosition: {
      x: 0,
      y: 89,
    },
  },
  {
    topTitle: "Green Lantern",
    bottomTitle: "God of Light",
    topImageSrc: dc("Green Lantern.jpg"),
    bottomImageSrc: dc("God of light.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 199,
    },
    topObjectPosition: {
      x: 0,
      y: 149,
    },
  },
  {
    topTitle: "Shazam",
    bottomTitle: "God of The Gods",
    topImageSrc: dc("Shazam.jpg"),
    bottomImageSrc: dc("God of The Gods.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 172,
    },
    topObjectPosition: {
      x: 0,
      y: 88,
    },
  },
  {
    topTitle: "Wonder Woman",
    bottomTitle: "Anti-Crisis",
    topImageSrc: dc("Wonder Woman.jpg"),
    bottomImageSrc: dc("anti crisis.webp"),
    bottomObjectPosition: {
      x: 0,
      y: 98,
    },
    topObjectPosition: {
      x: 0,
      y: 184,
    },
  },
  {
    topTitle: "Superman",
    bottomTitle: "God of Strength",
    topImageSrc: dc("Superman.jpg"),
    bottomImageSrc: dc("God of strength (superman).jpg"),
    topObjectPosition: {
      x: 0,
      y: 131,
    },
  },
  {
    topTitle: "Kyle Rayner",
    bottomTitle: "White Lantern",
    topImageSrc: dc("Kyle Rayner.jpg"),
    bottomImageSrc: dc("White Lantern (Kyle Rayner).jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 152,
    },
    topObjectPosition: {
      x: 0,
      y: -144,
    },
  },
  {
    topTitle: "Batman",
    bottomTitle: "Final Batsuit",
    topImageSrc: dc("Batman.jpg"),
    bottomImageSrc: dc("Final batsuit.jpg"),
    topObjectPosition: {
      x: 0,
      y: 90,
    },
    bottomObjectPosition: {
      x: 0,
      y: 71,
    },
  },
  {
    topTitle: "Supergirl",
    bottomTitle: "Red Lantern",
    topImageSrc: dc("Supergirl.jpg"),
    bottomImageSrc: dc("Red Lantern (Supergirl).jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 19,
    },
    topObjectPosition: {
      x: 0,
      y: 60,
    },
  },
  {
    topTitle: "Lex Luthor",
    bottomTitle: "Zone Child",
    topImageSrc: dc("Lex Luthor.jpg"),
    bottomImageSrc: dc("Zone child Lex.webp"),
    bottomObjectPosition: {
      x: 0,
      y: 234,
    },
  },
  {
    topTitle: "Superman",
    bottomTitle: "Cosmic Armour",
    topImageSrc: dc("Superman.jpg"),
    bottomImageSrc: dc("Cosmic Armor (superman).jpg"),
    topObjectPosition: {
      x: 0,
      y: 132,
    },
  },
  {
    topTitle: "Green Lantern",
    bottomTitle: "Parallax",
    topImageSrc: dc("Green Lantern.jpg"),
    bottomImageSrc: dc("Paralax (Hal jordan).jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 127,
    },
    topObjectPosition: {
      x: 0,
      y: 139,
    },
  },
  {
    topTitle: "Aquaman",
    bottomTitle: "Aquaman 1M",
    topImageSrc: dc("Aquaman.jpg"),
    bottomImageSrc: dc("Aquaman 1M.webp"),
    topObjectPosition: {
      x: 0,
      y: 70,
    },
    bottomObjectPosition: {
      x: 0,
      y: 137,
    },
  },
  {
    topTitle: "Zatanna",
    bottomTitle: "Lord of Chaos",
    topImageSrc: dc("Zatanna.jpg"),
    bottomImageSrc: dc("Lord of chaos (zatana).jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 67,
    },
    topObjectPosition: {
      x: 0,
      y: 136,
    },
  },
  {
    topTitle: "Raven",
    bottomTitle: "Unkindness Raven",
    topImageSrc: dc("Raven.jpg"),
    bottomImageSrc: dc("unkindness raven.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 222,
    },
    topObjectPosition: {
      x: 0,
      y: 140,
    },
  },
  {
    topTitle: "Batman",
    bottomTitle: "The Darkest Knight",
    topImageSrc: dc("Batman.jpg"),
    bottomImageSrc: dc("The Darkest Knight.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 42,
    },
    topObjectPosition: {
      x: 0,
      y: 83,
    },
  },
];
