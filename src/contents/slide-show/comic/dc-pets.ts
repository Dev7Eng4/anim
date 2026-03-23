import { staticFile } from "remotion";

const img = (name: string) => staticFile(`comic/dc/${name}`);

export const data = [
  // {
  //   topTitle: "Power Girl",
  //   bottomTitle: "Stinky",
  //   topImageSrc: img("Power Girl.jpg"),
  //   bottomImageSrc: img("Streaky the Supercat.jpg"),
  // },
  {
    topTitle: "Wonder Woman",
    bottomTitle: "Pegasus",
    topImageSrc: img("Wonder Woman.jpg"),
    bottomImageSrc: img("Comet the Super-Horse.jpg"),
    topObjectPosition: {
      x: 0,
      y: 188,
    },
  },
  {
    topTitle: "Superman",
    bottomTitle: "Krypto the Superdog",
    topImageSrc: img("Superman.jpg"),
    bottomImageSrc: img("Krypto the Superdog.jpg"),
    topObjectPosition: {
      x: 0,
      y: 140,
    },
  },
  {
    topTitle: "Supergirl",
    bottomTitle: "Streaky the Supercat",
    topImageSrc: img("Supergirl.jpg"),
    bottomImageSrc: img("Streaky the Supercat.jpg"),
  },
  {
    topTitle: "Joker",
    bottomTitle: "Jackanapes",
    topImageSrc: img("Joker.jpg"),
    bottomImageSrc: img("Jackanapes.jpg"),
    topObjectPosition: {
      x: 0,
      y: 140,
    },
  },
  {
    topTitle: "Lex Luthor",
    bottomTitle: "Licks Luthor",
    topImageSrc: img("Lex Luthor.jpg"),
    bottomImageSrc: img("Licks Luthor.jpg"),
  },
  {
    topTitle: "Absolute Flash",
    bottomTitle: "Grodd",
    topImageSrc: img("The Flash.jpg"),
    bottomImageSrc: img("gorilla grodd.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 190,
    },
  },
  {
    topTitle: "Green Arrow",
    bottomTitle: "George the arrowdog",
    topImageSrc: img("Green Arrow.jpg"),
    bottomImageSrc: img("George the arrowdog.jpg"),
    topObjectPosition: {
      x: 0,
      y: 68,
    },
  },
  {
    topTitle: "Plastic Man",
    bottomTitle: "Flexi",
    topImageSrc: img("Plastic Man.jpg"),
    bottomImageSrc: img("Flexi.webp"),
  },
  {
    topTitle: "Martian Manhunter",
    bottomTitle: "Zook",
    topImageSrc: img("Martian Manhunter.jpg"),
    bottomImageSrc: img("Zook.webp"),
    topObjectPosition: {
      x: 0,
      y: 212,
    },
  },
  {
    topTitle: "Bizarro",
    bottomTitle: "Krypto II",
    topImageSrc: img("Bizarro.jpg"),
    bottomImageSrc: img("Krypto the Superdog.jpg"),
    topObjectPosition: {
      x: 0,
      y: 129,
    },
  },
  {
    topTitle: "Lobo",
    bottomTitle: "Dawg",
    topImageSrc: img("Lobo.jpg"),
    bottomImageSrc: img("Dawg.webp"),
    bottomObjectPosition: {
      x: 0,
      y: 112,
    },
    topObjectPosition: {
      x: 0,
      y: 162,
    },
  },
  {
    topTitle: "Starfire",
    bottomTitle: "Silkie",
    topImageSrc: img("Starfire.jpg"),
    bottomImageSrc: img("Silkie.jpg"),
    topObjectPosition: {
      x: 0,
      y: 138,
    },
  },
  {
    topTitle: "Penguin",
    bottomTitle: "Penguins",
    topImageSrc: img("The Penguin.jpg"),
    bottomImageSrc: img("Penguins.png"),
    bottomObjectPosition: {
      x: 0,
      y: 74,
    },
    topObjectPosition: {
      x: 0,
      y: 145,
    },
  },
  {
    topTitle: "Catwoman",
    bottomTitle: "Isis",
    topImageSrc: img("Catwoman.jpg"),
    bottomImageSrc: img("Alfred the Cat.jpg"),
    topObjectPosition: {
      x: 0,
      y: 158,
    },
  },
  {
    topTitle: "Superboy",
    bottomTitle: "Beppo the Super-Monkey",
    topImageSrc: img("Superboy (Kon-El).jpg"),
    bottomImageSrc: img("Beppo the Super-Monkey.webp"),
    topObjectPosition: {
      x: 0,
      y: 89,
    },
  },
  {
    topTitle: "Supergirl (Pre-Crisis)",
    bottomTitle: "Comet the Super-Horse",
    topImageSrc: img("Supergirl (Pre-Crisis).jpg"),
    bottomImageSrc: img("Comet the Super-Horse.jpg"),
    topObjectPosition: {
      x: 0,
      y: 159,
    },
  },
  {
    topTitle: "Legion of Super-Heroes",
    bottomTitle: "Proty",
    topImageSrc: img("Legion of Super-Heroes.jpg"),
    bottomImageSrc: img("Proty.webp"),
    bottomObjectPosition: {
      x: 0,
      y: 71,
    },
  },
  {
    topTitle: "Batman",
    bottomTitle: "Ace the Bat-Hound",
    topImageSrc: img("Batman.jpg"),
    bottomImageSrc: img("Ace the Bat-Hound.jpg"),
    bottomObjectPosition: {
      x: 5,
      y: 185,
    },
    topObjectPosition: {
      x: 1,
      y: 102,
    },
  },
  {
    topTitle: "Robin (Damian Wayne)",
    bottomTitle: "Titus",
    topImageSrc: img("Robin (Damian Wayne).jpg"),
    bottomImageSrc: img("Titus.jpg"),
    topObjectPosition: {
      x: 0,
      y: 176,
    },
  },
  {
    topTitle: "Robin (Damian Wayne)",
    bottomTitle: "Bat-Cow",
    topImageSrc: img("Robin (Damian Wayne).jpg"),
    bottomImageSrc: img("Bat-Cow.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 78,
    },
    topObjectPosition: {
      x: 0,
      y: 176,
    },
  },
  {
    topTitle: "Robin (Damian Wayne)",
    bottomTitle: "Alfred the Cat",
    topImageSrc: img("Robin (Damian Wayne).jpg"),
    bottomImageSrc: img("Alfred the Cat.jpg"),
    topObjectPosition: {
      x: 0,
      y: 176,
    },
  },
  {
    topTitle: "Robin (Damian Wayne)",
    bottomTitle: "Goliath",
    topImageSrc: img("Robin (Damian Wayne).jpg"),
    bottomImageSrc: img("Goliath.jpg"),
    topObjectPosition: {
      x: 0,
      y: 176,
    },
  },
  {
    topTitle: "Atrocitus",
    bottomTitle: "Dex-Starr",
    topImageSrc: img("Red Lantern Atrocitus.jpg"),
    bottomImageSrc: img("Dex-Starr.jpg"),
    topObjectPosition: {
      x: 0,
      y: 119,
    },
  },
  // {
  //   topTitle: "Green Lantern",
  //   bottomTitle: "Ch'p",
  //   topImageSrc: img("Green Lantern.jpg"),
  //   bottomImageSrc: img("Ch'p.jpg"),
  // },
  {
    topTitle: "Green Lantern Corps",
    bottomTitle: "B'dg",
    topImageSrc: img("Green Lantern Corps.jpg"),
    bottomImageSrc: img("B'dg.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 107,
    },
  },
  // {
  //   topTitle: "Green Lantern Corps",
  //   bottomTitle: "G'nort",
  //   topImageSrc: img("Green Lantern Corps.jpg"),
  //   bottomImageSrc: img("G'nort.jpg"),
  // },
  {
    topTitle: "Aquaman",
    bottomTitle: "Storm (Seahorse)",
    topImageSrc: img("Aquaman.jpg"),
    bottomImageSrc: img("Storm (Seahorse).jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 204,
    },
    topObjectPosition: {
      x: 0,
      y: 74,
    },
  },
  {
    topTitle: "Aquaman",
    bottomTitle: "Topo (Octopus)",
    topImageSrc: img("Aquaman.jpg"),
    bottomImageSrc: img("Topo (Octopus).jpg"),
    topObjectPosition: {
      x: 0,
      y: 74,
    },
  },
  // {
  //   topTitle: "Aquaman",
  //   bottomTitle: "Puska (Seal)",
  //   topImageSrc: img("Aquaman.jpg"),
  //   bottomImageSrc: img("Puska (Seal).jpg"),
  // },
  {
    topTitle: "Aquaman",
    bottomTitle: "Arkland (Orca)",
    topImageSrc: img("Aquaman.jpg"),
    bottomImageSrc: img("Arkland (Orca).jpg"),
    topObjectPosition: {
      x: 0,
      y: 74,
    },
  },
  {
    topTitle: "Peacemaker",
    bottomTitle: "Eagly",
    topImageSrc: img("Peacemaker.jpg"),
    bottomImageSrc: img("Eagly.webp"),
    bottomObjectPosition: {
      x: 0,
      y: 88,
    },
    topObjectPosition: {
      x: 0,
      y: 87,
    },
  },
  {
    topTitle: "Justice League Dark",
    bottomTitle: "Detective Chimp",
    topImageSrc: img("Justice League Dark.jpg"),
    bottomImageSrc: img("Detective Chimp.webp"),
  },
  {
    topTitle: "Wonder Twins",
    bottomTitle: "Gleek",
    topImageSrc: img("Wonder Twins.jpg"),
    bottomImageSrc: img("Gleek.webp"),
    topObjectPosition: {
      x: 0,
      y: 123,
    },
  },
  {
    topTitle: "The Flash (Jay Garrick)",
    bottomTitle: "Whatzit",
    topImageSrc: img("The Flash (Jay Garrick).jpg"),
    bottomImageSrc: img("Whatzit.webp"),
    bottomObjectPosition: {
      x: 0,
      y: 54,
    },
    topObjectPosition: {
      x: 0,
      y: 86,
    },
  },
  // {
  //   topTitle: "The Flash",
  //   bottomTitle: "Flashback",
  //   topImageSrc: img("The Flash.jpg"),
  //   bottomImageSrc: img("Flash.jpg"),
  // },
  {
    topTitle: "Shazam Family",
    bottomTitle: "Hoppy the Marvel Bunny",
    topImageSrc: img("Shazam Family.jpg"),
    bottomImageSrc: img("Hoppy the Marvel Bunny.jpg"),
  },
  {
    topTitle: "Metamorpho",
    bottomTitle: "Element Dog",
    topImageSrc: img("Firestorm.jpg"),
    bottomImageSrc: img("Element Dog.jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 142,
    },
  },
  {
    topTitle: "Shazam",
    bottomTitle: "Tawky Tawny",
    topImageSrc: img("Shazam.jpg"),
    bottomImageSrc: img("Cheetah (Minerva).jpg"),
  },
  {
    topTitle: "Wonder Woman",
    bottomTitle: "Jumpa (Kanga)",
    topImageSrc: img("Wonder Woman.jpg"),
    bottomImageSrc: img("Jumpa (Kanga).webp"),
    bottomObjectPosition: {
      x: 0,
      y: -124,
    },
  },
  {
    topTitle: "Harley Quinn",
    bottomTitle: "Bud & Lou (Hyenas)",
    topImageSrc: img("Harley Quinn.jpg"),
    bottomImageSrc: img("Bud & Lou (Hyenas).jpg"),
  },
  {
    topTitle: "Lobo",
    bottomTitle: "Dawg",
    topImageSrc: img("Lobo.jpg"),
    bottomImageSrc: img("Dawg.webp"),
  },
  {
    topTitle: "Adam Strange",
    bottomTitle: "Zyzix",
    topImageSrc: img("Adam Strange.jpg"),
    bottomImageSrc: img("Zyzix.webp"),
  },
  {
    topTitle: "Klarion the Witch Boy",
    bottomTitle: "Teekl",
    topImageSrc: img("Klarion the Witch Boy.jpg"),
    bottomImageSrc: img("Teekl.jpg"),
  },
  // {
  //   topTitle: "Seven Soldiers of Victory",
  //   bottomTitle: "Pinky",
  //   topImageSrc: img("Seven Soldiers of Victory.jpg"),
  //   bottomImageSrc: img("Pinky.jpg"),
  // },
  // {
  //   topTitle: "U.S. Army (DC)",
  //   bottomTitle: "Rex the Wonder Dog",
  //   topImageSrc: img("U.S. Army (DC).jpg"),
  //   bottomImageSrc: img("Rex the Wonder Dog.jpg"),
  // },
  {
    topTitle: "Aquaman",
    bottomTitle: "Tuska (Walrus)",
    topImageSrc: img("Aquaman.jpg"),
    bottomImageSrc: img("Tuska (Walrus).webp"),
  },
  {
    topTitle: "The Atom",
    bottomTitle: "Major Mynah",
    topImageSrc: img("The Atom.jpg"),
    bottomImageSrc: img("Major Mynah.webp"),
  },
  // {
  //   topTitle: "Aquaman",
  //   bottomTitle: "Tusky",
  //   topImageSrc: img("Aquaman.jpg"),
  //   bottomImageSrc: img("Tusky.webp"),
  // },
];
