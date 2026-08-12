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
      jp: `{僕|ぼく}の{妻|つま}が先週{熱|ねつ}を出しました。{のど|のど}も痛いと言うので、{僕|ぼく}はとても{心配しました|しんぱいしました}。すぐ妻を病院へ{連れて行き|つれていき}ました。

病院で、友達に会いました。友達は僕に{(ご)主人|ごしゅじん}を{紹介して|しょうかいして}くれました。ご主人はお医者さんで、妻のことをいろいろ{手伝って|てつだって}くれました。帰るとき、きれいな花も{もらいました|もらいました}。二人ともまだ{若い|わかい}のに、とても優しかったです。

妻が入院している間、家はとても{寂しかった|さびしかった}です。でも、みんなが助けてくれたので、本当によかったです。`,
      en: `Last week my wife had a fever. She said her throat hurt too, so I was very worried. I immediately took her to the hospital.

At the hospital, I ran into a friend. She introduced her husband to me. He was a doctor, and he helped with a lot of things for my wife. When we left, we even received some pretty flowers. Even though they were both still young, they were so kind.

While my wife was in the hospital, the house felt very lonely. But because everyone helped, it turned out fine in the end.`,
    },
    2: {
      jp: `僕の{趣味|しゅみ}はたくさんあります。休みの日はよく{美術館|びじゅつかん}へ行ったり、友達と{(お)花見|おはなみ}をしたりします。音楽も好きなので、{コンサート|こんさーと}に{一度|いちど}行ったことがあります。とても楽しかったので、{ぜひ|ぜひ}また行きたいです。

冬になると、{スキー|すきー}をしに山へ行きます。うまくはありませんが、{ダンス|だんす}も少し習っています。家では{アニメ|あにめ}や{マンガ|まんが}をよく見ます。好きなアニメが{放送|ほうそう}される日は、{ビデオ|びでお}に録画します。

それから、僕は毎日{日記|にっき}を書いています。切手を{集める|あつめる}のも好きです。友達が{試合|しあい}する日は、見に行きます。`,
      en: `I have a lot of hobbies. On my days off, I often go to art museums or view cherry blossoms with friends. I like music too, so I've been to a concert once. It was so much fun that I definitely want to go again.

When winter comes, I go skiing in the mountains. I'm not very good at it, but I'm also learning a bit of dance. At home I often watch anime and manga. On days when my favorite anime airs, I always record it on video.

Also, I write in my diary every day. I also like collecting stamps. On days when my friend has a match, I go watch.`,
    },
  },
  N3: {},
};
