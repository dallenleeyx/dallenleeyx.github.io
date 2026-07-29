// Verb conjugation reference (9 topics) and a precomputed verb bank for the
// practice drill. Unlike vocab/grammar, conjugation forms are rule-based —
// so CONJUGATION_PRACTICE_VERBS holds hand-checked correct answers rather
// than being generated on the fly, to avoid silently teaching a wrong form.

export const CONJUGATION_TOPICS = [
  {
    number: 1,
    id: "verb-groups",
    title: "動詞のグループ",
    englishTitle: "Verb groups",
    type: "classification",
    intro:
      "There are three groups of verbs. You work out which one a verb belongs to based on the sound before ます, or the ending of the dictionary form. The rules for forming the て form, potential form, etc. are different for each group.",
    groups: [
      {
        label: "I",
        rows: [
          { masu: "-います", dict: "-う", examples: ["買う", "使う"] },
          { masu: "-きます / -ぎます", dict: "-く / -ぐ", examples: ["聞く", "行く", "およぐ"] },
          { masu: "-します", dict: "-す", examples: ["話す", "出す"] },
          { masu: "-ちます", dict: "-つ", examples: ["立つ", "持つ"] },
          { masu: "-にます", dict: "-ぬ", examples: ["死ぬ"] },
          { masu: "-びます", dict: "-ぶ", examples: ["運ぶ", "あそぶ"] },
          { masu: "-みます", dict: "-む", examples: ["読む", "飲む"] },
          { masu: "-ります", dict: "-aる / -oる / -uる", examples: ["ある", "とる", "作る"] },
          { masu: "-ります", dict: "-iる (exception)", examples: ["知る", "入る", "切る", "走る", "要る"] },
          { masu: "-ります", dict: "-eる (exception)", examples: ["帰る", "すべる"] },
        ],
      },
      {
        label: "II",
        rows: [
          { masu: "-iます", dict: "-iる", examples: ["見る", "いる", "着る", "あびる", "できる", "起きる"] },
          { masu: "-eます", dict: "-eる", examples: ["ねる", "食べる", "開ける", "かける", "変える", "聞こえる", "考える"] },
        ],
      },
      {
        label: "III",
        rows: [{ masu: "(irregular)", dict: "(irregular)", examples: ["する", "勉強する", "そうじする", "来る", "持ってくる"] }],
      },
    ],
  },

  {
    number: 2,
    id: "te-ta-form",
    title: "て形・た形",
    englishTitle: "Te-form / Ta-form",
    columns: ["て形", "た形"],
    groups: [
      {
        label: "I",
        examples: [
          { dict: "書く", values: ["書いて", "書いた"] },
          { dict: "行く (exception)", values: ["行って", "行った"] },
          { dict: "ぬぐ", values: ["ぬいで", "ぬいだ"] },
          { dict: "読む", values: ["読んで", "読んだ"] },
          { dict: "とぶ", values: ["とんで", "とんだ"] },
          { dict: "死ぬ", values: ["死んで", "死んだ"] },
          { dict: "言う", values: ["言って", "言った"] },
          { dict: "持つ", values: ["持って", "持った"] },
          { dict: "作る", values: ["作って", "作った"] },
          { dict: "出す", values: ["出して", "出した"] },
        ],
      },
      {
        label: "II",
        examples: [
          { dict: "いる", values: ["いて", "いた"] },
          { dict: "起きる", values: ["起きて", "起きた"] },
          { dict: "出る", values: ["出て", "出た"] },
          { dict: "食べる", values: ["食べて", "食べた"] },
          { dict: "あげる", values: ["あげて", "あげた"] },
        ],
      },
      {
        label: "III",
        examples: [
          { dict: "する", values: ["して", "した"] },
          { dict: "来る", values: ["来て", "来た"] },
        ],
      },
    ],
  },

  {
    number: 3,
    id: "polite-plain",
    title: "ていねい形とぶつう形",
    englishTitle: "Polite form and Plain form",
    columns: ["polite", "plain"],
    intro:
      "The plain form is used when talking with close friends and family, and also in literary styles used when writing reports, essays, and diaries.",
    groups: [
      {
        label: "Verb (買う)",
        examples: [
          { dict: "affirmative", values: ["買います", "買う"] },
          { dict: "negative", values: ["買いません", "買わない"] },
          { dict: "past affirmative", values: ["買いました", "買った"] },
          { dict: "past negative", values: ["買いませんでした", "買わなかった"] },
        ],
      },
      {
        label: "い adjective (高い)",
        examples: [
          { dict: "affirmative", values: ["高いです", "高い"] },
          { dict: "negative", values: ["高くないです", "高くない"] },
          { dict: "past affirmative", values: ["高かったです", "高かった"] },
          { dict: "past negative", values: ["高くなかったです", "高くなかった"] },
        ],
      },
      {
        label: "な adjective (静か)",
        examples: [
          { dict: "affirmative", values: ["静かです", "静かだ"] },
          { dict: "negative", values: ["静かではありません", "静かではない"] },
          { dict: "past affirmative", values: ["静かでした", "静かだった"] },
          { dict: "past negative", values: ["静かではありませんでした", "静かではなかった"] },
        ],
      },
      {
        label: "Noun (雨)",
        examples: [
          { dict: "affirmative", values: ["雨です", "雨だ"] },
          { dict: "negative", values: ["雨ではありません", "雨ではない"] },
          { dict: "past affirmative", values: ["雨でした", "雨だった"] },
          { dict: "past negative", values: ["雨ではありませんでした", "雨ではなかった"] },
        ],
      },
    ],
  },

  {
    number: 4,
    id: "potential-form",
    title: "可能の形",
    englishTitle: "The potential form",
    columns: ["可能形"],
    groups: [
      {
        label: "I",
        rule: "dictionary -u → -eる",
        examples: [
          { dict: "言う", values: ["言える"] },
          { dict: "聞く", values: ["聞ける"] },
          { dict: "急ぐ", values: ["急げる"] },
          { dict: "貸す", values: ["貸せる"] },
          { dict: "待つ", values: ["待てる"] },
          { dict: "呼ぶ", values: ["呼べる"] },
          { dict: "飲む", values: ["飲める"] },
          { dict: "作る", values: ["作れる"] },
        ],
      },
      {
        label: "II",
        rule: "dictionary -る → stem + られる",
        examples: [
          { dict: "見る", values: ["見られる"] },
          { dict: "いる", values: ["いられる"] },
          { dict: "ねる", values: ["ねられる"] },
          { dict: "考える", values: ["考えられる"] },
        ],
      },
      {
        label: "III",
        examples: [
          { dict: "する", values: ["できる"] },
          { dict: "来る", values: ["来られる"] },
        ],
      },
    ],
  },

  {
    number: 5,
    id: "ba-nara-form",
    title: "「~ば・~なら」の形",
    englishTitle: "Ba-form / Nara-form (conditional)",
    columns: ["affirmative", "negative"],
    groups: [
      {
        label: "I (Verb)",
        rule: "dictionary -u → -eば　／　-ない → -なければ",
        examples: [
          { dict: "すう", values: ["すえば", "すわなければ"] },
          { dict: "歩く", values: ["歩けば", "歩かなければ"] },
          { dict: "急ぐ", values: ["急げば", "急がなければ"] },
          { dict: "貸す", values: ["貸せば", "貸さなければ"] },
          { dict: "待つ", values: ["待てば", "待たなければ"] },
          { dict: "死ぬ", values: ["死ねば", "死ななければ"] },
          { dict: "とぶ", values: ["とべば", "とばなければ"] },
          { dict: "住む", values: ["住めば", "住まなければ"] },
          { dict: "作る", values: ["作れば", "作らなければ"] },
          { dict: "ある", values: ["あれば", "なければ"] },
        ],
      },
      {
        label: "II (Verb)",
        rule: "dictionary -る → -れば　／　-ない → -なければ",
        examples: [
          { dict: "見る", values: ["見れば", "見なければ"] },
          { dict: "いる", values: ["いれば", "いなければ"] },
          { dict: "ねる", values: ["ねれば", "ねなければ"] },
          { dict: "しめる", values: ["しめれば", "しめなければ"] },
        ],
      },
      {
        label: "III (Verb)",
        examples: [
          { dict: "する", values: ["すれば", "しなければ"] },
          { dict: "来る", values: ["来れば", "来なければ"] },
        ],
      },
      {
        label: "い adjective",
        examples: [
          { dict: "高い", values: ["高ければ", "高くなければ"] },
          { dict: "いい (exception)", values: ["よければ", "よくなければ"] },
        ],
      },
      {
        label: "な adjective / Noun",
        examples: [
          { dict: "しずか", values: ["しずかなら", "しずかでなければ"] },
          { dict: "雨", values: ["雨なら", "雨でなければ"] },
        ],
      },
    ],
  },

  {
    number: 6,
    id: "u-yo-form",
    title: "う・よう形",
    englishTitle: "Volitional form",
    columns: ["う・よう形"],
    note: "This form is also used as the plain form of ~ましょう.",
    groups: [
      {
        label: "I",
        rule: "dictionary -u → -oう",
        examples: [
          { dict: "買う", values: ["買おう"] },
          { dict: "みがく", values: ["みがこう"] },
          { dict: "およぐ", values: ["およごう"] },
          { dict: "出す", values: ["出そう"] },
          { dict: "立つ", values: ["立とう"] },
          { dict: "死ぬ", values: ["死のう"] },
          { dict: "よぶ", values: ["よぼう"] },
          { dict: "飲む", values: ["飲もう"] },
          { dict: "帰る", values: ["帰ろう"] },
        ],
      },
      {
        label: "II",
        rule: "dictionary -る → -よう",
        examples: [
          { dict: "見る", values: ["見よう"] },
          { dict: "起きる", values: ["起きよう"] },
          { dict: "ねる", values: ["ねよう"] },
          { dict: "あげる", values: ["あげよう"] },
        ],
      },
      {
        label: "III",
        examples: [
          { dict: "する", values: ["しよう"] },
          { dict: "来る", values: ["来よう"] },
        ],
      },
    ],
  },

  {
    number: 7,
    id: "passive-form",
    title: "受身の形",
    englishTitle: "The passive form",
    columns: ["受身形"],
    note: "With Group II verbs and 来る, the passive form and potential form are the same.",
    groups: [
      {
        label: "I",
        rule: "dictionary -u → -aれる",
        examples: [
          { dict: "言う", values: ["言われる"] },
          { dict: "なく", values: ["なかれる"] },
          { dict: "さわぐ", values: ["さわがれる"] },
          { dict: "話す", values: ["話される"] },
          { dict: "立つ", values: ["立たれる"] },
          { dict: "死ぬ", values: ["死なれる"] },
          { dict: "よぶ", values: ["よばれる"] },
          { dict: "ふむ", values: ["ふまれる"] },
          { dict: "しかる", values: ["しかられる"] },
        ],
      },
      {
        label: "II",
        rule: "dictionary -る → stem + られる",
        examples: [
          { dict: "見る", values: ["見られる"] },
          { dict: "いる", values: ["いられる"] },
          { dict: "ねる", values: ["ねられる"] },
          { dict: "ほめる", values: ["ほめられる"] },
        ],
      },
      {
        label: "III",
        examples: [
          { dict: "する", values: ["される"] },
          { dict: "来る", values: ["来られる"] },
        ],
      },
    ],
  },

  {
    number: 8,
    id: "causative-form",
    title: "使役の形",
    englishTitle: "The causative form",
    columns: ["使役形"],
    groups: [
      {
        label: "I",
        rule: "dictionary -u → -aせる",
        examples: [
          { dict: "言う", values: ["言わせる"] },
          { dict: "なく", values: ["なかせる"] },
          { dict: "およぐ", values: ["およがせる"] },
          { dict: "話す", values: ["話させる"] },
          { dict: "立つ", values: ["立たせる"] },
          { dict: "死ぬ", values: ["死なせる"] },
          { dict: "あそぶ", values: ["あそばせる"] },
          { dict: "飲む", values: ["飲ませる"] },
          { dict: "すわる", values: ["すわらせる"] },
        ],
      },
      {
        label: "II",
        rule: "dictionary -る → stem + させる",
        examples: [
          { dict: "見る", values: ["見させる"] },
          { dict: "いる", values: ["いさせる"] },
          { dict: "かける", values: ["かけさせる"] },
          { dict: "やめる", values: ["やめさせる"] },
        ],
      },
      {
        label: "III",
        examples: [
          { dict: "する", values: ["させる"] },
          { dict: "来る", values: ["来させる"] },
        ],
      },
    ],
  },

  {
    number: 9,
    id: "causative-passive-form",
    title: "使役受身の形",
    englishTitle: "The causative-passive form",
    columns: ["form 1 (-aされる)", "form 2 (-aせられる)"],
    note:
      "Group I verbs commonly use causative-passive form 1 (-aされる). However, verbs whose dictionary form ends in す (話す, 出す, おす, etc.) and Group II/III verbs do not have the -aされる form — only form 2.",
    groups: [
      {
        label: "I",
        examples: [
          { dict: "はらう", values: ["はらわされる", "はらわせられる"] },
          { dict: "聞く", values: ["聞かされる", "聞かせられる"] },
          { dict: "急ぐ", values: ["急がされる", "急がせられる"] },
          { dict: "話す", values: ["—", "話させられる"] },
          { dict: "立つ", values: ["立たされる", "立たせられる"] },
          { dict: "運ぶ", values: ["運ばされる", "運ばせられる"] },
          { dict: "飲む", values: ["飲まされる", "飲ませられる"] },
          { dict: "すわる", values: ["すわらされる", "すわらせられる"] },
        ],
      },
      {
        label: "II",
        examples: [
          { dict: "着る", values: ["—", "着させられる"] },
          { dict: "いる", values: ["—", "いさせられる"] },
          { dict: "ねる", values: ["—", "ねさせられる"] },
          { dict: "考える", values: ["—", "考えさせられる"] },
        ],
      },
      {
        label: "III",
        examples: [
          { dict: "する", values: ["—", "させられる"] },
          { dict: "来る", values: ["—", "来させられる"] },
        ],
      },
    ],
  },
];

// Practice-drill verb bank. Every form is pre-checked by hand — this is
// deliberately a fixed list rather than a generated one, since conjugation
// has real exceptions (行く, する/来る, す-ending verbs, etc.) that a
// generic rule engine could easily get wrong.
export const CONJUGATION_PRACTICE_VERBS = [
  // Group I (godan) — 37 verbs
  { dict: "買う", reading: "かう", meaning: "to buy", group: "I", te: "買って", ta: "買った", potential: "買える", ba: "買えば", volitional: "買おう", passive: "買われる", causative: "買わせる", causativePassive: "買わされる（買わせられる）" },
  { dict: "使う", reading: "つかう", meaning: "to use", group: "I", te: "使って", ta: "使った", potential: "使える", ba: "使えば", volitional: "使おう", passive: "使われる", causative: "使わせる", causativePassive: "使わされる（使わせられる）" },
  { dict: "会う", reading: "あう", meaning: "to meet", group: "I", te: "会って", ta: "会った", potential: "会える", ba: "会えば", volitional: "会おう", passive: "会われる", causative: "会わせる", causativePassive: "会わされる（会わせられる）" },
  { dict: "手伝う", reading: "てつだう", meaning: "to help", group: "I", te: "手伝って", ta: "手伝った", potential: "手伝える", ba: "手伝えば", volitional: "手伝おう", passive: "手伝われる", causative: "手伝わせる", causativePassive: "手伝わされる（手伝わせられる）" },
  { dict: "聞く", reading: "きく", meaning: "to listen, to ask", group: "I", te: "聞いて", ta: "聞いた", potential: "聞ける", ba: "聞けば", volitional: "聞こう", passive: "聞かれる", causative: "聞かせる", causativePassive: "聞かされる（聞かせられる）" },
  { dict: "書く", reading: "かく", meaning: "to write", group: "I", te: "書いて", ta: "書いた", potential: "書ける", ba: "書けば", volitional: "書こう", passive: "書かれる", causative: "書かせる", causativePassive: "書かされる（書かせられる）" },
  { dict: "歩く", reading: "あるく", meaning: "to walk", group: "I", te: "歩いて", ta: "歩いた", potential: "歩ける", ba: "歩けば", volitional: "歩こう", passive: "歩かれる", causative: "歩かせる", causativePassive: "歩かされる（歩かせられる）" },
  { dict: "働く", reading: "はたらく", meaning: "to work", group: "I", te: "働いて", ta: "働いた", potential: "働ける", ba: "働けば", volitional: "働こう", passive: "働かれる", causative: "働かせる", causativePassive: "働かされる（働かせられる）" },
  { dict: "泳ぐ", reading: "およぐ", meaning: "to swim", group: "I", te: "泳いで", ta: "泳いだ", potential: "泳げる", ba: "泳げば", volitional: "泳ごう", passive: "泳がれる", causative: "泳がせる", causativePassive: "泳がされる（泳がせられる）" },
  { dict: "急ぐ", reading: "いそぐ", meaning: "to hurry", group: "I", te: "急いで", ta: "急いだ", potential: "急げる", ba: "急げば", volitional: "急ごう", passive: "急がれる", causative: "急がせる", causativePassive: "急がされる（急がせられる）" },
  { dict: "話す", reading: "はなす", meaning: "to speak, to talk", group: "I", te: "話して", ta: "話した", potential: "話せる", ba: "話せば", volitional: "話そう", passive: "話される", causative: "話させる", causativePassive: "話させられる" },
  { dict: "貸す", reading: "かす", meaning: "to lend", group: "I", te: "貸して", ta: "貸した", potential: "貸せる", ba: "貸せば", volitional: "貸そう", passive: "貸される", causative: "貸させる", causativePassive: "貸させられる" },
  { dict: "出す", reading: "だす", meaning: "to take out, to submit", group: "I", te: "出して", ta: "出した", potential: "出せる", ba: "出せば", volitional: "出そう", passive: "出される", causative: "出させる", causativePassive: "出させられる" },
  { dict: "押す", reading: "おす", meaning: "to push", group: "I", te: "押して", ta: "押した", potential: "押せる", ba: "押せば", volitional: "押そう", passive: "押される", causative: "押させる", causativePassive: "押させられる" },
  { dict: "待つ", reading: "まつ", meaning: "to wait", group: "I", te: "待って", ta: "待った", potential: "待てる", ba: "待てば", volitional: "待とう", passive: "待たれる", causative: "待たせる", causativePassive: "待たされる（待たせられる）" },
  { dict: "持つ", reading: "もつ", meaning: "to hold, to carry", group: "I", te: "持って", ta: "持った", potential: "持てる", ba: "持てば", volitional: "持とう", passive: "持たれる", causative: "持たせる", causativePassive: "持たされる（持たせられる）" },
  { dict: "勝つ", reading: "かつ", meaning: "to win", group: "I", te: "勝って", ta: "勝った", potential: "勝てる", ba: "勝てば", volitional: "勝とう", passive: "勝たれる", causative: "勝たせる", causativePassive: "勝たされる（勝たせられる）" },
  { dict: "死ぬ", reading: "しぬ", meaning: "to die", group: "I", te: "死んで", ta: "死んだ", potential: "死ねる", ba: "死ねば", volitional: "死のう", passive: "死なれる", causative: "死なせる", causativePassive: "死なされる（死なせられる）" },
  { dict: "遊ぶ", reading: "あそぶ", meaning: "to play", group: "I", te: "遊んで", ta: "遊んだ", potential: "遊べる", ba: "遊べば", volitional: "遊ぼう", passive: "遊ばれる", causative: "遊ばせる", causativePassive: "遊ばされる（遊ばせられる）" },
  { dict: "呼ぶ", reading: "よぶ", meaning: "to call", group: "I", te: "呼んで", ta: "呼んだ", potential: "呼べる", ba: "呼べば", volitional: "呼ぼう", passive: "呼ばれる", causative: "呼ばせる", causativePassive: "呼ばされる（呼ばせられる）" },
  { dict: "飛ぶ", reading: "とぶ", meaning: "to fly, to jump", group: "I", te: "飛んで", ta: "飛んだ", potential: "飛べる", ba: "飛べば", volitional: "飛ぼう", passive: "飛ばれる", causative: "飛ばせる", causativePassive: "飛ばされる（飛ばせられる）" },
  { dict: "読む", reading: "よむ", meaning: "to read", group: "I", te: "読んで", ta: "読んだ", potential: "読める", ba: "読めば", volitional: "読もう", passive: "読まれる", causative: "読ませる", causativePassive: "読まされる（読ませられる）" },
  { dict: "飲む", reading: "のむ", meaning: "to drink", group: "I", te: "飲んで", ta: "飲んだ", potential: "飲める", ba: "飲めば", volitional: "飲もう", passive: "飲まれる", causative: "飲ませる", causativePassive: "飲まされる（飲ませられる）" },
  { dict: "住む", reading: "すむ", meaning: "to live, to reside", group: "I", te: "住んで", ta: "住んだ", potential: "住める", ba: "住めば", volitional: "住もう", passive: "住まれる", causative: "住ませる", causativePassive: "住まされる（住ませられる）" },
  { dict: "休む", reading: "やすむ", meaning: "to rest, to take a break", group: "I", te: "休んで", ta: "休んだ", potential: "休める", ba: "休めば", volitional: "休もう", passive: "休まれる", causative: "休ませる", causativePassive: "休まされる（休ませられる）" },
  { dict: "作る", reading: "つくる", meaning: "to make", group: "I", te: "作って", ta: "作った", potential: "作れる", ba: "作れば", volitional: "作ろう", passive: "作られる", causative: "作らせる", causativePassive: "作らされる（作らせられる）" },
  { dict: "帰る", reading: "かえる", meaning: "to go home", group: "I", te: "帰って", ta: "帰った", potential: "帰れる", ba: "帰れば", volitional: "帰ろう", passive: "帰られる", causative: "帰らせる", causativePassive: "帰らされる（帰らせられる）" },
  { dict: "洗う", reading: "あらう", meaning: "to wash", group: "I", te: "洗って", ta: "洗った", potential: "洗える", ba: "洗えば", volitional: "洗おう", passive: "洗われる", causative: "洗わせる", causativePassive: "洗わされる（洗わせられる）" },
  { dict: "乗る", reading: "のる", meaning: "to ride", group: "I", te: "乗って", ta: "乗った", potential: "乗れる", ba: "乗れば", volitional: "乗ろう", passive: "乗られる", causative: "乗らせる", causativePassive: "乗らされる（乗らせられる）" },
  { dict: "走る", reading: "はしる", meaning: "to run", group: "I", te: "走って", ta: "走った", potential: "走れる", ba: "走れば", volitional: "走ろう", passive: "走られる", causative: "走らせる", causativePassive: "走らされる（走らせられる）" },
  { dict: "入る", reading: "はいる", meaning: "to enter", group: "I", te: "入って", ta: "入った", potential: "入れる", ba: "入れば", volitional: "入ろう", passive: "入られる", causative: "入らせる", causativePassive: "入らされる（入らせられる）" },
  { dict: "切る", reading: "きる", meaning: "to cut", group: "I", te: "切って", ta: "切った", potential: "切れる", ba: "切れば", volitional: "切ろう", passive: "切られる", causative: "切らせる", causativePassive: "切らされる（切らせられる）" },
  { dict: "知る", reading: "しる", meaning: "to know", group: "I", te: "知って", ta: "知った", potential: "知れる", ba: "知れば", volitional: "知ろう", passive: "知られる", causative: "知らせる", causativePassive: "知らされる（知らせられる）" },
  { dict: "座る", reading: "すわる", meaning: "to sit", group: "I", te: "座って", ta: "座った", potential: "座れる", ba: "座れば", volitional: "座ろう", passive: "座られる", causative: "座らせる", causativePassive: "座らされる（座らせられる）" },
  { dict: "すべる", reading: "すべる", meaning: "to slip", group: "I", te: "すべって", ta: "すべった", potential: "すべれる", ba: "すべれば", volitional: "すべろう", passive: "すべられる", causative: "すべらせる", causativePassive: "すべらされる（すべらせられる）" },
  { dict: "行く", reading: "いく", meaning: "to go", group: "I", te: "行って", ta: "行った", potential: "行ける", ba: "行けば", volitional: "行こう", passive: "行かれる", causative: "行かせる", causativePassive: "行かされる（行かせられる）" },
  { dict: "送る", reading: "おくる", meaning: "to send", group: "I", te: "送って", ta: "送った", potential: "送れる", ba: "送れば", volitional: "送ろう", passive: "送られる", causative: "送らせる", causativePassive: "送らされる（送らせられる）" },

  // Group II (ichidan) — 11 verbs
  { dict: "見る", reading: "みる", meaning: "to see, to watch", group: "II", te: "見て", ta: "見た", potential: "見られる", ba: "見れば", volitional: "見よう", passive: "見られる", causative: "見させる", causativePassive: "見させられる" },
  { dict: "食べる", reading: "たべる", meaning: "to eat", group: "II", te: "食べて", ta: "食べた", potential: "食べられる", ba: "食べれば", volitional: "食べよう", passive: "食べられる", causative: "食べさせる", causativePassive: "食べさせられる" },
  { dict: "起きる", reading: "おきる", meaning: "to get up, to wake up", group: "II", te: "起きて", ta: "起きた", potential: "起きられる", ba: "起きれば", volitional: "起きよう", passive: "起きられる", causative: "起きさせる", causativePassive: "起きさせられる" },
  { dict: "かける", reading: "かける", meaning: "to hang, to pour", group: "II", te: "かけて", ta: "かけた", potential: "かけられる", ba: "かければ", volitional: "かけよう", passive: "かけられる", causative: "かけさせる", causativePassive: "かけさせられる" },
  { dict: "考える", reading: "かんがえる", meaning: "to think", group: "II", te: "考えて", ta: "考えた", potential: "考えられる", ba: "考えれば", volitional: "考えよう", passive: "考えられる", causative: "考えさせる", causativePassive: "考えさせられる" },
  { dict: "寝る", reading: "ねる", meaning: "to sleep", group: "II", te: "寝て", ta: "寝た", potential: "寝られる", ba: "寝れば", volitional: "寝よう", passive: "寝られる", causative: "寝させる", causativePassive: "寝させられる" },
  { dict: "着る", reading: "きる", meaning: "to wear", group: "II", te: "着て", ta: "着た", potential: "着られる", ba: "着れば", volitional: "着よう", passive: "着られる", causative: "着させる", causativePassive: "着させられる" },
  { dict: "開ける", reading: "あける", meaning: "to open (something)", group: "II", te: "開けて", ta: "開けた", potential: "開けられる", ba: "開ければ", volitional: "開けよう", passive: "開けられる", causative: "開けさせる", causativePassive: "開けさせられる" },
  { dict: "閉める", reading: "しめる", meaning: "to close (something)", group: "II", te: "閉めて", ta: "閉めた", potential: "閉められる", ba: "閉めれば", volitional: "閉めよう", passive: "閉められる", causative: "閉めさせる", causativePassive: "閉めさせられる" },
  { dict: "教える", reading: "おしえる", meaning: "to teach", group: "II", te: "教えて", ta: "教えた", potential: "教えられる", ba: "教えれば", volitional: "教えよう", passive: "教えられる", causative: "教えさせる", causativePassive: "教えさせられる" },
  { dict: "覚える", reading: "おぼえる", meaning: "to remember, to memorize", group: "II", te: "覚えて", ta: "覚えた", potential: "覚えられる", ba: "覚えれば", volitional: "覚えよう", passive: "覚えられる", causative: "覚えさせる", causativePassive: "覚えさせられる" },

  // Group III (irregular) — 2 verbs
  { dict: "する", reading: "する", meaning: "to do", group: "III", te: "して", ta: "した", potential: "できる", ba: "すれば", volitional: "しよう", passive: "される", causative: "させる", causativePassive: "させられる" },
  { dict: "来る", reading: "くる", meaning: "to come", group: "III", te: "来て", ta: "来た", potential: "来られる", ba: "来れば", volitional: "来よう", passive: "来られる", causative: "来させる", causativePassive: "来させられる" },
];
