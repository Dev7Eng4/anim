import { staticFile } from "remotion";

const img = (name: string) => staticFile(`anime/onepiece/${name}`);

export const data = [
  // 🔥 GIAI ĐOẠN 1: HOOK (3-5 giây đầu) - Phải cực ngầu và quen thuộc để ngừng lướt
  {
    topTitle: "Zoro",
    bottomTitle: "King of Hell",
    topImageSrc: img("Zoro.jfif"),
    bottomImageSrc: img("King of Hell (Zoro).jfif"),
  }, // Fan Zoro rất đông, hình dáng ngầu
  {
    topTitle: "Chopper",
    bottomTitle: "Monster Point",
    topImageSrc: img("Chopper.jfif"),
    bottomImageSrc: img("Monster Point (Chopper).jfif"),
  }, // Sự đối lập cực mạnh (dễ thương -> quái vật)
  {
    topTitle: "Robin",
    bottomTitle: "Demonio Fleur",
    topImageSrc: img("Robin.jfif"),
    bottomImageSrc: img("Demonio Fleur (Robin).jfif"),
  }, // Gây sốc, sexy và badass

  // 🌊 GIAI ĐOẠN 2: CHUYỂN TIẾP - Giữ nhịp độ bằng các form Zoan/Biến dị ấn tượng
  {
    topTitle: "Marco",
    bottomTitle: "Phoenix",
    topImageSrc: img("Marco.jfif"),
    bottomImageSrc: img("Phoenix (Marco).jfif"),
  },
  {
    topTitle: "Momonosuke",
    bottomTitle: "Dragon",
    topImageSrc: img("Momonosuke.jfif"),
    bottomImageSrc: img("Momonosuke Dragon.jfif"),
  },
  {
    topTitle: "Jozu",
    bottomTitle: "Diamond",
    topImageSrc: img("Jozu.jfif"),
    bottomImageSrc: img("Diamond (Jozu).jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 92,
    },
  },
  {
    topTitle: "Cavendish",
    bottomTitle: "Hakuba",
    topImageSrc: img("Cavendish.jfif"),
    bottomImageSrc: img("Hakuba (Cavendish).jfif"),
  },
  {
    topTitle: "Franky",
    bottomTitle: "General Franky",
    topImageSrc: img("Franky.jfif"),
    bottomImageSrc: img("General Franky.jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 90,
    },
  },
  // {
  //   topTitle: "Trafalgar Law",
  //   bottomTitle: "Awakened (Kroom)",
  // },
  {
    topTitle: "Katakuri",
    bottomTitle: "Buzz Cut Mochi",
    topImageSrc: img("Katakuri.jpg"),
    bottomImageSrc: img("Buzz Cut Mochi (Katakuri).jpg"),
  },
  {
    topTitle: "Doflamingo",
    bottomTitle: "Awakened (God Thread)",
    topImageSrc: img("Doflamingo.jpg"),
    bottomImageSrc: img("Awakened God Thread (Doflamingo).jpg"),
  },

  // ⚡ GIAI ĐOẠN 3: ĐIỂM NHẤN GIỮA (Giây thứ 15-20) - Kéo lại sự chú ý
  {
    topTitle: "Sanji",
    bottomTitle: "Awakened Germa Power",
    topImageSrc: img("Sanji.jfif"),
    bottomImageSrc: img("Awakened Germa Power (Sanji).jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 71,
    },
  }, // Fan Sanji sẽ thức tỉnh ở đoạn này
  {
    topTitle: "Kaido",
    bottomTitle: "Flame Dragon Torch",
    topImageSrc: img("Kaido.jfif"),
    bottomImageSrc: img("Flame Dragon Torch (Kaido).jfif"),
  }, // Trùm cuối cực khủng
  {
    topTitle: "Big Mom",
    bottomTitle: "Temperamented",
    topImageSrc: img("Big Mom.jfif"),
    bottomImageSrc: img("Temperamented (Big Mom).jfif"),
  },

  // 🌕 GIAI ĐOẠN 4: CHUỖI SULONG - Hiệu ứng hình ảnh đẹp mắt, màu trắng sáng
  {
    topTitle: "Carrot",
    bottomTitle: "Sulong Form",
    topImageSrc: img("Carrot.jfif"),
    bottomImageSrc: img("Carrot Sulong Form.jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 132,
    },
  },
  {
    topTitle: "Bepo",
    bottomTitle: "Sulong Form",
    topImageSrc: img("Bepo.jfif"),
    bottomImageSrc: img("Sulong Form (Bepo).jfif"),
  },
  {
    topTitle: "Nekomamushi",
    bottomTitle: "Sulong Form",
    topImageSrc: img("Nekomamushi.jfif"),
    bottomImageSrc: img("Nekomamushi Sulong Form.jfif"),
    topObjectPosition: {
      x: 0,
      y: 70,
    },
  },
  {
    topTitle: "Inuarashi",
    bottomTitle: "Sulong Form",
    topImageSrc: img("Inuarashi.jfif"),
    bottomImageSrc: img("Inuarashi Sulong Form.jfif"),
  },
  {
    topTitle: "Pekoms",
    bottomTitle: "Sulong Form",
    topImageSrc: img("Pekoms.jpg"),
    bottomImageSrc: img("pekoms sulong.jfif"),
  },

  // 🎭 GIAI ĐOẠN 5: ĐỔI GIÓ & HÀI HƯỚC - Tránh nhàm chán trước khi chốt hạ
  {
    topTitle: "Usopp",
    bottomTitle: "Sogeking",
    topImageSrc: img("Usopp.jfif"),
    bottomImageSrc: img("Sogeking (Usopp).jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 72,
    },
  }, // Meme chúa
  {
    topTitle: "Caesar",
    bottomTitle: "Ghost",
    topImageSrc: img("Caesar.jfif"),
    bottomImageSrc: img("Ghost (Caesar).jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 50,
    },
  },
  {
    topTitle: "Capone Bege",
    bottomTitle: "Big Father",
    topImageSrc: img("Capone Bege.jfif"),
    bottomImageSrc: img("Big Father (Capone Bege).jfif"),
  },
  {
    topTitle: "Hawkins",
    bottomTitle: "Straw Doll",
    topImageSrc: img("Hawkins.jfif"),
    bottomImageSrc: img("Straw Doll (Hawkins).jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 79,
    },
    topObjectPosition: {
      x: 0,
      y: 73,
    },
  },

  // 🦹 GIAI ĐOẠN 6: DÀN PHẢN DIỆN & SIDE CHARACTERS - Tăng tốc độ chuyển cảnh (Fast cuts)
  {
    topTitle: "Lucci",
    bottomTitle: "Awakened Leopard",
    topImageSrc: img("Lucci.jfif"),
    bottomImageSrc: img("Awakened Leopard (Lucci).jfif"),
  },
  {
    topTitle: "Magellan",
    bottomTitle: "Venom Demon",
    topImageSrc: img("Magellan.jfif"),
    bottomImageSrc: img("Venom Demon (Magellan).jfif"),
  },
  {
    topTitle: "Sengoku",
    bottomTitle: "Golden Buddha",
    topImageSrc: img("Sengoku.jpg"),
    bottomImageSrc: img("Golden Buddha (Sengoku).jpg"),
    topObjectPosition: {
      x: 0,
      y: 197,
    },
  },
  {
    topTitle: "King",
    bottomTitle: "Imperial Flaming Wings",
    topImageSrc: img("King.jpg"),
    bottomImageSrc: img("Imperial Flaming Wings (King).jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 169,
    },
  },
  {
    topTitle: "Enel",
    bottomTitle: "Thunder God",
    topImageSrc: img("Enel.jfif"),
    bottomImageSrc: img("Thunder God (Enel).jfif"),
  },
  {
    topTitle: "Bullet",
    bottomTitle: "Golem",
    topImageSrc: img("Bullet.jfif"),
    bottomImageSrc: img("Golem (Bullet).jfif"),
    topObjectPosition: {
      x: 0,
      y: 94,
    },
  },
  {
    topTitle: "Pica",
    bottomTitle: "Behemoth Stone Golem",
    topImageSrc: img("Pica.jfif"),
    bottomImageSrc: img("Behemoth Stone Golem (Pika).jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 105,
    },
  },
  {
    topTitle: "Vergo",
    bottomTitle: "Busoshoku Haki",
    topImageSrc: img("Vergo.jfif"),
    bottomImageSrc: img("Busoshoku Haki (Vergo).jfif"),
    topObjectPosition: {
      x: 0,
      y: 73,
    },
    bottomObjectPosition: {
      x: 0,
      y: 111,
    },
  },
  {
    topTitle: "Sasaki",
    bottomTitle: "Triceratops",
    topImageSrc: img("Sasaki.jfif"),
    bottomImageSrc: img("Triceratops (Sasaki).jfif"),
  },
  {
    topTitle: "Dalton",
    bottomTitle: "Hybrid Bison",
    topImageSrc: img("Dalton.jfif"),
    bottomImageSrc: img("Hybrid Bison (Dalton).jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 48,
    },
    topObjectPosition: {
      x: 0,
      y: 53,
    },
  },

  // 🌟 GIAI ĐOẠN 7: PRE-FINALE - Đẩy cảm xúc lên cao trào
  {
    topTitle: "Kid",
    bottomTitle: "Punk Rotten",
    topImageSrc: img("Kid.jfif"),
    bottomImageSrc: img("Punk Rotten (Kid).jfif"),
    topObjectPosition: {
      x: 0,
      y: 126,
    },
  },
  {
    topTitle: "Nami",
    bottomTitle: "Nami Zeus",
    topImageSrc: img("Nami.jfif"),
    bottomImageSrc: img("Nami Zeus.jfif"),
    bottomObjectPosition: {
      x: 0,
      y: 143,
    },

    topObjectPosition: {
      x: 0,
      y: 63,
    },
  },
  {
    topTitle: "Brook",
    bottomTitle: "Soul King",
    topImageSrc: img("Brook.jfif"),
    bottomImageSrc: img("Soul King (Brook).jfif"),
  },
  {
    topTitle: "Yamato",
    bottomTitle: "Beast",
    topImageSrc: img("Yamato.jfif"),
    bottomImageSrc: img("Beast (Yamato).jfif"),
    topObjectPosition: {
      x: 0,
      y: 134,
    },
  },
  {
    topTitle: "Jaygarcia Saturn",
    bottomTitle: "Awakened Gyuki",
    topImageSrc: img("Saint Jaygarcia Saturn.jpg"),
    bottomImageSrc: img("Awakened Gyuki (Saint Jaygarcia Saturn).jpg"),
  },
  {
    topTitle: "Jewelry Bonney",
    bottomTitle: "Nika",
    topImageSrc: img("Bonney.jpg"),
    bottomImageSrc: img("Nika (Jewelry Bonney).jpg"),
    bottomObjectPosition: {
      x: 0,
      y: 125,
    },
  },

  // 👑 GIAI ĐOẠN 8: GRAND FINALE - Cú chốt bùng nổ nhất
  {
    topTitle: "Luffy",
    bottomTitle: "Gear 5",
    topImageSrc: img("Luffy.jfif"),
    bottomImageSrc: img("Gear 5 (Luffy).jfif"),
  }, // Để người xem thỏa mãn, tim, share và xem lại từ đầu.
];
