// Kanji / vocab flashcard data, grouped by JLPT level, then by lesson (課).
// Add or edit entries here — each entry needs: word, reading, meaning, lesson.
// Words with no kanji (pure kana/katakana) have an empty reading.
// VOCAB_LESSONS gives each lesson number a title, shown in the Word List
// and as flashcard filter labels — add an entry there whenever you use a
// new lesson number.

export const VOCAB_LESSONS = {
  N4: {
    1: "人と人①",
    2: "趣味①",
    3: "趣味②",
    4: "生活①",
    5: "買い物①",
    6: "学校①",
    7: "仕事①",
    8: "町①",
    9: "人と人②",
    10: "趣味③",
    11: "趣味④",
    12: "生活②",
    13: "生活③",
    14: "生活④",
    15: "買い物②",
    16: "学校②",
    17: "学校③",
    18: "町②",
    19: "人と人③",
    20: "趣味⑤",
    21: "生活⑤",
    22: "生活⑥",
    23: "生活⑦",
    24: "買い物③",
    25: "学校④",
    26: "仕事②",
    27: "町③",
    28: "人と人④",
    29: "趣味⑥",
    30: "生活⑧",
    31: "生活⑨",
    32: "学校⑤",
    33: "体①",
    34: "社会",
    35: "時間",
    36: "人と人⑤",
    37: "人と人⑥",
    38: "趣味⑦",
    39: "趣味⑧",
    40: "生活⑩",
    41: "生活⑪",
    42: "生活⑫",
    43: "学校⑥",
    44: "仕事③",
    45: "体②",
    46: "自然",
    47: "敬語",
    48: "副詞①",
    49: "副詞②",
    50: "N3へのステップ",
  },
  N3: {
    1: "家族と友達、性格",
    2: "付き合い、気持ち",
    3: "毎日の生活",
    4: "食生活",
    5: "家",
    6: "美容、健康",
    7: "病気",
    8: "スポーツ、芸術",
    9: "ファッション",
    10: "旅行",
    11: "学校生活（小中高）",
    12: "学校生活（大学）",
    13: "仕事",
    14: "コンピューター、郵便、電話など",
    15: "事件、事故",
    16: "政治、経済",
    17: "行事、宗教",
    18: "季節と天気、地理",
    19: "植物、動物など",
    20: "数と量",
    21: "時間",
    22: "和語動詞",
    23: "漢語動詞",
    24: "形容詞",
    25: "副詞",
    26: "オノマトペ",
    27: "間違えやすい漢語",
    28: "言い換え類義",
    29: "語形成",
  },
};

export const VOCAB_DATA = {
  N5: [],
  N4: [
    // 1課 人と人①
    { word: "夫", reading: "おっと", meaning: "husband", lesson: 1 },
    { word: "妻", reading: "つま", meaning: "wife", lesson: 1 },
    { word: "僕", reading: "ぼく", meaning: "I (used by men)", lesson: 1 },
    { word: "髪", reading: "かみ", meaning: "hair", lesson: 1 },
    { word: "のど", reading: "", meaning: "throat", lesson: 1 },
    { word: "熱", reading: "ねつ", meaning: "fever", lesson: 1 },
    { word: "(ご)主人", reading: "(ご)しゅじん", meaning: "husband (someone else's)", lesson: 1 },
    { word: "紹介する", reading: "しょうかいする", meaning: "to introduce", lesson: 1 },
    { word: "心配する", reading: "しんぱいする", meaning: "to worry", lesson: 1 },
    { word: "もらう", reading: "", meaning: "to receive", lesson: 1 },
    { word: "くれる", reading: "", meaning: "to give (me)", lesson: 1 },
    { word: "連れて行く", reading: "つれていく", meaning: "to take (someone)", lesson: 1 },
    { word: "手伝う", reading: "てつだう", meaning: "to help", lesson: 1 },
    { word: "若い", reading: "わかい", meaning: "young", lesson: 1 },
    { word: "寂しい", reading: "さびしい", meaning: "lonely", lesson: 1 },

    // 2課 趣味①
    { word: "趣味", reading: "しゅみ", meaning: "hobby", lesson: 2 },
    { word: "美術館", reading: "びじゅつかん", meaning: "art museum, gallery", lesson: 2 },
    { word: "(お)花見", reading: "(お)はなみ", meaning: "cherry-blossom viewing", lesson: 2 },
    { word: "コンサート", reading: "", meaning: "concert", lesson: 2 },
    { word: "ダンス", reading: "", meaning: "dance", lesson: 2 },
    { word: "スキー", reading: "", meaning: "skiing", lesson: 2 },
    { word: "ビデオ", reading: "", meaning: "video", lesson: 2 },
    { word: "アニメ", reading: "", meaning: "anime, animation", lesson: 2 },
    { word: "マンガ", reading: "", meaning: "manga, comic", lesson: 2 },
    { word: "日記", reading: "にっき", meaning: "diary", lesson: 2 },
    { word: "試合する", reading: "しあいする", meaning: "to play (in a match)", lesson: 2 },
    { word: "放送する", reading: "ほうそうする", meaning: "to broadcast", lesson: 2 },
    { word: "集める", reading: "あつめる", meaning: "to collect", lesson: 2 },
    { word: "ぜひ", reading: "", meaning: "definitely", lesson: 2 },
    { word: "一度", reading: "いちど", meaning: "once", lesson: 2 },

    // 3課 趣味②
    { word: "船", reading: "ふね", meaning: "ship", lesson: 3 },
    { word: "空港", reading: "くうこう", meaning: "airport", lesson: 3 },
    { word: "急行", reading: "きゅうこう", meaning: "express train", lesson: 3 },
    { word: "交通", reading: "こうつう", meaning: "transportation", lesson: 3 },
    { word: "神社", reading: "じんじゃ", meaning: "shrine", lesson: 3 },
    { word: "世界", reading: "せかい", meaning: "world", lesson: 3 },
    { word: "予約する", reading: "よやくする", meaning: "to reserve", lesson: 3 },
    { word: "案内する", reading: "あんないする", meaning: "to show (someone) around", lesson: 3 },
    { word: "準備する", reading: "じゅんびする", meaning: "to prepare", lesson: 3 },
    { word: "動く", reading: "うごく", meaning: "to move, to work", lesson: 3 },
    { word: "泊まる", reading: "とまる", meaning: "to stay (e.g. at a hotel)", lesson: 3 },
    { word: "乗り換える", reading: "のりかえる", meaning: "to transfer", lesson: 3 },
    { word: "止める", reading: "とめる", meaning: "to stop, to park", lesson: 3 },
    { word: "残念", reading: "ざんねん", meaning: "regrettable", lesson: 3 },
    { word: "もうすぐ", reading: "", meaning: "soon", lesson: 3 },

    // 4課 生活①
    { word: "棚", reading: "たな", meaning: "shelf", lesson: 4 },
    { word: "スイッチ", reading: "", meaning: "switch", lesson: 4 },
    { word: "パソコン", reading: "", meaning: "personal computer, PC", lesson: 4 },
    { word: "布団", reading: "ふとん", meaning: "futon", lesson: 4 },
    { word: "ごみ", reading: "", meaning: "rubbish", lesson: 4 },
    { word: "住所", reading: "じゅうしょ", meaning: "address", lesson: 4 },
    { word: "修理する", reading: "しゅうりする", meaning: "to repair", lesson: 4 },
    { word: "故障する", reading: "こしょうする", meaning: "to break down", lesson: 4 },
    { word: "引っ越しする", reading: "ひっこしする", meaning: "to move (house)", lesson: 4 },
    { word: "役に立つ", reading: "やくにたつ", meaning: "to be useful", lesson: 4 },
    { word: "捨てる", reading: "すてる", meaning: "to throw away", lesson: 4 },
    { word: "つける", reading: "", meaning: "to turn/switch on", lesson: 4 },
    { word: "消す", reading: "けす", meaning: "to turn/switch off, to erase", lesson: 4 },
    { word: "すてき", reading: "", meaning: "wonderful", lesson: 4 },
    { word: "そろそろ", reading: "", meaning: "about time to", lesson: 4 },

    // 5課 買い物①
    { word: "カード", reading: "", meaning: "credit card", lesson: 5 },
    { word: "お釣り", reading: "おつり", meaning: "change", lesson: 5 },
    { word: "億", reading: "おく", meaning: "one hundred million", lesson: 5 },
    { word: "サイズ", reading: "", meaning: "size", lesson: 5 },
    { word: "売り場", reading: "うりば", meaning: "department, sales area", lesson: 5 },
    { word: "エスカレーター", reading: "", meaning: "escalator", lesson: 5 },
    { word: "サービス", reading: "", meaning: "service", lesson: 5 },
    { word: "(お)土産", reading: "(お)みやげ", meaning: "souvenir", lesson: 5 },
    { word: "下ろす", reading: "おろす", meaning: "to take down, to withdraw", lesson: 5 },
    { word: "押す", reading: "おす", meaning: "to press", lesson: 5 },
    { word: "払う", reading: "はらう", meaning: "to pay", lesson: 5 },
    { word: "触る", reading: "さわる", meaning: "to touch", lesson: 5 },
    { word: "細かい", reading: "こまかい", meaning: "small, fine (e.g. change)", lesson: 5 },

    // 6課 学校①
    { word: "レポート", reading: "", meaning: "report, paper", lesson: 6 },
    { word: "高校", reading: "こうこう", meaning: "high school", lesson: 6 },
    { word: "留学生", reading: "りゅうがくせい", meaning: "international student", lesson: 6 },
    { word: "ホームステイ", reading: "", meaning: "homestay", lesson: 6 },
    { word: "字", reading: "じ", meaning: "letter, character", lesson: 6 },
    { word: "答え", reading: "こたえ", meaning: "answer", lesson: 6 },
    { word: "消しゴム", reading: "けしゴム", meaning: "eraser", lesson: 6 },
    { word: "意味", reading: "いみ", meaning: "meaning", lesson: 6 },
    { word: "試験", reading: "しけん", meaning: "examination", lesson: 6 },
    { word: "説明する", reading: "せつめいする", meaning: "to explain", lesson: 6 },
    { word: "研究する", reading: "けんきゅうする", meaning: "to research", lesson: 6 },
    { word: "考える", reading: "かんがえる", meaning: "to think", lesson: 6 },
    { word: "調べる", reading: "しらべる", meaning: "to look up", lesson: 6 },
    { word: "だいたい", reading: "", meaning: "mostly", lesson: 6 },
    { word: "全然", reading: "ぜんぜん", meaning: "not at all", lesson: 6 },

    // 7課 仕事①
    { word: "社長", reading: "しゃちょう", meaning: "company president", lesson: 7 },
    { word: "部長", reading: "ぶちょう", meaning: "general manager", lesson: 7 },
    { word: "アルバイト", reading: "", meaning: "part-time work", lesson: 7 },
    { word: "受付", reading: "うけつけ", meaning: "reception", lesson: 7 },
    { word: "事務所", reading: "じむしょ", meaning: "office", lesson: 7 },
    { word: "会議室", reading: "かいぎしつ", meaning: "meeting room", lesson: 7 },
    { word: "昼休み", reading: "ひるやすみ", meaning: "lunch break", lesson: 7 },
    { word: "スーツ", reading: "", meaning: "suit", lesson: 7 },
    { word: "コンピューター", reading: "", meaning: "computer", lesson: 7 },
    { word: "経済", reading: "けいざい", meaning: "economy, economics", lesson: 7 },
    { word: "会議する", reading: "かいぎする", meaning: "to have a meeting", lesson: 7 },
    { word: "送る", reading: "おくる", meaning: "to send", lesson: 7 },
    { word: "簡単", reading: "かんたん", meaning: "easy", lesson: 7 },
    { word: "大変", reading: "たいへん", meaning: "hard, terrible", lesson: 7 },
    { word: "失礼", reading: "しつれい", meaning: "rude", lesson: 7 },

    // 8課 町①
    { word: "建物", reading: "たてもの", meaning: "building", lesson: 8 },
    { word: "交差点", reading: "こうさてん", meaning: "crossing, intersection", lesson: 8 },
    { word: "駐車場", reading: "ちゅうしゃじょう", meaning: "car park", lesson: 8 },
    { word: "角", reading: "かど", meaning: "corner", lesson: 8 },
    { word: "(お)寺", reading: "(お)てら", meaning: "temple", lesson: 8 },
    { word: "歯医者", reading: "はいしゃ", meaning: "dentist", lesson: 8 },
    { word: "県", reading: "けん", meaning: "prefecture", lesson: 8 },
    { word: "(お)正月", reading: "(お)しょうがつ", meaning: "New Year", lesson: 8 },
    { word: "(お)祭り", reading: "(お)まつり", meaning: "festival", lesson: 8 },
    { word: "田舎", reading: "いなか", meaning: "countryside", lesson: 8 },
    { word: "季節", reading: "きせつ", meaning: "season", lesson: 8 },
    { word: "着物", reading: "きもの", meaning: "kimono", lesson: 8 },
    { word: "曲がる", reading: "まがる", meaning: "to turn", lesson: 8 },
    { word: "渡る", reading: "わたる", meaning: "to cross", lesson: 8 },
    { word: "不便", reading: "ふべん", meaning: "inconvenient", lesson: 8 },

    // 9課 人と人②
    { word: "息子", reading: "むすこ", meaning: "son", lesson: 9 },
    { word: "娘", reading: "むすめ", meaning: "daughter", lesson: 9 },
    { word: "ペット", reading: "", meaning: "pet", lesson: 9 },
    { word: "声", reading: "こえ", meaning: "voice", lesson: 9 },
    { word: "力", reading: "ちから", meaning: "strength", lesson: 9 },
    { word: "うそ", reading: "", meaning: "lie", lesson: 9 },
    { word: "夢", reading: "ゆめ", meaning: "dream", lesson: 9 },
    { word: "普通", reading: "ふつう", meaning: "ordinary, usually", lesson: 9 },
    { word: "将来", reading: "しょうらい", meaning: "future", lesson: 9 },
    { word: "決める", reading: "きめる", meaning: "to decide", lesson: 9 },
    { word: "偉い", reading: "えらい", meaning: "admirable, eminent", lesson: 9 },
    { word: "すごい", reading: "", meaning: "amazing, wonderful", lesson: 9 },
    { word: "久しぶり", reading: "ひさしぶり", meaning: "after a long time", lesson: 9 },

    // 10課 趣味③
    { word: "小説", reading: "しょうせつ", meaning: "novel", lesson: 10 },
    { word: "展覧会", reading: "てんらんかい", meaning: "exhibition", lesson: 10 },
    { word: "番組", reading: "ばんぐみ", meaning: "TV program", lesson: 10 },
    { word: "ドラマ", reading: "", meaning: "TV drama", lesson: 10 },
    { word: "ゲーム", reading: "", meaning: "game", lesson: 10 },
    { word: "今夜", reading: "こんや", meaning: "this evening", lesson: 10 },
    { word: "運動する", reading: "うんどうする", meaning: "to exercise", lesson: 10 },
    { word: "練習する", reading: "れんしゅうする", meaning: "to practice", lesson: 10 },
    { word: "けがする", reading: "", meaning: "to be injured", lesson: 10 },
    { word: "踊る", reading: "おどる", meaning: "to dance", lesson: 10 },
    { word: "投げる", reading: "なげる", meaning: "to throw", lesson: 10 },
    { word: "勝つ", reading: "かつ", meaning: "to win", lesson: 10 },
    { word: "負ける", reading: "まける", meaning: "to lose", lesson: 10 },
    { word: "すばらしい", reading: "", meaning: "wonderful", lesson: 10 },
    // 11課 趣味④
    { word: "動物園", reading: "どうぶつえん", meaning: "zoo", lesson: 11 },
    { word: "星", reading: "ほし", meaning: "star", lesson: 11 },
    { word: "エンジン", reading: "", meaning: "engine", lesson: 11 },
    { word: "場所", reading: "ばしょ", meaning: "location", lesson: 11 },
    { word: "帰り", reading: "かえり", meaning: "returning home", lesson: 11 },
    { word: "気分", reading: "きぶん", meaning: "feeling", lesson: 11 },
    { word: "都合", reading: "つごう", meaning: "convenience, reason", lesson: 11 },
    { word: "予定", reading: "よてい", meaning: "plan", lesson: 11 },
    { word: "約束する", reading: "やくそくする", meaning: "to promise, to make an appointment", lesson: 11 },
    { word: "迎える", reading: "むかえる", meaning: "to go to meet", lesson: 11 },
    { word: "戻る", reading: "もどる", meaning: "to return", lesson: 11 },
    { word: "かかる", reading: "", meaning: "to be locked, to start (an engine)", lesson: 11 },
    { word: "聞こえる", reading: "きこえる", meaning: "to be heard", lesson: 11 },
    { word: "見える", reading: "みえる", meaning: "to be seen", lesson: 11 },
    { word: "騒ぐ", reading: "さわぐ", meaning: "to be noisy", lesson: 11 },

    // 12課 生活②
    { word: "サンドイッチ", reading: "", meaning: "sandwich", lesson: 12 },
    { word: "ガム", reading: "", meaning: "gum", lesson: 12 },
    { word: "ミルク", reading: "", meaning: "milk", lesson: 12 },
    { word: "(お)湯", reading: "(お)ゆ", meaning: "hot water", lesson: 12 },
    { word: "味", reading: "あじ", meaning: "taste", lesson: 12 },
    { word: "ガス", reading: "", meaning: "gas", lesson: 12 },
    { word: "ごちそうする", reading: "", meaning: "to treat (someone to a meal)", lesson: 12 },
    { word: "食事する", reading: "しょくじする", meaning: "to dine, to have a meal", lesson: 12 },
    { word: "片付ける", reading: "かたづける", meaning: "to put away, to clean up", lesson: 12 },
    { word: "かむ", reading: "", meaning: "to chew, to bite", lesson: 12 },
    { word: "残る", reading: "のこる", meaning: "to be left (over)", lesson: 12 },
    { word: "冷やす", reading: "ひやす", meaning: "to cool, to chill", lesson: 12 },
    { word: "たいてい", reading: "", meaning: "usually", lesson: 12 },
    { word: "なかなか", reading: "", meaning: "not readily, rather", lesson: 12 },

    // 13課 生活③
    { word: "ジャケット", reading: "", meaning: "jacket", lesson: 13 },
    { word: "下着", reading: "したぎ", meaning: "underwear", lesson: 13 },
    { word: "道具", reading: "どうぐ", meaning: "tool", lesson: 13 },
    { word: "忘れ物", reading: "わすれもの", meaning: "something left behind", lesson: 13 },
    { word: "クリーニングする", reading: "", meaning: "to (dry) clean, at a cleaner's", lesson: 13 },
    { word: "生活する", reading: "せいかつする", meaning: "to live", lesson: 13 },
    { word: "植える", reading: "うえる", meaning: "to plant", lesson: 13 },
    { word: "消える", reading: "きえる", meaning: "to go off, to go out", lesson: 13 },
    { word: "つく", reading: "", meaning: "to turn on, to come on", lesson: 13 },
    { word: "はく", reading: "", meaning: "to wear, to put on (pants, shoes, etc.)", lesson: 13 },
    { word: "引く", reading: "ひく", meaning: "to pull", lesson: 13 },
    { word: "拾う", reading: "ひろう", meaning: "to pick up", lesson: 13 },
    { word: "汚れる", reading: "よごれる", meaning: "to become dirty, to be a mess", lesson: 13 },
    { word: "気をつける", reading: "きをつける", meaning: "to be careful", lesson: 13 },
    { word: "十分", reading: "じゅうぶん", meaning: "enough", lesson: 13 },

    // 14課 生活④
    { word: "鏡", reading: "かがみ", meaning: "mirror", lesson: 14 },
    { word: "人形", reading: "にんぎょう", meaning: "doll, figure, stuffed animal", lesson: 14 },
    { word: "引き出し", reading: "ひきだし", meaning: "drawer", lesson: 14 },
    { word: "枝", reading: "えだ", meaning: "branch", lesson: 14 },
    { word: "ガラス", reading: "", meaning: "glass", lesson: 14 },
    { word: "真ん中", reading: "まんなか", meaning: "the middle", lesson: 14 },
    { word: "隅", reading: "すみ", meaning: "corner", lesson: 14 },
    { word: "落とす", reading: "おとす", meaning: "to drop, to lose", lesson: 14 },
    { word: "変える", reading: "かえる", meaning: "to change", lesson: 14 },
    { word: "かける", reading: "", meaning: "to hang, to pour/drizzle", lesson: 14 },
    { word: "飾る", reading: "かざる", meaning: "to decorate", lesson: 14 },
    { word: "取り替える", reading: "とりかえる", meaning: "to exchange, to replace", lesson: 14 },
    { word: "折れる", reading: "おれる", meaning: "to break, to snap", lesson: 14 },
    { word: "壊れる", reading: "こわれる", meaning: "to be broken, to break down", lesson: 14 },
    { word: "割れる", reading: "われる", meaning: "to be broken (shattered)", lesson: 14 },

    // 15課 買い物②
    { word: "財布", reading: "さいふ", meaning: "wallet", lesson: 15 },
    { word: "品物", reading: "しなもの", meaning: "goods, things", lesson: 15 },
    { word: "値段", reading: "ねだん", meaning: "price", lesson: 15 },
    { word: "ボーナス", reading: "", meaning: "bonus", lesson: 15 },
    { word: "平日", reading: "へいじつ", meaning: "weekday", lesson: 15 },
    { word: "メモする", reading: "", meaning: "to make a note", lesson: 15 },
    { word: "開く", reading: "あく", meaning: "to open", lesson: 15 },
    { word: "売れる", reading: "うれる", meaning: "to sell, to be sold", lesson: 15 },
    { word: "選ぶ", reading: "えらぶ", meaning: "to choose", lesson: 15 },
    { word: "閉まる", reading: "しまる", meaning: "to close", lesson: 15 },
    { word: "なくす", reading: "", meaning: "to lose", lesson: 15 },
    { word: "足りる", reading: "たりる", meaning: "to be enough", lesson: 15 },
    { word: "見つける", reading: "みつける", meaning: "to find", lesson: 15 },
    { word: "むだ", reading: "", meaning: "useless, unnecessary, wasted", lesson: 15 },

    // 16課 学校②
    { word: "講義", reading: "こうぎ", meaning: "lecture", lesson: 16 },
    { word: "席", reading: "せき", meaning: "seat", lesson: 16 },
    { word: "出席する", reading: "しゅっせきする", meaning: "to attend", lesson: 16 },
    { word: "返事する", reading: "へんじする", meaning: "to reply", lesson: 16 },
    { word: "予習する", reading: "よしゅうする", meaning: "to prepare for a lesson", lesson: 16 },
    { word: "復習する", reading: "ふくしゅうする", meaning: "to review", lesson: 16 },
    { word: "連絡する", reading: "れんらくする", meaning: "to contact", lesson: 16 },
    { word: "失敗する", reading: "しっぱいする", meaning: "to fail", lesson: 16 },
    { word: "出す", reading: "だす", meaning: "to give, to hand in, to produce, to let out", lesson: 16 },
    { word: "受ける", reading: "うける", meaning: "to take (an examination, a class, etc.)", lesson: 16 },
    { word: "通う", reading: "かよう", meaning: "to go to and from, to commute", lesson: 16 },
    { word: "急ぐ", reading: "いそぐ", meaning: "to hurry", lesson: 16 },
    { word: "間に合う", reading: "まにあう", meaning: "to be in time", lesson: 16 },
    { word: "遅れる", reading: "おくれる", meaning: "to be late", lesson: 16 },
    { word: "まじめ", reading: "", meaning: "serious", lesson: 16 },

    // 17課 学校③
    { word: "廊下", reading: "ろうか", meaning: "corridor", lesson: 17 },
    { word: "音", reading: "おと", meaning: "noise, sound", lesson: 17 },
    { word: "規則", reading: "きそく", meaning: "rule", lesson: 17 },
    { word: "意見", reading: "いけん", meaning: "opinion", lesson: 17 },
    { word: "注意する", reading: "ちゅういする", meaning: "to warn, to pay attention", lesson: 17 },
    { word: "思い出す", reading: "おもいだす", meaning: "to remember", lesson: 17 },
    { word: "続ける", reading: "つづける", meaning: "to continue", lesson: 17 },
    { word: "直す", reading: "なおす", meaning: "to repair, to correct", lesson: 17 },
    { word: "並べる", reading: "ならべる", meaning: "to arrange, to line up", lesson: 17 },
    { word: "間違える", reading: "まちがえる", meaning: "to make a mistake", lesson: 17 },
    { word: "守る", reading: "まもる", meaning: "to keep, to protect", lesson: 17 },
    { word: "やめる", reading: "", meaning: "to quit, to stop", lesson: 17 },
    { word: "熱心", reading: "ねっしん", meaning: "enthusiastic, avid", lesson: 17 },
    { word: "無理", reading: "むり", meaning: "impossible", lesson: 17 },
    { word: "ずっと", reading: "", meaning: "the whole time, far", lesson: 17 },

    // 18課 町②
    { word: "月", reading: "つき", meaning: "moon", lesson: 18 },
    { word: "教会", reading: "きょうかい", meaning: "church", lesson: 18 },
    { word: "景色", reading: "けしき", meaning: "view", lesson: 18 },
    { word: "緑", reading: "みどり", meaning: "green, greenery", lesson: 18 },
    { word: "南", reading: "みなみ", meaning: "south", lesson: 18 },
    { word: "形", reading: "かたち", meaning: "shape", lesson: 18 },
    { word: "込む", reading: "こむ", meaning: "to be busy, to be crowded", lesson: 18 },
    { word: "すく", reading: "", meaning: "to be empty, to not be crowded", lesson: 18 },
    { word: "晴れる", reading: "はれる", meaning: "to be clear, to be fine (weather)", lesson: 18 },
    { word: "曇る", reading: "くもる", meaning: "to become cloudy", lesson: 18 },
    { word: "やむ", reading: "", meaning: "to stop (rain, wind)", lesson: 18 },
    { word: "続く", reading: "つづく", meaning: "to continue", lesson: 18 },
    { word: "建てる", reading: "たてる", meaning: "to build", lesson: 18 },
    { word: "はっきり", reading: "", meaning: "clearly", lesson: 18 },

    // 19課 人と人③
    { word: "祖父", reading: "そふ", meaning: "grandfather", lesson: 19 },
    { word: "祖母", reading: "そぼ", meaning: "grandmother", lesson: 19 },
    { word: "おば(さん)", reading: "", meaning: "aunt", lesson: 19 },
    { word: "おじ(さん)", reading: "", meaning: "uncle", lesson: 19 },
    { word: "お子さん", reading: "おこさん", meaning: "(someone else's) child", lesson: 19 },
    { word: "赤ちゃん", reading: "あかちゃん", meaning: "baby", lesson: 19 },
    { word: "お宅", reading: "おたく", meaning: "(someone else's) house", lesson: 19 },
    { word: "気持ち", reading: "きもち", meaning: "feeling", lesson: 19 },
    { word: "お祝い", reading: "おいわい", meaning: "congratulatory gift", lesson: 19 },
    { word: "安心する", reading: "あんしんする", meaning: "to feel relief", lesson: 19 },
    { word: "褒める", reading: "ほめる", meaning: "to praise", lesson: 19 },
    { word: "びっくりする", reading: "", meaning: "to be surprised", lesson: 19 },
    { word: "育てる", reading: "そだてる", meaning: "to bring up, to grow", lesson: 19 },
    { word: "親切", reading: "しんせつ", meaning: "kind", lesson: 19 },

    // 20課 趣味⑤
    { word: "旅館", reading: "りょかん", meaning: "Japanese style inn", lesson: 20 },
    { word: "ラッシュ", reading: "", meaning: "rush-hour", lesson: 20 },
    { word: "港", reading: "みなと", meaning: "port", lesson: 20 },
    { word: "村", reading: "むら", meaning: "village", lesson: 20 },
    { word: "島", reading: "しま", meaning: "island", lesson: 20 },
    { word: "海岸", reading: "かいがん", meaning: "shore, coast", lesson: 20 },
    { word: "天気予報", reading: "てんきよほう", meaning: "weather forecast", lesson: 20 },
    { word: "会場", reading: "かいじょう", meaning: "venue", lesson: 20 },
    { word: "出発する", reading: "しゅっぱつする", meaning: "to depart", lesson: 20 },
    { word: "ハイキングする", reading: "", meaning: "to hike", lesson: 20 },
    { word: "通る", reading: "とおる", meaning: "to pass", lesson: 20 },
    { word: "誘う", reading: "さそう", meaning: "to invite", lesson: 20 },
    { word: "美しい", reading: "うつくしい", meaning: "beautiful", lesson: 20 },
    { word: "必要", reading: "ひつよう", meaning: "necessary", lesson: 20 },
    { word: "特別", reading: "とくべつ", meaning: "special", lesson: 20 },

    // 21課 生活⑤
    { word: "タオル", reading: "", meaning: "towel", lesson: 21 },
    { word: "冷房", reading: "れいぼう", meaning: "air conditioning (cooling)", lesson: 21 },
    { word: "暖房", reading: "だんぼう", meaning: "heating", lesson: 21 },
    { word: "手袋", reading: "てぶくろ", meaning: "gloves", lesson: 21 },
    { word: "表", reading: "おもて", meaning: "front (of something)", lesson: 21 },
    { word: "裏", reading: "うら", meaning: "back (of something)", lesson: 21 },
    { word: "カーテン", reading: "", meaning: "curtain", lesson: 21 },
    { word: "習慣", reading: "しゅうかん", meaning: "habit, custom", lesson: 21 },
    { word: "磨く", reading: "みがく", meaning: "to brush (teeth)", lesson: 21 },
    { word: "困る", reading: "こまる", meaning: "to be in trouble", lesson: 21 },
    { word: "気がつく", reading: "きがつく", meaning: "to notice", lesson: 21 },
    { word: "さす", reading: "", meaning: "to open (an umbrella)", lesson: 21 },
    { word: "慣れる", reading: "なれる", meaning: "to get used to", lesson: 21 },
    { word: "つける", reading: "", meaning: "to spread, to put (e.g. butter)", lesson: 21 },

    // 22課 生活⑥
    { word: "(お)米", reading: "(お)こめ", meaning: "rice", lesson: 22 },
    { word: "チーズ", reading: "", meaning: "cheese", lesson: 22 },
    { word: "ソース", reading: "", meaning: "sauce", lesson: 22 },
    { word: "水道", reading: "すいどう", meaning: "tap water, water supply", lesson: 22 },
    { word: "温度", reading: "おんど", meaning: "temperature", lesson: 22 },
    { word: "デートする", reading: "", meaning: "to date, to go on a date", lesson: 22 },
    { word: "焼ける", reading: "やける", meaning: "to be baked, to be roasted", lesson: 22 },
    { word: "上げる", reading: "あげる", meaning: "to raise, to increase", lesson: 22 },
    { word: "下げる", reading: "さげる", meaning: "to lower, to reduce", lesson: 22 },
    { word: "合う", reading: "あう", meaning: "to fit, to match", lesson: 22 },
    { word: "太る", reading: "ふとる", meaning: "to get fat", lesson: 22 },
    { word: "やせる", reading: "", meaning: "to get thin", lesson: 22 },
    { word: "固い", reading: "かたい", meaning: "tough, hard", lesson: 22 },
    { word: "やわらかい", reading: "", meaning: "soft, tender", lesson: 22 },
    { word: "苦い", reading: "にがい", meaning: "bitter", lesson: 22 },

    // 23課 生活⑦
    { word: "台風", reading: "たいふう", meaning: "typhoon", lesson: 23 },
    { word: "地震", reading: "じしん", meaning: "earthquake", lesson: 23 },
    { word: "火事", reading: "かじ", meaning: "fire", lesson: 23 },
    { word: "泥棒", reading: "どろぼう", meaning: "thief, burglar", lesson: 23 },
    { word: "事故", reading: "じこ", meaning: "accident", lesson: 23 },
    { word: "警察", reading: "けいさつ", meaning: "police", lesson: 23 },
    { word: "けんかする", reading: "", meaning: "to argue, to fight", lesson: 23 },
    { word: "見つかる", reading: "みつかる", meaning: "to be found", lesson: 23 },
    { word: "倒れる", reading: "たおれる", meaning: "to collapse, to fall over", lesson: 23 },
    { word: "逃げる", reading: "にげる", meaning: "to escape, to run away", lesson: 23 },
    { word: "踏む", reading: "ふむ", meaning: "to step on", lesson: 23 },
    { word: "直る", reading: "なおる", meaning: "to be fixed", lesson: 23 },
    { word: "起こる", reading: "おこる", meaning: "to occur", lesson: 23 },
    { word: "悲しい", reading: "かなしい", meaning: "sad", lesson: 23 },
    { word: "このごろ", reading: "", meaning: "these days", lesson: 23 },

    // 24課 買い物③
    { word: "(お)客", reading: "(お)きゃく", meaning: "guest, customer", lesson: 24 },
    { word: "大勢", reading: "おおぜい", meaning: "great number of people", lesson: 24 },
    { word: "指輪", reading: "ゆびわ", meaning: "ring", lesson: 24 },
    { word: "傷", reading: "きず", meaning: "bruise, flaw", lesson: 24 },
    { word: "近所", reading: "きんじょ", meaning: "neighborhood", lesson: 24 },
    { word: "レジ", reading: "", meaning: "cash register", lesson: 24 },
    { word: "レシート", reading: "", meaning: "receipt", lesson: 24 },
    { word: "店員", reading: "てんいん", meaning: "salesperson", lesson: 24 },
    { word: "チャンス", reading: "", meaning: "good chance", lesson: 24 },
    { word: "輸出する", reading: "ゆしゅつする", meaning: "to export", lesson: 24 },
    { word: "輸入する", reading: "ゆにゅうする", meaning: "to import", lesson: 24 },
    { word: "開く", reading: "ひらく", meaning: "to open, to hold", lesson: 24 },
    { word: "運ぶ", reading: "はこぶ", meaning: "to carry", lesson: 24 },
    { word: "うれしい", reading: "", meaning: "happy, pleased", lesson: 24 },

    // 25課 学校④
    { word: "小学校", reading: "しょうがっこう", meaning: "primary school", lesson: 25 },
    { word: "中学校", reading: "ちゅうがっこう", meaning: "junior high school", lesson: 25 },
    { word: "歴史", reading: "れきし", meaning: "history", lesson: 25 },
    { word: "文法", reading: "ぶんぽう", meaning: "grammar", lesson: 25 },
    { word: "水泳", reading: "すいえい", meaning: "swimming", lesson: 25 },
    { word: "参加する", reading: "さんかする", meaning: "to take part", lesson: 25 },
    { word: "しかる", reading: "", meaning: "to tell off", lesson: 25 },
    { word: "確かめる", reading: "たしかめる", meaning: "to check", lesson: 25 },
    { word: "正しい", reading: "ただしい", meaning: "correct", lesson: 25 },
    { word: "恥ずかしい", reading: "はずかしい", meaning: "embarrassed", lesson: 25 },
    { word: "詳しい", reading: "くわしい", meaning: "detailed", lesson: 25 },
    { word: "複雑", reading: "ふくざつ", meaning: "complicated, mixed up", lesson: 25 },
    { word: "必ず", reading: "かならず", meaning: "surely, certainly", lesson: 25 },
    { word: "できるだけ", reading: "", meaning: "as much as possible", lesson: 25 },
    { word: "がっかりする", reading: "", meaning: "to be disappointed", lesson: 25 },

    // 26課 仕事②
    { word: "ボランティア", reading: "", meaning: "volunteer", lesson: 26 },
    { word: "工場", reading: "こうじょう", meaning: "factory", lesson: 26 },
    { word: "用事", reading: "ようじ", meaning: "something to do", lesson: 26 },
    { word: "終わり", reading: "おわり", meaning: "the end", lesson: 26 },
    { word: "途中", reading: "とちゅう", meaning: "on the way, in the middle", lesson: 26 },
    { word: "経験する", reading: "けいけんする", meaning: "to experience", lesson: 26 },
    { word: "相談する", reading: "そうだんする", meaning: "to consult", lesson: 26 },
    { word: "伝える", reading: "つたえる", meaning: "to tell, to convey", lesson: 26 },
    { word: "行う", reading: "おこなう", meaning: "to conduct, to hold", lesson: 26 },
    { word: "頼む", reading: "たのむ", meaning: "to ask", lesson: 26 },
    { word: "始める", reading: "はじめる", meaning: "to start", lesson: 26 },
    { word: "数える", reading: "かぞえる", meaning: "to count", lesson: 26 },
    { word: "だめ", reading: "", meaning: "no good, impossible", lesson: 26 },

    // 27課 町③
    { word: "壁", reading: "かべ", meaning: "wall", lesson: 27 },
    { word: "ポスター", reading: "", meaning: "poster", lesson: 27 },
    { word: "葉", reading: "は", meaning: "leaf", lesson: 27 },
    { word: "屋上", reading: "おくじょう", meaning: "roof", lesson: 27 },
    { word: "地下", reading: "ちか", meaning: "basement", lesson: 27 },
    { word: "様子", reading: "ようす", meaning: "state, appearance", lesson: 27 },
    { word: "昔", reading: "むかし", meaning: "a long time ago", lesson: 27 },
    { word: "最近", reading: "さいきん", meaning: "recently", lesson: 27 },
    { word: "工事する", reading: "こうじする", meaning: "to do construction work", lesson: 27 },
    { word: "はる", reading: "", meaning: "to put, to paste", lesson: 27 },
    { word: "変わる", reading: "かわる", meaning: "to change", lesson: 27 },
    { word: "咲く", reading: "さく", meaning: "to bloom", lesson: 27 },
    { word: "茶色い", reading: "ちゃいろい", meaning: "brown", lesson: 27 },

    // 28課 人と人④
    { word: "会話", reading: "かいわ", meaning: "conversation", lesson: 28 },
    { word: "世話", reading: "せわ", meaning: "looking after", lesson: 28 },
    { word: "相手", reading: "あいて", meaning: "partner, opponent", lesson: 28 },
    { word: "あいさつする", reading: "", meaning: "to greet", lesson: 28 },
    { word: "招待する", reading: "しょうたいする", meaning: "to invite", lesson: 28 },
    { word: "賛成する", reading: "さんせいする", meaning: "to agree", lesson: 28 },
    { word: "反対する", reading: "はんたいする", meaning: "to oppose", lesson: 28 },
    { word: "届く", reading: "とどく", meaning: "to arrive", lesson: 28 },
    { word: "渡す", reading: "わたす", meaning: "to hand (over)", lesson: 28 },
    { word: "いらっしゃる", reading: "", meaning: "to come, to go, to be (honorific)", lesson: 28 },
    { word: "信じる", reading: "しんじる", meaning: "to believe", lesson: 28 },
    { word: "別れる", reading: "わかれる", meaning: "to break up, to part", lesson: 28 },
    { word: "優しい", reading: "やさしい", meaning: "kind", lesson: 28 },
    { word: "厳しい", reading: "きびしい", meaning: "strict", lesson: 28 },

    // 29課 趣味⑥
    { word: "ひも", reading: "", meaning: "string", lesson: 29 },
    { word: "ガソリン", reading: "", meaning: "gasoline, petrol", lesson: 29 },
    { word: "興味", reading: "きょうみ", meaning: "interest", lesson: 29 },
    { word: "空気", reading: "くうき", meaning: "air", lesson: 29 },
    { word: "自然", reading: "しぜん", meaning: "nature", lesson: 29 },
    { word: "楽しみ", reading: "たのしみ", meaning: "pleasure, looking forward to", lesson: 29 },
    { word: "マラソン", reading: "", meaning: "marathon", lesson: 29 },
    { word: "キャンプする", reading: "", meaning: "to go camping", lesson: 29 },
    { word: "スタートする", reading: "", meaning: "to start", lesson: 29 },
    { word: "折る", reading: "おる", meaning: "to break, to fold", lesson: 29 },
    { word: "滑る", reading: "すべる", meaning: "to slip, to slide", lesson: 29 },
    { word: "集まる", reading: "あつまる", meaning: "to gather", lesson: 29 },
    { word: "楽しむ", reading: "たのしむ", meaning: "to enjoy", lesson: 29 },
    { word: "珍しい", reading: "めずらしい", meaning: "rare, unusual", lesson: 29 },

    // 30課 生活⑧
    { word: "留守", reading: "るす", meaning: "absence, being away from home", lesson: 30 },
    { word: "おもちゃ", reading: "", meaning: "toy", lesson: 30 },
    { word: "眠る", reading: "ねむる", meaning: "to sleep", lesson: 30 },
    { word: "並ぶ", reading: "ならぶ", meaning: "to line up, to queue", lesson: 30 },
    { word: "届ける", reading: "とどける", meaning: "to deliver, to send", lesson: 30 },
    { word: "壊す", reading: "こわす", meaning: "to break", lesson: 30 },
    { word: "ぬれる", reading: "", meaning: "to get damp", lesson: 30 },
    { word: "乾く", reading: "かわく", meaning: "to get dry", lesson: 30 },
    { word: "過ぎる", reading: "すぎる", meaning: "to pass", lesson: 30 },
    { word: "切れる", reading: "きれる", meaning: "to break, to snap", lesson: 30 },
    { word: "なくなる", reading: "", meaning: "to be lost, to run out", lesson: 30 },
    { word: "嫌", reading: "いや", meaning: "unpleasant, reluctant", lesson: 30 },
    { word: "自由", reading: "じゆう", meaning: "free", lesson: 30 },
    { word: "邪魔する", reading: "じゃまする", meaning: "to be in the way, to disturb", lesson: 30 },

    // 31課 生活⑨
    { word: "おかず", reading: "", meaning: "dishes to go with rice", lesson: 31 },
    { word: "火", reading: "ひ", meaning: "fire", lesson: 31 },
    { word: "におい", reading: "", meaning: "smell", lesson: 31 },
    { word: "倍", reading: "ばい", meaning: "double", lesson: 31 },
    { word: "半分", reading: "はんぶん", meaning: "half", lesson: 31 },
    { word: "量", reading: "りょう", meaning: "amount", lesson: 31 },
    { word: "数", reading: "かず", meaning: "number", lesson: 31 },
    { word: "包む", reading: "つつむ", meaning: "to wrap", lesson: 31 },
    { word: "焼く", reading: "やく", meaning: "to grill, to bake", lesson: 31 },
    { word: "沸かす", reading: "わかす", meaning: "to boil", lesson: 31 },
    { word: "濃い", reading: "こい", meaning: "strong, dark (flavor/color)", lesson: 31 },
    { word: "厚い", reading: "あつい", meaning: "thick", lesson: 31 },
    { word: "薄い", reading: "うすい", meaning: "thin, weak", lesson: 31 },
    { word: "まずい", reading: "", meaning: "bad tasting", lesson: 31 },

    // 32課 学校⑤
    { word: "科学", reading: "かがく", meaning: "science", lesson: 32 },
    { word: "文学", reading: "ぶんがく", meaning: "literature", lesson: 32 },
    { word: "点", reading: "てん", meaning: "score, mark", lesson: 32 },
    { word: "線", reading: "せん", meaning: "line", lesson: 32 },
    { word: "以上", reading: "いじょう", meaning: "or more", lesson: 32 },
    { word: "以下", reading: "いか", meaning: "or less", lesson: 32 },
    { word: "教育する", reading: "きょういくする", meaning: "to educate", lesson: 32 },
    { word: "緊張する", reading: "きんちょうする", meaning: "to get nervous", lesson: 32 },
    { word: "入学する", reading: "にゅうがくする", meaning: "to enter school", lesson: 32 },
    { word: "卒業する", reading: "そつぎょうする", meaning: "to graduate", lesson: 32 },
    { word: "中止する", reading: "ちゅうしする", meaning: "to cancel", lesson: 32 },
    { word: "発音する", reading: "はつおんする", meaning: "to pronounce", lesson: 32 },
    { word: "合格する", reading: "ごうかくする", meaning: "to pass (an exam)", lesson: 32 },
    { word: "落ちる", reading: "おちる", meaning: "to drop, to fail", lesson: 32 },
    { word: "なぜ", reading: "", meaning: "why", lesson: 32 },

    // 33課 体①
    { word: "(お)見舞い", reading: "(お)みまい", meaning: "visiting somebody who is ill", lesson: 33 },
    { word: "具合", reading: "ぐあい", meaning: "condition", lesson: 33 },
    { word: "入院する", reading: "にゅういんする", meaning: "to go into hospital", lesson: 33 },
    { word: "退院する", reading: "たいいんする", meaning: "to leave hospital", lesson: 33 },
    { word: "泣く", reading: "なく", meaning: "to cry", lesson: 33 },
    { word: "笑う", reading: "わらう", meaning: "to laugh", lesson: 33 },
    { word: "おかしい", reading: "", meaning: "strange", lesson: 33 },
    { word: "怖い", reading: "こわい", meaning: "scary", lesson: 33 },
    { word: "眠い", reading: "ねむい", meaning: "sleepy", lesson: 33 },
    { word: "太い", reading: "ふとい", meaning: "thick", lesson: 33 },
    { word: "細い", reading: "ほそい", meaning: "thin", lesson: 33 },
    { word: "丈夫", reading: "じょうぶ", meaning: "strong, solid", lesson: 33 },
    { word: "急に", reading: "きゅうに", meaning: "suddenly", lesson: 33 },
    { word: "やっと", reading: "", meaning: "finally", lesson: 33 },

    // 34課 社会
    { word: "社会", reading: "しゃかい", meaning: "society", lesson: 34 },
    { word: "政治", reading: "せいじ", meaning: "politics", lesson: 34 },
    { word: "文化", reading: "ぶんか", meaning: "culture", lesson: 34 },
    { word: "法律", reading: "ほうりつ", meaning: "law", lesson: 34 },
    { word: "人口", reading: "じんこう", meaning: "population", lesson: 34 },
    { word: "原因", reading: "げんいん", meaning: "cause", lesson: 34 },
    { word: "利用する", reading: "りようする", meaning: "to use, to make use of", lesson: 34 },
    { word: "使用する", reading: "しようする", meaning: "to use", lesson: 34 },
    { word: "戦争する", reading: "せんそうする", meaning: "to go to war", lesson: 34 },
    { word: "上がる", reading: "あがる", meaning: "to rise, to go up", lesson: 34 },
    { word: "下がる", reading: "さがる", meaning: "to go down, to drop", lesson: 34 },
    { word: "増える", reading: "ふえる", meaning: "to increase", lesson: 34 },
    { word: "減る", reading: "へる", meaning: "to decrease", lesson: 34 },
    { word: "安全", reading: "あんぜん", meaning: "safe", lesson: 34 },
    { word: "危険", reading: "きけん", meaning: "dangerous", lesson: 34 },

    // 35課 時間
    { word: "機会", reading: "きかい", meaning: "chance", lesson: 35 },
    { word: "時代", reading: "じだい", meaning: "period, era", lesson: 35 },
    { word: "日", reading: "ひ", meaning: "day", lesson: 35 },
    { word: "これから", reading: "", meaning: "from now", lesson: 35 },
    { word: "今度", reading: "こんど", meaning: "next time", lesson: 35 },
    { word: "たまに", reading: "", meaning: "sometimes", lesson: 35 },
    { word: "すぐ", reading: "", meaning: "immediately", lesson: 35 },
    { word: "まず", reading: "", meaning: "first of all", lesson: 35 },
    { word: "この間", reading: "このあいだ", meaning: "the other day", lesson: 35 },
    { word: "さっき", reading: "", meaning: "a short while ago", lesson: 35 },

    // 36課 人と人⑤
    { word: "お嬢さん", reading: "おじょうさん", meaning: "(someone's) daughter", lesson: 36 },
    { word: "女性", reading: "じょせい", meaning: "woman", lesson: 36 },
    { word: "男性", reading: "だんせい", meaning: "man", lesson: 36 },
    { word: "家庭", reading: "かてい", meaning: "family, household", lesson: 36 },
    { word: "お金持ち", reading: "おかねもち", meaning: "rich person", lesson: 36 },
    { word: "心", reading: "こころ", meaning: "heart, spirit", lesson: 36 },
    { word: "グループ", reading: "", meaning: "group", lesson: 36 },
    { word: "メンバー", reading: "", meaning: "member", lesson: 36 },
    { word: "タイプ", reading: "", meaning: "type", lesson: 36 },
    { word: "いじめる", reading: "", meaning: "to bully", lesson: 36 },
    { word: "似る", reading: "にる", meaning: "to look alike", lesson: 36 },
    { word: "うまい", reading: "", meaning: "good, skillful", lesson: 36 },
    { word: "おとなしい", reading: "", meaning: "quiet, obedient", lesson: 36 },
    { word: "立派", reading: "りっぱ", meaning: "good, splendid", lesson: 36 },

    // 37課 人と人⑥
    { word: "関係", reading: "かんけい", meaning: "relationship", lesson: 37 },
    { word: "お礼", reading: "おれい", meaning: "thanks", lesson: 37 },
    { word: "贈り物", reading: "おくりもの", meaning: "present", lesson: 37 },
    { word: "別", reading: "べつ", meaning: "different", lesson: 37 },
    { word: "コミュニケーション", reading: "", meaning: "communication", lesson: 37 },
    { word: "おじぎする", reading: "", meaning: "to bow", lesson: 37 },
    { word: "遠慮する", reading: "えんりょする", meaning: "to be reserved, to hold back", lesson: 37 },
    { word: "差し上げる", reading: "さしあげる", meaning: "to give (humble)", lesson: 37 },
    { word: "知らせる", reading: "しらせる", meaning: "to let (someone) know", lesson: 37 },
    { word: "訪ねる", reading: "たずねる", meaning: "to visit", lesson: 37 },
    { word: "謝る", reading: "あやまる", meaning: "to apologize", lesson: 37 },
    { word: "怒る", reading: "おこる", meaning: "to get angry", lesson: 37 },
    { word: "驚く", reading: "おどろく", meaning: "to be surprised", lesson: 37 },
    { word: "丁寧", reading: "ていねい", meaning: "polite, thorough", lesson: 37 },

    // 38課 趣味⑦
    { word: "思い出", reading: "おもいで", meaning: "memories", lesson: 38 },
    { word: "アルバム", reading: "", meaning: "album", lesson: 38 },
    { word: "ジム", reading: "", meaning: "gym", lesson: 38 },
    { word: "チーム", reading: "", meaning: "team", lesson: 38 },
    { word: "ルール", reading: "", meaning: "rule", lesson: 38 },
    { word: "スクリーン", reading: "", meaning: "screen", lesson: 38 },
    { word: "スーツケース", reading: "", meaning: "suitcase", lesson: 38 },
    { word: "プログラム", reading: "", meaning: "program", lesson: 38 },
    { word: "競争する", reading: "きょうそうする", meaning: "to compete", lesson: 38 },
    { word: "見物する", reading: "けんぶつする", meaning: "to see the sights", lesson: 38 },
    { word: "写す", reading: "うつす", meaning: "to photograph, to copy", lesson: 38 },
    { word: "打つ", reading: "うつ", meaning: "to hit", lesson: 38 },
    { word: "喜ぶ", reading: "よろこぶ", meaning: "to be delighted", lesson: 38 },

    // 39課 趣味⑧
    { word: "乗り物", reading: "のりもの", meaning: "vehicle", lesson: 39 },
    { word: "トンネル", reading: "", meaning: "tunnel", lesson: 39 },
    { word: "坂", reading: "さか", meaning: "hill, slope", lesson: 39 },
    { word: "運転手", reading: "うんてんしゅ", meaning: "driver", lesson: 39 },
    { word: "オートバイ", reading: "", meaning: "motorcycle", lesson: 39 },
    { word: "ボート", reading: "", meaning: "boat", lesson: 39 },
    { word: "スピード", reading: "", meaning: "speed", lesson: 39 },
    { word: "理由", reading: "りゆう", meaning: "reason", lesson: 39 },
    { word: "遠く", reading: "とおく", meaning: "great distance, far", lesson: 39 },
    { word: "ストップする", reading: "", meaning: "to stop", lesson: 39 },
    { word: "空く", reading: "あく", meaning: "to become vacant/unoccupied", lesson: 39 },
    { word: "寄る", reading: "よる", meaning: "to drop in, to stop by", lesson: 39 },

    // 40課 生活⑩
    { word: "ファッション", reading: "", meaning: "fashion", lesson: 40 },
    { word: "アクセサリー", reading: "", meaning: "accessory", lesson: 40 },
    { word: "ベルト", reading: "", meaning: "belt", lesson: 40 },
    { word: "格好", reading: "かっこう", meaning: "appearance", lesson: 40 },
    { word: "床屋", reading: "とこや", meaning: "barber", lesson: 40 },
    { word: "ロッカー", reading: "", meaning: "locker", lesson: 40 },
    { word: "マナー", reading: "", meaning: "manner", lesson: 40 },
    { word: "オープンする", reading: "", meaning: "to open", lesson: 40 },
    { word: "似合う", reading: "にあう", meaning: "to suit", lesson: 40 },
    { word: "塗る", reading: "ぬる", meaning: "to apply, to paint", lesson: 40 },
    { word: "かまう", reading: "", meaning: "to care, to matter", lesson: 40 },
    { word: "変", reading: "へん", meaning: "strange", lesson: 40 },

    // 41課 生活⑪
    { word: "ソファー", reading: "", meaning: "sofa", lesson: 41 },
    { word: "クーラー", reading: "", meaning: "air conditioner", lesson: 41 },
    { word: "ストーブ", reading: "", meaning: "stove, heater", lesson: 41 },
    { word: "リモコン", reading: "", meaning: "remote control", lesson: 41 },
    { word: "ライト", reading: "", meaning: "light", lesson: 41 },
    { word: "バケツ", reading: "", meaning: "bucket", lesson: 41 },
    { word: "プラスチック", reading: "", meaning: "plastic", lesson: 41 },
    { word: "暮らす", reading: "くらす", meaning: "to live", lesson: 41 },
    { word: "分ける", reading: "わける", meaning: "to separate, to share", lesson: 41 },
    { word: "燃やす", reading: "もやす", meaning: "to burn", lesson: 41 },
    { word: "沸く", reading: "わく", meaning: "to boil", lesson: 41 },
    { word: "冷える", reading: "ひえる", meaning: "to cool, to get cold", lesson: 41 },
    { word: "臭い", reading: "くさい", meaning: "smelly", lesson: 41 },

    // 42課 生活⑫
    { word: "最初", reading: "さいしょ", meaning: "first", lesson: 42 },
    { word: "最後", reading: "さいご", meaning: "last", lesson: 42 },
    { word: "両方", reading: "りょうほう", meaning: "both", lesson: 42 },
    { word: "食料品", reading: "しょくりょうひん", meaning: "groceries", lesson: 42 },
    { word: "用意する", reading: "よういする", meaning: "to prepare", lesson: 42 },
    { word: "配る", reading: "くばる", meaning: "to distribute, to hand out", lesson: 42 },
    { word: "盗む", reading: "ぬすむ", meaning: "to steal", lesson: 42 },
    { word: "鳴る", reading: "なる", meaning: "to ring", lesson: 42 },
    { word: "下りる", reading: "おりる", meaning: "to go down", lesson: 42 },
    { word: "起こす", reading: "おこす", meaning: "to wake (someone) up", lesson: 42 },
    { word: "祈る", reading: "いのる", meaning: "to pray", lesson: 42 },

    // 43課 学校⑥
    { word: "専門", reading: "せんもん", meaning: "specialty", lesson: 43 },
    { word: "テキスト", reading: "", meaning: "textbook", lesson: 43 },
    { word: "レベル", reading: "", meaning: "level", lesson: 43 },
    { word: "割合", reading: "わりあい", meaning: "percentage, proportion", lesson: 43 },
    { word: "仕方", reading: "しかた", meaning: "way, method", lesson: 43 },
    { word: "先輩", reading: "せんぱい", meaning: "senior", lesson: 43 },
    { word: "以外", reading: "いがい", meaning: "apart from, except for", lesson: 43 },
    { word: "以内", reading: "いない", meaning: "within", lesson: 43 },
    { word: "決まる", reading: "きまる", meaning: "to be decided", lesson: 43 },
    { word: "比べる", reading: "くらべる", meaning: "to compare", lesson: 43 },
    { word: "大事", reading: "だいじ", meaning: "important", lesson: 43 },
    { word: "ちっとも", reading: "", meaning: "not a bit", lesson: 43 },
    { word: "どんどん", reading: "", meaning: "more and more", lesson: 43 },

    // 44課 仕事③
    { word: "技術", reading: "ぎじゅつ", meaning: "technology", lesson: 44 },
    { word: "産業", reading: "さんぎょう", meaning: "industry", lesson: 44 },
    { word: "国際", reading: "こくさい", meaning: "international", lesson: 44 },
    { word: "貿易", reading: "ぼうえき", meaning: "trade", lesson: 44 },
    { word: "パートタイム", reading: "", meaning: "part-time", lesson: 44 },
    { word: "計画する", reading: "けいかくする", meaning: "to make a plan", lesson: 44 },
    { word: "生産する", reading: "せいさんする", meaning: "to produce", lesson: 44 },
    { word: "承知する", reading: "しょうちする", meaning: "to understand, to consent", lesson: 44 },
    { word: "進む", reading: "すすむ", meaning: "to progress, to go along", lesson: 44 },
    { word: "済む", reading: "すむ", meaning: "to be finished", lesson: 44 },
    { word: "勤める", reading: "つとめる", meaning: "to work (be employed)", lesson: 44 },
    { word: "盛ん", reading: "さかん", meaning: "thriving", lesson: 44 },
    { word: "楽", reading: "らく", meaning: "easy, comfortable", lesson: 44 },
    { word: "ほとんど", reading: "", meaning: "hardly", lesson: 44 },

    // 45課 体②
    { word: "腕", reading: "うで", meaning: "arm", lesson: 45 },
    { word: "首", reading: "くび", meaning: "neck", lesson: 45 },
    { word: "背中", reading: "せなか", meaning: "back", lesson: 45 },
    { word: "指", reading: "ゆび", meaning: "finger", lesson: 45 },
    { word: "爪", reading: "つめ", meaning: "nail", lesson: 45 },
    { word: "毛", reading: "け", meaning: "hair", lesson: 45 },
    { word: "ひげ", reading: "", meaning: "beard, mustache", lesson: 45 },
    { word: "血", reading: "ち", meaning: "blood", lesson: 45 },
    { word: "マスク", reading: "", meaning: "mask", lesson: 45 },
    { word: "注射する", reading: "ちゅうしゃする", meaning: "to inject", lesson: 45 },
    { word: "生きる", reading: "いきる", meaning: "to live", lesson: 45 },
    { word: "ひどい", reading: "", meaning: "terrible, bad", lesson: 45 },

    // 46課 自然
    { word: "草", reading: "くさ", meaning: "grass", lesson: 46 },
    { word: "石", reading: "いし", meaning: "stone", lesson: 46 },
    { word: "砂", reading: "すな", meaning: "sand", lesson: 46 },
    { word: "虫", reading: "むし", meaning: "insect", lesson: 46 },
    { word: "森", reading: "もり", meaning: "forest", lesson: 46 },
    { word: "雲", reading: "くも", meaning: "cloud", lesson: 46 },
    { word: "流れる", reading: "ながれる", meaning: "to flow", lesson: 46 },
    { word: "回る", reading: "まわる", meaning: "to go round, to rotate", lesson: 46 },
    { word: "揺れる", reading: "ゆれる", meaning: "to sway, to shake", lesson: 46 },
    { word: "光る", reading: "ひかる", meaning: "to shine, to glow", lesson: 46 },
    { word: "積もる", reading: "つもる", meaning: "to accumulate, to pile up", lesson: 46 },
    { word: "吹く", reading: "ふく", meaning: "to blow", lesson: 46 },
    { word: "捕まえる", reading: "つかまえる", meaning: "to catch, to arrest", lesson: 46 },
    { word: "浅い", reading: "あさい", meaning: "shallow", lesson: 46 },
    { word: "深い", reading: "ふかい", meaning: "deep", lesson: 46 },

    // 47課 敬語
    { word: "ご存じ", reading: "ごぞんじ", meaning: "to know (respectful)", lesson: 47 },
    { word: "おっしゃる", reading: "", meaning: "to say (respectful)", lesson: 47 },
    { word: "召し上がる", reading: "めしあがる", meaning: "to eat, to drink (respectful)", lesson: 47 },
    { word: "ご覧になる", reading: "ごらんになる", meaning: "to look at, to see (respectful)", lesson: 47 },
    { word: "なさる", reading: "", meaning: "to do (respectful)", lesson: 47 },
    { word: "おいでになる", reading: "", meaning: "to come, to go, to be (respectful)", lesson: 47 },
    { word: "申し上げる", reading: "もうしあげる", meaning: "to tell, to say (humble)", lesson: 47 },
    { word: "拝見する", reading: "はいけんする", meaning: "to read, to see (humble)", lesson: 47 },
    { word: "いたす", reading: "", meaning: "to do (humble)", lesson: 47 },
    { word: "申す", reading: "もうす", meaning: "to say, to be called (humble)", lesson: 47 },
    { word: "参る", reading: "まいる", meaning: "to come, to go (humble)", lesson: 47 },
    { word: "おる", reading: "", meaning: "to be, to exist (humble)", lesson: 47 },

    // 48課 副詞①
    { word: "とうとう", reading: "", meaning: "in the end", lesson: 48 },
    { word: "なるべく", reading: "", meaning: "as much as possible", lesson: 48 },
    { word: "だいぶ", reading: "", meaning: "considerably", lesson: 48 },
    { word: "それほど", reading: "", meaning: "that much", lesson: 48 },
    { word: "すっかり", reading: "", meaning: "completely", lesson: 48 },
    { word: "けっして", reading: "", meaning: "never, by no means", lesson: 48 },
    { word: "非常に", reading: "ひじょうに", meaning: "very", lesson: 48 },
    { word: "やはり", reading: "", meaning: "as expected, after all", lesson: 48 },

    // 49課 副詞②
    { word: "ちゃんと", reading: "", meaning: "properly", lesson: 49 },
    { word: "けっこう", reading: "", meaning: "quite, more than expected", lesson: 49 },
    { word: "特に", reading: "とくに", meaning: "particularly", lesson: 49 },
    { word: "そんなに", reading: "", meaning: "that much", lesson: 49 },
    { word: "もちろん", reading: "", meaning: "of course", lesson: 49 },
    { word: "ずいぶん", reading: "", meaning: "really, quite", lesson: 49 },
    { word: "きっと", reading: "", meaning: "surely", lesson: 49 },
    { word: "かなり", reading: "", meaning: "quite", lesson: 49 },

    // 50課 N3へのステップ
    { word: "アイデア", reading: "", meaning: "idea", lesson: 50 },
    { word: "テーマ", reading: "", meaning: "theme", lesson: 50 },
    { word: "チェックする", reading: "", meaning: "to check", lesson: 50 },
    { word: "結ぶ", reading: "むすぶ", meaning: "to tie", lesson: 50 },
    { word: "足す", reading: "たす", meaning: "to add", lesson: 50 },
    { word: "動かす", reading: "うごかす", meaning: "to move", lesson: 50 },
    { word: "割る", reading: "わる", meaning: "to break, to crack open", lesson: 50 },
    { word: "うつる", reading: "", meaning: "to catch, to be infected", lesson: 50 },
    { word: "助ける", reading: "たすける", meaning: "to rescue, to help", lesson: 50 },
    { word: "適当", reading: "てきとう", meaning: "suitable", lesson: 50 },
    { word: "不思議", reading: "ふしぎ", meaning: "strange, mysterious", lesson: 50 },
    { word: "または", reading: "", meaning: "or", lesson: 50 },
    { word: "なるほど", reading: "", meaning: "I see", lesson: 50 },
  ],
  N3: [
{ word: "長男", reading: "ちょうなん", meaning: "eldest son", lesson: 1 },
{ word: "長女", reading: "ちょうじょ", meaning: "eldest daughter", lesson: 1 },
{ word: "末っ子", reading: "すえっこ", meaning: "youngest child", lesson: 1 },
{ word: "一人っ子", reading: "ひとりっこ", meaning: "only child", lesson: 1 },
{ word: "いとこ", reading: "", meaning: "cousin", lesson: 1 },
{ word: "孫", reading: "まご", meaning: "grandchild", lesson: 1 },
{ word: "そっくり", reading: "", meaning: "close resemblance", lesson: 1 },
{ word: "双子", reading: "ふたご", meaning: "twins", lesson: 1 },
{ word: "親戚", reading: "しんせき", meaning: "relative", lesson: 1 },
{ word: "仲", reading: "なか", meaning: "relationship, relations", lesson: 1 },
{ word: "夫婦", reading: "ふうふ", meaning: "married couple", lesson: 1 },
{ word: "親友", reading: "しんゆう", meaning: "close friend, best friend", lesson: 1 },
{ word: "親しい", reading: "したしい", meaning: "close, intimate", lesson: 1 },
{ word: "友人", reading: "ゆうじん", meaning: "friend", lesson: 1 },
{ word: "恋人", reading: "こいびと", meaning: "lover", lesson: 1 },
{ word: "仲間", reading: "なかま", meaning: "colleague, companion", lesson: 1 },
{ word: "相手", reading: "あいて", meaning: "partner, the other person", lesson: 1 },
{ word: "知り合い", reading: "しりあい", meaning: "acquaintance", lesson: 1 },
{ word: "性格", reading: "せいかく", meaning: "personal character", lesson: 1 },
{ word: "子供っぽい", reading: "こどもっぽい", meaning: "childish", lesson: 1 },
{ word: "男っぽい", reading: "おとこっぽい", meaning: "manly", lesson: 1 },
{ word: "大人しい", reading: "おとなしい", meaning: "meek, compliant", lesson: 1 },
{ word: "だらしない", reading: "", meaning: "sloppy, lax", lesson: 1 },
{ word: "意地悪", reading: "いじわる", meaning: "spiteful, ill-natured", lesson: 1 },
{ word: "素直", reading: "すなお", meaning: "accommodating, unprotesting", lesson: 1 },
{ word: "正直", reading: "しょうじき", meaning: "honest, frank", lesson: 1 },
{ word: "乱暴", reading: "らんぼう", meaning: "rough, rude, violent", lesson: 1 },
{ word: "わがまま", reading: "", meaning: "selfish", lesson: 1 },
{ word: "積極的", reading: "せっきょくてき", meaning: "positive", lesson: 1 },
{ word: "落ち着いた", reading: "おちついた", meaning: "calm, composed", lesson: 1 },
{ word: "きちんとした", reading: "", meaning: "neat, respectable", lesson: 1 },
{ word: "思いやり", reading: "おもいやり", meaning: "considerateness, thoughtfulness", lesson: 1 },
{ word: "ユーモア", reading: "", meaning: "sense of humor", lesson: 1 },
{ word: "勇気", reading: "ゆうき", meaning: "courage", lesson: 1 },
{ word: "冗談", reading: "じょうだん", meaning: "joke", lesson: 1 },
{ word: "自慢", reading: "じまん", meaning: "act or speak boastfully", lesson: 1 },
{ word: "独身", reading: "どくしん", meaning: "unmarried", lesson: 2 },
{ word: "出会う", reading: "であう", meaning: "meet", lesson: 2 },
{ word: "知り合う", reading: "しりあう", meaning: "get to know", lesson: 2 },
{ word: "付き合う", reading: "つきあう", meaning: "associate with, go with", lesson: 2 },
{ word: "恋", reading: "こい", meaning: "love", lesson: 2 },
{ word: "デート", reading: "", meaning: "date", lesson: 2 },
{ word: "誘う", reading: "さそう", meaning: "invite", lesson: 2 },
{ word: "断る", reading: "ことわる", meaning: "refuse, turn down", lesson: 2 },
{ word: "付き合い", reading: "つきあい", meaning: "relationship", lesson: 2 },
{ word: "愛", reading: "あい", meaning: "love", lesson: 2 },
{ word: "感じる", reading: "かんじる", meaning: "feel, sense", lesson: 2 },
{ word: "破る", reading: "やぶる", meaning: "break", lesson: 2 },
{ word: "守る", reading: "まもる", meaning: "keep, comply with", lesson: 2 },
{ word: "疑う", reading: "うたがう", meaning: "doubt, suspect", lesson: 2 },
{ word: "許す", reading: "ゆるす", meaning: "allow, forgive, condone", lesson: 2 },
{ word: "たたく", reading: "", meaning: "hit, strike", lesson: 2 },
{ word: "態度", reading: "たいど", meaning: "attitude", lesson: 2 },
{ word: "振られる", reading: "ふられる", meaning: "be rejected, be cold-shouldered", lesson: 2 },
{ word: "離婚", reading: "りこん", meaning: "divorce", lesson: 2 },
{ word: "悲しむ", reading: "かなしむ", meaning: "mourn, be sad about", lesson: 2 },
{ word: "腹が立つ", reading: "はらがたつ", meaning: "get angry", lesson: 2 },
{ word: "不安", reading: "ふあん", meaning: "unease, anxiety", lesson: 2 },
{ word: "恐怖", reading: "きょうふ", meaning: "fear", lesson: 2 },
{ word: "不満", reading: "ふまん", meaning: "dissatisfaction, discontent", lesson: 2 },
{ word: "満足", reading: "まんぞく", meaning: "satisfaction, satisfy", lesson: 2 },
{ word: "がっかり", reading: "", meaning: "be disappointed", lesson: 2 },
{ word: "悩む", reading: "なやむ", meaning: "be troubled by", lesson: 2 },
{ word: "迷う", reading: "まよう", meaning: "be puzzled over", lesson: 2 },
{ word: "感動", reading: "かんどう", meaning: "be impressed, impress", lesson: 2 },
{ word: "感情", reading: "かんじょう", meaning: "emotion, feeling", lesson: 2 },
{ word: "感謝", reading: "かんしゃ", meaning: "thanks, gratitude", lesson: 2 },
{ word: "びっくり", reading: "", meaning: "be surprised", lesson: 2 },
{ word: "慌てる", reading: "あわてる", meaning: "be flustered, do something in a flustered way", lesson: 2 },
{ word: "希望", reading: "きぼう", meaning: "hope", lesson: 2 },
{ word: "望む", reading: "のぞむ", meaning: "look forward to", lesson: 2 },
{ word: "食器", reading: "しょっき", meaning: "cutlery and dishes", lesson: 3 },
{ word: "汚れ", reading: "よごれ", meaning: "dirt", lesson: 3 },
{ word: "洗剤", reading: "せんざい", meaning: "detergent", lesson: 3 },
{ word: "汚す", reading: "よごす", meaning: "make dirty, soil", lesson: 3 },
{ word: "畳む", reading: "たたむ", meaning: "fold", lesson: 3 },
{ word: "しまう", reading: "", meaning: "put away, store", lesson: 3 },
{ word: "掃除機", reading: "そうじき", meaning: "vacuum cleaner", lesson: 3 },
{ word: "アイロン", reading: "", meaning: "iron", lesson: 3 },
{ word: "家具", reading: "かぐ", meaning: "furniture", lesson: 3 },
{ word: "動かす", reading: "うごかす", meaning: "move, shift", lesson: 3 },
{ word: "床", reading: "ゆか", meaning: "floor", lesson: 3 },
{ word: "拭く", reading: "ふく", meaning: "wipe, mop", lesson: 3 },
{ word: "調子", reading: "ちょうし", meaning: "condition, state", lesson: 3 },
{ word: "修理", reading: "しゅうり", meaning: "repair", lesson: 3 },
{ word: "リサイクル", reading: "", meaning: "recycling", lesson: 3 },
{ word: "家事", reading: "かじ", meaning: "housekeeping, domestic chores", lesson: 3 },
{ word: "面倒臭い", reading: "めんどうくさい", meaning: "tiresome, bothersome", lesson: 3 },
{ word: "目が覚める", reading: "めがさめる", meaning: "awaken", lesson: 3 },
{ word: "あくび", reading: "", meaning: "yawn, yawning", lesson: 3 },
{ word: "涙", reading: "なみだ", meaning: "tears", lesson: 3 },
{ word: "睡眠", reading: "すいみん", meaning: "sleep", lesson: 3 },
{ word: "朝食", reading: "ちょうしょく", meaning: "breakfast", lesson: 3 },
{ word: "化粧", reading: "けしょう", meaning: "make-up, cosmetics", lesson: 3 },
{ word: "えさ", reading: "", meaning: "food, feed (for pets/livestock)", lesson: 3 },
{ word: "可愛がる", reading: "かわいがる", meaning: "treat with affection", lesson: 3 },
{ word: "定期", reading: "ていき", meaning: "season ticket", lesson: 3 },
{ word: "遅刻", reading: "ちこく", meaning: "lateness, be late", lesson: 3 },
{ word: "携帯電話", reading: "けいたいでんわ", meaning: "mobile phone, cellphone", lesson: 3 },
{ word: "電池", reading: "でんち", meaning: "battery", lesson: 3 },
{ word: "切れる", reading: "きれる", meaning: "run out, expire", lesson: 3 },
{ word: "退屈", reading: "たいくつ", meaning: "boring, boredom", lesson: 3 },
{ word: "帰宅", reading: "きたく", meaning: "return, go back home", lesson: 3 },
{ word: "文句", reading: "もんく", meaning: "complaint, grumbling", lesson: 3 },
{ word: "疲れ", reading: "つかれ", meaning: "fatigue, tiredness", lesson: 3 },
{ word: "毛布", reading: "もうふ", meaning: "blanket", lesson: 3 },
{ word: "皮", reading: "かわ", meaning: "peel, rind (n)", lesson: 4 },
{ word: "むく", reading: "", meaning: "peel (v)", lesson: 4 },
{ word: "加える", reading: "くわえる", meaning: "add", lesson: 4 },
{ word: "材料", reading: "ざいりょう", meaning: "materials, ingredients", lesson: 4 },
{ word: "混ぜる", reading: "まぜる", meaning: "mix, stir", lesson: 4 },
{ word: "鍋", reading: "なべ", meaning: "hotpot", lesson: 4 },
{ word: "煮る", reading: "にる", meaning: "simmer", lesson: 4 },
{ word: "油", reading: "あぶら", meaning: "oil, grease", lesson: 4 },
{ word: "揚げる", reading: "あげる", meaning: "fry", lesson: 4 },
{ word: "容器", reading: "ようき", meaning: "container", lesson: 4 },
{ word: "移す", reading: "うつす", meaning: "move", lesson: 4 },
{ word: "保存", reading: "ほぞん", meaning: "storage, store, keep", lesson: 4 },
{ word: "腐る", reading: "くさる", meaning: "go bad, spoil", lesson: 4 },
{ word: "生", reading: "なま", meaning: "raw", lesson: 4 },
{ word: "酸っぱい", reading: "すっぱい", meaning: "acidic, sour", lesson: 4 },
{ word: "濃い", reading: "こい", meaning: "rich, heavy (taste)", lesson: 4 },
{ word: "しつこい", reading: "", meaning: "too rich, cloying", lesson: 4 },
{ word: "軟らかい", reading: "やわらかい", meaning: "soft, supple", lesson: 4 },
{ word: "香り", reading: "かおり", meaning: "aroma, fragrance", lesson: 4 },
{ word: "包丁", reading: "ほうちょう", meaning: "kitchen knife, cleaver", lesson: 4 },
{ word: "フライパン", reading: "", meaning: "frying pan", lesson: 4 },
{ word: "ぺこぺこ", reading: "", meaning: "famished", lesson: 4 },
{ word: "からから", reading: "", meaning: "parched", lesson: 4 },
{ word: "高級", reading: "こうきゅう", meaning: "high-class, upmarket, luxury", lesson: 4 },
{ word: "メニュー", reading: "", meaning: "menu", lesson: 4 },
{ word: "栄養", reading: "えいよう", meaning: "nutrition, diet", lesson: 4 },
{ word: "バランス", reading: "", meaning: "balanced", lesson: 4 },
{ word: "注文", reading: "ちゅうもん", meaning: "order (n); order (v)", lesson: 4 },
{ word: "追加", reading: "ついか", meaning: "extra helping, extra portion", lesson: 4 },
{ word: "乾杯", reading: "かんぱい", meaning: "toast, say cheers, drink a toast", lesson: 4 },
{ word: "酔う", reading: "よう", meaning: "get drunk", lesson: 4 },
{ word: "舌", reading: "した", meaning: "tongue", lesson: 4 },
{ word: "火傷", reading: "やけど", meaning: "burn, scald", lesson: 4 },
{ word: "残す", reading: "のこす", meaning: "leave (uneaten)", lesson: 4 },
{ word: "マナー", reading: "", meaning: "manners", lesson: 4 },
{ word: "支払い", reading: "しはらい", meaning: "payment", lesson: 4 },
{ word: "食費", reading: "しょくひ", meaning: "cost of board, meal cost", lesson: 4 },
{ word: "おかず", reading: "", meaning: "side-dish", lesson: 4 },
{ word: "おにぎり", reading: "", meaning: "rice-ball", lesson: 4 },
{ word: "お菓子", reading: "おかし", meaning: "confectionery", lesson: 4 },
{ word: "自宅", reading: "じたく", meaning: "own home", lesson: 5 },
{ word: "設計", reading: "せっけい", meaning: "design (n); design (v)", lesson: 5 },
{ word: "工事", reading: "こうじ", meaning: "construction works", lesson: 5 },
{ word: "建築", reading: "けんちく", meaning: "construction, building", lesson: 5 },
{ word: "マンション", reading: "", meaning: "apartment building", lesson: 5 },
{ word: "建設", reading: "けんせつ", meaning: "construction", lesson: 5 },
{ word: "建つ", reading: "たつ", meaning: "go up, be erected", lesson: 5 },
{ word: "完成", reading: "かんせい", meaning: "completion, complete", lesson: 5 },
{ word: "土地", reading: "とち", meaning: "land", lesson: 5 },
{ word: "価値", reading: "かち", meaning: "value", lesson: 5 },
{ word: "地下", reading: "ちか", meaning: "underground", lesson: 5 },
{ word: "造る", reading: "つくる", meaning: "build", lesson: 5 },
{ word: "屋根", reading: "やね", meaning: "roof", lesson: 5 },
{ word: "インテリア", reading: "", meaning: "interior (design)", lesson: 5 },
{ word: "スペース", reading: "", meaning: "space", lesson: 5 },
{ word: "デザイン", reading: "", meaning: "design", lesson: 5 },
{ word: "家具", reading: "かぐ", meaning: "furniture", lesson: 5 },
{ word: "すっきり", reading: "", meaning: "neat, cleanly designed", lesson: 5 },
{ word: "中心", reading: "ちゅうしん", meaning: "center", lesson: 5 },
{ word: "商店街", reading: "しょうてんがい", meaning: "shopping district", lesson: 5 },
{ word: "地区", reading: "ちく", meaning: "district, neighborhood", lesson: 5 },
{ word: "かなり", reading: "", meaning: "rather, considerably", lesson: 5 },
{ word: "距離", reading: "きょり", meaning: "distance", lesson: 5 },
{ word: "畳", reading: "じょう", meaning: "tatami (floorspace measuring unit)", lesson: 5 },
{ word: "当たる", reading: "あたる", meaning: "catch (the sun)", lesson: 5 },
{ word: "日当たり", reading: "ひあたり", meaning: "sunshine", lesson: 5 },
{ word: "向き", reading: "むき", meaning: "-facing", lesson: 5 },
{ word: "影", reading: "かげ", meaning: "shadow, shade", lesson: 5 },
{ word: "付き", reading: "つき", meaning: "equipped, furnished with", lesson: 5 },
{ word: "なし", reading: "", meaning: "not included, unavailable", lesson: 5 },
{ word: "引っ越し", reading: "ひっこし", meaning: "moving house, relocation", lesson: 5 },
{ word: "床", reading: "ゆか", meaning: "floor", lesson: 5 },
{ word: "傷", reading: "きず", meaning: "scratch, blemish", lesson: 5 },
{ word: "付く", reading: "つく", meaning: "cause (a scratch)", lesson: 5 },
{ word: "家賃", reading: "やちん", meaning: "rent", lesson: 5 },
// 6課 体1：美容、健康 — 1 美容
{ word: "伸ばす", reading: "のばす", meaning: "to allow to grow long", lesson: 6 },
{ word: "結ぶ", reading: "むすぶ", meaning: "to tie up", lesson: 6 },
{ word: "美容院", reading: "びよういん", meaning: "beauty salon", lesson: 6 },
{ word: "雰囲気", reading: "ふんいき", meaning: "atmosphere", lesson: 6 },
{ word: "しわ", reading: "", meaning: "wrinkle, crease", lesson: 6 },
{ word: "肌", reading: "はだ", meaning: "skin", lesson: 6 },
{ word: "クリーム", reading: "", meaning: "cream", lesson: 6 },
{ word: "まったく", reading: "", meaning: "absolutely, completely", lesson: 6 },
{ word: "効果", reading: "こうか", meaning: "effect", lesson: 6 },
{ word: "化粧", reading: "けしょう", meaning: "make-up, cosmetics", lesson: 6 },
{ word: "濃い", reading: "こい", meaning: "heavy (e.g. make-up), thick", lesson: 6 },
{ word: "スタイル", reading: "", meaning: "style, figure", lesson: 6 },
{ word: "自信", reading: "じしん", meaning: "confidence", lesson: 6 },
{ word: "姿勢", reading: "しせい", meaning: "posture", lesson: 6 },
{ word: "みっともない", reading: "", meaning: "disgraceful, unbecoming", lesson: 6 },
{ word: "量", reading: "りょう", meaning: "amount", lesson: 6 },
{ word: "制限する", reading: "せいげんする", meaning: "to limit", lesson: 6 },
{ word: "外食", reading: "がいしょく", meaning: "eating out", lesson: 6 },
{ word: "カロリー", reading: "", meaning: "calories", lesson: 6 },

// 6課 体1：美容、健康 — 2 健康
{ word: "体力", reading: "たいりょく", meaning: "bodily strength", lesson: 6 },
{ word: "体操", reading: "たいそう", meaning: "physical exercise", lesson: 6 },
{ word: "全身", reading: "ぜんしん", meaning: "whole body", lesson: 6 },
{ word: "筋肉", reading: "きんにく", meaning: "muscle", lesson: 6 },
{ word: "汗", reading: "あせ", meaning: "sweat", lesson: 6 },
{ word: "息", reading: "いき", meaning: "breath, breathing", lesson: 6 },
{ word: "苦しい", reading: "くるしい", meaning: "painful, difficult", lesson: 6 },
{ word: "中年", reading: "ちゅうねん", meaning: "middle age", lesson: 6 },
{ word: "普段", reading: "ふだん", meaning: "usually, ordinarily", lesson: 6 },
{ word: "健康", reading: "けんこう", meaning: "health", lesson: 6 },
{ word: "禁煙", reading: "きんえん", meaning: "quitting smoking", lesson: 6 },
{ word: "内緒", reading: "ないしょ", meaning: "in secret, in private", lesson: 6 },
{ word: "無駄", reading: "むだ", meaning: "futile, pointless", lesson: 6 },
{ word: "意志", reading: "いし", meaning: "will, volition", lesson: 6 },
{ word: "影響", reading: "えいきょう", meaning: "effect, influence", lesson: 6 },
{ word: "与える", reading: "あたえる", meaning: "to give, provide", lesson: 6 },
{ word: "ヨガ", reading: "", meaning: "yoga", lesson: 6 },
{ word: "ジョギング", reading: "", meaning: "jogging", lesson: 6 },
{ word: "ダイエット", reading: "", meaning: "dieting", lesson: 6 },
{ word: "ジム", reading: "", meaning: "gym", lesson: 6 },

// 7課 体2：病気 — 1 病気と怪我
{ word: "体調", reading: "たいちょう", meaning: "physical condition", lesson: 7 },
{ word: "食欲", reading: "しょくよく", meaning: "appetite", lesson: 7 },
{ word: "感じ", reading: "かんじ", meaning: "feeling, sensation", lesson: 7 },
{ word: "体温", reading: "たいおん", meaning: "(body) temperature", lesson: 7 },
{ word: "測る", reading: "はかる", meaning: "to measure", lesson: 7 },
{ word: "順番", reading: "じゅんばん", meaning: "order, sequence", lesson: 7 },
{ word: "冷やす", reading: "ひやす", meaning: "to cool down", lesson: 7 },
{ word: "温める", reading: "あたためる", meaning: "to warm up", lesson: 7 },
{ word: "傷", reading: "きず", meaning: "wound, abrasion", lesson: 7 },
{ word: "火傷", reading: "やけど", meaning: "burn, scald", lesson: 7 },
{ word: "削る", reading: "けずる", meaning: "to scrape, drill (a tooth)", lesson: 7 },
{ word: "抜く", reading: "ぬく", meaning: "to extract, pull out", lesson: 7 },
{ word: "防ぐ", reading: "ふせぐ", meaning: "to prevent", lesson: 7 },
{ word: "清潔", reading: "せいけつ", meaning: "cleanliness", lesson: 7 },
{ word: "薬局", reading: "やっきょく", meaning: "pharmacy, drug store", lesson: 7 },
{ word: "マスク", reading: "", meaning: "mask", lesson: 7 },
{ word: "胃", reading: "い", meaning: "stomach", lesson: 7 },
{ word: "肩", reading: "かた", meaning: "shoulder", lesson: 7 },
{ word: "腰", reading: "こし", meaning: "waist", lesson: 7 },
{ word: "膝", reading: "ひざ", meaning: "knee", lesson: 7 },
{ word: "胸", reading: "むね", meaning: "chest", lesson: 7 },
{ word: "心臓", reading: "しんぞう", meaning: "heart", lesson: 7 },

// 7課 体2：病気 — 2 入院
{ word: "かかる", reading: "", meaning: "to catch, get (an illness)", lesson: 7 },
{ word: "検査", reading: "けんさ", meaning: "examination", lesson: 7 },
{ word: "発見する", reading: "はっけんする", meaning: "to discover", lesson: 7 },
{ word: "異常", reading: "いじょう", meaning: "abnormality, abnormal", lesson: 7 },
{ word: "ガン", reading: "", meaning: "cancer", lesson: 7 },
{ word: "痛み", reading: "いたみ", meaning: "pain", lesson: 7 },
{ word: "我慢する", reading: "がまんする", meaning: "to endure", lesson: 7 },
{ word: "苦しむ", reading: "くるしむ", meaning: "to suffer", lesson: 7 },
{ word: "状態", reading: "じょうたい", meaning: "state, condition", lesson: 7 },
{ word: "手術", reading: "しゅじゅつ", meaning: "operation", lesson: 7 },
{ word: "成功する", reading: "せいこうする", meaning: "to succeed", lesson: 7 },
{ word: "回復", reading: "かいふく", meaning: "recovery", lesson: 7 },
{ word: "ほぼ", reading: "", meaning: "almost, mostly", lesson: 7 },
{ word: "完全に", reading: "かんぜんに", meaning: "completely, fully", lesson: 7 },
{ word: "助ける", reading: "たすける", meaning: "to help, save", lesson: 7 },
{ word: "救う", reading: "すくう", meaning: "to save, rescue", lesson: 7 },
{ word: "落とす", reading: "おとす", meaning: "to drop, lose (e.g. one's life)", lesson: 7 },
{ word: "助かる", reading: "たすかる", meaning: "to be saved, helped", lesson: 7 },
{ word: "お見舞い", reading: "おみまい", meaning: "visit (to a sick person)", lesson: 7 },

// 8課 趣味と旅行1：スポーツ、芸術 — 1 スポーツ
{ word: "開始", reading: "かいし", meaning: "beginning", lesson: 8 },
{ word: "選手", reading: "せんしゅ", meaning: "player, athlete", lesson: 8 },
{ word: "活躍", reading: "かつやく", meaning: "active participation, engagement", lesson: 8 },
{ word: "期待する", reading: "きたいする", meaning: "to expect, have expectations of", lesson: 8 },
{ word: "チーム", reading: "", meaning: "team", lesson: 8 },
{ word: "応援する", reading: "おうえんする", meaning: "to support, cheer for", lesson: 8 },
{ word: "出場する", reading: "しゅつじょうする", meaning: "to appear, take part in (a match)", lesson: 8 },
{ word: "ボール", reading: "", meaning: "ball", lesson: 8 },
{ word: "蹴る", reading: "ける", meaning: "to kick", lesson: 8 },
{ word: "優勝", reading: "ゆうしょう", meaning: "win, victory", lesson: 8 },
{ word: "争う", reading: "あらそう", meaning: "to contest, vie", lesson: 8 },
{ word: "悔しい", reading: "くやしい", meaning: "vexing, regrettable", lesson: 8 },
{ word: "代表", reading: "だいひょう", meaning: "representative (team)", lesson: 8 },
{ word: "トレーニング", reading: "", meaning: "training", lesson: 8 },
{ word: "コース", reading: "", meaning: "course", lesson: 8 },
{ word: "トップ", reading: "", meaning: "top position", lesson: 8 },
{ word: "ゴール", reading: "", meaning: "goal, finish line", lesson: 8 },
{ word: "あきらめる", reading: "", meaning: "to give up, abandon", lesson: 8 },
{ word: "記録", reading: "きろく", meaning: "record", lesson: 8 },
{ word: "破る", reading: "やぶる", meaning: "to break (a record)", lesson: 8 },

// 8課 趣味と旅行1：スポーツ、芸術 — 2 芸術
{ word: "芸術", reading: "げいじゅつ", meaning: "the arts", lesson: 8 },
{ word: "一流", reading: "いちりゅう", meaning: "first-rate, top-ranking", lesson: 8 },
{ word: "作家", reading: "さっか", meaning: "author, writer", lesson: 8 },
{ word: "画家", reading: "がか", meaning: "artist, painter", lesson: 8 },
{ word: "音楽家", reading: "おんがくか", meaning: "musician", lesson: 8 },
{ word: "才能", reading: "さいのう", meaning: "talent", lesson: 8 },
{ word: "監督", reading: "かんとく", meaning: "director, manager", lesson: 8 },
{ word: "人気", reading: "にんき", meaning: "popularity", lesson: 8 },
{ word: "俳優", reading: "はいゆう", meaning: "actor", lesson: 8 },
{ word: "女優", reading: "じょゆう", meaning: "actress", lesson: 8 },
{ word: "お勧め", reading: "おすすめ", meaning: "recommended", lesson: 8 },
{ word: "作品", reading: "さくひん", meaning: "work, production", lesson: 8 },
{ word: "ストーリー", reading: "", meaning: "story, narrative", lesson: 8 },
{ word: "単純", reading: "たんじゅん", meaning: "simple", lesson: 8 },
{ word: "表現する", reading: "ひょうげんする", meaning: "to express", lesson: 8 },
{ word: "喜び", reading: "よろこび", meaning: "joy, delight", lesson: 8 },
{ word: "悲しみ", reading: "かなしみ", meaning: "sorrow, unhappiness", lesson: 8 },
{ word: "感情", reading: "かんじょう", meaning: "feeling, emotion", lesson: 8 },
{ word: "楽器", reading: "がっき", meaning: "musical instrument", lesson: 8 },
{ word: "プロ", reading: "", meaning: "professional", lesson: 8 },
{ word: "演奏", reading: "えんそう", meaning: "performance", lesson: 8 },
{ word: "感想", reading: "かんそう", meaning: "impressions, thoughts on", lesson: 8 },
{ word: "コンクール", reading: "", meaning: "competition, contest", lesson: 8 },
{ word: "演劇", reading: "えんげき", meaning: "drama, the theater", lesson: 8 },
{ word: "絵画", reading: "かいが", meaning: "picture, painting", lesson: 8 },
{ word: "アニメ", reading: "", meaning: "anime", lesson: 8 },

// 9課 趣味と旅行2：ファッション — 1 ファッション(1)
{ word: "最新", reading: "さいしん", meaning: "latest", lesson: 9 },
{ word: "ファッション", reading: "", meaning: "fashion", lesson: 9 },
{ word: "流行", reading: "りゅうこう", meaning: "fashion, fad, trend", lesson: 9 },
{ word: "スタイル", reading: "", meaning: "style", lesson: 9 },
{ word: "デザイン", reading: "", meaning: "design", lesson: 9 },
{ word: "おしゃれ", reading: "", meaning: "fashionable, stylish", lesson: 9 },
{ word: "試着する", reading: "しちゃくする", meaning: "to try on", lesson: 9 },
{ word: "着替える", reading: "きがえる", meaning: "to change (clothes)", lesson: 9 },
{ word: "きつい", reading: "", meaning: "tight (clothes)", lesson: 9 },
{ word: "緩い", reading: "ゆるい", meaning: "loose (clothes)", lesson: 9 },
{ word: "袖", reading: "そで", meaning: "sleeve", lesson: 9 },
{ word: "サイズ", reading: "", meaning: "size", lesson: 9 },
{ word: "ぴったりだ", reading: "", meaning: "to fit exactly", lesson: 9 },
{ word: "気に入る", reading: "きにいる", meaning: "to like, be pleased with", lesson: 9 },
{ word: "似合う", reading: "にあう", meaning: "to suit, go well with", lesson: 9 },
{ word: "関心", reading: "かんしん", meaning: "interest", lesson: 9 },
{ word: "パジャマ", reading: "", meaning: "pajamas", lesson: 9 },
{ word: "ワンピース", reading: "", meaning: "one-piece dress", lesson: 9 },
{ word: "浴衣", reading: "ゆかた", meaning: "yukata, casual kimono robe", lesson: 9 },
{ word: "水着", reading: "みずぎ", meaning: "swimwear", lesson: 9 },

// 9課 趣味と旅行2：ファッション — 2 ファッション(2)
{ word: "きちんとした", reading: "", meaning: "neat, respectable", lesson: 9 },
{ word: "高級な", reading: "こうきゅうな", meaning: "high-class", lesson: 9 },
{ word: "上品な", reading: "じょうひんな", meaning: "elegant, refined, tasteful", lesson: 9 },
{ word: "シンプルな", reading: "", meaning: "simple, basic", lesson: 9 },
{ word: "服装", reading: "ふくそう", meaning: "dress, clothing", lesson: 9 },
{ word: "派手な", reading: "はでな", meaning: "flashy, showy", lesson: 9 },
{ word: "地味な", reading: "じみな", meaning: "plain, drab", lesson: 9 },
{ word: "かっこいい", reading: "", meaning: "stylish, cool", lesson: 9 },
{ word: "かっこ悪い", reading: "かっこわるい", meaning: "lacking style, uncool", lesson: 9 },
{ word: "素敵な", reading: "すてきな", meaning: "nice, attractive", lesson: 9 },
{ word: "ドレス", reading: "", meaning: "dress", lesson: 9 },
{ word: "真っ赤な", reading: "まっかな", meaning: "bright red", lesson: 9 },
{ word: "真っ白な", reading: "まっしろな", meaning: "pure white", lesson: 9 },
{ word: "真っ黒な", reading: "まっくろな", meaning: "coal-black, black as pitch", lesson: 9 },
{ word: "オレンジ", reading: "", meaning: "orange color", lesson: 9 },
{ word: "ピンク", reading: "", meaning: "pink color", lesson: 9 },
{ word: "紫", reading: "むらさき", meaning: "purple color", lesson: 9 },
{ word: "灰色", reading: "はいいろ", meaning: "gray color", lesson: 9 },
{ word: "濃い", reading: "こい", meaning: "dark (color)", lesson: 9 },
{ word: "合わせる", reading: "あわせる", meaning: "to match, go well with", lesson: 9 },
{ word: "模様", reading: "もよう", meaning: "pattern", lesson: 9 },
{ word: "無地", reading: "むじ", meaning: "plain, not patterned", lesson: 9 },
{ word: "ウール", reading: "", meaning: "wool", lesson: 9 },
{ word: "綿", reading: "めん", meaning: "cotton", lesson: 9 },
{ word: "革", reading: "かわ", meaning: "leather", lesson: 9 },
{ word: "コート", reading: "", meaning: "coat", lesson: 9 },
{ word: "パンツ", reading: "", meaning: "underpants", lesson: 9 },
{ word: "ストッキング", reading: "", meaning: "stockings", lesson: 9 },
{ word: "ジーンズ", reading: "", meaning: "jeans", lesson: 9 },
{ word: "サンダル", reading: "", meaning: "sandals", lesson: 9 },
{ word: "ブーツ", reading: "", meaning: "boots, booties", lesson: 9 },
// 11課 教育1：学校生活（小中高）
{ word: "学年", reading: "がくねん", meaning: "school year", lesson: 11 },
{ word: "学期", reading: "がっき", meaning: "semester", lesson: 11 },
{ word: "通学", reading: "つうがく", meaning: "commuting to school; commute", lesson: 11 },
{ word: "遅刻", reading: "ちこく", meaning: "lateness; be late", lesson: 11 },
{ word: "欠席", reading: "けっせき", meaning: "absence; be absent", lesson: 11 },
{ word: "プリント", reading: "", meaning: "printout; handout", lesson: 11 },
{ word: "配る", reading: "くばる", meaning: "hand out, circulate", lesson: 11 },
{ word: "得意", reading: "とくい", meaning: "skilled in", lesson: 11 },
{ word: "苦手", reading: "にがて", meaning: "weak in", lesson: 11 },
{ word: "おしゃべり", reading: "", meaning: "chatting; chat", lesson: 11 },
{ word: "居眠り", reading: "いねむり", meaning: "nap; take a nap", lesson: 11 },
{ word: "給食", reading: "きゅうしょく", meaning: "school-meal service", lesson: 11 },
{ word: "クラブ", reading: "", meaning: "club", lesson: 11 },
{ word: "部", reading: "ぶ", meaning: "~group, ~team (club suffix)", lesson: 11 },
{ word: "大会", reading: "たいかい", meaning: "meet, competition, championship, match", lesson: 11 },
{ word: "遠足", reading: "えんそく", meaning: "excursion, outing", lesson: 11 },
{ word: "修学旅行", reading: "しゅうがくりょこう", meaning: "school trip", lesson: 11 },
{ word: "運動会", reading: "うんどうかい", meaning: "sports meeting", lesson: 11 },
{ word: "体育祭", reading: "たいいくさい", meaning: "sports festival", lesson: 11 },
{ word: "文化祭", reading: "ぶんかさい", meaning: "college/cultural festival", lesson: 11 },
{ word: "学ぶ", reading: "まなぶ", meaning: "study, learn", lesson: 11 },
{ word: "学習", reading: "がくしゅう", meaning: "study, learn", lesson: 11 },
{ word: "基礎", reading: "きそ", meaning: "basics", lesson: 11 },
{ word: "習う", reading: "ならう", meaning: "learn, acquire", lesson: 11 },
{ word: "教わる", reading: "おそわる", meaning: "learn, be taught", lesson: 11 },
{ word: "知識", reading: "ちしき", meaning: "knowledge", lesson: 11 },
{ word: "疑問", reading: "ぎもん", meaning: "question, doubt", lesson: 11 },
{ word: "実力", reading: "じつりょく", meaning: "ability", lesson: 11 },
{ word: "試す", reading: "ためす", meaning: "try, test", lesson: 11 },
{ word: "満点", reading: "まんてん", meaning: "full marks", lesson: 11 },
{ word: "成績", reading: "せいせき", meaning: "marks, grade, score", lesson: 11 },
{ word: "単語", reading: "たんご", meaning: "word, vocabulary item", lesson: 11 },
{ word: "暗記", reading: "あんき", meaning: "memorization; learn by heart", lesson: 11 },
{ word: "内容", reading: "ないよう", meaning: "content, what was said", lesson: 11 },
{ word: "理解", reading: "りかい", meaning: "understanding; understand", lesson: 11 },
{ word: "スピーチ", reading: "", meaning: "speech, give a speech", lesson: 11 },
{ word: "レベル", reading: "", meaning: "level", lesson: 11 },
{ word: "初級", reading: "しょきゅう", meaning: "basic level", lesson: 11 },
{ word: "中級", reading: "ちゅうきゅう", meaning: "intermediate level", lesson: 11 },
{ word: "上級", reading: "じょうきゅう", meaning: "advanced level", lesson: 11 },
{ word: "国語", reading: "こくご", meaning: "Japanese, the national language", lesson: 11 },
{ word: "理科", reading: "りか", meaning: "science", lesson: 11 },
{ word: "体育", reading: "たいいく", meaning: "physical education", lesson: 11 },
{ word: "数学", reading: "すうがく", meaning: "mathematics", lesson: 11 },
{ word: "社会", reading: "しゃかい", meaning: "social studies; society", lesson: 11 },
{ word: "音楽", reading: "おんがく", meaning: "music", lesson: 11 },

// 12課 教育2：学校生活（大学）
{ word: "受験", reading: "じゅけん", meaning: "examination; take an examination", lesson: 12 },
{ word: "私立", reading: "しりつ", meaning: "private", lesson: 12 },
{ word: "国立", reading: "こくりつ", meaning: "national, state", lesson: 12 },
{ word: "大学院", reading: "だいがくいん", meaning: "graduate school", lesson: 12 },
{ word: "進学", reading: "しんがく", meaning: "progress; go on to further education", lesson: 12 },
{ word: "徹夜", reading: "てつや", meaning: "staying up all night", lesson: 12 },
{ word: "努力", reading: "どりょく", meaning: "effort; make efforts, show commitment", lesson: 12 },
{ word: "ミス", reading: "", meaning: "mistake", lesson: 12 },
{ word: "確かめる", reading: "たしかめる", meaning: "confirm; check", lesson: 12 },
{ word: "確認", reading: "かくにん", meaning: "confirm; check", lesson: 12 },
{ word: "解答", reading: "かいとう", meaning: "answer", lesson: 12 },
{ word: "見直す", reading: "みなおす", meaning: "review, revise", lesson: 12 },
{ word: "計算", reading: "けいさん", meaning: "calculation", lesson: 12 },
{ word: "間違う", reading: "まちがう", meaning: "make a mistake", lesson: 12 },
{ word: "結果", reading: "けっか", meaning: "results", lesson: 12 },
{ word: "発表", reading: "はっぴょう", meaning: "announcement; announce", lesson: 12 },
{ word: "通る", reading: "とおる", meaning: "pass (an exam)", lesson: 12 },
{ word: "合格", reading: "ごうかく", meaning: "pass (an exam)", lesson: 12 },
{ word: "パス", reading: "", meaning: "pass (an exam)", lesson: 12 },
{ word: "落ちる", reading: "おちる", meaning: "fail (an exam)", lesson: 12 },
{ word: "不合格", reading: "ふごうかく", meaning: "failure", lesson: 12 },
{ word: "教科書", reading: "きょうかしょ", meaning: "textbook", lesson: 12 },
{ word: "参考書", reading: "さんこうしょ", meaning: "reference book", lesson: 12 },
{ word: "問題集", reading: "もんだいしゅう", meaning: "exercise book", lesson: 12 },
{ word: "医学部", reading: "いがくぶ", meaning: "department of medicine", lesson: 12 },
{ word: "理工学部", reading: "りこうがくぶ", meaning: "department of science and technology", lesson: 12 },
{ word: "文学部", reading: "ぶんがくぶ", meaning: "department of literature", lesson: 12 },
{ word: "法学部", reading: "ほうがくぶ", meaning: "department of law", lesson: 12 },
{ word: "経済学部", reading: "けいざいがくぶ", meaning: "department of economics", lesson: 12 },
{ word: "社会学部", reading: "しゃかいがくぶ", meaning: "department of sociology", lesson: 12 },
{ word: "ゼミ", reading: "", meaning: "seminar", lesson: 12 },
{ word: "教授", reading: "きょうじゅ", meaning: "professor", lesson: 12 },
{ word: "指導", reading: "しどう", meaning: "coaching, guidance", lesson: 12 },
{ word: "アドバイス", reading: "", meaning: "advice", lesson: 12 },
{ word: "コメント", reading: "", meaning: "feedback, comment", lesson: 12 },
{ word: "実験", reading: "じっけん", meaning: "experiment", lesson: 12 },
{ word: "提出", reading: "ていしゅつ", meaning: "submission; submit", lesson: 12 },
{ word: "課題", reading: "かだい", meaning: "subject, assignment", lesson: 12 },
{ word: "卒業論文", reading: "そつぎょうろんぶん", meaning: "graduation thesis", lesson: 12 },
{ word: "卒論", reading: "そつろん", meaning: "graduation thesis (abbrev.)", lesson: 12 },
{ word: "授業料", reading: "じゅぎょうりょう", meaning: "tuition fees", lesson: 12 },
{ word: "学費", reading: "がくひ", meaning: "tuition fees", lesson: 12 },
{ word: "寮", reading: "りょう", meaning: "dormitory", lesson: 12 },
{ word: "暮らす", reading: "くらす", meaning: "live", lesson: 12 },
{ word: "一人暮らし", reading: "ひとりぐらし", meaning: "living alone", lesson: 12 },
{ word: "サークル", reading: "", meaning: "circle, club", lesson: 12 },
{ word: "合宿", reading: "がっしゅく", meaning: "student camp", lesson: 12 },
{ word: "後輩", reading: "こうはい", meaning: "junior (in school/company hierarchy)", lesson: 12 },
{ word: "学園祭", reading: "がくえんさい", meaning: "college festival, cultural festival", lesson: 12 },
{ word: "参加", reading: "さんか", meaning: "participation; participate", lesson: 12 },
{ word: "留学", reading: "りゅうがく", meaning: "overseas study; study abroad", lesson: 12 },

// 13課 仕事1：仕事
{ word: "募集", reading: "ぼしゅう", meaning: "recruitment; recruit", lesson: 13 },
{ word: "スタッフ", reading: "", meaning: "staff member", lesson: 13 },
{ word: "社員", reading: "しゃいん", meaning: "employee", lesson: 13 },
{ word: "履歴書", reading: "りれきしょ", meaning: "résumé", lesson: 13 },
{ word: "面接", reading: "めんせつ", meaning: "interview", lesson: 13 },
{ word: "入社試験", reading: "にゅうしゃしけん", meaning: "company entrance exam", lesson: 13 },
{ word: "生年月日", reading: "せいねんがっぴ", meaning: "date of birth", lesson: 13 },
{ word: "資格", reading: "しかく", meaning: "qualification", lesson: 13 },
{ word: "免許", reading: "めんきょ", meaning: "license, permit", lesson: 13 },
{ word: "職業", reading: "しょくぎょう", meaning: "occupation, job", lesson: 13 },
{ word: "就く", reading: "つく", meaning: "take, engage in (a job)", lesson: 13 },
{ word: "企業", reading: "きぎょう", meaning: "company, enterprise", lesson: 13 },
{ word: "就職", reading: "しゅうしょく", meaning: "employment; get, begin a job", lesson: 13 },
{ word: "辞める", reading: "やめる", meaning: "quit", lesson: 13 },
{ word: "首になる", reading: "くびになる", meaning: "get the sack, be fired", lesson: 13 },
{ word: "失う", reading: "うしなう", meaning: "lose", lesson: 13 },
{ word: "公務員", reading: "こうむいん", meaning: "civil servant, government employee", lesson: 13 },
{ word: "職人", reading: "しょくにん", meaning: "craftsman", lesson: 13 },
{ word: "モデル", reading: "", meaning: "model", lesson: 13 },
{ word: "記者", reading: "きしゃ", meaning: "reporter", lesson: 13 },
{ word: "パイロット", reading: "", meaning: "pilot", lesson: 13 },
{ word: "教師", reading: "きょうし", meaning: "teacher", lesson: 13 },
{ word: "医師", reading: "いし", meaning: "doctor", lesson: 13 },
{ word: "看護師", reading: "かんごし", meaning: "nurse", lesson: 13 },
{ word: "弁護士", reading: "べんごし", meaning: "lawyer", lesson: 13 },
{ word: "政治家", reading: "せいじか", meaning: "politician", lesson: 13 },
{ word: "ミーティング", reading: "", meaning: "meeting", lesson: 13 },
{ word: "資料", reading: "しりょう", meaning: "documentation, materials", lesson: 13 },
{ word: "配る", reading: "くばる", meaning: "hand out, circulate", lesson: 13 },
{ word: "スケジュール", reading: "", meaning: "schedule", lesson: 13 },
{ word: "アイデア", reading: "", meaning: "idea", lesson: 13 },
{ word: "指示", reading: "しじ", meaning: "instructions, directions", lesson: 13 },
{ word: "作業", reading: "さぎょう", meaning: "work, operations", lesson: 13 },
{ word: "書類", reading: "しょるい", meaning: "document", lesson: 13 },
{ word: "整理", reading: "せいり", meaning: "arrangement, sort out; arrange", lesson: 13 },
{ word: "契約", reading: "けいやく", meaning: "contract", lesson: 13 },
{ word: "結ぶ", reading: "むすぶ", meaning: "sign, conclude", lesson: 13 },
{ word: "商品", reading: "しょうひん", meaning: "products, goods", lesson: 13 },
{ word: "販売", reading: "はんばい", meaning: "sale; sell", lesson: 13 },
{ word: "通勤", reading: "つうきん", meaning: "commuting (to work); commute", lesson: 13 },
{ word: "出勤", reading: "しゅっきん", meaning: "going to work; go to work", lesson: 13 },
{ word: "事務所", reading: "じむしょ", meaning: "office", lesson: 13 },
{ word: "オフィス", reading: "", meaning: "office", lesson: 13 },
{ word: "本社", reading: "ほんしゃ", meaning: "head office", lesson: 13 },
{ word: "深夜", reading: "しんや", meaning: "late at night", lesson: 13 },
{ word: "残業", reading: "ざんぎょう", meaning: "overtime; do overtime", lesson: 13 },
{ word: "きつい", reading: "", meaning: "tough, demanding", lesson: 13 },
{ word: "楽な", reading: "らくな", meaning: "easy", lesson: 13 },
{ word: "時給", reading: "じきゅう", meaning: "hourly pay", lesson: 13 },
{ word: "給料", reading: "きゅうりょう", meaning: "salary", lesson: 13 },
{ word: "ボーナス", reading: "", meaning: "bonus", lesson: 13 },
// 10課 趣味と旅行3：旅行
    { word: "休暇", reading: "きゅうか", meaning: "vacation, holiday", lesson: 10 },
    { word: "休憩", reading: "きゅうけい", meaning: "rest, break", lesson: 10 },
    { word: "申し込む", reading: "もうしこむ", meaning: "to apply for", lesson: 10 },
    { word: "予算", reading: "よさん", meaning: "budget", lesson: 10 },
    { word: "キャンセルする", reading: "", meaning: "to cancel", lesson: 10 },
    { word: "ガイド", reading: "", meaning: "guide, tour guiding", lesson: 10 },
    { word: "観光", reading: "かんこう", meaning: "tourism, sightseeing", lesson: 10 },
    { word: "詳しい", reading: "くわしい", meaning: "detailed", lesson: 10 },
    { word: "迷う", reading: "まよう", meaning: "to get lost, go astray", lesson: 10 },
    { word: "両替する", reading: "りょうがえする", meaning: "to exchange currency", lesson: 10 },
    { word: "お土産", reading: "おみやげ", meaning: "souvenir", lesson: 10 },
    { word: "名物", reading: "めいぶつ", meaning: "local specialty product", lesson: 10 },
    { word: "風景", reading: "ふうけい", meaning: "scenery", lesson: 10 },
    { word: "感動する", reading: "かんどうする", meaning: "to be impressed, moved", lesson: 10 },
    { word: "温泉", reading: "おんせん", meaning: "hot spring", lesson: 10 },
    { word: "のんびりする", reading: "", meaning: "to be at ease, relax", lesson: 10 },
    { word: "リラックスする", reading: "", meaning: "to relax", lesson: 10 },
    { word: "思い出", reading: "おもいで", meaning: "memories", lesson: 10 },
    { word: "記憶", reading: "きおく", meaning: "memory", lesson: 10 },
    { word: "集合する", reading: "しゅうごうする", meaning: "to gather", lesson: 10 },
    { word: "移動する", reading: "いどうする", meaning: "to move, travel", lesson: 10 },
    { word: "チェックインする", reading: "", meaning: "to check in", lesson: 10 },
    { word: "検査する", reading: "けんさする", meaning: "to inspect", lesson: 10 },
    { word: "国内線", reading: "こくないせん", meaning: "domestic flight", lesson: 10 },
    { word: "国際線", reading: "こくさいせん", meaning: "international flight", lesson: 10 },
    { word: "乗り換える", reading: "のりかえる", meaning: "to transfer, change (trains/flights)", lesson: 10 },
    { word: "満員", reading: "まんいん", meaning: "full, fully booked", lesson: 10 },
    { word: "ドライブ", reading: "", meaning: "drive, driving", lesson: 10 },
    { word: "道路", reading: "どうろ", meaning: "road, highway", lesson: 10 },
    { word: "混雑する", reading: "こんざつする", meaning: "to be congested", lesson: 10 },
    { word: "渋滞する", reading: "じゅうたいする", meaning: "to get into a traffic jam", lesson: 10 },
    { word: "スピード", reading: "", meaning: "speed", lesson: 10 },
    { word: "速度", reading: "そくど", meaning: "speed", lesson: 10 },
    { word: "のろのろ", reading: "", meaning: "sluggishly, slowly (ideophonic)", lesson: 10 },
    { word: "信号", reading: "しんごう", meaning: "traffic lights", lesson: 10 },
    { word: "酔う", reading: "よう", meaning: "to get carsick, drunk", lesson: 10 },
    { word: "くたびれる", reading: "", meaning: "to get tired", lesson: 10 },
    { word: "無事", reading: "ぶじ", meaning: "safely, without incident", lesson: 10 },
    { word: "到着する", reading: "とうちゃくする", meaning: "to arrive", lesson: 10 },
    { word: "チケット", reading: "", meaning: "ticket", lesson: 10 },
    { word: "パスポート", reading: "", meaning: "passport", lesson: 10 },
    { word: "シートベルト", reading: "", meaning: "seat-belt", lesson: 10 },

    // 14課 仕事2：コンピューター、郵便、電話など
    { word: "スイッチ", reading: "", meaning: "switch", lesson: 14 },
    { word: "クリックする", reading: "", meaning: "to click", lesson: 14 },
    { word: "マウス", reading: "", meaning: "mouse", lesson: 14 },
    { word: "ボタン", reading: "", meaning: "button", lesson: 14 },
    { word: "ファイル", reading: "", meaning: "file", lesson: 14 },
    { word: "閉じる", reading: "とじる", meaning: "to close", lesson: 14 },
    { word: "画面", reading: "がめん", meaning: "screen", lesson: 14 },
    { word: "表示する", reading: "ひょうじする", meaning: "to display", lesson: 14 },
    { word: "入力する", reading: "にゅうりょくする", meaning: "to input", lesson: 14 },
    { word: "文字", reading: "もじ", meaning: "letter, character", lesson: 14 },
    { word: "数字", reading: "すうじ", meaning: "number, digit", lesson: 14 },
    { word: "パスワード", reading: "", meaning: "password", lesson: 14 },
    { word: "確認する", reading: "かくにんする", meaning: "to confirm", lesson: 14 },
    { word: "メール", reading: "", meaning: "email", lesson: 14 },
    { word: "チェックする", reading: "", meaning: "to check", lesson: 14 },
    { word: "ウェブサイト", reading: "", meaning: "website", lesson: 14 },
    { word: "サイト", reading: "", meaning: "site", lesson: 14 },
    { word: "ホームページ", reading: "", meaning: "website, homepage", lesson: 14 },
    { word: "インターネット", reading: "", meaning: "the internet", lesson: 14 },
    { word: "サービス", reading: "", meaning: "service", lesson: 14 },
    { word: "まとめる", reading: "", meaning: "to summarize", lesson: 14 },
    { word: "基本", reading: "きほん", meaning: "the basics", lesson: 14 },
    { word: "マスターする", reading: "", meaning: "to master", lesson: 14 },
    { word: "書類", reading: "しょるい", meaning: "document", lesson: 14 },
    { word: "郵送する", reading: "ゆうそうする", meaning: "to mail", lesson: 14 },
    { word: "速達", reading: "そくたつ", meaning: "express mail", lesson: 14 },
    { word: "配達する", reading: "はいたつする", meaning: "to deliver", lesson: 14 },
    { word: "郵便", reading: "ゆうびん", meaning: "the post, mail", lesson: 14 },
    { word: "届く", reading: "とどく", meaning: "to arrive, be delivered", lesson: 14 },
    { word: "つながる", reading: "", meaning: "to be connected", lesson: 14 },
    { word: "切れる", reading: "きれる", meaning: "to be cut off", lesson: 14 },
    { word: "しゃべる", reading: "", meaning: "to chat, talk", lesson: 14 },
    { word: "連絡", reading: "れんらく", meaning: "contact", lesson: 14 },
    { word: "携帯電話", reading: "けいたいでんわ", meaning: "cellphone, mobile phone", lesson: 14 },
    { word: "電源", reading: "でんげん", meaning: "power source", lesson: 14 },
    { word: "マナー", reading: "", meaning: "manners, etiquette", lesson: 14 },
    { word: "守る", reading: "まもる", meaning: "to uphold, follow (rules)", lesson: 14 },
    { word: "メッセージ", reading: "", meaning: "message", lesson: 14 },
    { word: "送る", reading: "おくる", meaning: "to send", lesson: 14 },
    { word: "残す", reading: "のこす", meaning: "to leave (a message)", lesson: 14 },
    { word: "再生する", reading: "さいせいする", meaning: "to play, replay", lesson: 14 },
    { word: "ファックス", reading: "", meaning: "fax, facsimile", lesson: 14 },
    { word: "郵便番号", reading: "ゆうびんばんごう", meaning: "zip code, post code", lesson: 14 },
    { word: "送料", reading: "そうりょう", meaning: "postage", lesson: 14 },
    { word: "宅配便", reading: "たくはいびん", meaning: "parcel delivery, home delivery", lesson: 14 },
    { word: "航空便", reading: "こうくうびん", meaning: "airmail", lesson: 14 },
    { word: "船便", reading: "ふなびん", meaning: "sea mail, surface mail", lesson: 14 },

    // 18課 自然1：季節と天気、地理
    { word: "気温", reading: "きおん", meaning: "temperature", lesson: 18 },
    { word: "パーセント", reading: "", meaning: "percent", lesson: 18 },
    { word: "確率", reading: "かくりつ", meaning: "probability", lesson: 18 },
    { word: "嵐", reading: "あらし", meaning: "storm", lesson: 18 },
    { word: "近付く", reading: "ちかづく", meaning: "to approach", lesson: 18 },
    { word: "雷", reading: "かみなり", meaning: "thunder, thunderstorm", lesson: 18 },
    { word: "激しい", reading: "はげしい", meaning: "hard, heavy (rain, etc.)", lesson: 18 },
    { word: "虹", reading: "にじ", meaning: "rainbow", lesson: 18 },
    { word: "湿度", reading: "しつど", meaning: "humidity", lesson: 18 },
    { word: "乾燥する", reading: "かんそうする", meaning: "to be dry", lesson: 18 },
    { word: "明ける", reading: "あける", meaning: "to begin, set in (season)", lesson: 18 },
    { word: "太陽", reading: "たいよう", meaning: "sun", lesson: 18 },
    { word: "まぶしい", reading: "", meaning: "(uncomfortably) bright", lesson: 18 },
    { word: "沈む", reading: "しずむ", meaning: "to set, go down (sun)", lesson: 18 },
    { word: "四季", reading: "しき", meaning: "the four seasons", lesson: 18 },
    { word: "爽やか", reading: "さわやか", meaning: "bracing, refreshing", lesson: 18 },
    { word: "蒸し暑い", reading: "むしあつい", meaning: "hot and humid, muggy", lesson: 18 },
    { word: "梅雨", reading: "つゆ", meaning: "rainy season", lesson: 18 },
    { word: "大陸", reading: "たいりく", meaning: "the continent", lesson: 18 },
    { word: "砂漠", reading: "さばく", meaning: "desert", lesson: 18 },
    { word: "広がる", reading: "ひろがる", meaning: "to expand, spread", lesson: 18 },
    { word: "火山", reading: "かざん", meaning: "volcano", lesson: 18 },
    { word: "爆発する", reading: "ばくはつする", meaning: "to erupt", lesson: 18 },
    { word: "流れる", reading: "ながれる", meaning: "to flow", lesson: 18 },
    { word: "あふれる", reading: "", meaning: "to flood, overflow", lesson: 18 },
    { word: "滝", reading: "たき", meaning: "waterfall", lesson: 18 },
    { word: "眺める", reading: "ながめる", meaning: "to look at, watch", lesson: 18 },
    { word: "湖", reading: "みずうみ", meaning: "lake", lesson: 18 },
    { word: "浮かぶ", reading: "うかぶ", meaning: "to float", lesson: 18 },
    { word: "農業", reading: "のうぎょう", meaning: "agriculture", lesson: 18 },
    { word: "地域", reading: "ちいき", meaning: "region, district", lesson: 18 },
    { word: "都会", reading: "とかい", meaning: "city", lesson: 18 },
    { word: "地方", reading: "ちほう", meaning: "rural area, region", lesson: 18 },
    { word: "田舎", reading: "いなか", meaning: "countryside", lesson: 18 },
    { word: "故郷", reading: "こきょう", meaning: "home, native place", lesson: 18 },
    { word: "離れる", reading: "はなれる", meaning: "to leave, be distant from", lesson: 18 },
    { word: "ふるさと", reading: "", meaning: "home, native place", lesson: 18 },
    { word: "懐かしい", reading: "なつかしい", meaning: "nostalgic, fondly remembered", lesson: 18 },
{ word: "事件", reading: "じけん", meaning: "incident", lesson: 15 },
{ word: "恐ろしい", reading: "おそろしい", meaning: "terrible, frightening", lesson: 15 },
{ word: "重大な", reading: "じゅうだいな", meaning: "serious, grave", lesson: 15 },
{ word: "トラブル", reading: "", meaning: "trouble, hassle", lesson: 15 },
{ word: "だます", reading: "", meaning: "to deceive, cheat", lesson: 15 },
{ word: "殴る", reading: "なぐる", meaning: "to hit, beat", lesson: 15 },
{ word: "撃つ", reading: "うつ", meaning: "to shoot", lesson: 15 },
{ word: "殺す", reading: "ころす", meaning: "to kill", lesson: 15 },
{ word: "受け取る", reading: "うけとる", meaning: "to receive", lesson: 15 },
{ word: "奪う", reading: "うばう", meaning: "to seize, snatch", lesson: 15 },
{ word: "隠す", reading: "かくす", meaning: "to hide", lesson: 15 },
{ word: "怪しい", reading: "あやしい", meaning: "suspicious, fishy", lesson: 15 },
{ word: "様子", reading: "ようす", meaning: "appearance, situation", lesson: 15 },
{ word: "被害", reading: "ひがい", meaning: "damage, harm", lesson: 15 },
{ word: "遭う", reading: "あう", meaning: "to sustain, suffer (misfortune)", lesson: 15 },
{ word: "犯人", reading: "はんにん", meaning: "criminal", lesson: 15 },
{ word: "逮捕する", reading: "たいほする", meaning: "to arrest", lesson: 15 },
{ word: "罪", reading: "つみ", meaning: "crime", lesson: 15 },
{ word: "認める", reading: "みとめる", meaning: "to admit, acknowledge", lesson: 15 },
{ word: "起こる", reading: "おこる", meaning: "to happen, occur", lesson: 15 },
{ word: "ぶつかる", reading: "", meaning: "to bump into, collide", lesson: 15 },
{ word: "ひかれる", reading: "", meaning: "to be run over", lesson: 15 },
{ word: "調査する", reading: "ちょうさする", meaning: "to investigate", lesson: 15 },
{ word: "信号", reading: "しんごう", meaning: "traffic lights", lesson: 15 },
{ word: "無視する", reading: "むしする", meaning: "to ignore", lesson: 15 },
{ word: "歩道", reading: "ほどう", meaning: "sidewalk", lesson: 15 },
{ word: "道路", reading: "どうろ", meaning: "road, highway", lesson: 15 },
{ word: "飛び出す", reading: "とびだす", meaning: "to jump out into", lesson: 15 },
{ word: "スピード", reading: "", meaning: "speed", lesson: 15 },
{ word: "ブレーキ", reading: "", meaning: "brakes", lesson: 15 },
{ word: "転ぶ", reading: "ころぶ", meaning: "to fall over", lesson: 15 },
{ word: "骨", reading: "ほね", meaning: "bone", lesson: 15 },
{ word: "骨折する", reading: "こっせつする", meaning: "to fracture (a bone)", lesson: 15 },
{ word: "気を付ける", reading: "きをつける", meaning: "to be careful", lesson: 15 },
{ word: "防ぐ", reading: "ふせぐ", meaning: "to prevent", lesson: 15 },
{ word: "選挙", reading: "せんきょ", meaning: "election", lesson: 16 },
{ word: "大統領", reading: "だいとうりょう", meaning: "president", lesson: 16 },
{ word: "首相", reading: "しゅしょう", meaning: "prime minister", lesson: 16 },
{ word: "リーダー", reading: "", meaning: "leader", lesson: 16 },
{ word: "国民", reading: "こくみん", meaning: "the people, citizens", lesson: 16 },
{ word: "信頼する", reading: "しんらいする", meaning: "to trust", lesson: 16 },
{ word: "投票", reading: "とうひょう", meaning: "vote, voting", lesson: 16 },
{ word: "権利", reading: "けんり", meaning: "right", lesson: 16 },
{ word: "守る", reading: "まもる", meaning: "to protect (rights), keep (a promise)", lesson: 16 },
{ word: "実現する", reading: "じつげんする", meaning: "to realize, bring about", lesson: 16 },
{ word: "平等な", reading: "びょうどうな", meaning: "fair, equitable", lesson: 16 },
{ word: "公平な", reading: "こうへいな", meaning: "just, fair", lesson: 16 },
{ word: "マスコミ", reading: "", meaning: "the media, mass media", lesson: 16 },
{ word: "批判する", reading: "ひはんする", meaning: "to criticize", lesson: 16 },
{ word: "政府", reading: "せいふ", meaning: "government", lesson: 16 },
{ word: "責任", reading: "せきにん", meaning: "responsibility", lesson: 16 },
{ word: "デモ", reading: "", meaning: "demo, demonstration", lesson: 16 },
{ word: "戦う", reading: "たたかう", meaning: "to fight, make war with", lesson: 16 },
{ word: "攻撃", reading: "こうげき", meaning: "attack", lesson: 16 },
{ word: "景気", reading: "けいき", meaning: "economic conditions", lesson: 16 },
{ word: "物価", reading: "ぶっか", meaning: "price (of commodities)", lesson: 16 },
{ word: "安定する", reading: "あんていする", meaning: "to stabilize", lesson: 16 },
{ word: "売れる", reading: "うれる", meaning: "to sell well", lesson: 16 },
{ word: "定価", reading: "ていか", meaning: "listed/recommended sales price", lesson: 16 },
{ word: "割引", reading: "わりびき", meaning: "discount", lesson: 16 },
{ word: "価格", reading: "かかく", meaning: "price", lesson: 16 },
{ word: "値下げする", reading: "ねさげする", meaning: "to cut the price", lesson: 16 },
{ word: "損をする", reading: "そんをする", meaning: "to take a loss", lesson: 16 },
{ word: "つぶれる", reading: "", meaning: "to collapse, go under (of a company)", lesson: 16 },
{ word: "税金", reading: "ぜいきん", meaning: "tax, taxation", lesson: 16 },
{ word: "電気料金", reading: "でんきりょうきん", meaning: "electricity charge, fee", lesson: 16 },
{ word: "節約する", reading: "せつやくする", meaning: "to save, economize", lesson: 16 },
{ word: "借金", reading: "しゃっきん", meaning: "debt, borrowing", lesson: 16 },
{ word: "預ける", reading: "あずける", meaning: "to deposit", lesson: 16 },
{ word: "貯金する", reading: "ちょきんする", meaning: "to save money", lesson: 16 },
{ word: "無料", reading: "むりょう", meaning: "free, gratis", lesson: 16 },
{ word: "ただ", reading: "", meaning: "free, gratis", lesson: 16 },
{ word: "貧しい", reading: "まずしい", meaning: "poor, impoverished", lesson: 16 },
{ word: "豊かな", reading: "ゆたかな", meaning: "rich, affluent", lesson: 16 },
{ word: "参加する", reading: "さんかする", meaning: "to participate", lesson: 17 },
{ word: "行事", reading: "ぎょうじ", meaning: "regularly-held event, function", lesson: 17 },
{ word: "イベント", reading: "", meaning: "one-time event, function", lesson: 17 },
{ word: "祝う", reading: "いわう", meaning: "to celebrate", lesson: 17 },
{ word: "誕生", reading: "たんじょう", meaning: "birth", lesson: 17 },
{ word: "成人", reading: "せいじん", meaning: "coming-of-age, adulthood", lesson: 17 },
{ word: "過ごす", reading: "すごす", meaning: "to spend, pass (time)", lesson: 17 },
{ word: "クリスマス", reading: "", meaning: "Christmas", lesson: 17 },
{ word: "年末年始", reading: "ねんまつねんし", meaning: "year-end holidays, New Year's", lesson: 17 },
{ word: "伝統", reading: "でんとう", meaning: "tradition", lesson: 17 },
{ word: "飾り", reading: "かざり", meaning: "decorations", lesson: 17 },
{ word: "シーズン", reading: "", meaning: "season", lesson: 17 },
{ word: "卒業式", reading: "そつぎょうしき", meaning: "graduation ceremony", lesson: 17 },
{ word: "運動会", reading: "うんどうかい", meaning: "sports day, athletic meet", lesson: 17 },
{ word: "拍手", reading: "はくしゅ", meaning: "clapping, applause", lesson: 17 },
{ word: "贈る", reading: "おくる", meaning: "to give, present with", lesson: 17 },
{ word: "お祝い", reading: "おいわい", meaning: "congratulatory gift", lesson: 17 },
{ word: "記念品", reading: "きねんひん", meaning: "souvenir, memento", lesson: 17 },
{ word: "信じる", reading: "しんじる", meaning: "to believe", lesson: 17 },
{ word: "宗教", reading: "しゅうきょう", meaning: "religion", lesson: 17 },
{ word: "神", reading: "かみ", meaning: "god", lesson: 17 },
{ word: "未来", reading: "みらい", meaning: "future", lesson: 17 },
{ word: "占う", reading: "うらなう", meaning: "to tell (someone's) fortune", lesson: 17 },
{ word: "占い", reading: "うらない", meaning: "fortune-telling", lesson: 17 },
{ word: "当たる", reading: "あたる", meaning: "to be accurate, get it right (of a fortune)", lesson: 17 },
{ word: "結婚式", reading: "けっこんしき", meaning: "wedding ceremony", lesson: 17 },
{ word: "挙げる", reading: "あげる", meaning: "to hold, arrange (a wedding)", lesson: 17 },
{ word: "葬式", reading: "そうしき", meaning: "funeral", lesson: 17 },
{ word: "手を合わせる", reading: "てをあわせる", meaning: "to put hands together (in prayer)", lesson: 17 },
{ word: "墓", reading: "はか", meaning: "grave, tomb", lesson: 17 },
{ word: "願う", reading: "ねがう", meaning: "to pray for, wish", lesson: 17 },
{ word: "幸せ", reading: "しあわせ", meaning: "happiness, content", lesson: 17 },
{ word: "幸福", reading: "こうふく", meaning: "happiness", lesson: 17 },
{ word: "平和", reading: "へいわ", meaning: "peace", lesson: 17 },
{ word: "運", reading: "うん", meaning: "(good or bad) fortune", lesson: 17 },
{ word: "幸運", reading: "こううん", meaning: "good fortune", lesson: 17 },
{ word: "ラッキーだ", reading: "", meaning: "lucky", lesson: 17 },
{ word: "仏教", reading: "ぶっきょう", meaning: "Buddhism", lesson: 17 },
{ word: "キリスト教", reading: "きりすときょう", meaning: "Christianity", lesson: 17 },
{ word: "イスラム教", reading: "いすらむきょう", meaning: "Islam", lesson: 17 },
{ word: "植物", reading: "しょくぶつ", meaning: "plant", lesson: 19 },
{ word: "育つ", reading: "そだつ", meaning: "grow", lesson: 19 },
{ word: "種", reading: "たね", meaning: "seed", lesson: 19 },
{ word: "植える", reading: "うえる", meaning: "plant (a seed)", lesson: 19 },
{ word: "芽", reading: "め", meaning: "bud, sprout", lesson: 19 },
{ word: "伸びる", reading: "のびる", meaning: "grow bigger, extend", lesson: 19 },
{ word: "当たる", reading: "あたる", meaning: "catch (the sun), hit", lesson: 19 },
{ word: "栄養", reading: "えいよう", meaning: "nutrition", lesson: 19 },
{ word: "与える", reading: "あたえる", meaning: "give", lesson: 19 },
{ word: "成長", reading: "せいちょう", meaning: "growth", lesson: 19 },
{ word: "散る", reading: "ちる", meaning: "scatter, fall (petals)", lesson: 19 },
{ word: "果実", reading: "かじつ", meaning: "fruit", lesson: 19 },
{ word: "採る", reading: "とる", meaning: "pick, harvest", lesson: 19 },
{ word: "新鮮", reading: "しんせん", meaning: "fresh", lesson: 19 },
{ word: "種類", reading: "しゅるい", meaning: "type, variety", lesson: 19 },
{ word: "豊富", reading: "ほうふ", meaning: "be rich in, abundant", lesson: 19 },
{ word: "飼う", reading: "かう", meaning: "keep (a pet)", lesson: 19 },
{ word: "生き物", reading: "いきもの", meaning: "creature, living thing", lesson: 19 },
{ word: "猿", reading: "さる", meaning: "monkey, ape", lesson: 19 },
{ word: "羽", reading: "わ", meaning: "counter for birds", lesson: 19 },
{ word: "鶏", reading: "にわとり", meaning: "chicken, fowl", lesson: 19 },
{ word: "頭", reading: "とう", meaning: "counter for large animals", lesson: 19 },
{ word: "牛", reading: "うし", meaning: "cow, bovine", lesson: 19 },
{ word: "えさ", reading: "", meaning: "feed, pet food", lesson: 19 },
{ word: "観察", reading: "かんさつ", meaning: "observation, observe", lesson: 19 },
{ word: "隠れる", reading: "かくれる", meaning: "hide oneself", lesson: 19 },
{ word: "逃がす", reading: "にがす", meaning: "let go, allow to escape", lesson: 19 },
{ word: "蚊", reading: "か", meaning: "mosquito", lesson: 19 },
{ word: "刺す", reading: "さす", meaning: "bite, sting", lesson: 19 },
{ word: "自然", reading: "しぜん", meaning: "nature, the natural environment", lesson: 19 },
{ word: "守る", reading: "まもる", meaning: "protect, safeguard", lesson: 19 },
{ word: "貴重", reading: "きちょう", meaning: "valuable, precious", lesson: 19 },
{ word: "数", reading: "かず", meaning: "number", lesson: 19 },
{ word: "減る", reading: "へる", meaning: "decrease", lesson: 19 },
{ word: "捕る", reading: "とる", meaning: "catch, take", lesson: 19 },
{ word: "禁止", reading: "きんし", meaning: "prohibition, prohibit", lesson: 19 },
{ word: "量", reading: "りょう", meaning: "amount, quantity", lesson: 20 },
{ word: "増やす", reading: "ふやす", meaning: "increase (something)", lesson: 20 },
{ word: "増す", reading: "ます", meaning: "increase, grow", lesson: 20 },
{ word: "減らす", reading: "へらす", meaning: "reduce, decrease (something)", lesson: 20 },
{ word: "増える", reading: "ふえる", meaning: "increase (in number)", lesson: 20 },
{ word: "減る", reading: "へる", meaning: "decrease", lesson: 20 },
{ word: "倍", reading: "ばい", meaning: "times, -fold", lesson: 20 },
{ word: "余る", reading: "あまる", meaning: "be left over, be in excess", lesson: 20 },
{ word: "不足", reading: "ふそく", meaning: "shortage, run short of", lesson: 20 },
{ word: "余裕", reading: "よゆう", meaning: "leeway, room for", lesson: 20 },
{ word: "数える", reading: "かぞえる", meaning: "count", lesson: 20 },
{ word: "人数", reading: "にんずう", meaning: "number of people", lesson: 20 },
{ word: "個数", reading: "こすう", meaning: "number of items", lesson: 20 },
{ word: "回数", reading: "かいすう", meaning: "number of times", lesson: 20 },
{ word: "台数", reading: "だいすう", meaning: "number of machines", lesson: 20 },
{ word: "測る", reading: "はかる", meaning: "measure (distance, area, time)", lesson: 20 },
{ word: "距離", reading: "きょり", meaning: "distance", lesson: 20 },
{ word: "面積", reading: "めんせき", meaning: "area", lesson: 20 },
{ word: "時間", reading: "じかん", meaning: "time", lesson: 20 },
{ word: "量る", reading: "はかる", meaning: "weigh", lesson: 20 },
{ word: "記録", reading: "きろく", meaning: "record", lesson: 20 },
{ word: "大量", reading: "たいりょう", meaning: "large amount of", lesson: 20 },
{ word: "少量", reading: "しょうりょう", meaning: "small amount of", lesson: 20 },
{ word: "多数", reading: "たすう", meaning: "majority", lesson: 20 },
{ word: "少数", reading: "しょうすう", meaning: "minority", lesson: 20 },
{ word: "気温", reading: "きおん", meaning: "temperature (air)", lesson: 20 },
{ word: "マイナス", reading: "", meaning: "minus, below zero", lesson: 20 },
{ word: "プラス", reading: "", meaning: "plus, above zero", lesson: 20 },
{ word: "レベル", reading: "", meaning: "level", lesson: 20 },
{ word: "サイズ", reading: "", meaning: "size", lesson: 20 },
{ word: "最大", reading: "さいだい", meaning: "maximum, greatest", lesson: 20 },
{ word: "最小", reading: "さいしょう", meaning: "minimum, smallest", lesson: 20 },
{ word: "温度", reading: "おんど", meaning: "temperature", lesson: 20 },
{ word: "最高", reading: "さいこう", meaning: "highest", lesson: 20 },
{ word: "最低", reading: "さいてい", meaning: "lowest", lesson: 20 },
{ word: "平均", reading: "へいきん", meaning: "average", lesson: 20 },
{ word: "たっぷり", reading: "", meaning: "plenty of, amply", lesson: 20 },
{ word: "少々", reading: "しょうしょう", meaning: "a little", lesson: 20 },
{ word: "加える", reading: "くわえる", meaning: "add", lesson: 20 },
{ word: "すべて", reading: "", meaning: "all, everything", lesson: 20 },
{ word: "全員", reading: "ぜんいん", meaning: "everybody, all members", lesson: 20 },
{ word: "合計", reading: "ごうけい", meaning: "total", lesson: 20 },
{ word: "計算", reading: "けいさん", meaning: "calculation", lesson: 20 },
{ word: "経つ", reading: "たつ", meaning: "elapse, pass (time)", lesson: 21 },
{ word: "時刻", reading: "じこく", meaning: "time, time of day", lesson: 21 },
{ word: "時期", reading: "じき", meaning: "time, season", lesson: 21 },
{ word: "期間", reading: "きかん", meaning: "period, duration", lesson: 21 },
{ word: "期限", reading: "きげん", meaning: "deadline, due date", lesson: 21 },
{ word: "切れる", reading: "きれる", meaning: "run out, expire", lesson: 21 },
{ word: "短期", reading: "たんき", meaning: "short-term", lesson: 21 },
{ word: "長期", reading: "ちょうき", meaning: "long-term", lesson: 21 },
{ word: "日中", reading: "にっちゅう", meaning: "during the day, daytime", lesson: 21 },
{ word: "夜間", reading: "やかん", meaning: "night-time", lesson: 21 },
{ word: "日時", reading: "にちじ", meaning: "date and time", lesson: 21 },
{ word: "日程", reading: "にってい", meaning: "schedule", lesson: 21 },
{ word: "年間", reading: "ねんかん", meaning: "yearly, annual", lesson: 21 },
{ word: "延期", reading: "えんき", meaning: "postponement, postpone", lesson: 21 },
{ word: "合わせる", reading: "あわせる", meaning: "synchronize (a clock)", lesson: 21 },
{ word: "日付", reading: "ひづけ", meaning: "date, day of the month", lesson: 21 },
{ word: "セット", reading: "", meaning: "setting, set (an alarm)", lesson: 21 },
{ word: "アラーム", reading: "", meaning: "alarm", lesson: 21 },
{ word: "目覚まし時計", reading: "めざましどけい", meaning: "alarm clock", lesson: 21 },
{ word: "前回", reading: "ぜんかい", meaning: "previous time, last time", lesson: 21 },
{ word: "今回", reading: "こんかい", meaning: "this time", lesson: 21 },
{ word: "次回", reading: "じかい", meaning: "next time", lesson: 21 },
{ word: "以前", reading: "いぜん", meaning: "before ~", lesson: 21 },
{ word: "以後", reading: "いご", meaning: "after ~, from now on", lesson: 21 },
{ word: "前後", reading: "ぜんご", meaning: "approximately, about ~", lesson: 21 },
{ word: "前日", reading: "ぜんじつ", meaning: "previous day", lesson: 21 },
{ word: "当日", reading: "とうじつ", meaning: "the day in question, that day", lesson: 21 },
{ word: "翌日", reading: "よくじつ", meaning: "following day, next day", lesson: 21 },
{ word: "平日", reading: "へいじつ", meaning: "weekday", lesson: 21 },
{ word: "週末", reading: "しゅうまつ", meaning: "weekend", lesson: 21 },
{ word: "昨年", reading: "さくねん", meaning: "last year", lesson: 21 },
{ word: "翌年", reading: "よくねん", meaning: "following year, next year", lesson: 21 },
{ word: "過去", reading: "かこ", meaning: "the past", lesson: 21 },
{ word: "現在", reading: "げんざい", meaning: "currently, at the moment", lesson: 21 },
{ word: "未来", reading: "みらい", meaning: "the future", lesson: 21 },
{ word: "現代", reading: "げんだい", meaning: "contemporary, modern", lesson: 21 },
{ word: "間もなく", reading: "まもなく", meaning: "soon, shortly", lesson: 21 },
{ word: "突然", reading: "とつぜん", meaning: "suddenly, sudden", lesson: 21 },
{
  "word": "歯が生える",
  "reading": "はがはえる",
  "meaning": "Grow, emerge",
  "lesson": 22
},
{
  "word": "スープが冷める",
  "reading": "スープがさめる",
  "meaning": "Cool down",
  "lesson": 22
},
{
  "word": "家が燃える",
  "reading": "いえがもえる",
  "meaning": "Burn",
  "lesson": 22
},
{
  "word": "服が目立つ",
  "reading": "ふくがめだつ",
  "meaning": "Stand out",
  "lesson": 22
},
{
  "word": "星が輝く",
  "reading": "ほしがかがやく",
  "meaning": "Shine, gleam, beam",
  "lesson": 22
},
{
  "word": "黙って、話を聞く",
  "reading": "だまって、はなしをきく",
  "meaning": "Keep quiet, shut up",
  "lesson": 22
},
{
  "word": "水がたまる",
  "reading": "みずがたまる",
  "meaning": "Build up, accumulate",
  "lesson": 22
},
{
  "word": "薬がよく効く",
  "reading": "くすりがよくきく",
  "meaning": "Be effective, take effect",
  "lesson": 22
},
{
  "word": "社長が代わる",
  "reading": "しゃちょうがかわる",
  "meaning": "Replace, take place of",
  "lesson": 22
},
{
  "word": "親に頼る",
  "reading": "おやにたよる",
  "meaning": "Depend on, rely on",
  "lesson": 22
},
{
  "word": "彼の言葉にうなずく",
  "reading": "かれのことばにうなずく",
  "meaning": "Nod (agreement)",
  "lesson": 22
},
{
  "word": "ゲームに飽きる",
  "reading": "ゲームにあきる",
  "meaning": "Get bored with, tire of",
  "lesson": 22
},
{
  "word": "大きな声で叫ぶ",
  "reading": "おおきなこえでさけぶ",
  "meaning": "Shout, call",
  "lesson": 22
},
{
  "word": "車で空港に向かう",
  "reading": "くるまでくうこうにむかう",
  "meaning": "Head for, depart for",
  "lesson": 22
},
{
  "word": "油は水に浮く",
  "reading": "あぶらはみずにうく",
  "meaning": "Float",
  "lesson": 22
},
{
  "word": "ガムが靴にくっつく",
  "reading": "ガムがくつにくっつく",
  "meaning": "Stick to",
  "lesson": 22
},
{
  "word": "ボールを握る",
  "reading": "ボールをにぎる",
  "meaning": "Grasp, hold onto",
  "lesson": 22
},
{
  "word": "皿を重ねる",
  "reading": "さらをかさねる",
  "meaning": "Pile, stack",
  "lesson": 22
},
{
  "word": "新聞をひもで縛る",
  "reading": "しんぶんをひもでしばる",
  "meaning": "Tie, bind",
  "lesson": 22
},
{
  "word": "池を石で囲む",
  "reading": "いけをいしでかこむ",
  "meaning": "Surround, ring",
  "lesson": 22
},
{
  "word": "犬がボールを追う",
  "reading": "いぬがボールをおう",
  "meaning": "Chase, pursue",
  "lesson": 22
},
{
  "word": "物を大切に扱う",
  "reading": "ものをたいせつにあつかう",
  "meaning": "Handle, treat",
  "lesson": 22
},
{
  "word": "電話代を支払う",
  "reading": "でんわだいをしはらう",
  "meaning": "Pay",
  "lesson": 22
},
{
  "word": "若い人は肉料理を好む",
  "reading": "わかいひとはにくりょうりをこのむ",
  "meaning": "Like, be fond of",
  "lesson": 22
},
{
  "word": "そばを食う",
  "reading": "そばをくう",
  "meaning": "Eat",
  "lesson": 22
},
{
  "word": "人を指で指す",
  "reading": "ひとをゆびでさす",
  "meaning": "Show, point",
  "lesson": 22
},
{
  "word": "地図で場所を示す",
  "reading": "ちずでばしょをしめす",
  "meaning": "Show, indicate, represent",
  "lesson": 22
},
{
  "word": "夢を語る",
  "reading": "ゆめをかたる",
  "meaning": "Relate, talk about",
  "lesson": 22
},
{
  "word": "楽しい時間を過ごす",
  "reading": "たのしいじかんをすごす",
  "meaning": "Spend, pass",
  "lesson": 22
},
{
  "word": "出発を1日延ばす",
  "reading": "しゅっぱつをいちにちのばす",
  "meaning": "Extend, draw out",
  "lesson": 22
},
{
  "word": "優勝を目指す",
  "reading": "ゆうしょうをめざす",
  "meaning": "Aim for",
  "lesson": 22
},
{
  "word": "警察に助けを求める",
  "reading": "けいさつにたすけをもとめる",
  "meaning": "Seek, ask for",
  "lesson": 22
},
{
  "word": "子供を可愛がる",
  "reading": "こどもをかわいがる",
  "meaning": "Treat with affection",
  "lesson": 22
},
{
  "word": "弟をいじめる",
  "reading": "おとうといじめる",
  "meaning": "Bully, mistreat",
  "lesson": 22
},
{
  "word": "機械を発明する",
  "reading": "きかいをはつめいする",
  "meaning": "Invention; invent",
  "lesson": 23
},
{
  "word": "船を製造する",
  "reading": "ふねをせいぞうする",
  "meaning": "Manufacturing; manufacture",
  "lesson": 23
},
{
  "word": "映画を制作する",
  "reading": "えいがをせいさくする",
  "meaning": "Production; produce",
  "lesson": 23
},
{
  "word": "写真を印刷する",
  "reading": "しゃしんをいんさつする",
  "meaning": "Printing; print",
  "lesson": 23
},
{
  "word": "本を出版する",
  "reading": "ほんをしゅっぱんする",
  "meaning": "Publishing; publish",
  "lesson": 23
},
{
  "word": "ゴミを回収する",
  "reading": "ゴミをかいしゅうする",
  "meaning": "Collection; collect",
  "lesson": 23
},
{
  "word": "将来の自分を想像する",
  "reading": "しょうらいのじぶんをそうぞうする",
  "meaning": "Imagination; imagine",
  "lesson": 23
},
{
  "word": "自分がしたことを反省する",
  "reading": "じぶんがしたことをはんせいする",
  "meaning": "Rueful reflection on, self-examination; reflect ruefully on",
  "lesson": 23
},
{
  "word": "病院に行くかを判断する",
  "reading": "びょういんにいくかをはんだんする",
  "meaning": "Judgment; judge",
  "lesson": 23
},
{
  "word": "お客さんを歓迎する",
  "reading": "おきゃくさんをかんげいする",
  "meaning": "Welcome (n); welcome (v)",
  "lesson": 23
},
{
  "word": "犬を訓練する",
  "reading": "いぬをくんれんする",
  "meaning": "Training; exercise; train, exercise",
  "lesson": 23
},
{
  "word": "授業を選択する",
  "reading": "じゅぎょうをせんたくする",
  "meaning": "Choice; choose",
  "lesson": 23
},
{
  "word": "レポートを評価する",
  "reading": "レポートをひょうかする",
  "meaning": "Evaluation, assessment; evaluate, assess",
  "lesson": 23
},
{
  "word": "お金を管理する",
  "reading": "おかねをかんりする",
  "meaning": "Management; manage",
  "lesson": 23
},
{
  "word": "会社を経営する",
  "reading": "かいしゃをけいえいする",
  "meaning": "Running, management; run, manage",
  "lesson": 23
},
{
  "word": "問題を解決する",
  "reading": "もんだいをかいけつする",
  "meaning": "Settlement, solution; settle, resolve",
  "lesson": 23
},
{
  "word": "事故を防止する",
  "reading": "じこをぼうしする",
  "meaning": "Prevention; prevent",
  "lesson": 23
},
{
  "word": "アメリカを訪問する",
  "reading": "アメリカをほうもんする",
  "meaning": "Visit (n); visit (v)",
  "lesson": 23
},
{
  "word": "円をドルに交換する",
  "reading": "えんをドルにこうかんする",
  "meaning": "Exchange (n); exchange (v)",
  "lesson": 23
},
{
  "word": "英語を日本語に翻訳する",
  "reading": "えいごをにほんごにほんやくする",
  "meaning": "Translation; translate",
  "lesson": 23
},
{
  "word": "悪いところに薬を使用する",
  "reading": "わるいところにくすりをしようする",
  "meaning": "Use, application; use, apply",
  "lesson": 23
},
{
  "word": "部長に問題を報告する",
  "reading": "ぶちょうにもんだいをほうこくする",
  "meaning": "Report (n); report (v)",
  "lesson": 23
},
{
  "word": "相手に自分の意見を主張する",
  "reading": "あいてにじぶんのいけんをしゅちょうする",
  "meaning": "Assertion; assert",
  "lesson": 23
},
{
  "word": "彼の意見に賛成する",
  "reading": "かれのいけんにさんせいする",
  "meaning": "Approval, agreement; approve, agree",
  "lesson": 23
},
{
  "word": "彼女に協力する",
  "reading": "かのじょにきょうりょくする",
  "meaning": "Cooperation; cooperate",
  "lesson": 23
},
{
  "word": "中国の会社に注目する",
  "reading": "ちゅうごくのかいしゃにちゅうもくする",
  "meaning": "Focus (n); focus (v)",
  "lesson": 23
},
{
  "word": "ルールに違反する",
  "reading": "ルールにいはんする",
  "meaning": "Breach, violation; breach, violate",
  "lesson": 23
},
{
  "word": "大阪に出張する",
  "reading": "おおさかにしゅっちょうする",
  "meaning": "Business or official trip; go on a business or official trip",
  "lesson": 23
},
{
  "word": "色が変化する",
  "reading": "いろがへんかする",
  "meaning": "Change (n); change (v)",
  "lesson": 23
},
{
  "word": "電車が停止する",
  "reading": "でんしゃがていしする",
  "meaning": "Stop (n); stop (v)",
  "lesson": 23
},
{
  "word": "経済が発展する",
  "reading": "けいざいがはってんする",
  "meaning": "Development; develop",
  "lesson": 23
},
{
  "word": "技術が進歩する",
  "reading": "ぎじゅつがしんぽする",
  "meaning": "Progress; make progress",
  "lesson": 23
},
{
  "word": "大きな問題が存在する",
  "reading": "おおきなもんだいがそんざいする",
  "meaning": "Existence, presence; exist, be present",
  "lesson": 23
},
{
  "word": "社長が引退する",
  "reading": "しゃちょうがいんたいする",
  "meaning": "Retirement; retire",
  "lesson": 23
},
{
  "word": "よく考えて行動する",
  "reading": "よくかんがえてこうどうする",
  "meaning": "Behavior; behave, act",
  "lesson": 23
},
{
  "word": "夜に活動する動物",
  "reading": "よるにかつどうするどうぶつ",
  "meaning": "Be active, engagement in; engage in (activity)",
  "lesson": 23
},
{
  "word": "背中がかゆい",
  "reading": "せなかがかゆい",
  "meaning": "Itchy",
  "lesson": 24
},
{
  "word": "太陽がまぶしい",
  "reading": "たいようがまぶしい",
  "meaning": "(Uncomfortably) bright",
  "lesson": 24
},
{
  "word": "スカートがきつい",
  "reading": "",
  "meaning": "Tight, tough (job)",
  "lesson": 24
},
{
  "word": "昔が懐かしい",
  "reading": "むかしがなつかしい",
  "meaning": "Prompting nostalgia, prompting fond memories",
  "lesson": 24
},
{
  "word": "失敗して、悔しい",
  "reading": "しっぱいして、くやしい",
  "meaning": "Vexing, regrettable",
  "lesson": 24
},
{
  "word": "恐ろしい事件",
  "reading": "おそろしいじけん",
  "meaning": "Terrible",
  "lesson": 24
},
{
  "word": "怪しい男",
  "reading": "あやしいおとこ",
  "meaning": "Suspicious, fishy",
  "lesson": 24
},
{
  "word": "親しい友人",
  "reading": "したしいゆうじん",
  "meaning": "Close, intimate",
  "lesson": 24
},
{
  "word": "大人しい子供",
  "reading": "おとなしいこども",
  "meaning": "Meek, compliant",
  "lesson": 24
},
{
  "word": "パソコンに詳しい人",
  "reading": "パソコンにくわしいひと",
  "meaning": "Well versed in",
  "lesson": 24
},
{
  "word": "味がしつこい",
  "reading": "あじがしつこい",
  "meaning": "Too rich, cloying",
  "lesson": 24
},
{
  "word": "鋭いナイフ",
  "reading": "するどいナイフ",
  "meaning": "Sharp",
  "lesson": 24
},
{
  "word": "鈍い人",
  "reading": "にぶいひと",
  "meaning": "Slow-moving, dull-witted",
  "lesson": 24
},
{
  "word": "貧しい国",
  "reading": "まずしいくに",
  "meaning": "Poor, impoverished",
  "lesson": 24
},
{
  "word": "激しい雨",
  "reading": "はげしいあめ",
  "meaning": "Hard, intense",
  "lesson": 24
},
{
  "word": "お金がもったいない",
  "reading": "おかねがもったいない",
  "meaning": "A waste of (money, time)",
  "lesson": 24
},
{
  "word": "とんでもない事件",
  "reading": "とんでもないじけん",
  "meaning": "Dreadful, awful",
  "lesson": 24
},
{
  "word": "怒っても仕様がない",
  "reading": "おこってもしょうがない",
  "meaning": "Inevitable, cannot be helped",
  "lesson": 24
},
{
  "word": "わがままな子供",
  "reading": "わがままなこども",
  "meaning": "Selfish",
  "lesson": 24
},
{
  "word": "意地悪な姉",
  "reading": "いじわるなあね",
  "meaning": "Spiteful, ill-natured",
  "lesson": 24
},
{
  "word": "下品な男",
  "reading": "げひんなおとこ",
  "meaning": "Vulgar, coarse",
  "lesson": 24
},
{
  "word": "乱暴な運転",
  "reading": "らんぼうなうんてん",
  "meaning": "Rough, rude, violent",
  "lesson": 24
},
{
  "word": "派手な服",
  "reading": "はでなふく",
  "meaning": "Flashy, showy",
  "lesson": 24
},
{
  "word": "地味な色",
  "reading": "じみないろ",
  "meaning": "Plain, drab",
  "lesson": 24
},
{
  "word": "おしゃれなレストラン",
  "reading": "",
  "meaning": "Fashionable, smart",
  "lesson": 24
},
{
  "word": "素敵な結婚式",
  "reading": "すてきなけっこんしき",
  "meaning": "Nice, pleasant",
  "lesson": 24
},
{
  "word": "楽な仕事",
  "reading": "らくなしごと",
  "meaning": "Easy",
  "lesson": 24
},
{
  "word": "豊かな生活",
  "reading": "ゆたかなせいかつ",
  "meaning": "Rich, affluent",
  "lesson": 24
},
{
  "word": "穏やかな天気",
  "reading": "おだやかなてんき",
  "meaning": "Mild, gentle",
  "lesson": 24
},
{
  "word": "ゲームに夢中だ",
  "reading": "ゲームにむちゅうだ",
  "meaning": "Fully absorbed in, crazy about",
  "lesson": 24
},
{
  "word": "飛行機が無事に着く",
  "reading": "ひこうきがぶじにつく",
  "meaning": "Safely, without incident",
  "lesson": 24
},
{
  "word": "平気で嘘をつく",
  "reading": "へいきでうそをつく",
  "meaning": "Unconcerned, not worried",
  "lesson": 24
},
{
  "word": "人の迷惑になる",
  "reading": "ひとのめいわくになる",
  "meaning": "Annoyance, trouble",
  "lesson": 24
},
{
  "word": "東京までおよそ50分で着く",
  "reading": "とうきょうまでおよそごじゅっぷんでつく",
  "meaning": "About, approximately",
  "lesson": 25
},
{
  "word": "その時計はかなり高そうだ",
  "reading": "そのとけいはかなりたかそうだ",
  "meaning": "Rather, substantially, considerably",
  "lesson": 25
},
{
  "word": "熱が多少下がった",
  "reading": "ねつがたしょうさがった",
  "meaning": "Somewhat",
  "lesson": 25
},
{
  "word": "電気がすべて消えた",
  "reading": "でんきがすべてきえた",
  "meaning": "All",
  "lesson": 25
},
{
  "word": "まったく日本語が話せない",
  "reading": "まったくにほんごがはなせない",
  "meaning": "Absolutely, completely",
  "lesson": 25
},
{
  "word": "一度にたくさんの本を運ぶ",
  "reading": "いちどにたくさんのほんをはこぶ",
  "meaning": "At once, simultaneously",
  "lesson": 25
},
{
  "word": "偶然先生に会った",
  "reading": "ぐうぜんせんせいにあった",
  "meaning": "By chance, by accident",
  "lesson": 25
},
{
  "word": "たまにそばを食べる",
  "reading": "たまにそばをたべる",
  "meaning": "Occasionally, rarely",
  "lesson": 25
},
{
  "word": "新しい服を早速着てみた",
  "reading": "あたらしいふくをさっそくきてみた",
  "meaning": "Immediately, straightaway",
  "lesson": 25
},
{
  "word": "実はお金がない",
  "reading": "じつはおかねがない",
  "meaning": "In truth, in fact",
  "lesson": 25
},
{
  "word": "実際に料理を作ってみる",
  "reading": "じっさいにりょうりをつくってみる",
  "meaning": "Actually, really",
  "lesson": 25
},
{
  "word": "案外レストランはすいていた",
  "reading": "あんがいレストランはすいていた",
  "meaning": "Unexpectedly",
  "lesson": 25
},
{
  "word": "少なくとも1時間は勉強している",
  "reading": "すくなくともいちじかんはべんきょうしている",
  "meaning": "At least",
  "lesson": 25
},
{
  "word": "せっかく作ったのに、誰も食べない",
  "reading": "せっかくつくったのに、だれもたべない",
  "meaning": "Expressly, specially",
  "lesson": 25
},
{
  "word": "確か森さんは39歳だったと思う",
  "reading": "たしかもりさんはさんじゅうきゅうさいだったとおもう",
  "meaning": "Certainly, no doubt",
  "lesson": 25
},
{
  "word": "ともかく・とにかく遅れないで",
  "reading": "ともかく・とにかくおくれないで",
  "meaning": "Anyway, at any rate",
  "lesson": 25
},
{
  "word": "思い切り・思いっ切り泳ぎたい",
  "reading": "おもいきり・おもいっきりおよぎたい",
  "meaning": "(I) so much (want to)",
  "lesson": 25
},
{
  "word": "兄はわざと負けてくれた",
  "reading": "あにはわざとまけてくれた",
  "meaning": "Deliberately, on purpose",
  "lesson": 25
},
{
  "word": "まさか雨が降るとは思わなかった",
  "reading": "まさかあめがふるとはおもわなかった",
  "meaning": "That's exactly what I wasn't (expecting)",
  "lesson": 25
},
{
  "word": "まるで子供みたいだ",
  "reading": "まるでこどもみたいだ",
  "meaning": "Completely, just as if",
  "lesson": 25
},
{
  "word": "もしかしたら行けないかもしれない",
  "reading": "もしかしたらいけないかもしれない",
  "meaning": "Might well, very likely",
  "lesson": 25
},
{
  "word": "もしも怪我をしたら、大変だ",
  "reading": "もしもけがをしたら、たいへんだ",
  "meaning": "If",
  "lesson": 25
},
{
  "word": "いくら探しても、見つからない",
  "reading": "いくらさがしても、みつからない",
  "meaning": "However much, however many",
  "lesson": 25
},
{
  "word": "どうしても思い出せない",
  "reading": "どうしてもおもいだせない",
  "meaning": "I just cannot (remember)",
  "lesson": 25
},
{
  "word": "別に困っていない",
  "reading": "べつにこまっていない",
  "meaning": "Not particularly",
  "lesson": 25
},
{
  "word": "何で怒っているのか",
  "reading": "なんでおこっているのか",
  "meaning": "Why? What for?",
  "lesson": 25
},
{
  "word": "間もなくバスが来る",
  "reading": "まもなくバスがくる",
  "meaning": "Soon",
  "lesson": 25
},
{
  "word": "いよいよ試合が始まる",
  "reading": "いよいよしあいがはじまる",
  "meaning": "At last, finally",
  "lesson": 25
},
{
  "word": "そろそろ寝る時間だ",
  "reading": "そろそろねるじかんだ",
  "meaning": "Polite expression used to indicate that the time for leaving or going to bed, etc., is approaching",
  "lesson": 25
},
{
  "word": "さっき食べたばかりだ",
  "reading": "さっきたべたばかりだ",
  "meaning": "Just now, a few moments ago",
  "lesson": 25
},
{
  "word": "しばらく駅で待っていた",
  "reading": "しばらくえきでまっていた",
  "meaning": "For a while, for the moment",
  "lesson": 25
},
{
  "word": "今にも雨が降りそうだ",
  "reading": "いまにもあめがふりそうだ",
  "meaning": "At any moment, imminently",
  "lesson": 25
},
{
  "word": "頑張ったが、結局だめだった",
  "reading": "がんばったが、けっきょくだめだった",
  "meaning": "In the end, as it turned out",
  "lesson": 25
},
{
  "word": "二人はとうとう別れた",
  "reading": "ふたりはとうとうわかれた",
  "meaning": "Finally, at length",
  "lesson": 25
},
{
  "word": "ようやく病気が治った",
  "reading": "ようやくびょうきがなおった",
  "meaning": "Eventually, finally",
  "lesson": 25
},
{
  "word": "ついに答えが見つかった",
  "reading": "ついにこたえがみつかった",
  "meaning": "At long last, finally",
  "lesson": 25
},
{
  "word": "ぐっすり寝る",
  "reading": "ぐっすりねる",
  "meaning": "Soundly, fast (asleep)",
  "lesson": 26
},
{
  "word": "じっと見る／じっとする",
  "reading": "じっとみる／じっとする",
  "meaning": "Expresses fixity of look (staring), or quiet endurance",
  "lesson": 26
},
{
  "word": "じろじろ見る",
  "reading": "じろじろみる",
  "meaning": "Expresses fixity of look (staring)",
  "lesson": 26
},
{
  "word": "にっこり笑う",
  "reading": "にっこりわらう",
  "meaning": "Smile",
  "lesson": 26
},
{
  "word": "のろのろ歩く",
  "reading": "のろのろあるく",
  "meaning": "Sluggish; expresses slowness, heaviness",
  "lesson": 26
},
{
  "word": "うっかり忘れる",
  "reading": "うっかりわすれる",
  "meaning": "Expresses carelessness or forgetfulness",
  "lesson": 26
},
{
  "word": "こっそりお酒を飲む",
  "reading": "こっそりおさけをのむ",
  "meaning": "Secretly, stealthily",
  "lesson": 26
},
{
  "word": "そっとドアを閉める",
  "reading": "そっとドアをしめる",
  "meaning": "Softly, furtively",
  "lesson": 26
},
{
  "word": "一日中ごろごろしている",
  "reading": "いちにちじゅうごろごろしている",
  "meaning": "Expresses idling, lounging around",
  "lesson": 26
},
{
  "word": "いつもにこにこしている",
  "reading": "",
  "meaning": "Expresses smiling manner",
  "lesson": 26
},
{
  "word": "バスが来なくて、いらいらする",
  "reading": "バスがこなくて、いらいらする",
  "meaning": "Expresses state of annoyance, frustration",
  "lesson": 26
},
{
  "word": "恋人が出来て、うきうきしている",
  "reading": "こいびとができて、うきうきしている",
  "meaning": "Expresses state of cheerfulness, lightheartedness",
  "lesson": 26
},
{
  "word": "発表があるので、どきどきする",
  "reading": "はっぴょうがあるので、どきどきする",
  "meaning": "Expresses pulsation, throbbing",
  "lesson": 26
},
{
  "word": "明日から旅行で、わくわくしている",
  "reading": "あしたからりょこうで、わくわくしている",
  "meaning": "Expresses state of excitement, nervousness",
  "lesson": 26
},
{
  "word": "試合に負けて、がっかりしている",
  "reading": "しあいにまけて、がっかりしている",
  "meaning": "Expresses sense of disappointment",
  "lesson": 26
},
{
  "word": "テストが終わって、ほっとしている",
  "reading": "テストがおわって、ほっとしている",
  "meaning": "Expresses sense of relief",
  "lesson": 26
},
{
  "word": "熱が高くて、ふらふらする",
  "reading": "ねつがたかくて、ふらふらする",
  "meaning": "Feel dizzy, unstable",
  "lesson": 26
},
{
  "word": "英語がぺらぺらだ",
  "reading": "えいごがぺらぺらだ",
  "meaning": "Expresses fluency in a language",
  "lesson": 26
},
{
  "word": "ぐんぐん背が伸びる",
  "reading": "ぐんぐんせがのびる",
  "meaning": "Expresses steady growth or improvement",
  "lesson": 26
},
{
  "word": "仕事にすっかり慣れる",
  "reading": "しごとにすっかりなれる",
  "meaning": "Expresses completeness, wholeness",
  "lesson": 26
},
{
  "word": "サイズがぴったり合う",
  "reading": "サイズがぴったりあう",
  "meaning": "Expresses exactness (of fit), perfection",
  "lesson": 26
},
{
  "word": "授業にぎりぎり間に合う",
  "reading": "じゅぎょうにぎりぎりまにあう",
  "meaning": "Used for when a situation is touch-and-go, or time is running out, or when something is a close call",
  "lesson": 26
},
{
  "word": "朝御飯をしっかり食べる",
  "reading": "あさごはんをしっかりたべる",
  "meaning": "Properly, rigorously",
  "lesson": 26
},
{
  "word": "靴をぴかぴかに磨く",
  "reading": "くつをぴかぴかにみがく",
  "meaning": "Expresses brightness, shininess",
  "lesson": 26
},
{
  "word": "お菓子がぎっしり入っている",
  "reading": "おかしがぎっしりはいっている",
  "meaning": "Expresses tightness, closeness (of packing or stacking)",
  "lesson": 26
},
{
  "word": "野菜がたっぷり入っている",
  "reading": "やさいがたっぷりはいっている",
  "meaning": "Plenty of",
  "lesson": 26
},
{
  "word": "味がさっぱりしている",
  "reading": "あじがさっぱりしている",
  "meaning": "Expresses sense of refreshment or tidiness, neatness",
  "lesson": 26
},
{
  "word": "机の上がごちゃごちゃしている",
  "reading": "つくえのうえがごちゃごちゃしている",
  "meaning": "Expresses messiness, confusion, disorder",
  "lesson": 26
},
{
  "word": "事故で車がめちゃくちゃになる",
  "reading": "じこでくるまがめちゃくちゃになる",
  "meaning": "Expresses messiness, confusion, disorder",
  "lesson": 26
},
{
  "word": "教室がしんと・しいんとなる",
  "reading": "きょうしつがしんと・しいんとなる",
  "meaning": "Expresses silence, stillness",
  "lesson": 26
},
{
  "word": "服がぼろぼろだ",
  "reading": "ふくがぼろぼろだ",
  "meaning": "Expresses worn-out or tattered state",
  "lesson": 26
},
{
  "word": "星がきらきら光る",
  "reading": "ほしがきらきらひかる",
  "meaning": "Expresses sparkling or twinkling quality",
  "lesson": 26
},
{
  "word": "電車ががらがらだ",
  "reading": "でんしゃががらがらだ",
  "meaning": "Expresses emptiness, lack of (passengers, customers, etc.)",
  "lesson": 26
},
{
  "word": "歯がぐらぐらする",
  "reading": "はがぐらぐらする",
  "meaning": "Be wobbly, unsteady",
  "lesson": 26
},
{
  "word": "みんな意見がばらばらだ",
  "reading": "みんないけんがばらばらだ",
  "meaning": "Expresses diversity, disparity, variety",
  "lesson": 26
},
{
  "word": "お母さんにそっくりだ",
  "reading": "おかあさんにそっくりだ",
  "meaning": "Expresses close resemblance",
  "lesson": 26
},
{
  "word": "一流",
  "reading": "いちりゅう",
  "meaning": "first-rate",
  "lesson": 27
},
{
  "word": "一部",
  "reading": "いちぶ",
  "meaning": "some of",
  "lesson": 27
},
{
  "word": "最新",
  "reading": "さいしん",
  "meaning": "latest",
  "lesson": 27
},
{
  "word": "最終",
  "reading": "さいしゅう",
  "meaning": "last, final",
  "lesson": 27
},
{
  "word": "流行",
  "reading": "りゅうこう",
  "meaning": "fashion, fad",
  "lesson": 27
},
{
  "word": "実際",
  "reading": "じっさい",
  "meaning": "actual, real",
  "lesson": 27
},
{
  "word": "頭痛",
  "reading": "ずつう",
  "meaning": "headache",
  "lesson": 27
},
{
  "word": "余裕",
  "reading": "よゆう",
  "meaning": "leeway, scope, room for",
  "lesson": 27
},
{
  "word": "安定",
  "reading": "あんてい",
  "meaning": "stability; stabilize",
  "lesson": 27
},
{
  "word": "緊張",
  "reading": "きんちょう",
  "meaning": "tension; be tense, nervous",
  "lesson": 27
},
{
  "word": "混雑",
  "reading": "こんざつ",
  "meaning": "congestion; be congested",
  "lesson": 27
},
{
  "word": "発達",
  "reading": "はったつ",
  "meaning": "development; develop",
  "lesson": 27
},
{
  "word": "不足",
  "reading": "ふそく",
  "meaning": "shortage; run short of",
  "lesson": 27
},
{
  "word": "一致",
  "reading": "いっち",
  "meaning": "consistency, agreement; be consistent with",
  "lesson": 27
},
{
  "word": "混乱",
  "reading": "こんらん",
  "meaning": "confusion; be confused",
  "lesson": 27
},
{
  "word": "関心",
  "reading": "かんしん",
  "meaning": "interest",
  "lesson": 27
},
{
  "word": "自信",
  "reading": "じしん",
  "meaning": "confidence",
  "lesson": 27
},
{
  "word": "感覚",
  "reading": "かんかく",
  "meaning": "feeling, sensation",
  "lesson": 27
},
{
  "word": "参考",
  "reading": "さんこう",
  "meaning": "reference",
  "lesson": 27
},
{
  "word": "秘密",
  "reading": "ひみつ",
  "meaning": "secret",
  "lesson": 27
},
{
  "word": "評判",
  "reading": "ひょうばん",
  "meaning": "reputation",
  "lesson": 27
},
{
  "word": "出身",
  "reading": "しゅっしん",
  "meaning": "place of origin, alma mater, background",
  "lesson": 27
},
{
  "word": "夢中",
  "reading": "むちゅう",
  "meaning": "fully absorbed in",
  "lesson": 27
},
{
  "word": "面倒",
  "reading": "めんどう",
  "meaning": "bother, trouble",
  "lesson": 27
},
{
  "word": "被害",
  "reading": "ひがい",
  "meaning": "damage, harm",
  "lesson": 27
},
{
  "word": "感動",
  "reading": "かんどう",
  "meaning": "be impressed, be touched",
  "lesson": 27
},
{
  "word": "基本",
  "reading": "きほん",
  "meaning": "basic",
  "lesson": 27
},
{
  "word": "現実",
  "reading": "げんじつ",
  "meaning": "realistic",
  "lesson": 27
},
{
  "word": "積極",
  "reading": "せっきょく",
  "meaning": "positive",
  "lesson": 27
},
{
  "word": "伝統",
  "reading": "でんとう",
  "meaning": "traditional",
  "lesson": 27
},
{
  "word": "平均",
  "reading": "へいきん",
  "meaning": "average",
  "lesson": 27
},
{
  "word": "理想",
  "reading": "りそう",
  "meaning": "ideal, optimal",
  "lesson": 27
},
{
  "word": "交換する",
  "reading": "こうかんする",
  "meaning": "replace; replacement",
  "lesson": 28
},
{
  "word": "戻す",
  "reading": "もどす",
  "meaning": "returns, give back",
  "lesson": 28
},
{
  "word": "気に入る",
  "reading": "きにいる",
  "meaning": "like, be pleased with",
  "lesson": 28
},
{
  "word": "許可する",
  "reading": "きょかする",
  "meaning": "permission; permit",
  "lesson": 28
},
{
  "word": "許す",
  "reading": "ゆるす",
  "meaning": "permission, allow",
  "lesson": 28
},
{
  "word": "あきらめる",
  "reading": "",
  "meaning": "give up, abandon",
  "lesson": 28
},
{
  "word": "やり直す",
  "reading": "やりなおす",
  "meaning": "redo, go over again",
  "lesson": 28
},
{
  "word": "気を付ける",
  "reading": "きをつける",
  "meaning": "be careful of",
  "lesson": 28
},
{
  "word": "苦労する",
  "reading": "くろうする",
  "meaning": "(experience) hardship, difficulty; troublesome, difficult",
  "lesson": 28
},
{
  "word": "くたびれる",
  "reading": "",
  "meaning": "get tired, be tired",
  "lesson": 28
},
{
  "word": "決まり",
  "reading": "きまり",
  "meaning": "agreed arrangement",
  "lesson": 28
},
{
  "word": "守る",
  "reading": "まもる",
  "meaning": "keep, follow",
  "lesson": 28
},
{
  "word": "計画",
  "reading": "けいかく",
  "meaning": "plan",
  "lesson": 28
},
{
  "word": "理由",
  "reading": "りゆう",
  "meaning": "reason, ground",
  "lesson": 28
},
{
  "word": "長所",
  "reading": "ちょうしょ",
  "meaning": "merit, advantage",
  "lesson": 28
},
{
  "word": "短所",
  "reading": "たんしょ",
  "meaning": "demerit, shortcoming",
  "lesson": 28
},
{
  "word": "欠点",
  "reading": "けってん",
  "meaning": "defect, shortcoming",
  "lesson": 28
},
{
  "word": "共通点",
  "reading": "きょうつうてん",
  "meaning": "shared characteristic, point in common",
  "lesson": 28
},
{
  "word": "アイデア",
  "reading": "",
  "meaning": "idea",
  "lesson": 28
},
{
  "word": "考え",
  "reading": "かんがえ",
  "meaning": "thought, idea, opinion",
  "lesson": 28
},
{
  "word": "イメージ",
  "reading": "",
  "meaning": "image",
  "lesson": 28
},
{
  "word": "印象",
  "reading": "いんしょう",
  "meaning": "impression",
  "lesson": 28
},
{
  "word": "レベル",
  "reading": "",
  "meaning": "level",
  "lesson": 28
},
{
  "word": "程度",
  "reading": "ていど",
  "meaning": "degree, extent",
  "lesson": 28
},
{
  "word": "暮らし",
  "reading": "くらし",
  "meaning": "livelihood, daily life",
  "lesson": 28
},
{
  "word": "生活",
  "reading": "せいかつ",
  "meaning": "life",
  "lesson": 28
},
{
  "word": "誤り",
  "reading": "あやまり",
  "meaning": "error, mistake",
  "lesson": 28
},
{
  "word": "間違い",
  "reading": "まちがい",
  "meaning": "error, mistake",
  "lesson": 28
},
{
  "word": "きつい",
  "reading": "",
  "meaning": "tough, demanding",
  "lesson": 28
},
{
  "word": "苦しい",
  "reading": "くるしい",
  "meaning": "painful, in discomfort",
  "lesson": 28
},
{
  "word": "我慢する",
  "reading": "がまんする",
  "meaning": "endurance; put up with, tolerate",
  "lesson": 28
},
{
  "word": "短気",
  "reading": "たんき",
  "meaning": "short-tempered",
  "lesson": 28
},
{
  "word": "賢い",
  "reading": "かしこい",
  "meaning": "intelligent",
  "lesson": 28
},
{
  "word": "幼い",
  "reading": "おさない",
  "meaning": "little, very young",
  "lesson": 28
},
{
  "word": "単純",
  "reading": "たんじゅん",
  "meaning": "simple, basic",
  "lesson": 28
},
{
  "word": "当然",
  "reading": "とうぜん",
  "meaning": "as a matter of course, goes without saying",
  "lesson": 28
},
{
  "word": "さっき",
  "reading": "",
  "meaning": "just now, a few moments ago",
  "lesson": 28
},
{
  "word": "最近",
  "reading": "さいきん",
  "meaning": "these days, nowadays",
  "lesson": 28
},
{
  "word": "年中",
  "reading": "ねんじゅう",
  "meaning": "all year round, always",
  "lesson": 28
},
{
  "word": "突然",
  "reading": "とつぜん",
  "meaning": "suddenly",
  "lesson": 28
},
{
  "word": "再び",
  "reading": "ふたたび",
  "meaning": "once more, again",
  "lesson": 28
},
{
  "word": "なるべく",
  "reading": "",
  "meaning": "as ... as possible, if possible",
  "lesson": 28
},
{
  "word": "絶対に",
  "reading": "ぜったいに",
  "meaning": "for sure, absolutely, definitely",
  "lesson": 28
},
{
  "word": "相当",
  "reading": "そうとう",
  "meaning": "somewhat, considerably",
  "lesson": 28
},
{
  "word": "かなり",
  "reading": "",
  "meaning": "rather, substantially, considerably",
  "lesson": 28
},
{
  "word": "そっくり",
  "reading": "",
  "meaning": "expresses close resemblance",
  "lesson": 28
},
{
  "word": "ぼんやり",
  "reading": "",
  "meaning": "vaguely, vacantly, dimly",
  "lesson": 28
},
{
  "word": "にこにこ",
  "reading": "",
  "meaning": "expresses smiling manner",
  "lesson": 28
},
{
  "word": "見送る",
  "reading": "みおくる",
  "meaning": "see off, give a send-off",
  "lesson": 29
},
{
  "word": "見直す",
  "reading": "みなおす",
  "meaning": "review, revise",
  "lesson": 29
},
{
  "word": "受け入れる",
  "reading": "うけいれる",
  "meaning": "accept",
  "lesson": 29
},
{
  "word": "受け取る",
  "reading": "うけとる",
  "meaning": "receive",
  "lesson": 29
},
{
  "word": "引き受ける",
  "reading": "ひきうける",
  "meaning": "take on, accept",
  "lesson": 29
},
{
  "word": "申し込む",
  "reading": "もうしこむ",
  "meaning": "apply for, propose",
  "lesson": 29
},
{
  "word": "取り消す",
  "reading": "とりけす",
  "meaning": "cancel, annul",
  "lesson": 29
},
{
  "word": "繰り返す",
  "reading": "くりかえす",
  "meaning": "repeat",
  "lesson": 29
},
{
  "word": "やり直す",
  "reading": "やりなおす",
  "meaning": "redo, go over again",
  "lesson": 29
},
{
  "word": "落ち着く",
  "reading": "おちつく",
  "meaning": "calm, composed",
  "lesson": 29
},
{
  "word": "区切る",
  "reading": "くぎる",
  "meaning": "demarcate, separate, punctuate",
  "lesson": 29
},
{
  "word": "出会う",
  "reading": "であう",
  "meaning": "come across, meet",
  "lesson": 29
},
{
  "word": "出来上がる",
  "reading": "できあがる",
  "meaning": "complete, finish off",
  "lesson": 29
},
{
  "word": "通り過ぎる",
  "reading": "とおりすぎる",
  "meaning": "pass by, pass through",
  "lesson": 29
},
{
  "word": "話し合う",
  "reading": "はなしあう",
  "meaning": "discuss, thrash out",
  "lesson": 29
},
{
  "word": "打ち合わせ",
  "reading": "うちあわせ",
  "meaning": "preparatory meeting",
  "lesson": 29
},
{
  "word": "待ち合わせ",
  "reading": "まちあわせ",
  "meaning": "rendezvous, appointment",
  "lesson": 29
},
{
  "word": "行き先",
  "reading": "いきさき",
  "meaning": "destination",
  "lesson": 29
},
{
  "word": "大〜",
  "reading": "おお",
  "meaning": "heavy ~, main ~, big ~",
  "lesson": 29
},
{
  "word": "大〜",
  "reading": "だい",
  "meaning": "large ~, major ~, great ~",
  "lesson": 29
},
{
  "word": "各〜",
  "reading": "かく",
  "meaning": "each ~",
  "lesson": 29
},
{
  "word": "片〜",
  "reading": "かた",
  "meaning": "single ~",
  "lesson": 29
},
{
  "word": "全〜",
  "reading": "ぜん",
  "meaning": "the whole ~, all the ~",
  "lesson": 29
},
{
  "word": "元〜",
  "reading": "もと",
  "meaning": "former ~",
  "lesson": 29
},
{
  "word": "翌〜",
  "reading": "よく",
  "meaning": "next/following ~",
  "lesson": 29
},
{
  "word": "〜毎",
  "reading": "ごと",
  "meaning": "once every ~, by ~",
  "lesson": 29
},
{
  "word": "〜差",
  "reading": "さ",
  "meaning": "a difference of ~",
  "lesson": 29
},
{
  "word": "〜産",
  "reading": "さん",
  "meaning": "product of ~",
  "lesson": 29
},
{
  "word": "〜着",
  "reading": "ちゃく",
  "meaning": "arrival in/at ~",
  "lesson": 29
},
{
  "word": "〜発",
  "reading": "はつ",
  "meaning": "departing at/from ~",
  "lesson": 29
},
{
  "word": "〜風",
  "reading": "ふう",
  "meaning": "-style, -like",
  "lesson": 29
},
{
  "word": "〜沿い",
  "reading": "ぞい",
  "meaning": "along the ~",
  "lesson": 29
},
{
  "word": "〜付き",
  "reading": "つき",
  "meaning": "equipped, furnished with ~",
  "lesson": 29
},
{
  "word": "〜引き",
  "reading": "びき",
  "meaning": "~ off (discount)",
  "lesson": 29
},
{
  "word": "〜振り",
  "reading": "ぶり",
  "meaning": "for the first time in ~",
  "lesson": 29
},
{
  "word": "〜向き",
  "reading": "むき",
  "meaning": "facing the ~",
  "lesson": 29
},
{
  "word": "〜行き",
  "reading": "いき",
  "meaning": "bound for ~, heading for/toward ~",
  "lesson": 29
},
  ],
  N2: [],
  N1: [],
};
