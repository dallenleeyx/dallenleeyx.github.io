// lib/japanese/data/passages.js — one short reading passage per vocab
// lesson, written to use as much of that lesson's word list as naturally
// fits into a coherent short story. Meant for initial learning (seeing a
// word in context), not revision -- Flashcards/Writing/Furigana already
// cover drilling words you've already met once.
//
// `jp` uses a small custom syntax instead of raw HTML: `{kanji|reading}`
// marks a word that should render with furigana AND is eligible to be
// blanked out in cloze practice -- see components/japanese/vocab/Reading.jsx
// for the parser. Only mark the lesson's own target words (and only their
// first occurrence, if a word repeats) this way; incidental kanji outside
// the target list are left as plain text.
//
// Static, hand/AI-authored content (like vocab.js/grammar.js already are)
// -- no runtime API calls, so adding more lessons here has no ongoing cost.
export const PASSAGES = {
  N4: {
    1: {
      jp: `{僕|ぼく}の{妻|つま}が先週{熱|ねつ}を出しました。{のど|のど}も痛いと言うので、{僕|ぼく}はとても{心配しました|しんぱいしました}。すぐ妻を病院へ{連れて行き|つれていき}ました。書類には「患者の{夫|おっと}」と書きました。

病院で、友達に会いました。友達は僕に{(ご)主人|ごしゅじん}を{紹介して|しょうかいして}くれました。ご主人はお医者さんで、妻のことをいろいろ{手伝って|てつだって}くれました。帰るとき、きれいな花も{もらいました|もらいました}。二人ともまだ{若い|わかい}のに、とても優しかったです。

妻が入院している間、家はとても{寂しかった|さびしかった}です。毎日病院へ行って、妻の{髪|かみ}をとかしてあげました。でも、みんなが助けてくれたので、本当によかったです。`,
      en: `Last week my wife had a fever. She said her throat hurt too, so I was very worried. I immediately took her to the hospital. On the paperwork, I wrote "patient's husband."

At the hospital, I ran into a friend. She introduced her husband to me. He was a doctor, and he helped with a lot of things for my wife. When we left, we even received some pretty flowers. Even though they were both still young, they were so kind.

While my wife was in the hospital, the house felt very lonely. Every day I went to the hospital and brushed my wife's hair for her. But because everyone helped, it turned out fine in the end.`,
    },
    2: {
      jp: `僕の{趣味|しゅみ}はたくさんあります。休みの日はよく{美術館|びじゅつかん}へ行ったり、友達と{(お)花見|おはなみ}をしたりします。音楽も好きなので、{コンサート|こんさーと}に{一度|いちど}行ったことがあります。とても楽しかったので、{ぜひ|ぜひ}また行きたいです。

冬になると、{スキー|すきー}をしに山へ行きます。うまくはありませんが、{ダンス|だんす}も少し習っています。家では{アニメ|あにめ}や{マンガ|まんが}をよく見ます。好きなアニメが{放送|ほうそう}される日は、{ビデオ|びでお}に録画します。

それから、僕は毎日{日記|にっき}を書いています。切手を{集める|あつめる}のも好きです。友達が{試合|しあい}する日は、見に行きます。`,
      en: `I have a lot of hobbies. On my days off, I often go to art museums or view cherry blossoms with friends. I like music too, so I've been to a concert once. It was so much fun that I definitely want to go again.

When winter comes, I go skiing in the mountains. I'm not very good at it, but I'm also learning a bit of dance. At home I often watch anime and manga. On days when my favorite anime airs, I always record it on video.

Also, I write in my diary every day. I also like collecting stamps. On days when my friend has a match, I go watch.`,
    },
    3: {
      jp: `来月、僕は{世界|せかい}一周の旅に出ます。まず飛行機で{空港|くうこう}へ行って、それから{船|ふね}に乗ります。{交通|こうつう}が便利な町なら、{急行|きゅうこう}に乗って、{乗り換えて|のりかえて}すぐ着けます。

ホテルはもう{予約しました|よやくしました}。友達が現地を{案内して|あんないして}くれるので、{準備|じゅんび}はあまり大変ではありません。友達の家に少し{泊まる|とまる}予定です。

出発は{もうすぐ|もうすぐ}です。でも、車が{動かなくて|うごかなくて}、駅の前に{止めて|とめて}タクシーを呼びました。{残念|ざんねん}ですが、{神社|じんじゃ}に寄る時間はなくなりました。`,
      en: `Next month I'm going on a trip around the world. First I'll fly to the airport, then take a ship. If a town has good transportation, I can take an express train and transfer to get there quickly.

I've already booked the hotel. A friend will show me around, so I don't have much to prepare. I plan to stay at my friend's house for a bit.

Departure is coming up soon. But my car wouldn't start, so I parked it in front of the station and called a taxi. Unfortunately, I no longer have time to stop by the shrine.`,
    },
    4: {
      jp: `先週、{引っ越ししました|ひっこししました}。新しい部屋はとても{すてき|すてき}です。{棚|たな}をたくさん買って、本を並べました。{パソコン|ぱそこん}も新しい{住所|じゅうしょ}に届きました。

でも、電気の{スイッチ|すいっち}が{故障して|こしょうして}いて、電気を{つけたり|つけたり}{消したり|けしたり}できません。今度{修理して|しゅうりして}もらいます。それから、古い{布団|ふとん}を{捨てました|すてました}。使わない物を{捨てる|すてる}と、部屋がすっきりして{役に立ちました|やくにたちました}。

{そろそろ|そろそろ}{ごみ|ごみ}を出す時間です。`,
      en: `I moved last week. The new apartment is really nice. I bought a lot of shelves and lined up my books. My PC arrived at the new address too.

But the light switch is broken, and I can't turn the light on or off. I'll have it repaired soon. Also, I threw away my old futon. Throwing away things I wasn't using cleared up the room nicely -- it really helped.

It's about time to take out the trash.`,
    },
    5: {
      jp: `デパートで買い物をしました。まず{エスカレーター|えすかれーたー}で二階の{売り場|うりば}へ行きました。店員さんの{サービス|さーびす}がとても良かったです。

服の{サイズ|さいず}を見てから、店員さんに「{触っても|さわっても}いいですか」と聞きました。ボタンを{押すと|おすと}、鏡が回りました。値段は{億|おく}まではいきませんが、少し高かったです。{カード|かーど}で{払おう|はらおう}と思いましたが、現金がよかったので、銀行でお金を{下ろしました|おろしました}。{細かい|こまかい}お金がなかったので、大きいお札で払って、{お釣り|おつり}をもらいました。

最後に、家族への{お土産|おみやげ}も買いました。`,
      en: `I went shopping at the department store. First I took the escalator up to the second-floor department. The salesperson's service was really good.

After looking at the size of the clothes, I asked the salesperson, 'Can I touch it?' When I pressed the button, the mirror turned. The price wasn't in the hundreds of millions, but it was a bit expensive. I thought about paying by card, but I preferred cash, so I withdrew money at the bank. I didn't have small change, so I paid with a big bill and got change.

Finally, I also bought a souvenir for my family.`,
    },
    6: {
      jp: `僕は今、大学で{研究して|けんきゅうして}います。{高校|こうこう}のときは{留学生|りゅうがくせい}として日本で{ホームステイ|ほーむすてい}をしました。日本語の{字|じ}は{全然|ぜんぜん}読めませんでしたが、辞書で{調べたり|しらべたり}、先生に{意味|いみ}を{説明して|せつめいして}もらったりして、少しずつ{考える|かんがえる}力がつきました。

来週、{試験|しけん}があります。{レポート|れぽーと}も書かなければいけません。問題の{答え|こたえ}を書いてから、間違いを{消しゴム|けしごむ}で消して、また書き直します。{だいたい|だいたい}準備はできました。`,
      en: `I'm doing research at university now. When I was in high school, I did a homestay in Japan as an exchange student. I couldn't read Japanese characters at all, but by looking things up in the dictionary and having my teacher explain the meaning, I gradually built up my ability to think it through.

I have an exam next week. I also have to write a report. After writing the answer to a question, I erase mistakes with an eraser and rewrite it. I'm mostly ready.`,
    },
    7: {
      jp: `今日から新しい{事務所|じむしょ}で働きます。{社長|しゃちょう}と{部長|ぶちょう}に挨拶して、「{失礼|しつれい}します」と言って{会議室|かいぎしつ}に入りました。学生のとき{アルバイト|あるばいと}をしていたので、{受付|うけつけ}の仕事は{簡単|かんたん}でした。でも、{経済|けいざい}の会議に出るのは{大変|たいへん}です。

{スーツ|すーつ}を着て、朝から{会議しました|かいぎしました}。{コンピューター|こんぴゅーたー}でメールを{送って|おくって}から、{昼休み|ひるやすみ}になりました。`,
      en: `Starting today, I'm working at a new office. I greeted the president and the general manager, said 'excuse me,' and went into the meeting room. I did part-time work as a student, so the reception work was easy. But attending the economics meeting is tough.

I wore a suit and had a meeting from the morning. After sending an email on the computer, it became lunch break.`,
    },
    8: {
      jp: `僕の{田舎|いなか}は{建物|たてもの}が少なくて、車がないと{不便|ふべん}です。{交差点|こうさてん}を{渡って|わたって}、{角|かど}を{曲がると|まがると}、古い{(お)寺|おてら}があります。近くに{駐車場|ちゅうしゃじょう}もあります。

{季節|きせつ}のいい{(お)正月|おしょうがつ}には、みんな{着物|きもの}を着て{(お)祭り|おまつり}に行きます。この{県|けん}はお祭りが有名です。

昨日、歯が痛かったので{歯医者|はいしゃ}に行きました。`,
      en: `There aren't many buildings in my hometown in the countryside, and it's inconvenient without a car. If you cross the intersection and turn at the corner, there's an old temple. There's also a parking lot nearby.

At New Year's, when the season is nice, everyone wears kimono and goes to the festival. This prefecture is famous for its festival.

Yesterday my tooth hurt, so I went to the dentist.`,
    },
    9: {
      jp: `{久しぶり|ひさしぶり}に友達に会いました。{息子|むすこ}と{娘|むすめ}も一緒でした。二人とも{将来|しょうらい}の{夢|ゆめ}があって、もう{決めた|きめた}そうです。「{すごい|すごい}ね、{偉い|えらい}よ」と言いました。

友達の家には{ペット|ぺっと}がいます。名前を呼ぶと、大きい{声|こえ}で鳴きます。{力|ちから}も強くて、びっくりしました。子供たちは{うそ|うそ}をつかない、{普通|ふつう}のいい子たちでした。`,
      en: `I met up with a friend after a long time. Her son and daughter were with her too. Both of them already have a future dream and, apparently, have already decided on it. I said, 'That's amazing, you're admirable.'

My friend has a pet. When you call its name, it cries out in a loud voice. It's strong too -- I was surprised. The kids don't tell lies; they're just normal, good kids.`,
    },
    10: {
      jp: `{今夜|こんや}、好きな{ドラマ|どらま}の{番組|ばんぐみ}があります。その前に{小説|しょうせつ}を少し読みました。{すばらしい|すばらしい}話でした。

週末は絵の{展覧会|てんらんかい}に行くつもりです。それから、時々弟と{ゲーム|げーむ}をします。健康のために毎日{運動して|うんどうして}、ダンスも{練習して|れんしゅうして}います。ボールを{投げる|なげる}ときに転んで{けがした|けがした}こともありますが、今は上手に{踊れます|おどれます}。試合で{勝つ|かつ}ことも{負ける|まける}こともありますが、楽しいです。`,
      en: `Tonight there's an episode of a drama I like. Before that I read a bit of a novel -- it was a wonderful story.

I'm planning to go to an art exhibition this weekend. I also play video games with my brother sometimes. I exercise every day for my health, and I'm practicing dance too. I once got injured falling over while throwing a ball, but now I can dance well. Sometimes I win a match, sometimes I lose, but it's fun.`,
    },
    11: {
      jp: `今日は子供と{動物園|どうぶつえん}へ行く{予定|よてい}でしたが、友達と会う{約束|やくそく}があったので、行く{場所|ばしょ}を変えました。夜、外で{星|ほし}がきれいに{見えました|みえました}。子供たちは{騒いで|さわいで}いましたが、みんな{気分|きぶん}がよさそうでした。

{帰り|かえり}に車の{エンジン|えんじん}が{かかりませんでした|かかりませんでした}。友達が家まで{迎えに|むかえに}来てくれました。{都合|つごう}が悪かったので、また明日{戻ります|もどります}。遠くから電車の音が{聞こえます|きこえます}。`,
      en: `I had planned to go to the zoo with my kids today, but since I had an appointment to meet a friend, I changed the location. At night, the stars looked beautiful outside. The kids were being noisy, but everyone seemed to be in a good mood.

On the way home, the car engine wouldn't start. A friend came to pick me up. It wasn't a convenient time, so I'll go back again tomorrow. I can hear the sound of a train in the distance.`,
    },
    12: {
      jp: `{たいてい|たいてい}朝は{サンドイッチ|さんどいっち}と{ミルク|みるく}で{食事します|しょくじします}。今朝は{お湯|おゆ}を沸かして、コーヒーも作りました。{ガス|がす}が{なかなか|なかなか}つかなくて、少し時間がかかりました。

友達を{ごちそうしました|ごちそうしました}。料理の{味|あじ}をほめてくれました。{ガム|がむ}を{かみながら|かみながら}、二人で話しました。食後、少し料理が{残ったので|のこったので}、冷蔵庫で{冷やして|ひやして}おきました。テーブルを{片付ける|かたづける}のに時間がかかりました。`,
      en: `I usually have a sandwich and milk for breakfast. This morning I boiled water and made coffee too. The gas wouldn't light for a while, so it took a bit of time.

I treated a friend to a meal. She praised the taste of my cooking. We chewed gum and talked. After the meal, some food was left over, so I chilled it in the fridge. It took a while to clean up the table.`,
    },
    13: {
      jp: `一人で{生活して|せいかつして}三年になります。{気をつけて|きをつけて}いますが、時々{忘れ物|わすれもの}をします。今朝も{ジャケット|じゃけっと}を{クリーニングに|くりーにんぐに}出すのを忘れました。{下着|したぎ}も{道具|どうぐ}も、全部自分で洗います。

庭に花を{植えました|うえました}。電気が急に{消えて|きえて}、また{つきました|つきました}。靴を{はいて|はいて}外に出ると、道でお金を{拾いました|ひろいました}。手が{汚れて|よごれて}いたので、水道の水を{引いて|ひいて}洗いました。今は{十分|じゅうぶん}気をつけて生活しています。`,
      en: `It's been three years since I started living alone. I'm careful, but I still forget things sometimes. This morning I forgot to take my jacket to the cleaners. I wash my own underwear and tools, everything myself.

I planted flowers in the yard. The lights suddenly went off, then came back on. When I put on my shoes and went outside, I found some money on the road. My hands were dirty, so I ran some tap water and washed them. Now I live carefully enough.`,
    },
    14: {
      jp: `部屋の{真ん中|まんなか}に{鏡|かがみ}を{飾りました|かざりました}。{隅|すみ}の{引き出し|ひきだし}には古い{人形|にんぎょう}が入っています。

先週、木の{枝|えだ}が{折れて|おれて}、窓の{ガラス|がらす}が{割れました|われました}。すぐ新しいガラスに{取り替えました|とりかえました}。それから、うっかり時計を{落として|おとして}、{壊れて|こわれて}しまいました。壁の絵の位置も{変えて|かえて}、新しい絵を{かけました|かけました}。`,
      en: `I decorated the middle of the room with a mirror. In the corner, the drawer has an old doll in it.

Last week, a tree branch broke and the window glass shattered. I replaced it with new glass right away. Also, I accidentally dropped my watch and it broke. I also changed the position of the picture on the wall and hung a new one.`,
    },
    15: {
      jp: `先月、{財布|さいふ}を{なくして|なくして}しまいました。困っていたら、駅の人が{見つけて|みつけて}くれました。{ボーナス|ぼーなす}をもらったので、店で{品物|しなもの}を{選びました|えらびました}。{値段|ねだん}を{メモしたら|めもしたら}、お金が{足りない|たりない}ことがわかりました。

{平日|へいじつ}は店が朝早く{開いて|あいて}、夜遅く{閉まります|しまります}。人気の品物はすぐ{売れて|うれて}しまうので、買い物を{むだ|むだ}にしないように気をつけています。`,
      en: `Last month I lost my wallet. While I was worried about it, a station employee found it for me. I got my bonus, so I chose some items at a store. When I noted down the prices, I realized I didn't have enough money.

On weekdays, stores open early in the morning and close late at night. Popular items sell out fast, so I'm careful not to waste my shopping.`,
    },
    16: {
      jp: `毎日、大学に{通って|かよって}います。{まじめ|まじめ}な学生なので、{講義|こうぎ}にはいつも{出席します|しゅっせきします}。前の日は{予習して|よしゅうして}、後で{復習します|ふくしゅうします}。

今朝は{遅れそうで|おくれそうで}、{急いで|いそいで}家を出ましたが、{間に合いました|まにあいました}。教室で{席|せき}に着いて、先生に{返事しました|へんじしました}。試験を{受ける|うける}前に、先生に{連絡して|れんらくして}レポートを{出しました|だしました}。{失敗しない|しっぱいしない}ように、気をつけています。`,
      en: `I commute to university every day. I'm a serious student, so I always attend lectures. I prepare the day before and review afterward.

This morning it looked like I'd be late, so I hurried out of the house, but I made it in time. I took my seat in the classroom and answered the teacher. Before taking the exam, I contacted the teacher and handed in my report. I'm careful not to fail.`,
    },
    17: {
      jp: `学校の{規則|きそく}は{ずっと|ずっと}{守っています|まもっています}。{廊下|ろうか}で走ると先生に{注意されます|ちゅういされます}から、静かに歩きます。今日、机を{並べていた|ならべていた}とき、大きい{音|おと}がしました。

宿題で漢字を{間違えて|まちがえて}、先生が{直して|なおして}くれました。すぐには{思い出せません|おもいだせません}でしたが、{熱心|ねっしん}に勉強を{続けたら|つづけたら}、覚えられました。友達は「もう{無理|むり}、{やめる|やめる}」と言っていましたが、僕は自分の{意見|いけん}を伝えて、一緒に頑張ろうと言いました。`,
      en: `I've always followed the school rules. If you run in the corridor, the teacher will warn you, so I walk quietly. Today, while I was lining up the desks, there was a loud noise.

I made a mistake with a kanji character in my homework, and the teacher corrected it. I couldn't remember it right away, but by studying hard and continuing, I was able to remember it. My friend said, 'This is impossible, I'm quitting,' but I shared my opinion and told her to keep trying together.`,
    },
    18: {
      jp: `昨日は空が{曇って|くもって}いましたが、夜には{晴れて|はれて}、きれいな{月|つき}が見えました。雨が{やんだ|やんだ}後、{南|みなみ}の窓から{景色|けしき}を見ると、{緑|みどり}の山が{はっきり|はっきり}見えました。

町の{教会|きょうかい}は面白い{形|かたち}をしています。新しく{建てられました|たてられました}。休日はいつも人で{込みますが|こみますが}、平日は{すいています|すいています}。晴れの日が{続いて|つづいて}います。`,
      en: `It was cloudy yesterday, but it cleared up at night and I could see a beautiful moon. After the rain stopped, when I looked at the view from the south window, the green mountains were clearly visible.

The town's church has an interesting shape. It was newly built. It's always crowded with people on holidays, but it's uncrowded on weekdays. The sunny days have been continuing.`,
    },
    19: {
      jp: `先週、{祖父|そふ}と{祖母|そぼ}の{お宅|おたく}へ行きました。{おば(さん)|おばさん}と{おじ(さん)|おじさん}の{赤ちゃん|あかちゃん}に会って、{びっくりしました|びっくりしました}。とても{親切|しんせつ}に迎えてくれて、{安心しました|あんしんしました}。

「{お子さん|おこさん}は元気に{育っています|そだっています}ね」と{褒めて|ほめて}くれました。うれしい{気持ち|きもち}になりました。誕生日の{お祝い|おいわい}に花をもらいました。`,
      en: `Last week I went to my grandfather and grandmother's house. I met my aunt and uncle's baby, and I was surprised. They welcomed me so kindly that I felt relieved.

'Your child is growing up healthy,' they said, praising us. It made me feel happy. I received flowers as a birthday gift.`,
    },
    20: {
      jp: `先週末、友達を{誘って|さそって}、小さな{島|しま}へ旅行に行きました。{天気予報|てんきよほう}を見て、晴れの日に{出発しました|しゅっぱつしました}。{港|みなと}から船に乗って、{海岸|かいがん}沿いの{村|むら}を{通り|とおり}ました。景色がとても{美しかった|うつくしかった}です。

夜は{旅館|りょかん}に泊まりました。朝、{会場|かいじょう}まで{ハイキングして|はいきんぐして}、山に登りました。{ラッシュ|らっしゅ}の時間を避けたので、電車も空いていました。{特別|とくべつ}な思い出になりました。準備に{必要な|ひつような}物は、リュックだけでした。`,
      en: `Last weekend, I invited a friend and we traveled to a small island. Watching the weather forecast, we set off on a sunny day. We took a boat from the port and passed through a village along the coast. The scenery was very beautiful.

At night we stayed at a Japanese inn. In the morning, we hiked to the venue and climbed the mountain. We avoided rush hour, so the train was empty too. It became a special memory. All I needed to prepare was a backpack.`,
    },
    21: {
      jp: `冬は{暖房|だんぼう}、夏は{冷房|れいぼう}をつけるのが{習慣|しゅうかん}になりました。朝、歯を{磨いて|みがいて}から、パンにジャムを{つけて|つけて}食べます。

出かけるとき、{手袋|てぶくろ}を忘れて{困りました|こまりました}。雨が降っていたので、傘を{さしました|さしました}。{カーテン|かーてん}の{表|おもて}と{裏|うら}を間違えて掛けていたことに、後で{気がつきました|きがつきました}。{タオル|たおる}で顔を拭いて、この生活にも{慣れました|なれました}。`,
      en: `Turning on the heater in winter and the AC in summer has become a habit. In the morning, after brushing my teeth, I spread jam on bread and eat it.

When I went out, I forgot my gloves and was in trouble. It was raining, so I opened my umbrella. I later noticed that I had hung the curtain with the front and back reversed. I wiped my face with a towel -- I've gotten used to this life.`,
    },
    22: {
      jp: `今夜、彼女と{デートします|でーとします}。{(お)米|おこめ}を炊いて、{チーズ|ちーず}と{ソース|そーす}を使った料理を作ります。オーブンの{温度|おんど}を{上げて|あげて}、パンを{焼きました|やきました}。とても{やわらかく|やわらかく}できました。焼きすぎると{固く|かたく}なるので、途中で温度を{下げました|さげました}。

このソースは少し{苦い|にがい}ですが、この料理によく{合います|あいます}。最近食べすぎて{太った|ふとった}ので、少し{やせたい|やせたい}です。{水道|すいどう}の水で野菜を洗いました。`,
      en: `Tonight I have a date with my girlfriend. I'm cooking rice and making a dish with cheese and sauce. I raised the oven temperature and baked bread -- it turned out very soft. If you bake it too long it gets hard, so I lowered the temperature partway through.

This sauce is a bit bitter, but it goes well with this dish. I've been eating too much lately and gained weight, so I want to lose a little. I washed the vegetables with tap water.`,
    },
    23: {
      jp: `{このごろ|このごろ}、{台風|たいふう}や{地震|じしん}のニュースをよく見ます。昨日、近くのビルで{火事|かじ}が{起こりました|おこりました}。木が{倒れて|たおれて}、道をふさいでいました。みんな急いで{逃げました|にげました}。

それから、{泥棒|どろぼう}が入った家もありました。{警察|けいさつ}がすぐ来て、犯人が{見つかりました|みつかりました}。夫婦が{けんかして|けんかして}事故になった話も聞きました。{悲しい|かなしい}ニュースが多くて、車も何かを{踏んで|ふんで}{事故|じこ}になったので{直る|なおる}まで少し時間がかかります。`,
      en: `These days I often see news about typhoons and earthquakes. Yesterday a fire broke out in a nearby building. A tree had fallen and was blocking the road. Everyone hurried to escape.

There was also a house that a burglar broke into. The police came right away and the culprit was found. I also heard about a couple who got into a fight and it turned into an incident. There's a lot of sad news -- my car also had an accident after running over something, so it'll take a while to get fixed.`,
    },
    24: {
      jp: `セール中の店に{大勢|おおぜい}の{(お)客|おきゃく}が来ていました。{近所|きんじょ}の{店員|てんいん}さんが荷物を{運んで|はこんで}くれて、とても{うれしかった|うれしかった}です。

{レジ|れじ}でお金を払って、{レシート|れしーと}をもらいました。買った{指輪|ゆびわ}に小さい{傷|きず}がありましたが、交換できる{チャンス|ちゃんす}をもらいました。この店は海外から{輸入した|ゆにゅうした}品物も、日本から{輸出する|ゆしゅつする}品物も{開いて|ひらいて}売っています。`,
      en: `A large crowd of customers came to the store during the sale. A salesperson from the neighborhood carried my bags for me, which made me really happy.

I paid at the register and got a receipt. The ring I bought had a small flaw, but I got a chance to exchange it. This store sells both goods imported from overseas and goods exported from Japan.`,
    },
    25: {
      jp: `{小学校|しょうがっこう}のときは{水泳|すいえい}の授業が好きでしたが、{中学校|ちゅうがっこう}に入ってから{歴史|れきし}が好きになりました。{文法|ぶんぽう}の先生は{詳しく|くわしく}説明してくれます。でも文法は{複雑|ふくざつ}で、よく間違えて{恥ずかしい|はずかしい}思いをします。

答えが{正しいか|ただしいか}、{必ず|かならず}{確かめます|たしかめます}。先生に{しかられる|しかられる}前に、{できるだけ|できるだけ}早く宿題をします。大会に{参加できなくて|さんかできなくて}、{がっかりしました|がっかりしました}。`,
      en: `I liked swimming classes in elementary school, but I came to like history after entering junior high. The grammar teacher explains things in detail. But grammar is complicated, and I often make mistakes and feel embarrassed.

I always make sure to check whether an answer is correct. Before getting scolded by the teacher, I do my homework as early as possible. I was disappointed that I couldn't take part in the competition.`,
    },
    26: {
      jp: `週末、{ボランティア|ぼらんてぃあ}として{工場|こうじょう}の見学会に参加しました。初めての{経験|けいけん}でしたが、{行われた|おこなわれた}説明はわかりやすかったです。作業の{途中|とちゅう}で困ったことがあって、係の人に{相談しました|そうだんしました}。

「手伝いを{頼んでも|たのんでも}いいですか」と聞くと、快く手伝ってくれました。数字を{数える|かぞえる}仕事を{始めました|はじめました}。{用事|ようじ}があったので早く帰りましたが、{終わり|おわり}まで{伝えて|つたえて}もらったので{だめ|だめ}になりませんでした。`,
      en: `On the weekend, I took part in a factory tour as a volunteer. It was my first experience, but the explanation given was easy to understand. Partway through the work I ran into trouble, so I consulted the person in charge.

When I asked, 'Can I ask for some help?' they happily helped me. I started counting numbers. I had somewhere to be, so I left early, but since they told me how it ended, it wasn't wasted.`,
    },
    27: {
      jp: `{昔|むかし}、この町のビルの{壁|かべ}には映画の{ポスター|ぽすたー}がたくさん{はって|はって}ありました。でも{最近|さいきん}、町の{様子|ようす}は大きく{変わりました|かわりました}。

今、駅の{地下|ちか}では新しい店の{工事|こうじ}をしています。ビルの{屋上|おくじょう}には木が植えてあって、春には花が{咲きます|さきます}。秋になると{葉|は}が{茶色く|ちゃいろく}なります。`,
      en: `Long ago, the walls of the buildings in this town had a lot of movie posters put up on them. But recently, the look of the town has changed a lot.

Right now, they're doing construction on a new shop underground at the station. Trees are planted on the roof of the building, and in spring, flowers bloom. Come autumn, the leaves turn brown.`,
    },
    28: {
      jp: `パーティーに友達を{招待しました|しょうたいしました}。ドアの前で{あいさつして|あいさつして}、プレゼントを{渡しました|わたしました}。「先生も{いらっしゃいます|いらっしゃいます}か」と聞かれました。

先生はいつも{優しい|やさしい}ですが、勉強には{厳しい|きびしい}です。パーティーの計画について{会話して|かいわして}いたとき、ある{相手|あいて}が{反対しました|はんたいしました}が、他のみんなは{賛成しました|さんせいしました}。友達の{世話|せわ}になったお礼の手紙が{届きました|とどきました}。何年も{別れて|わかれて}いた友達でも、この気持ちは{信じられます|しんじられます}。`,
      en: `I invited a friend to the party. I greeted them at the door and handed over a present. I was asked, 'Will the teacher be coming too?'

The teacher is always kind, but strict about studying. While we were talking about the party plan, one person objected, but everyone else agreed. A thank-you letter arrived from a friend I had been taken care of by. Even with a friend I've been apart from for years, I can believe in this feeling.`,
    },
    29: {
      jp: `週末、{自然|しぜん}の中で{キャンプしました|きゃんぷしました}。{空気|くうき}がきれいで、みんな{楽しみ|たのしみ}にしていました。テントの{ひも|ひも}を結んで、車に{ガソリン|がそりん}を入れてから出発しました。

朝、{マラソン|まらそん}大会が{スタートしました|すたーとしました}。道が凍っていて{滑って|すべって}転んだ人もいましたが、大きなけがはありませんでした。木の枝を{折って|おって}焚き火を作り、みんなで{集まって|あつまって}楽しく{楽しみました|たのしみました}。最近、キャンプに{興味|きょうみ}を持つ人が増えて、{珍しく|めずらしく}なくなりました。`,
      en: `This weekend we went camping in nature. The air was clean, and everyone was looking forward to it. We tied the tent's cord and put gasoline in the car before setting off.

In the morning, the marathon race started. The road was frozen and some people slipped and fell, but no one was badly hurt. We broke tree branches to make a campfire, and everyone gathered together and had a fun time. Lately more people have become interested in camping, so it's no longer unusual.`,
    },
    30: {
      jp: `今日は一日{留守|るす}にする予定でしたが、宅配便が荷物を{届けに|とどけに}来ました。子供の{おもちゃ|おもちゃ}が入っていました。子供は嬉しくて、{邪魔しないで|じゃましないで}静かに遊んでいましたが、そのうち一つを{壊して|こわして}しまいました。

雨で服が{ぬれて|ぬれて}しまいましたが、太陽の下ですぐ{乾きました|かわきました}。時間が{過ぎて|すぎて}、電池が{切れて|きれて}しまい、テレビが動かなくなりました。買い物に{並ぶ|ならぶ}のは{嫌|いや}ですが、電池がすっかり{なくなって|なくなって}しまったので、店へ行きました。今日は{自由|じゆう}な一日でした。子供はもう{眠って|ねむって}います。`,
      en: `I was planning to be out all day today, but a delivery came with a package for my child. It had a toy inside. My child was so happy, playing quietly without bothering anyone, but eventually broke one of the pieces.

My clothes got wet in the rain, but they dried quickly in the sun. Time passed, the batteries ran out, and the TV stopped working. I hate standing in line to shop, but since the batteries had completely run out, I went to the store. Today was a free day. My child is already asleep.`,
    },
    31: {
      jp: `夕食の{おかず|おかず}を作ります。まず{火|ひ}をつけて、お湯を{沸かします|わかします}。魚を{焼く|やく}と、いい{におい|におい}がします。肉は{厚く|あつく}切って、野菜は{薄く|うすく}切りました。

いつもの{倍|ばい}の{量|りょう}を作ってしまったので、{半分|はんぶん}をお弁当箱に{包みました|つつみました}。味は{濃い|こい}方が好きですが、今日は少し{まずかった|まずかった}です。作った皿の{数|かず}を数えたら、五枚もありました。`,
      en: `I'm making the side dish for dinner. First I light the stove and boil water. When I grill the fish, it smells good. I cut the meat thick and the vegetables thin.

I ended up making double the usual amount, so I wrapped half of it into a lunch box. I prefer a strong flavor, but today it turned out a bit bad-tasting. When I counted the number of plates I'd used, there were five.`,
    },
    32: {
      jp: `来月、大学を{卒業する|そつぎょうする}前に、最後の試験があります。{科学|かがく}と{文学|ぶんがく}、二つの科目です。{緊張して|きんちょうして}います。{なぜ|なぜ}かというと、80{点|てん}{以上|いじょう}取らないと{落ちる|おちる}からです。60点{以下|いか}だと、来年また受けなければいけません。

試験は最初{中止する|ちゅうしする}という話もありましたが、結局{行われました|おこなわれました}。単語をノートに{線|せん}を引いて覚えました。正しく{発音できるか|はつおんできるか}も大切です。もし{合格したら|ごうかくしたら}、来年は大学院に{入学します|にゅうがくします}。子供を{教育する|きょういくする}仕事につきたいです。`,
      en: `Next month, before I graduate from university, there's one final exam. It's two subjects: science and literature. I'm nervous. The reason is that if I don't score 80 points or above, I'll fail. If it's 60 points or below, I have to take it again next year.

There was talk at first that the exam would be cancelled, but in the end it was held. I underlined words in my notebook to memorize them. Whether I can pronounce them correctly matters too. If I pass, I'll enter graduate school next year. I want a job educating children.`,
    },
    33: {
      jp: `友達が{入院しました|にゅういんしました}ので、{(お)見舞い|おみまい}に行きました。「{具合|ぐあい}はどう?」と聞くと、{笑って|わらって}「大丈夫」と答えてくれました。少し{怖かった|こわかった}と{泣きました|なきました}が、体は{丈夫|じょうぶ}なので、心配しませんでした。

{急に|きゅうに}熱が出た夜のことを、{おかしい|おかしい}話として話してくれました。{太い|ふとい}腕から{細い|ほそい}腕になったねと言ったら、また笑いました。{眠い|ねむい}のを我慢して{やっと|やっと}話を聞き終えて、来週{退院する|たいいんする}と聞いて安心しました。`,
      en: `A friend of mine was hospitalized, so I went to visit them. When I asked, 'How are you feeling?' they laughed and said, 'I'm fine.' They cried a little, saying it had been a bit scary, but their body is strong, so I wasn't too worried.

They told me, as a funny story, about the night their fever suddenly spiked. When I said their arm had gone from thick to thin, they laughed again. Fighting off sleepiness, I finally finished listening to the whole story, and I felt relieved to hear they'd be discharged next week.`,
    },
    34: {
      jp: `大学で{社会|しゃかい}について勉強しています。{政治|せいじ}や{法律|ほうりつ}、{文化|ぶんか}など、いろいろなテーマを{利用して|りようして}レポートを書きます。今日は{人口|じんこう}が{増えたり|ふえたり}{減ったり|へったり}する{原因|げんいん}について調べました。

昔、{戦争した|せんそうした}国では物の値段が{上がったり|あがったり}{下がったり|さがったり}したそうです。図書館のパソコンを{使用して|しようして}調べると、今の社会は{安全|あんぜん}な国も{危険|きけん}な国もあることがわかりました。`,
      en: `I'm studying society at university. I use various themes like politics, law, and culture to write reports. Today I looked into the causes behind population increases and decreases.

Long ago, in countries that went to war, prices apparently went up and down. Using the library's computer to look it up, I learned that in today's society there are both safe countries and dangerous ones.`,
    },
    35: {
      jp: `{この間|このあいだ}、久しぶりに友達と話す{機会|きかい}がありました。学生{時代|じだい}の話をたくさんしました。「{今度|こんど}また会おうね」と約束しました。{たまに|たまに}しか会えませんが、{さっき|さっき}もメッセージが届きました。

{これから|これから}のことを考えると、{まず|まず}仕事を{すぐ|すぐ}に決めたいです。忙しい{日|ひ}もありますが、頑張ります。`,
      en: `The other day, I had a chance to talk with a friend after a long time. We talked a lot about our student days. We promised, 'Let's meet again next time.' We can only meet occasionally, but I just got a message from them a moment ago.

Thinking about what comes next, first I want to decide on a job soon. There are busy days, but I'll do my best.`,
    },
    36: {
      jp: `友達の{お嬢さん|おじょうさん}に会いました。とても{おとなしい|おとなしい}{女性|じょせい}で、母親によく{似ています|にています}。将来は{立派な|りっぱな}{家庭|かてい}を持ちたいそうです。

大学のサークルで、同じ{グループ|ぐるーぷ}の{メンバー|めんばー}と話しました。{男性|だんせい}も{お金持ち|おかねもち}も貧しい人も、みんな仲良しです。優しい{心|こころ}を持つ人が多く、誰かを{いじめる|いじめる}人はいません。歌が{うまい|うまい}人もいて、私と同じ{タイプ|たいぷ}の人もいます。`,
      en: `I met my friend's daughter. She's a very quiet woman, and looks a lot like her mother. She apparently wants a fine household of her own in the future.

At my university club, I talked with a member of the same group. Men, rich people, and people who aren't well-off -- everyone gets along. Many people have kind hearts, and no one bullies anyone. Some people are good singers, and there are people who are the same type as me.`,
    },
    37: {
      jp: `先生の家を{訪ねました|たずねました}。{丁寧に|ていねいに}{おじぎして|おじぎして}、{お礼|おれい}の{贈り物|おくりもの}を{差し上げました|さしあげました}。「{遠慮しないで|えんりょしないで}」と言われましたが、{別|べつ}の物も用意していたので、少し{驚きました|おどろきました}。

前に約束を忘れてしまって{怒られた|おこられた}ことを{謝りました|あやまりました}。それから、来月また会う予定を{知らせました|しらせました}。先生との{関係|かんけい}は、{コミュニケーション|こみゅにけーしょん}のおかげでずっと良いままです。`,
      en: `I visited my teacher's home. I bowed politely and gave a gift as thanks. They said, 'No need to hold back,' but since I had prepared something else too, I was a little surprised.

I apologized for having gotten scolded before, after forgetting a promise. Then I let them know about our plan to meet again next month. My relationship with my teacher has stayed good the whole time, thanks to good communication.`,
    },
    38: {
      jp: `旅行の{思い出|おもいで}を{アルバム|あるばむ}にまとめました。町を{見物して|けんぶつして}、写真をたくさん{写しました|うつしました}。{スーツケース|すーつけーす}にお土産を詰めて帰りました。

最近は{ジム|じむ}に通っています。{チーム|ちーむ}を作って、みんなで{ルール|るーる}を決めて{競争します|きょうそうします}。テニスでボールを{打つ|うつ}のが好きです。大きい{スクリーン|すくりーん}で試合を見て、勝った{プログラム|ぷろぐらむ}のチームはみんな{喜びました|よろこびました}。`,
      en: `I put together an album of memories from the trip. I saw the sights of the town and took a lot of photos. I packed souvenirs into my suitcase and came home.

Lately I've been going to the gym. We form teams, decide on rules together, and compete. I like hitting the ball in tennis. Watching the match on a big screen, the team that won on the program's schedule were all delighted.`,
    },
    39: {
      jp: `いろいろな{乗り物|のりもの}に乗るのが好きです。先週は{オートバイ|おーとばい}で{坂|さか}を登って、{トンネル|とんねる}を通りました。{運転手|うんてんしゅ}として、{スピード|すぴーど}を出しすぎないように気をつけています。

途中、道が{空いて|あいて}いたので、店に{寄りました|よりました}。{遠く|とおく}に見えた湖では{ボート|ぼーと}に乗る人がいました。信号で車が{ストップする|すとっぷする}のを見て、急ぐ{理由|りゆう}もないので、私も止まって少し休みました。`,
      en: `I like riding all kinds of vehicles. Last week I rode a motorcycle up a hill and passed through a tunnel. As the rider, I'm careful not to go too fast.

Along the way, the road was uncongested, so I stopped by a shop. At a lake that looked far off, there were people riding boats. Watching a car stop at the traffic light, since I had no reason to hurry either, I stopped too and rested a bit.`,
    },
    40: {
      jp: `最近、{ファッション|ふぁっしょん}に興味があります。新しい{ベルト|べると}と{アクセサリー|あくせさりー}を買いました。この{格好|かっこう}、私に{似合いますか|にあいますか}。

昨日は{床屋|とこや}に行って、髪を切りました。ジムの{ロッカー|ろっかー}に荷物を入れて、着替えました。新しい店が{オープンした|おーぷんした}ので見に行くと、店員の{マナー|まなー}がとても良かったです。爪に色を{塗る|ぬる}人もいましたが、私は{かまいません|かまいません}。少し{変|へん}かもしれませんが、これが好きです。`,
      en: `Lately I'm interested in fashion. I bought a new belt and some accessories. Does this look suit me?

Yesterday I went to the barber and got a haircut. I put my things in a locker at the gym and changed clothes. A new shop opened, so I went to check it out, and the staff's manners were very good. Some people paint their nails, but I don't mind either way. It might be a little strange, but I like it.`,
    },
    41: {
      jp: `一人で{暮らして|くらして}います。部屋には{ソファー|そふぁー}があって、夏は{クーラー|くーらー}、冬は{ストーブ|すとーぶ}を使います。{リモコン|りもこん}で{ライト|らいと}をつけたり消したりします。

ごみは{プラスチック|ぷらすちっく}と燃えるごみに{分けて|わけて}、{バケツ|ばけつ}に集めてから出します。魚を{燃やす|もやす}ように焼いたら、少し{臭く|くさく}なってしまいました。お湯が{沸いたら|わいたら}、飲み物を作って、{冷える|ひえる}前に飲みます。`,
      en: `I live alone. There's a sofa in my room, and I use the air conditioner in summer and the heater in winter. I turn the light on and off with the remote.

I separate the trash into plastic and burnable, gather it in a bucket, and put it out. When I grilled the fish so it was practically charred, it ended up smelling a bit. Once the water boils, I make a drink and drink it before it cools down.`,
    },
    42: {
      jp: `{最初|さいしょ}に{食料品|しょくりょうひん}を{用意しました|よういしました}。{最後|さいご}にケーキも買いました。パーティーで、料理を{両方|りょうほう}のテーブルに{配りました|くばりました}。

夜、電話が{鳴って|なって}、目が覚めました。誰かが車から物を{盗んだ|ぬすんだ}というニュースでした。びっくりして階段を{下りて|おりて}、寝ている家族を{起こしました|おこしました}。みんなの安全を{祈りました|いのりました}。`,
      en: `First I prepared the groceries. Last, I bought a cake too. At the party, I distributed the food to both tables.

At night, the phone rang and I woke up. It was news that someone had stolen something from a car. Startled, I went down the stairs and woke up my sleeping family. I prayed for everyone's safety.`,
    },
    43: {
      jp: `大学で日本語を{専門|せんもん}に勉強しています。{テキスト|てきすと}の{レベル|れべる}は高いですが、{先輩|せんぱい}が勉強の{仕方|しかた}を教えてくれます。クラスの{割合|わりあい}を見ると、留学生{以外|いがい}はほとんどいません。

試験は一時間{以内|いない}に{決まりました|きまりました}。他のクラスと{比べると|くらべると}、宿題が多くて大変です。でも{ちっとも|ちっとも}嫌になりません。日本語は毎日{どんどん|どんどん}上手になっていて、それが一番{大事|だいじ}なことです。`,
      en: `I'm studying Japanese as my specialty at university. The textbook's level is high, but a senior student teaches me how to study. Looking at the class makeup, there's almost no one apart from exchange students.

It was decided that the exam would be within one hour. Compared to other classes, there's a lot of homework, which is tough. But I don't mind it at all. My Japanese is getting better and better every day, and that's the most important thing.`,
    },
    44: {
      jp: `この町は{産業|さんぎょう}が{盛ん|さかん}で、車の{技術|ぎじゅつ}を{生産する|せいさんする}会社に{勤めて|つとめて}います。{国際|こくさい}的な{貿易|ぼうえき}の仕事もしています。

新しいプロジェクトを{計画して|けいかくして}います。部長が{承知して|しょうちして}くれたので、仕事は{進んで|すすんで}います。今日の仕事はもう{済んで|すんで}、{ほとんど|ほとんど}帰る準備ができました。{パートタイム|ぱーとたいむ}の仕事より{楽|らく}な気がします。`,
      en: `This town has a thriving industry, and I work at a company that produces car technology. I also do international trade work.

I'm planning a new project. Since the general manager agreed to it, the work is progressing. Today's work is already finished, and I'm almost ready to go home. It feels easier than part-time work.`,
    },
    45: {
      jp: `昨日、{腕|うで}と{背中|せなか}が痛くなりました。{首|くび}を回すと、もっと{ひどく|ひどく}痛みました。病院で{注射して|ちゅうしゃして}もらいました。{血|ち}を少し取られて、少し怖かったです。

医者は{ひげ|ひげ}を生やしていて、{マスク|ますく}をつけていました。{指|ゆび}の{爪|つめ}を見て、「元気に{生きて|いきて}いますね」と笑いました。動物の{毛|け}のアレルギーかもしれないと言われました。`,
      en: `Yesterday my arm and back started hurting. When I turned my neck, it hurt even worse. I had an injection at the hospital. They took a little blood, which was a bit scary.

The doctor had a beard and was wearing a mask. Looking at my fingernails, he laughed and said, 'You're living well.' He said it might be an allergy to animal fur.`,
    },
    46: {
      jp: `{森|もり}の中を歩きました。{草|くさ}の間に{虫|むし}がいて、子供が{捕まえました|つかまえました}。川の水が{流れる|ながれる}音がきれいでした。{浅い|あさい}ところも{深い|ふかい}ところもあって、{石|いし}や{砂|すな}が見えました。

風が{吹いて|ふいて}、木の枝が{揺れました|ゆれました}。夜になると星が{光り|ひかり}、月の周りを{雲|くも}が{回って|まわって}いるように見えました。冬には雪が{積もる|つもる}そうです。`,
      en: `I walked through the forest. There was an insect among the grass, and a child caught it. The sound of the river flowing was beautiful. There were both shallow and deep spots, and I could see the stones and sand.

The wind blew and the tree branches swayed. When night came, the stars shone, and the clouds looked like they were circling around the moon. Apparently snow piles up here in winter.`,
    },
    47: {
      jp: `お客様に「何を{召し上がりますか|めしあがりますか}」と聞きました。「これを{ご覧になりますか|ごらんになりますか}」とメニューを見せると、「そうする」と{おっしゃいました|おっしゃいました}。

先生のお名前は{ご存じですか|ごぞんじですか}。今度、私が{参ります|まいります}ので、{申し上げたい|もうしあげたい}ことがあります。何を{なさいますか|なさいますか}、こちらから{おいでになりますか|おいでになりますか}と伺いました。私もお手伝い{いたします|いたします}。「田中と{申します|もうします}」と自己紹介して、会議室に{おります|おります}と伝えました。資料を{拝見しました|はいけんしました}。`,
      en: `I asked the customer, 'What will you have to eat?' When I showed them the menu and asked, 'Would you like to see this?' they said, 'I'll do that.'

Do you know the teacher's name? I'll be the one coming next time, so there's something I'd like to say. I asked what they would be doing, and whether they would be coming from here. I'll help as well. I introduced myself saying, 'I'm called Tanaka,' and told them I'd be in the meeting room. I looked over the materials.`,
    },
    48: {
      jp: `三年間頑張って、{とうとう|とうとう}日本語の試験に合格しました。{非常に|ひじょうに}嬉しかったです。最初は{それほど|それほど}上手ではありませんでしたが、{だいぶ|だいぶ}話せるようになりました。

これからも{なるべく|なるべく}日本語で話す練習をします。難しいときも{けっして|けっして}あきらめません。{やはり|やはり}、続けることが大事だと思います。今は{すっかり|すっかり}自信がつきました。`,
      en: `After working hard for three years, I finally passed the Japanese exam. I was extremely happy. At first I wasn't that good, but I've become able to speak quite a bit.

I'll keep practicing speaking Japanese as much as possible going forward. Even when it's hard, I will never give up. After all, I think continuing is what matters. Now I've gained complete confidence.`,
    },
    49: {
      jp: `宿題は{ちゃんと|ちゃんと}やっています。{特に|とくに}数学が好きで、{けっこう|けっこう}得意です。他の科目は{そんなに|そんなに}好きではありませんが、{もちろん|もちろん}ちゃんと勉強します。

先週の試験は{かなり|かなり}難しかったですが、{ずいぶん|ずいぶん}準備をしたので、{きっと|きっと}大丈夫だと思います。`,
      en: `I'm doing my homework properly. I especially like math and I'm pretty good at it. I don't like the other subjects that much, but of course I study them properly too.

Last week's exam was quite difficult, but since I prepared a lot, I'm sure it'll be fine.`,
    },
    50: {
      jp: `新しいレポートの{テーマ|てーま}について、いい{アイデア|あいであ}が浮かびました。まず数字を{足したり|たしたり}{割ったり|わったり}して、データを{チェックしました|ちぇっくしました}。

友達に手伝ってもらって、いくつかの表を{結びました|むすびました}。少し{適当に|てきとうに}書いたところを{動かして|うごかして}直すと、「{なるほど|なるほど}」と{助けて|たすけて}くれました。この作業、風邪が{うつる|うつる}ように誰かに教えたら{または|または}楽になるかもしれません。{不思議|ふしぎ}なことに、そう思ったら本当に楽しくなりました。`,
      en: `A good idea came to mind for the theme of my new report. First I added and divided numbers, checking the data.

With a friend's help, I linked a few tables together. When I moved and fixed a part I'd written a bit carelessly, they said, 'I see,' and helped me. This kind of work might get easier if I teach it to someone else, the way a cold spreads, or something like that. Strangely enough, once I thought that, it actually became fun.`,
    },
  },
  N3: {},
};
