// lib/japanese/data/passages.js — one short reading passage per vocab
// lesson, written to use as much of that lesson's word list as naturally
// fits into a coherent story. Meant for initial learning (seeing a word in
// context), not revision -- Flashcards/Writing/Furigana already cover
// drilling words you've already met once.
//
// N4 lessons 1-30 are one continuous, chronological story (a couple's
// life together, roughly in lesson order: dating, moving in, a pregnancy,
// the baby's first year) so each lesson reads as the next chapter instead
// of an isolated, vocab-stuffed scene -- lessons 31-50 are still
// standalone scenes.
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
      jp: `{僕|ぼく}の妻が先週{熱|ねつ}を出しました。「{のど|のど}も痛い」と言うので、僕はとても{心配しました|しんぱいしました}。すぐ妻を病院へ{連れて行き|つれていき}ました。受付で書類に「患者の{夫|おっと}」と書いていると、後ろから声がしました。

振り向くと、大学時代の友達でした。「久しぶり!」と驚いていると、友達は隣にいた男の人を{紹介して|しょうかいして}{くれました|くれました}。「{主人|しゅじん}なの。お医者さんなんだ」。ご主人は妻の検査をいろいろ{手伝って|てつだって}くれて、すぐ診てくれることになりました。まだ{若い|わかい}先生でしたが、とても頼りになりました。

検査の間、妻は「ちょっと怖い」と言って僕の手を握りました。しばらく待って、「大丈夫、ただの風邪ですよ」と聞いて、二人でほっとしました。帰るとき、ご主人から花を一輪{もらいました|もらいました}。妻は花を見て、少し笑いました。

妻が数日入院している間、家はとても{寂しかった|さびしかった}です。毎晩病院に行って、妻の{髪|かみ}をとかしてあげました。でも、みんなが助けてくれたおかげで、妻はすぐ元気になりました。`,
      en: `My wife came down with a fever last week. Since she said her throat hurt too, I got really worried. I rushed her to the hospital. While I was writing "patient's husband" on the paperwork at reception, I heard a voice behind me.

I turned around, and it was a friend from my university days. "Long time no see!" I said, surprised, and she introduced the man standing next to her. "This is my husband. He's a doctor." Her husband helped a lot with my wife's examination and arranged to see her right away. He was still a young doctor, but very reliable.

During the exam, my wife squeezed my hand and said, "I'm a little scared." After waiting a while, we heard, "Don't worry, it's just a cold," and we both felt relieved. On the way out, her husband gave us a single flower. My wife looked at it and smiled a little.

While my wife was in the hospital for a few days, the house felt very lonely. Every night I went and brushed her hair for her. But thanks to everyone who helped, she got better quickly.`,
    },
    2: {
      jp: `妻が元気になってから、二人でよく出かけるようになりました。僕たちの{趣味|しゅみ}はよく似ています。休みの日は{美術館|びじゅつかん}に行ったり、近所の公園で{(お)花見|おはなみ}をしたりします。

先月、妻の誕生日に{コンサート|こんさーと}のチケットを買いました。二人で行くのは{一度|いちど}目でしたが、とても楽しくて、「{ぜひ|ぜひ}また行こうね」と約束しました。妻は音楽に合わせて少し{ダンス|だんす}をして、僕を笑わせました。

冬になったら、{スキー|すきー}をしに行く予定です。それまでは、家で{アニメ|あにめ}や{マンガ|まんが}を読んで過ごしています。好きな番組が{放送|ほうそう}される日は、忘れないように{ビデオ|びでお}に録画しておきます。友達が出る野球の{試合|しあい}がある日も、二人で応援に行きます。

それから、妻は毎日{日記|にっき}を書くようになりました。「将来、読み返したいから」だそうです。僕も真似して、旅行のチケットや写真を{集める|あつめる}ことにしました。`,
      en: `After my wife got better, the two of us started going out together often. Our hobbies are pretty similar. On days off we go to art museums, or view cherry blossoms in the park near our house.

Last month, for my wife's birthday, I bought concert tickets. It was our first time going together, and it was so much fun that we promised, "Let's definitely go again." My wife did a little dance along with the music and made me laugh.

Once winter comes, we're planning to go skiing. Until then, we spend time at home reading anime and manga. On days when a show we like airs, we always record it on video so we don't forget. On days when a friend has a baseball game, the two of us go cheer him on.

Also, my wife has started writing in a diary every day — "because I'll want to read it back someday," she says. I copied her and decided to start collecting travel tickets and photos.`,
    },
    3: {
      jp: `コンサートの帰り道、妻が「今度は{世界|せかい}のどこかへ旅行に行きたいな」と言いました。僕もずっと考えていたので、その場で{予約しました|よやくしました}。行き先はハワイです。

出発の日が{もうすぐ|もうすぐ}なので、{準備|じゅんび}で忙しい毎日です。現地に住んでいる友達が街を{案内して|あんないして}くれるというので、少し安心しました。友達の家に少し{泊まる|とまる}予定です。

当日、まず{船|ふね}で川を渡ってから、車で{空港|くうこう}へ向かいました。ところが、途中で車が急に{動かなく|うごかなく}なりました。慌てて道の端に{止めて|とめて}、タクシーを呼びました。時間がなかったので{急行|きゅうこう}電車に乗って{乗り換え|のりかえ}を二回して、なんとか間に合いました。{交通|こうつう}の心配ばかりで、疲れてしまいました。

空港に着くと、妻が「本当は出発前に{神社|じんじゃ}にお参りしたかったのに」と{残念|ざんねん}そうに言いました。「帰ってきたら一緒に行こう」と約束して、僕たちは飛行機に乗り込みました。`,
      en: `On the way home from the concert, my wife said, "Next time I want to travel somewhere in the world." I'd been thinking the same thing, so I booked it on the spot. Our destination is Hawaii.

Departure day is coming up soon, so we've been busy preparing. A friend living there offered to show us around the city, which put me a little at ease. We're planning to stay at their place for a bit.

On the day itself, we first crossed a river by ferry, then headed to the airport by car. But partway there, the car suddenly wouldn't move. Flustered, I pulled over to the side of the road and called a taxi. We had no time left, so we took the express train and transferred twice, and somehow made it in time. Between all the worry about transportation, I was exhausted.

At the airport, my wife said regretfully, "I really wanted to visit the shrine before we left." "Let's go together when we get back," I promised, and we boarded the plane.`,
    },
    4: {
      jp: `ハワイから帰ってきてしばらくして、僕たちは新しいアパートへ{引っ越し|ひっこし}することにしました。前の部屋より少し広くて、{すてき|すてき}な部屋です。新しい{住所|じゅうしょ}を友達みんなに知らせました。

引っ越しの日、{棚|たな}をいくつも運んで、本や食器を並べました。{パソコン|ぱそこん}も無事に届いて、{つけて|つけて}みると、ちゃんと動きました。でも、寝室の電気の{スイッチ|すいっち}が{故障して|こしょうして}いて、電気を{消せません|けせません}でした。「今度{修理して|しゅうりして}もらおう」と妻と話しました。

古い{布団|ふとん}や使わない物は、思い切って{捨てました|すてました}。「これも{役に立つ|やくにたつ}かも」と迷うこともありましたが、結局ほとんど捨てて、部屋がすっきりしました。

{そろそろ|そろそろ}{ごみ|ごみ}を出す時間です。窓から新しい町の景色を見ながら、二人で「ここでの生活が楽しみだね」と話しました。`,
      en: `A while after we got back from Hawaii, we decided to move to a new apartment. It's a bit bigger than our old place, and really lovely. We let all our friends know the new address.

On moving day, we carried in several shelves and lined up our books and dishes. The PC arrived safely too, and when I turned it on, it worked fine. But the bedroom light switch was broken, and we couldn't turn the light off. "Let's have it repaired sometime," we agreed.

We decided to throw away our old futon and other things we no longer used. Sometimes we hesitated, thinking "this might still be useful," but in the end we threw away most of it, and the room felt so much cleaner.

It's about time to take out the trash. Looking at the new neighborhood through the window, the two of us said, "I can't wait to start our life here."`,
    },
    5: {
      jp: `新しい部屋に合う家具を買いに、デパートへ行きました。{エスカレーター|えすかれーたー}で家具の{売り場|うりば}まで上がると、店員さんがすぐに来て、丁寧な{サービス|さーびす}で案内してくれました。

ソファーの{サイズ|さいず}を測ってから、色々{触って|さわって}座り心地を確かめました。値段は{億|おく}まではいきませんが、二人にとっては大きな買い物です。{カード|かーど}で{払おう|はらおう}かと思いましたが、現金の方がいいという妻の意見で、近くのATMでお金を{下ろしました|おろしました}。

ボタンを{押す|おす}だけで簡単に操作できて、驚きました。会計のとき{細かい|こまかい}お金がなくて、大きいお札を出すと、店員さんが丁寧に{お釣り|おつり}を数えてくれました。

最後に、いつもお世話になっている友達への{(お)土産|おみやげ}も少し買いました。今度の週末、新しい家に招待するつもりです。`,
      en: `We went to the department store to buy furniture that would suit our new place. We took the escalator up to the furniture section, and a salesperson came right over and guided us with polite service.

We measured the sofa's size, then touched several to check how comfortable they were. The price wasn't in the hundreds of millions, but it was still a big purchase for the two of us. I thought about paying by card, but my wife thought cash would be better, so we withdrew money at a nearby ATM.

I was surprised at how easily it operated with just the press of a button. At checkout I didn't have small change, so I handed over a large bill, and the salesperson carefully counted out my change.

Finally, we also bought a small souvenir for a friend who's always looked out for us. We're planning to invite them over to the new place this weekend.`,
    },
    6: {
      jp: `新しい家に友達を招待した日、妻が「実は、また大学で{研究したい|けんきゅうしたい}と思っているの」と話しました。{高校|こうこう}を出てからずっと働いていた妻でしたが、昔からの夢だったそうです。

それから妻は、毎晩机に向かって勉強するようになりました。難しい{字|じ}が{全然|ぜんぜん}読めなくて困ったときは、辞書で{調べたり|しらべたり}、僕に{意味|いみ}を聞いたりしていました。僕もうまく{説明できず|せつめいできず}、二人で{考え|かんがえ}ながら、なんとか答えを見つけました。

友達の中には、昔{留学生|りゅうがくせい}として海外で{ホームステイ|ほーむすてい}をした人がいて、勉強のコツを教えてくれました。「{だいたい|だいたい}わかればいいから、あまり気にしないで」というアドバイスに、妻は少し安心したようでした。

入学の{試験|しけん}の日、妻は{消しゴム|けしごむ}を握りしめながら{答え|こたえ}を書いていました。帰ってきて、「{レポート|れぽーと}を書く宿題も出た」と少し疲れた顔で笑いました。`,
      en: `On the day we invited a friend over to the new house, my wife told me, "Actually, I've been thinking I want to go back and study at university." She'd worked ever since finishing high school, but apparently it had been a long-held dream.

After that, my wife started sitting down to study every night. When she got stuck on kanji she couldn't read at all, she'd look them up in the dictionary or ask me what they meant. I wasn't always able to explain well either, so we'd think it through together and somehow find the answer.

Among our friends was someone who had once been an exchange student and done a homestay abroad, and she gave my wife some study tips. "It's fine if you mostly understand — don't worry too much," she said, and my wife seemed a little reassured.

On the day of the entrance exam, my wife wrote her answers while gripping an eraser tightly. When she got home, she said with a tired smile, "They also gave us a report to write."`,
    },
    7: {
      jp: `妻が勉強を始めた頃、僕の仕事にも変化がありました。新しい{事務所|じむしょ}に移ることになり、{社長|しゃちょう}から直接、{部長|ぶちょう}の仕事を手伝ってほしいと頼まれたのです。学生の頃の{アルバイト|あるばいと}とは違って、責任の大きい仕事でした。

初日、{受付|うけつけ}で緊張しながら「{失礼|しつれい}します」と言って{会議室|かいぎしつ}に入りました。{スーツ|すーつ}を着るのも久しぶりで、少し窮屈に感じました。{経済|けいざい}についての{会議|かいぎ}は{簡単|かんたん}ではなく、初めはついていくのが{大変|たいへん}でした。

{コンピューター|こんぴゅーたー}で資料を作り、部長にメールで{送りました|おくりました}。「よくできているね」と褒められて、少しほっとしました。{昼休み|ひるやすみ}に妻にメッセージを送ると、「頑張ったね」と返事が来て、元気が出ました。`,
      en: `Around the time my wife started studying, things changed at my job too. I was moved to a new office, and the president himself asked me to help the general manager directly. It was a much bigger responsibility than the part-time work I'd done as a student.

On my first day, I nervously said "excuse me" at reception and went into the meeting room. It had been a while since I'd worn a suit, and it felt a little stiff. The meeting about the economy wasn't easy, and at first it was hard just to keep up.

I put together materials on the computer and sent them to the general manager by email. "This is well done," he said, which was a relief. At lunch break I messaged my wife, and her reply — "you worked hard" — gave me energy.`,
    },
    8: {
      jp: `忙しい日々を送るうちに、{季節|きせつ}はすっかり冬になりました。{(お)正月|おしょうがつ}は僕の{田舎|いなか}に帰ることにしました。{建物|たてもの}が少なくて静かな町で、車がないと{不便|ふべん}な場所です。

駅から実家までは、{交差点|こうさてん}を{渡って|わたって}、大きな木がある{角|かど}を{曲がる|まがる}と、すぐ着きます。実家の前に小さな{駐車場|ちゅうしゃじょう}があって、そこに車を止めました。

久しぶりに帰ると、近くの{(お)寺|おてら}で{(お)祭り|おまつり}が開かれていました。両親と一緒に{着物|きもの}を着て出かけると、町の人たちがみんな声をかけてくれました。妻もこの{県|けん}の雰囲気をとても気に入ったようでした。

帰りに、歯が痛いと言い出した妻を連れて{歯医者|はいしゃ}に寄りました。「ただの疲れですね」と言われて、二人で笑いました。`,
      en: `As our busy days went on, the season had turned to winter. We decided to go back to my hometown in the countryside for New Year's. It's a quiet town with few buildings, and inconvenient without a car.

From the station to my parents' house, you cross an intersection and turn at the corner with the big tree, and you're there right away. There's a small parking lot in front of the house, so we parked there.

It had been a while since I'd been back, and a festival was being held at the nearby temple. My parents and I went out wearing kimono, and everyone in town greeted us. My wife seemed to really like the atmosphere of this prefecture too.

On the way back, my wife said her tooth hurt, so we stopped by the dentist. "It's just fatigue," we were told, and we laughed about it together.`,
    },
    9: {
      jp: `田舎から帰ってきた数週間後、妻の様子が少し変わりました。「実は、赤ちゃんができたの」。僕は{すごい|すごい}驚いて、しばらく言葉が出ませんでした。

その夜、{久しぶり|ひさしぶり}に古い友達に電話をしました。友達には{息子|むすこ}と{娘|むすめ}がいて、子育ての話をいろいろ聞かせてくれました。「{普通|ふつう}の毎日が一番大変で、一番幸せだよ」と言われて、少し{将来|しょうらい}が楽しみになりました。

友達の家には{ペット|ぺっと}の犬もいて、僕たちが遊びに行くと、大きな{声|こえ}で吠えて出迎えてくれました。小さいのに{力|ちから}が強くて、驚きました。

僕たちはまだ名前を{決めて|きめて}いませんが、「{うそ|うそ}みたいだね、僕たちに子供ができるなんて」と妻と何度も話しました。「お父さんになるんだから、{偉い|えらい}人にならないとね」と冗談を言うと、妻は笑いました。{夢|ゆめ}のような気分の日々です。`,
      en: `A few weeks after we got back from the countryside, something about my wife seemed different. "Actually, we're going to have a baby." I was so amazed, I couldn't say anything for a while.

That night, I called an old friend for the first time in ages. She has a son and a daughter, and told us all about raising kids. "The ordinary days are the hardest and the happiest," she said, and it started to make the future feel a little exciting.

Our friend also has a pet dog, and when we visited, it barked loudly to greet us. It was small but surprisingly strong.

We haven't decided on a name yet, but my wife and I kept saying to each other, "It's unbelievable, that we're going to have a child." "I guess I'll have to become someone admirable now that I'm going to be a father," I joked, and she laughed. It feels like a dream, these days.`,
    },
    10: {
      jp: `妊娠がわかってから、僕たちの生活は少し落ち着きました。先週見に行った{展覧会|てんらんかい}を最後に、出かけるのは控えています。{今夜|こんや}も外に出かけず、家で静かに過ごしています。妻は{小説|しょうせつ}を読んだり、僕は好きな{ドラマ|どらま}の{番組|ばんぐみ}を見たりします。この間見た映画は{すばらしい|すばらしい}話で、二人とも泣いてしまいました。

医者に勧められて、妻は毎日軽く{運動する|うんどうする}ようにしています。無理せず{練習|れんしゅう}を続けるだけで、{けがしない|けがしない}ように気をつけながら、近所を散歩します。僕も一緒に歩いて、時々二人で子供みたいに小さいボールを{投げて|なげて}遊びます。

妻の妹が遊びに来た日は、三人で{ゲーム|げーむ}をしました。妻は僕に{勝つ|かつ}と嬉しそうに{踊り|おどり}出し、僕が{負ける|まける}とみんなで笑いました。こんな{すばらしい|すばらしい}時間が、これからも続けばいいなと思います。`,
      en: `Since we found out about the pregnancy, our life has settled down a bit. We've been holding off on going out since an exhibition we saw last week. Tonight too, instead of going out, we're spending a quiet evening at home. My wife reads novels, and I watch a drama I like. The movie we watched the other day was such a wonderful story that we both ended up crying.

On the doctor's advice, my wife has been exercising lightly every day. Just keeping up a gentle routine without overdoing it, being careful not to get hurt, we take walks around the neighborhood. I walk with her, and sometimes we throw a small ball back and forth like kids.

When my wife's sister came to visit, the three of us played a game. When my wife beats me she does a happy little dance, and when I lose everyone laughs. I hope wonderful moments like this keep happening.`,
    },
    11: {
      jp: `出産予定日が近づいたある週末、友達の子供たちと{動物園|どうぶつえん}へ行く{予定|よてい}でした。でも前の日、妻が「なんだかお腹の調子がおかしい」と言い出しました。行く{場所|ばしょ}を病院に変えることにしました。

その夜、外に出ると{星|ほし}がきれいに{見えました|みえました}が、それを楽しむ余裕はありませんでした。妻は痛みで{騒ぐ|さわぐ}こともなく、静かに僕の{都合|つごう}を気にして、「大丈夫、まだ{約束|やくそく}の時間まで平気だよ」と言っていました。

車に乗ろうとすると、{エンジン|えんじん}が{かかりません|かかりません}でした。焦っている僕を見て、友達がすぐに家まで{迎えに|むかえに}来てくれました。病院までの{帰り|かえり}道ならぬ行き道、遠くから救急車の音が{聞こえて|きこえて}、少し落ち着きました。

無事に病院に着き、僕はやっと少し{気分|きぶん}が落ち着きました。「もう{戻れない|もどれない}よ、生まれてくるまで頑張ろう」と妻の手を握りました。`,
      en: `One weekend close to the due date, we had plans to go to the zoo with a friend's kids. But the day before, my wife said, "Something feels off with my stomach." We changed our destination to the hospital instead.

That night, when I stepped outside, the stars looked beautiful, but I had no room to enjoy them. My wife wasn't making a fuss despite the pain; she calmly worried about my schedule, saying, "It's okay, we still have time before the appointment."

When I tried to start the car, the engine wouldn't turn over. Seeing me panic, a friend came right over to pick us up. On what should have been our way back but was instead our way to the hospital, I could hear an ambulance siren in the distance, which calmed me down a little.

We made it to the hospital safely, and I finally felt myself settle down. "There's no turning back now — let's do our best until the baby comes," I said, holding my wife's hand.`,
    },
    12: {
      jp: `無事に赤ちゃんが生まれて、僕たちの生活は{たいてい|たいてい}赤ちゃん中心になりました。ゆっくり{食事する|しょくじする}時間も{なかなか|なかなか}なくて、簡単な{サンドイッチ|さんどいっち}で済ませる日が多いです。

妻は赤ちゃんに{ミルク|みるく}をあげながら、「{お湯|おゆ}を沸かしてくれる?」と僕に頼みます。台所の{ガス|がす}をつけて、お茶を入れるのが僕の役目になりました。

友達が家に来て、手料理を{ごちそうして|ごちそうして}くれた日もありました。「この{味|あじ}、懐かしいね」と妻が言うと、友達は嬉しそうでした。赤ちゃんは硬い物を{かむ|かむ}ことはまだできないので、大人だけで食べました。

食後、料理が少し{残ったので|のこったので}、冷蔵庫で{冷やして|ひやして}おきました。テーブルを{片付けて|かたづけて}いる間、友達が赤ちゃんをあやしてくれて、本当に助かりました。{ガム|がむ}も噛めない小さな手で、僕の指をぎゅっと握る赤ちゃんが愛おしいです。`,
      en: `After the baby was born safely, our life became almost entirely centered on the baby. We rarely have time for a proper meal, so we often make do with a simple sandwich.

My wife feeds the baby milk and asks me, "Can you boil some water?" Turning on the gas stove and making tea has become my job.

A friend came over one day and treated us to home-cooked food. "This taste brings back memories," my wife said, and our friend looked pleased. The baby can't chew anything hard yet, so only the adults ate.

Some food was left over after the meal, so we put it in the fridge to chill. While I was clearing the table, our friend rocked the baby, which was a huge help. The baby can't even chew gum with those tiny hands, but the way it grips my finger is so precious.`,
    },
    13: {
      jp: `赤ちゃんの物を置く場所を作るため、クローゼットを整理しました。奥から、結婚前に一人で{生活して|せいかつして}いた頃に着ていた古い{ジャケット|じゃけっと}や{下着|したぎ}が出てきました。

あの頃は{忘れ物|わすれもの}が多くて、{クリーニングに|くりーにんぐに}出すのをよく忘れていたな、と懐かしくなりました。掃除の{道具|どうぐ}も、当時のままです。

床を掃除していると、電気が急に{消えて|きえて}、また{ついたり|ついたり}して驚きました。配線が古いのかもしれません。靴下を{はいた|はいた}まま床に座り込んでいると、隅で小さな指輪を{拾いました|ひろいました}。結婚指輪をなくして探していたときのことを思い出し、思わず笑ってしまいました。

手が{汚れた|よごれた}ので、水道の水を{引いて|ひいて}洗いました。あの頃はもっと自分のことだけに{気をつけて|きをつけて}いればよかったのに、今は{十分|じゅうぶん}すぎるほど、家族のことで頭がいっぱいです。庭には、いつか妻と{植えた|うえた}小さな木が、もうずいぶん大きくなっていました。`,
      en: `To make room for the baby's things, we cleaned out the closet. From the back came an old jacket and some underwear I'd worn back when I lived alone before we got married.

I got nostalgic remembering how, back then, I often forgot things and would forget to take clothes to the cleaners. The cleaning tools were still exactly as they were back then.

While cleaning the floor, the lights suddenly went out, then flickered back on, startling me. The wiring might be old. Sitting on the floor still wearing my socks, I found a small ring in the corner. It reminded me of the time I lost my wedding ring and searched everywhere, and I couldn't help but laugh.

My hands got dirty, so I ran the tap water and washed them. Back then I only had to be careful about myself; now my head is more than full of my family. In the yard, a small tree my wife and I once planted had already grown quite tall.`,
    },
    14: {
      jp: `赤ちゃんの部屋を作ることにしました。部屋の{真ん中|まんなか}に小さいベッドを置いて、{隅|すみ}には{人形|にんぎょう}をいくつか{飾りました|かざりました}。妻の友達からもらった{鏡|かがみ}も壁に{かけました|かけました}。

準備をしている途中、うっかり{引き出し|ひきだし}を強く引きすぎて、取っ手が{折れて|おれて}しまいました。慌てて新しい物に{取り替えました|とりかえました}。それから、窓の{ガラス|がらす}のそばにあった写真立てを{落として|おとして}、{割れて|われて}しまいました。危ないので、赤ちゃんが動き回るようになる前に、家具の位置を{変える|かえる}ことにしました。

庭の木の{枝|えだ}が窓に当たって、少し{壊れて|こわれて}いた網戸も直しました。慌ただしい一日でしたが、部屋が少しずつ赤ちゃんらしくなっていくのが嬉しくて、僕たちは何度も部屋を覗きに行きました。`,
      en: `We decided to make a room for the baby. We put a small bed in the middle of the room and decorated the corner with a few dolls. We also hung a mirror we got from a friend of my wife's on the wall.

While preparing, I accidentally pulled a drawer too hard and the handle snapped off. I hurried to replace it with a new one. Then I dropped a picture frame near the window glass, and it shattered. Since it was dangerous, we decided to rearrange the furniture before the baby started crawling around.

We also fixed the screen door that had been slightly damaged where a tree branch from the yard hit the window. It was a hectic day, but seeing the room slowly start to look like a baby's room made us so happy that we kept peeking in again and again.`,
    },
    15: {
      jp: `赤ちゃんに必要な{品物|しなもの}を買いに、また出かけました。ちょうど僕の{ボーナス|ぼーなす}が出た月だったので、少し余裕がありました。

{平日|へいじつ}の昼間だったので、店は{開いて|あいて}いてすいていました。ベビーカーの{値段|ねだん}を{メモして|めもして}、いくつかの店を回ってから{選ぶ|えらぶ}ことにしました。人気の物はすぐ{売れて|うれて}しまうと聞いていたので、少し急ぎました。

会計のとき、{財布|さいふ}を{なくした|なくした}かと思って焦りましたが、バッグの底で{見つけました|みつけました}。お金は{足りて|たりて}いたので安心しましたが、心臓が止まるかと思いました。店が{閉まる|しまる}時間ぎりぎりまで買い物をして、少し{むだ|むだ}に時間を使ってしまったかもしれません。それでも、二人で選んだベビーカーを見て、幸せな気持ちになりました。`,
      en: `We went out again to buy the things we needed for the baby. It happened to be the month my bonus came in, so we had a bit of extra room.

Since it was a weekday afternoon, the store was open and not crowded. We noted down stroller prices and went around to a few shops before choosing one. I'd heard popular items sell out fast, so we hurried a little.

At checkout, I thought I'd lost my wallet and panicked, but found it at the bottom of my bag. We had enough money, which was a relief, but my heart nearly stopped. We shopped right up until the store's closing time, maybe wasting a bit of time. Still, seeing the stroller we'd chosen together made us feel happy.`,
    },
    16: {
      jp: `赤ちゃんが生まれても、妻は大学に{通う|かよう}のをやめませんでした。授業の前は{予習して|よしゅうして}、帰ってきたら赤ちゃんを寝かせてから{復習します|ふくしゅうします}。とても{まじめ|まじめ}な学生です。

ある日、赤ちゃんが熱を出して、大事な{講義|こうぎ}に{出席できません|しゅっせきできません}でした。先生に{連絡して|れんらくして}事情を話すと、「大丈夫、レポートを{出せば|だせば}問題ないですよ」と{返事|へんじ}をもらいました。

試験を{受ける|うける}日、妻は準備が{間に合うか|まにあうか}心配で、朝からずっと落ち着きませんでした。{急いで|いそいで}家を出ましたが、電車が{遅れて|おくれて}、教室の{席|せき}に着いたときは息を切らしていました。

「今日は{失敗した|しっぱいした}かも」と帰ってきて肩を落としていましたが、数日後、思ったよりいい点数だったと知って、二人で喜びました。`,
      en: `Even after the baby was born, my wife didn't stop commuting to university. Before class she prepares, and after coming home she puts the baby to sleep before reviewing. She's a very serious student.

One day the baby had a fever, and she couldn't attend an important lecture. She contacted the professor to explain, and got the reply, "It's fine, just hand in a report and there's no problem."

On the day of the exam, she was worried all morning about whether she'd make it in time. She hurried out of the house, but the train was late, and by the time she reached her seat in the classroom, she was out of breath.

"I think I failed today," she said, shoulders slumped, when she got home. But a few days later, we found out her score was better than expected, and we celebrated together.`,
    },
    17: {
      jp: `試験の後も、妻の勉強は楽ではありませんでした。ある夜、「もう{無理|むり}かもしれない、{やめようかな|やめようかな}」と{ずっと|ずっと}悩んでいた気持ちを話してくれました。

聞くと、大学の{規則|きそく}が厳しくて、{廊下|ろうか}を走っただけで{注意された|ちゅういされた}ことや、レポートで漢字を{間違えて|まちがえて}先生に{直された|なおされた}ことが続いて、自信をなくしていたようでした。

僕は、妻が結婚前に「{熱心|ねっしん}に勉強を{続けたい|つづけたい}」と話していたことを{思い出して|おもいだして}伝えました。「あなたの{意見|いけん}はいつも大事だし、僕はあなたが決めたことを{守るよ|まもるよ}」。

翌朝、妻は机にノートを{並べて|ならべて}、また静かに勉強を始めました。小さな{音|おと}を立てないように、僕はそっと部屋を出ました。`,
      en: `Even after the exam, my wife's studies weren't easy. One night, she finally told me what she'd been struggling with the whole time: "Maybe it's impossible, maybe I should quit."

Listening to her, I learned the university's rules were strict — she'd been warned just for running in the hallway, and had lost confidence after repeatedly getting corrected by her professor for kanji mistakes in her reports.

I reminded her of something she'd said before we got married: that she wanted to keep studying hard, enthusiastically. "Your opinion always matters, and I'll support whatever you decide."

The next morning, my wife lined up her notebooks on the desk and quietly started studying again. I stepped out of the room quietly, careful not to make a sound.`,
    },
    18: {
      jp: `春になり、赤ちゃんも少しずつ大きくなりました。ある日曜日、天気が{晴れて|はれて}きたので、三人で近所を散歩することにしました。朝は{曇って|くもって}いましたが、雨が{やんだ|やんだ}後、きれいな青空が広がりました。

{南|みなみ}の方へ歩いていくと、新しく{建てられた|たてられた}白い{教会|きょうかい}が見えてきました。面白い{形|かたち}をした屋根で、赤ちゃんも興味深そうに見ていました。

公園は休日でいつも{込んで|こんで}いますが、この日は少し{すいて|すいて}いました。{緑|みどり}の木々に囲まれたベンチに座って、遠くの{景色|けしき}を眺めました。夜には{月|つき}が{はっきり|はっきり}見えて、赤ちゃんが指をさして喜びました。

こんな穏やかな時間が{続く|つづく}といいなと、妻と話しました。`,
      en: `Spring came, and the baby had grown a bit more. One Sunday, the weather cleared up, so the three of us decided to take a walk around the neighborhood. It had been cloudy in the morning, but after the rain stopped, a beautiful blue sky spread out.

Walking south, we came across a newly built white church. It had an interesting-shaped roof, and even the baby seemed curious, watching it closely.

The park is always crowded on holidays, but that day it was a little emptier than usual. We sat on a bench surrounded by green trees and looked out at the view in the distance. At night, the moon was clearly visible, and the baby pointed at it happily.

We talked about how nice it would be if these peaceful days kept going.`,
    },
    19: {
      jp: `赤ちゃんが生まれて初めて、僕の{祖父|そふ}と{祖母|そぼ}の{お宅|おたく}へ連れて行きました。玄関に着くと、{おば(さん)|おばさん}と{おじ(さん)|おじさん}も来ていて、みんなで赤ちゃんを迎えてくれました。

祖母は赤ちゃんを見て、「まあ、なんて{赤ちゃん|あかちゃん}!」と{びっくりして|びっくりして}、涙を浮かべていました。祖父は「よく{育てて|そだてて}いるね」と僕たちを{褒めて|ほめて}くれて、少し照れくさかったです。

みんな本当に{親切|しんせつ}で、「{お子さん|おこさん}のために」と、たくさんの{お祝い|おいわい}をくれました。妻はその{気持ち|きもち}に感激して、何度もお礼を言っていました。

帰り道、妻が「みんなに会えて{安心した|あんしんした}」とつぶやきました。僕も同じ気持ちでした。`,
      en: `For the first time since the baby was born, we took her to visit my grandfather and grandmother's house. When we arrived at the door, my aunt and uncle were there too, and everyone welcomed the baby together.

My grandmother looked at the baby and said, "Oh, what a baby!" — utterly surprised, with tears in her eyes. My grandfather praised us, saying, "You're raising her well," which was a little embarrassing.

Everyone was so kind, giving us all kinds of gifts "for the little one." My wife was moved by their thoughtfulness and thanked them again and again.

On the way home, my wife murmured, "I feel relieved, having gotten to see everyone." I felt exactly the same way.`,
    },
    20: {
      jp: `祖母が「今度、家族みんなで{海岸|かいがん}沿いの{村|むら}に行かない?」と{誘って|さそって}くれました。おじ夫婦も一緒に行くことになり、{特別|とくべつ}な旅行になりそうです。

{天気予報|てんきよほう}で晴れが続くと聞いて、みんなで{出発しました|しゅっぱつしました}。{ラッシュ|らっしゅ}の時間を避けるため、早朝に家を{出発する|しゅっぱつする}ことにしたので、電車も空いていて楽でした。

{港|みなと}から小さな船に乗って、小さな{島|しま}へ渡りました。赤ちゃんを抱っこしながら軽く{ハイキングして|はいきんぐして}、山道を{通り|とおり}ました。頂上から見た景色はとても{美しく|うつくしく}、みんなで写真を撮りました。

夜は{旅館|りょかん}に泊まりました。夕食の{会場|かいじょう}で、祖父が「こんな旅行に{必要|ひつよう}なのは、家族全員がいることだけだね」と言って、みんなで笑いました。`,
      en: `My grandmother invited us: "Why don't we all go together to a village along the coast sometime?" My aunt and uncle decided to come too, so it was shaping up to be a special trip.

Hearing from the weather forecast that clear skies would continue, we all set off. To avoid rush hour, we decided to leave early in the morning, so the trains were empty and easy to ride.

From the port, we took a small boat over to a small island. Carrying the baby, we did a light hike, passing along a mountain trail. The view from the top was so beautiful that everyone took photos.

That night we stayed at a Japanese inn. At the dinner venue, my grandfather said, "All you really need for a trip like this is for the whole family to be together," and everyone laughed.`,
    },
    21: {
      jp: `旅行から帰ると、すっかり夏になっていました。{冷房|れいぼう}をつける{習慣|しゅうかん}がついて、赤ちゃんが暑がらないように気をつけています。朝、赤ちゃんの歯を優しく{磨いて|みがいて}あげるのも、毎日のことに{慣れました|なれました}。

ある雨の日、出かけようとして{困りました|こまりました}。赤ちゃん用の傘がなかったのです。近所の店で小さな傘を買って{さして|さして}あげると、嬉しそうにしていました。パンにジャムを{つけて|つけて}あげる時も、赤ちゃんはにこにこ笑います。

洗濯をしていて、{タオル|たおる}の{裏|うら}が少し汚れているのに{気がつきました|きがつきました}。冬に使う{暖房|だんぼう}や{手袋|てぶくろ}を片付けながら、季節の変わり目を感じます。{カーテン|かーてん}の{表|おもて}を洗って、部屋の中も少しさっぱりしました。`,
      en: `We came back from the trip to find it had turned into full summer. Turning on the air conditioner has become a habit, and we're careful to keep the baby from getting too hot. Gently brushing the baby's teeth every morning has become second nature too.

One rainy day, we ran into trouble trying to go out — we didn't have an umbrella for the baby. We bought a small one at a nearby shop and opened it for her, and she looked delighted. She also smiles happily whenever we spread jam on her bread.

While doing laundry, I noticed the back of a towel was a little dirty. Putting away the heater and gloves we use in winter, I could feel the season changing. We washed the front of the curtains too, and the room felt a bit fresher.`,
    },
    22: {
      jp: `久しぶりに、両親に赤ちゃんを預けて{デートしました|でーとしました}。家で二人きりの食事を作ることにして、{(お)米|おこめ}を炊き、{チーズ|ちーず}と{ソース|そーす}を使った料理に挑戦しました。

オーブンの{温度|おんど}を{上げて|あげて}パンを焼くと、とても{やわらかく|やわらかく}できました。焼きすぎると{固く|かたく}なるので、途中で温度を{下げました|さげました}。ソースは少し{苦かった|にがかった}ですが、料理によく{合って|あって}、二人とも満足でした。

「最近食べすぎて少し{太った|ふとった}かも」と妻が笑うと、「じゃあ、また一緒に散歩して{やせよう|やせよう}か」と僕が答えました。{水道|すいどう}の水で洗い物をしながら、久しぶりの静かな夜を楽しみました。`,
      en: `For the first time in a while, we left the baby with my parents and went on a date. We decided to cook a meal just for the two of us at home, cooking rice and trying a dish with cheese and sauce.

We raised the oven temperature to bake bread, and it came out very soft. Baking it too long makes it hard, so we lowered the temperature partway through. The sauce was a bit bitter, but it went well with the dish, and we were both satisfied.

"I think I've gained a little weight from eating too much lately," my wife laughed. "Then let's go for walks together again and lose some," I answered. Washing up with tap water, we enjoyed a rare quiet evening.`,
    },
    23: {
      jp: `{このごろ|このごろ}、天気のニュースが心配です。ある夜、大きな{台風|たいふう}が町に近づいてきました。風で庭の木が{倒れて|たおれて}、大きな音がしました。赤ちゃんが驚いて泣き出し、僕たちも少し焦りました。

停電で真っ暗になり、みんなで手を繋いで安全な部屋へ{逃げました|にげました}。妻は落ち着いた声で赤ちゃんをあやしていましたが、内心とても不安だったと後で聞きました。翌朝、{地震|じしん}かと思うほど家が揺れたことも{起こりました|おこりました}。

台風が過ぎた後、近所で電線から{火事|かじ}が{起こった|おこった}という{悲しい|かなしい}ニュースを聞きました。幸い、大きな被害はなく、{警察|けいさつ}と消防が{事故|じこ}の処理をしてくれました。近所では、台風のどさくさに紛れて{泥棒|どろぼう}に入られた家もあったそうです。うちは大丈夫でしたが、鍵をしっかり閉めることの大切さを改めて感じました。

僕たちは何も{けんかする|けんかする}こともなく、ただ協力して乗り越えました。壊れていた電気も{直り|なおり}、静かな日常が{見つかった|みつかった}ような気がして、ほっとしました。庭に落ちた枝を{踏まない|ふまない}よう、気をつけながら片付けました。`,
      en: `These days, the weather news is worrying. One night, a big typhoon approached our town. The wind knocked down a tree in the yard with a loud crash. The baby woke up crying, startled, and we were a bit flustered too.

The power went out and it went pitch black, and we all held hands and fled to a safer room. My wife kept a calm voice to soothe the baby, though she told me later she'd been very anxious inside. The next morning, the house shook so hard it felt like an earthquake.

After the typhoon passed, we heard the sad news that a fire had broken out nearby from a power line. Thankfully there wasn't much damage, and the police and fire department handled the accident. We heard some houses in the neighborhood were even broken into by a burglar amid the typhoon's chaos. Ours was fine, but it made us realize again how important it is to lock up carefully.

We didn't argue at all — we just worked together and got through it. The broken electricity got fixed, and it felt like we'd found our quiet everyday life again, which was a relief. We cleaned up, being careful not to step on the fallen branches in the yard.`,
    },
    24: {
      jp: `台風の後、片付けを手伝ってくれた{近所|きんじょ}の人たちにお礼をしようと、小さなパーティーを{開く|ひらく}ことにしました。{大勢|おおぜい}の{(お)客|おきゃく}が来てくれて、賑やかな一日になりました。

その帰り、ふと宝石店の前を通ると、妻が結婚指輪によく似た{指輪|ゆびわ}を見つめていました。よく見ると、彼女の指輪には小さな{傷|きず}がついていました。これも何かの{チャンス|ちゃんす}だと思い、こっそりお店に入りました。

{店員|てんいん}さんに相談すると、海外から{輸入した|ゆにゅうした}指輪も、日本で作って{輸出する|ゆしゅつする}指輪もあると教えてくれました。結局、前と同じ指輪を選んで、荷物を家まで{運んで|はこんで}もらいました。

{レジ|れじ}で払って{レシート|れしーと}をもらい、家に帰ってこっそり指輪を渡すと、妻はとても{うれしそうに|うれしそうに}泣いていました。`,
      en: `After the typhoon, we decided to throw a small party to thank the neighbors who'd helped us clean up. A big crowd of guests came, and it turned into a lively day.

On the way back from that, I happened to pass a jewelry store and noticed my wife staring at a ring that looked a lot like her wedding ring. Looking closer, I saw her actual ring had a small scratch on it. Figuring this was as good a chance as any, I quietly slipped into the shop.

Talking with the salesperson, I learned there were rings imported from overseas as well as ones made in Japan and exported. In the end I chose the same ring as before, and had it delivered to our house.

I paid at the register and got a receipt, then secretly handed her the ring at home. My wife cried, looking so happy.`,
    },
    25: {
      jp: `妻の勉強を見ていると、自分の{小学校|しょうがっこう}や{中学校|ちゅうがっこう}時代を思い出します。僕は{歴史|れきし}が好きでしたが、{文法|ぶんぽう}はとても{複雑|ふくざつ}に感じて苦手でした。

ある日、答えが{正しいか|ただしいか}{確かめずに|たしかめずに}宿題を出して、先生に{しかられた|しかられた}ことがあります。{恥ずかしくて|はずかしくて}、その日は落ち込んでいました。{水泳|すいえい}大会に{参加できなくて|さんかできなくて}、{がっかりした|がっかりした}こともよく覚えています。

今の妻は{必ず|かならず}答えを確認してから提出していて、僕とは違います。「{できるだけ|できるだけ}丁寧にやりたいの」と{詳しく|くわしく}説明してくれました。

この子が大きくなったら、僕みたいに慌てず、妻みたいに丁寧な人になってほしいなと思いました。`,
      en: `Watching my wife study reminds me of my own elementary and junior high school days. I liked history, but grammar always felt so complicated that I struggled with it.

There was a time I turned in homework without checking whether the answers were correct, and got scolded by my teacher. I felt embarrassed, and was down about it for the rest of that day. I also clearly remember being disappointed when I couldn't take part in a swimming competition.

My wife now always double-checks her answers before submitting, unlike me back then. "I want to do it as carefully as possible," she explained in detail.

I hope that when this child grows up, they'll be like me but without the carelessness, and like their mother in being thorough.`,
    },
    26: {
      jp: `ある週末、会社が{行う|おこなう}地域の{ボランティア|ぼらんてぃあ}活動に参加しました。近くの{工場|こうじょう}見学を兼ねたイベントで、初めての{経験|けいけん}でした。

作業の{途中|とちゅう}で分からないことがあり、係の人に{相談しました|そうだんしました}。「手伝いを{頼んでも|たのんでも}いいですか」と聞くと、快く教えてくれて、簡単な数字を{数える|かぞえる}作業を{始めました|はじめました}。

家に帰る前に{用事|ようじ}があったので、少し早めに切り上げましたが、係の人が結果を後で{伝えて|つたえて}くれたので、{だめ|だめ}になることはありませんでした。

活動の{終わり|おわり}に、社長が「こういう経験も、いつか会社の役に立つよ」と声をかけてくれました。妻に話すと、「私も参加してみたいな」と目を輝かせていました。`,
      en: `One weekend, I took part in a community volunteer event my company was running. It doubled as a tour of a nearby factory, and it was my first experience with anything like it.

Partway through the work, I ran into something I didn't understand and consulted the person in charge. When I asked, "Can I ask you to help me?" they happily explained, and I started counting some simple figures.

I had somewhere to be before heading home, so I left a little early, but the person in charge told me how it turned out afterward, so it wasn't wasted.

At the end of the activity, the president told me, "Experience like this will pay off for the company someday too." When I told my wife about it, her eyes lit up: "I want to try something like that too."`,
    },
    27: {
      jp: `{最近|さいきん}、駅前の{様子|ようす}が大きく{変わりました|かわりました}。{昔|むかし}は{壁|かべ}に古い映画の{ポスター|ぽすたー}が{はって|はって}あるだけの寂しい場所でしたが、今は新しいビルの{工事|こうじ}が進んでいます。

地下鉄の{地下|ちか}にも新しいお店ができました。ビルの{屋上|おくじょう}には木が植えられていて、春には花が{咲く|さく}そうです。今は秋で、{葉|は}が{茶色く|ちゃいろく}色づいています。

赤ちゃんを連れて散歩するたびに、町が少しずつ形を変えていくのを感じます。「私たちの子供が大きくなる頃、この町はどうなっているんだろうね」と妻と話しながら、ゆっくり歩きました。`,
      en: `Recently, the area around the station has changed a lot. It used to be a rather empty place with just old movie posters pasted on the walls, but now construction on a new building is underway.

A new shop has opened underground by the subway too. Trees have been planted on the building's roof, and apparently flowers bloom there in spring. It's autumn now, and the leaves are turning brown.

Every time we take the baby for a walk, I can feel the town slowly changing shape. "I wonder what this town will look like by the time our child is grown," my wife and I said to each other as we walked slowly along.`,
    },
    28: {
      jp: `赤ちゃんの一歳の誕生日に、みんなを家に{招待しました|しょうたいしました}。友達も祖父母も「もちろん{いらっしゃいます|いらっしゃいます}よ」と{賛成して|さんせいして}くれて、{反対する|はんたいする}人は誰もいませんでした。

玄関で一人ずつ{あいさつして|あいさつして}迎えていると、遠くに住むいとこからも贈り物が{届きました|とどきました}。パーティーの{会話|かいわ}は自然と子供の{世話|せわ}の話ばかりになり、みんな{相手|あいて}の話に熱心に耳を傾けていました。

祖父母はいつも{優しい|やさしい}ですが、子育てには{厳しい|きびしい}アドバイスもくれました。プレゼントを{渡す|わたす}とき、赤ちゃんは大きな声で笑って、みんなを幸せな気持ちにしました。

「この子はきっと、誰のことも{信じる|しんじる}優しい子に育つね」と祖母が言いました。友達と{別れる|わかれる}時間になっても、みんな名残惜しそうに手を振っていました。`,
      en: `For the baby's first birthday, we invited everyone to our house. Friends and grandparents alike said, "Of course we'll come," and no one objected.

Greeting people one by one at the door, a gift even arrived from a cousin who lives far away. The party's conversation naturally turned mostly to talk of raising kids, and everyone listened closely to whoever was speaking.

My grandparents are always kind, but they also gave us some strict advice about parenting. When we handed the baby her present, she laughed loudly, making everyone happy.

"This child is surely going to grow up kind, trusting everyone," my grandmother said. Even when it was time to say goodbye to our friends, everyone waved reluctantly.`,
    },
    29: {
      jp: `誕生日会をきっかけに、昔からの友達と久しぶりに{自然|しぜん}の中で{キャンプしよう|きゃんぷしよう}という話になりました。子連れでのキャンプは初めてで、みんな{楽しみ|たのしみ}にしていました。

出発の朝、テントの{ひも|ひも}を結んで、車に{ガソリン|がそりん}を入れました。現地に着くと、{空気|くうき}がとても澄んでいて気持ちよかったです。子供たちは初めて見る自然に{興味|きょうみ}津々で、はしゃぎ回っていました。

近くで{マラソン|まらそん}大会が{スタートする|すたーとする}ところで、みんなで応援しました。子供の一人が転びそうになりましたが、{滑らずに|すべらずに}なんとか踏みとどまりました。木の枝を{折って|おって}焚き火の準備をしていると、他の家族連れも{集まって|あつまって}きて、賑やかになりました。

こんな{珍しい|めずらしい}体験を子供と一緒に{楽しめる|たのしめる}日が来るなんて、少し前までは想像もしていませんでした。`,
      en: `The birthday party led to talk of camping in nature with old friends again, something we hadn't done in a while. It would be our first time camping with the baby, and everyone was looking forward to it.

On the morning we set off, we tied the tent's cords and put gasoline in the car. When we arrived, the air was so clean and refreshing. The kids were fascinated by nature for the first time, running around excitedly.

A marathon race was about to start nearby, and we all cheered it on. One of the kids nearly slipped but managed to catch themselves. As we broke tree branches to prepare a campfire, other families with kids gathered around too, and it got lively.

I never imagined, until not so long ago, that a day like this — enjoying such a rare experience with a child of my own — would come.`,
    },
    30: {
      jp: `キャンプから帰って数日後、家を{留守|るす}にしていた間に届くはずだった荷物が、ようやく{届けられました|とどけられました}。子供への{おもちゃ|おもちゃ}のプレゼントで、注文してからずいぶん{過ぎて|すぎて}いたので、忘れかけていました。

子供は大喜びで、{邪魔しないで|じゃましないで}静かに遊んでいましたが、しばらくすると一つを{壊して|こわして}しまいました。それでも楽しそうな顔を見ると、{嫌|いや}な気持ちにはなりませんでした。

外は雨で、干していた洗濯物が{ぬれて|ぬれて}しまいましたが、夕方には{乾きました|かわきました}。テレビをつけようとすると、電池が{切れて|きれて}動きません。買い置きがすっかり{なくなって|なくなって}いたので、明日買いに{並ぶ|ならぶ}ことにしました。

夜、子供がようやく{眠った|ねむった}後、僕たちは{自由|じゆう}な時間を少しだけ楽しみました。「あの頃、病院で会ったのが、もう随分昔みたいだね」と妻が笑いました。振り返れば、たくさんのことがあった一年でした。これからも、この穏やかな毎日が続きますように。`,
      en: `A few days after we got back from camping, a package that was supposed to arrive while we were away finally got delivered. It was a toy present for the baby, and since it had taken so long since we ordered it, we'd almost forgotten about it.

Our child was thrilled, playing quietly so as not to bother us, but before long, broke one of the pieces. Even so, seeing that happy face, we couldn't feel too upset about it.

It was raining outside and the laundry we'd hung out got wet, but it dried by evening. When we tried to turn on the TV, the batteries had died. We were completely out of spares, so we decided to go stand in line to buy more tomorrow.

At night, once our child had finally fallen asleep, we enjoyed a little bit of free time together. "It feels like it was so long ago that we met at the hospital," my wife laughed. Looking back, it had been quite a year. May these gentle, ordinary days keep going.`,
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
