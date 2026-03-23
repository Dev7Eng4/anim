import { staticFile } from "remotion";
const dir = "anime/kurono-no-basuke-skills";

export const data = [
  // 1. THE HOOK (Cặp bài trùng Seirin)
  {
    title: "Tetsuya Kuroko",
    description: "3,5,5,10,10",
    imageSrc: staticFile(`${dir}/Tetsuya Kuroko.webp`),
    objectPosition: {
      x: 90,
      y: 0,
    },
  },
  {
    title: "Taiga Kagami",
    description: "10,8,8,9,10",
    imageSrc: staticFile(`${dir}/Taiga Kagami.webp`),
    objectPosition: {
      x: -143,
      y: 0,
    },
  },

  // 2. SEIRIN CORE & BENCH (Lướt nhanh)
  {
    title: "Junpei Hyuga",
    description: "6,7,8,8,7",
    imageSrc: staticFile(`${dir}/Junpei Hyūga.webp`),
  },
  {
    title: "Shun Izuki",
    description: "6,7,7,7,7",
    imageSrc: staticFile(`${dir}/Shun Izuki.webp`),
  },
  {
    title: "Rinnosuke Mitobe",
    description: "7,7,8,7,3",
    imageSrc: staticFile(`${dir}/Rinnosuke Mitobe.webp`),
  },
  {
    title: "Shinji Koganei",
    description: "8,4,8,7,4",
    imageSrc: staticFile(`${dir}/Shinji Koganei.webp`),
  },
  {
    title: "Koki Furihata",
    description: "5,6,5,6,3",
    imageSrc: staticFile(`${dir}/Koki Furihata.webp`),
  },
  {
    title: "Satoshi Tsuchida",
    description: "6,6,8,7,3",
    imageSrc: staticFile(`${dir}/Satoshi Tsuchida.webp`),
  },
  {
    title: "Koichi Kawahara",
    description: "6,5,5,5,2",
    imageSrc: staticFile(`${dir}/Koichi Kawahara.webp`),
    objectPosition: {
      x: 148,
      y: 0,
    },
  },

  // 3. MINOR RIVALS & OTHERS (Nhân vật phụ các đội khác)
  {
    title: "Tomoki Tsugawa",
    description: "7,7,10,8,4",
    imageSrc: staticFile(`${dir}/Tomoki Tsugawa.webp`),
  },
  {
    title: "Ryo Sakurai",
    description: "6,8,7,7,8",
    imageSrc: staticFile(`${dir}/Ryō Sakurai.webp`),
  },
  {
    title: "Yoshitaka Moriyama",
    description: "6,9,8,7,7",
    imageSrc: staticFile(`${dir}/Yoshitaka Moriyama.webp`),
    objectPosition: {
      x: -153,
      y: 12,
    },
  },
  {
    title: "Mitsuhiro Hayakawa",
    description: "7,5,10,8,5",
    imageSrc: staticFile(`${dir}/Mitsuhiro Hayakawa.webp`),
  },
  {
    title: "Shinsuke Kimura",
    description: "7,7,10,8,4",
    imageSrc: staticFile(`${dir}/Shinsuke Kimura.webp`),
    objectPosition: {
      x: -138,
      y: 5,
    },
  },
  {
    title: "Yoshinori Susa",
    description: "8,8,8,7,5",
    imageSrc: staticFile(`${dir}/Yoshinori Susa.webp`),
    objectPosition: {
      x: -188,
      y: 3,
    },
  },
  {
    title: "Kosuke Wakamatsu",
    description: "10,6,10,8,5",
    imageSrc: staticFile(`${dir}/Kosuke Wakamatsu.webp`),
  },
  {
    title: "Taisuke Otsubo",
    description: "9,8,9,9,4",
    imageSrc: staticFile(`${dir}/Taisuke Otsubo.webp`),
  },
  {
    title: "Kenichi Okamura",
    description: "9,7,9,8,5",
    imageSrc: staticFile(`${dir}/Kenichi Okamura.webp`),
  },
  {
    title: "Papa Mbaye Siki",
    description: "?,?,?,?,?",
    imageSrc: staticFile(`${dir}/Papa Mbaye Siki.webp`),
  },
  {
    title: "Wei Liu",
    description: "9,9,7,7,5",
    imageSrc: staticFile(`${dir}/Wei Liu.webp`),
  },
  {
    title: "Shigehiro Ogiwara",
    description: "7,7,9,10,4",
    imageSrc: staticFile(`${dir}/Shigehiro Ogiwara.webp`),
  },
  {
    title: "Shinya Nakamura",
    description: "7,7,9,7,4",
    imageSrc: staticFile(`${dir}/Shinya Nakamura.webp`),
    objectPosition: {
      x: 130,
      y: 0,
    },
  },
  {
    title: "Kazuya Hara",
    description: "8,8,6,7,6",
    imageSrc: staticFile(`${dir}/Kazuya Hara.webp`),
  },
  {
    title: "Kensuke Fukui",
    description: "7,8,8,7,5",
    imageSrc: staticFile(`${dir}/Kensuke Fukui.webp`),
  },
  {
    title: "Kentaro Seto",
    description: "6,8,6,7,7",
    imageSrc: staticFile(`${dir}/Kentaro Seto.webp`),
  },
  {
    title: "Koji Kobori",
    description: "7,8,9,8,4",
    imageSrc: staticFile(`${dir}/Koji Kobori.webp`),
  },
  {
    title: "Kojiro Furuhashi",
    description: "7,8,7,8,5",
    imageSrc: staticFile(`${dir}/Kojiro Furuhashi.webp`),
    objectPosition: {
      x: -135,
      y: 0,
    },
  },

  // 4. STRONG RIVALS & CAPTAINS (Bắt đầu hype)
  {
    title: "Kazunari Takao",
    description: "7,8,7,7,8",
    imageSrc: staticFile(`${dir}/Kazunari Takao.webp`),
  },
  {
    title: "Yukio Kasamatsu",
    description: "8,8,9,9,5",
    imageSrc: staticFile(`${dir}/Yukio Kasamatsu.webp`),
  },
  {
    title: "Shoichi Imayoshi",
    description: "6,9,8,9,6",
    imageSrc: staticFile(`${dir}/Shoichi Imayoshi.webp`),
  },
  {
    title: "Kiyoshi Miyaji",
    description: "8,9,8,8,5",
    imageSrc: staticFile(`${dir}/Kiyoshi Miyaji.webp`),
  },
  {
    title: "Chihiro Mayuzumi",
    description: "6,6,6,7,10",
    imageSrc: staticFile(`${dir}/Chihiro Mayuzumi.webp`),
  },
  {
    title: "Shuzo Nijimura",
    description: "8,8,10,9,5",
    imageSrc: staticFile(`${dir}/Shūzō Nijimura.webp`),
  },
  {
    title: "Tatsuya Himuro",
    description: "8,10,9,8,9",
    imageSrc: staticFile(`${dir}/Tatsuya Himuro.webp`),
  },
  {
    title: "Shogo Haizaki",
    description: "9,9,8,9,10",
    imageSrc: staticFile(`${dir}/Shōgo Haizaki.webp`),
  },

  // 5. UNCROWNED KINGS (Những vị vua không ngai)
  {
    title: "Teppei Kiyoshi",
    description: "9,9,7,9,8",
    imageSrc: staticFile(`${dir}/Teppei Kiyoshi.webp`),
  },
  {
    title: "Makoto Hanamiya",
    description: "8,9,8,8,9",
    imageSrc: staticFile(`${dir}/Makoto Hanamiya.webp`),
  },
  {
    title: "Reo Mibuchi",
    description: "8,10,8,8,9",
    imageSrc: staticFile(`${dir}/Reo Mibuchi.webp`),
  },
  {
    title: "Kotaro Hayama",
    description: "9,9,9,8,8",
    imageSrc: staticFile(`${dir}/Kotaro Hayama.webp`),
  },
  {
    title: "Eikichi Nebuya",
    description: "10,8,10,9,5",
    imageSrc: staticFile(`${dir}/Eikichi Nebuya.webp`),
  },

  // 6. GENERATION OF MIRACLES (Tuyệt đỉnh hype)
  {
    title: "Ryota Kise",
    description: "9,9,9,9,10",
    imageSrc: staticFile(`${dir}/Ryōta Kise.webp`),
  },
  {
    title: "Shintaro Midorima",
    description: "9,10,9,9,10",
    imageSrc: staticFile(`${dir}/Shintarō Midorima.webp`),
  },
  {
    title: "Atsushi Murasakibara",
    description: "10,10,9,8,9",
    imageSrc: staticFile(`${dir}/Atsushi Murasakibara.webp`),
  },
  {
    title: "Daiki Aomine",
    description: "10,10,8,9,10",
    imageSrc: staticFile(`${dir}/Daiki Aomine.webp`),
  },
  {
    title: "Seijuro Akashi",
    description: "9,10,9,10,10",
    imageSrc: staticFile(`${dir}/Seijūrō Akashi.webp`),
  },

  // 7. JABBERWOCK & OLD COACHES
  {
    title: "Jason Silver",
    description: "?,?,?,?,?",
    imageSrc: staticFile(`${dir}/Jason Silver.jpg`),
  },
  {
    title: "Nash Gold Jr.",
    description: "?,?,?,?,?",
    imageSrc: staticFile(`${dir}/Nash Gold Jr..webp`),
  },
  // {
  //   title: "Kagetora Aida",
  //   description: "8,10,6,10,6",
  //   imageSrc: staticFile(`${dir}/Kagetora Aida.webp`),
  // },
  // {
  //   title: "Katsunori Harasawa",
  //   description: "9,7,7,8,8",
  //   imageSrc: staticFile(`${dir}/Katsunori Harasawa.webp`),
  // },

  // 8. BONUS: MANAGERS (Thú vị cuối video)
  {
    title: "Riko Aida",
    description: "8,8,7,6,1",
    subTitle:
      "Training Capability,Analytical Skill,Leadership,Charisma,Cooking",
    imageSrc: staticFile(`${dir}/Riko Aida.webp`),
  },
  {
    title: "Satsuki Momoi",
    description: "4,10,5,7,9",
    subTitle:
      "Training Capability,Analytical Skill,Leadership,Charisma,Feminine Appeal",
    imageSrc: staticFile(`${dir}/Satsuki Momoi.webp`),
  },
];
