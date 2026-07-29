// Sentence-based practice for the Conjugation tab's "Sentences" mode.
// Unlike the isolated verb→form drill in "By form", these test each
// conjugation form inside a real sentence context. Keyed by form id
// (te, ta, potential, ba, volitional, passive, causative, causativePassive)
// — matching the FORM_LABELS keys already used in app.js.

export const CONJUGATION_SENTENCES = {
  te: [
    { type: "fill", jp: "朝起き＿＿＿、顔を洗います。（起きる）", en: "I get up in the morning and wash my face.", answer: "て" },
    { type: "choice", jp: "友だちに会っ＿＿、うれしかったです。", en: "I was happy to meet my friend.", options: ["て", "た", "れば", "よう"], correct: 0 },
    { type: "fill", jp: "窓を開け＿＿＿、空気を入れかえました。（開ける）", en: "I opened the window and let in fresh air.", answer: "て" },
    { type: "choice", jp: "宿題をし＿＿、寝ます。", en: "I'll do my homework and then sleep.", options: ["て", "た", "ながら", "のに"], correct: 0 },
    { type: "fill", jp: "この本を読ん＿＿＿、感想を書いてください。（読む）", en: "Please read this book and write your thoughts.", answer: "で" },
    { type: "choice", jp: "駅まで走っ＿＿、なんとか間に合いました。", en: "I ran to the station and just barely made it in time.", options: ["て", "たら", "ながら", "ので"], correct: 0 },
  ],
  ta: [
    { type: "fill", jp: "きのう、友だちと映画を＿＿＿＿＿。（見る）", en: "Yesterday I watched a movie with a friend.", answer: "見ました" },
    { type: "choice", jp: "先週、京都へ＿＿＿。", en: "Last week I went to Kyoto.", options: ["行きました", "行きます", "行って", "行けば"], correct: 0 },
    { type: "fill", jp: "きのうの晩、早く＿＿＿＿＿。（寝る）", en: "Last night I went to sleep early.", answer: "寝ました" },
    { type: "choice", jp: "去年、日本語の勉強を＿＿＿。", en: "I started studying Japanese last year.", options: ["始めました", "始めます", "始めて", "始めれば"], correct: 0 },
    { type: "fill", jp: "さっき、駅で友だちに＿＿＿＿＿。（会う）", en: "I met a friend at the station a little while ago.", answer: "会いました" },
  ],
  potential: [
    { type: "fill", jp: "わたしはギターが少し＿＿＿。（弾く）", en: "I can play the guitar a little.", answer: "弾けます" },
    { type: "choice", jp: "この魚は生で＿＿＿。", en: "This fish can be eaten raw.", options: ["食べられます", "食べます", "食べさせます", "食べられません"], correct: 0 },
    { type: "fill", jp: "彼は3か国語が＿＿＿。（話す）", en: "He can speak three languages.", answer: "話せます" },
    { type: "choice", jp: "この道具を使えば、簡単に＿＿＿。", en: "If you use this tool, you can cut it easily.", options: ["切れます", "切ります", "切らせます", "切られます"], correct: 0 },
    { type: "fill", jp: "ここからは富士山が＿＿＿。（見る）", en: "You can see Mt. Fuji from here.", answer: "見られます" },
  ],
  ba: [
    { type: "fill", jp: "早く出れ＿＿、間に合います。（出る）", en: "If you leave early, you'll make it in time.", answer: "ば" },
    { type: "choice", jp: "この薬を飲め＿＿、すぐ治りますよ。", en: "If you take this medicine, you'll get better right away.", options: ["ば", "たら", "と", "のに"], correct: 0 },
    { type: "fill", jp: "天気がよけれ＿＿、山に登りたいです。（いい）", en: "If the weather's good, I want to climb the mountain.", answer: "ば" },
    { type: "choice", jp: "静か＿＿、勉強に集中できます。", en: "If it's quiet, I can focus on studying.", options: ["なら", "けば", "くば", "だば"], correct: 0 },
    { type: "fill", jp: "がんばれ＿＿、きっとできますよ。（がんばる）", en: "If you do your best, you'll surely be able to do it.", answer: "ば" },
  ],
  volitional: [
    { type: "fill", jp: "もう遅いから、そろそろ帰＿＿＿。（帰る）", en: "It's already late, so let's head home soon.", answer: "ろう" },
    { type: "choice", jp: "今度いっしょにご飯を食べ＿＿。", en: "Let's eat together sometime.", options: ["よう", "よ", "ます", "ません"], correct: 0 },
    { type: "fill", jp: "あしたは早く起き＿＿＿と思います。（起きる）", en: "I'm thinking of getting up early tomorrow.", answer: "よう" },
    { type: "choice", jp: "この問題、いっしょに考え＿＿。", en: "Let's think about this problem together.", options: ["よう", "ながら", "たら", "ので"], correct: 0 },
    { type: "fill", jp: "今年こそタバコをやめ＿＿＿と思う。（やめる）", en: "I'm thinking this year I'll really quit smoking.", answer: "よう" },
  ],
  passive: [
    { type: "fill", jp: "この歌は世界中で＿＿＿＿＿。（歌う）", en: "This song is sung all over the world.", answer: "歌われています" },
    { type: "choice", jp: "きのう、電車で足を＿＿＿。", en: "My foot got stepped on on the train yesterday.", options: ["ふまれました", "ふみました", "ふませました", "ふめました"], correct: 0 },
    { type: "fill", jp: "このお寺は江戸時代に＿＿＿＿＿。（建てる）", en: "This temple was built in the Edo period.", answer: "建てられました" },
    { type: "choice", jp: "子どものとき、よく兄にお菓子を＿＿＿。", en: "As a child, I often had my snacks eaten by my older brother.", options: ["食べられました", "食べさせました", "食べました", "食べさせられました"], correct: 0 },
  ],
  causative: [
    { type: "fill", jp: "先生は学生に漢字を＿＿＿＿＿。（覚える）", en: "The teacher makes the students memorize kanji.", answer: "覚えさせます" },
    { type: "choice", jp: "母は妹に野菜を＿＿＿。", en: "Mother makes my younger sister eat vegetables.", options: ["食べさせます", "食べられます", "食べます", "食べさせられます"], correct: 0 },
    { type: "fill", jp: "上司はわたしに残業を＿＿＿＿＿。（する）", en: "My boss makes me work overtime.", answer: "させます" },
    { type: "choice", jp: "けんは犬を庭で自由に＿＿＿。", en: "Ken lets the dog play freely in the garden.", options: ["あそばせます", "あそびます", "あそばれます", "あそべます"], correct: 0 },
  ],
  causativePassive: [
    { type: "fill", jp: "子どものころ、よく親に部屋を＿＿＿＿＿＿＿。（掃除する）", en: "As a child, I was often made to clean my room by my parents.", answer: "掃除させられました" },
    { type: "choice", jp: "先輩に無理やりお酒を＿＿＿。", en: "I was forced by a senior to drink alcohol.", options: ["飲まされました", "飲みました", "飲ませました", "飲まれました"], correct: 0 },
    { type: "fill", jp: "小学生のとき、みんなの前で歌を＿＿＿＿＿＿＿。（歌う）", en: "When I was in elementary school, I was made to sing in front of everyone.", answer: "歌わされました" },
    { type: "choice", jp: "上司に急な出張を＿＿＿、大変でした。", en: "I was made to go on a sudden business trip by my boss, and it was tough.", options: ["させられて", "させて", "されて", "させられれば"], correct: 0 },
  ],
};
