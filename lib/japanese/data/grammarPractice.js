// Grammar practice questions, keyed by JLPT level then lesson number.
//
// These are hand-written to drill the things a reference page can't: which
// form attaches to a pattern, what a pattern actually means in context, and
// -- most importantly -- how to choose between the confusable patterns that
// share a lesson (まで vs までに, the three ところです, ため vs ように...).
// Lessons in grammar-data.js already group related patterns together, so a
// lesson's questions can freely contrast its own patterns against each other.
//
// Each question has a stable `id` (`${level}-${lesson}-${indexInLesson}`),
// assigned at port time -- unlike the original static site, which synthesized
// this at runtime from array position and would silently reassign an SRS
// history to the wrong question if entries were ever reordered.
export const GRAMMAR_PRACTICE = {
  "N4": {
    "1": [
      {
        "id": "N4-1-0",
        "type": "choice",
        "tag": "〜ほど…ません",
        "prompt": "Which fits the blank?",
        "jp": "わたしは兄＿＿背が高くありません。",
        "en": "I'm not as tall as my older brother.",
        "options": [
          "より",
          "ほど",
          "のほう",
          "どちら"
        ],
        "correct": 1,
        "explain": "A negative comparison — 'not as ~ as' — uses ほど with a negative ending. より cannot do this job: 兄より背が高くありません would be an odd way to say it, because より is for stating which side has more."
      },
      {
        "id": "N4-1-1",
        "type": "choice",
        "tag": "〜より…",
        "prompt": "Which apartment is more convenient?",
        "jp": "このアパートは前のアパートより便利です。",
        "options": [
          "This apartment",
          "The previous apartment",
          "They are equally convenient",
          "The sentence doesn't say"
        ],
        "correct": 0,
        "explain": "より always marks the LOSING side — the thing being outranked. So 前のアパートより means 'more than the previous one,' and the topic at the front (このアパート) is the more convenient one."
      },
      {
        "id": "N4-1-2",
        "type": "choice",
        "tag": "〜より〜のほう",
        "prompt": "Which fits the blank?",
        "jp": "電車よりバス＿＿＿が便利です。",
        "en": "The bus is more convenient than the train.",
        "options": [
          "のほう",
          "より",
          "ほど",
          "とどちら"
        ],
        "correct": 0,
        "explain": "のほう singles out one side as the winner: 「AよりBのほうが〜」= 'B is more ~ than A.' Note the pairing — the より noun loses, the のほう noun wins."
      },
      {
        "id": "N4-1-3",
        "type": "fill",
        "tag": "〜と〜とどちら",
        "prompt": "Type the missing word in hiragana.",
        "jp": "夏と冬と＿＿＿が好きですか。",
        "en": "Which do you like better, summer or winter?",
        "answers": [
          "どちら",
          "どっち"
        ],
        "explain": "To ask someone to pick between exactly two things, the frame is 「AとBとどちらが〜か」. どちら is the polite form; どっち is its casual equivalent."
      },
      {
        "id": "N4-1-4",
        "type": "choice",
        "tag": "疑問詞＋より",
        "prompt": "Which fits the blank to mean 'more than anything else'?",
        "jp": "わたしは＿＿＿音楽が好きです。",
        "en": "I like music more than anything else.",
        "options": [
          "何より",
          "だれより",
          "どこより",
          "いつより"
        ],
        "correct": 0,
        "explain": "Attaching より to a question word makes a superlative. 何より = 'more than anything,' だれより = 'more than anyone,' どこより = 'more than anywhere.' Since 音楽 is a thing, not a person or place, 何より is the fit."
      },
      {
        "id": "N4-1-5",
        "type": "choice",
        "tag": "〜ほど…ません",
        "prompt": "One of these comparison sentences is ungrammatical. Which one?",
        "options": [
          "兄は私ほど背が高いです。",
          "兄は私ほど背が高くありません。",
          "兄は私より背が高いです。",
          "私より兄のほうが背が高いです。"
        ],
        "correct": 0,
        "explain": "ほど in this pattern requires a NEGATIVE predicate. 「私ほど背が高いです」 pairs ほど with an affirmative, which doesn't work. To say 'as tall as' positively, use a different pattern such as 私と同じくらい背が高いです."
      },
      {
        "id": "N4-1-6",
        "type": "choice",
        "tag": "より vs から",
        "prompt": "Which fits the blank to mean 'I'll go home early FROM school'?",
        "jp": "学校＿＿早く帰ります。",
        "options": [
          "から",
          "より",
          "ほど",
          "のほう"
        ],
        "correct": 0,
        "explain": "から marks a starting point (from school). より in this lesson is strictly a comparison marker — 学校より早く帰ります would mean 'I go home earlier than the school does,' which is nonsense here."
      },
      {
        "id": "N4-1-7",
        "type": "choice",
        "tag": "〜と〜とどちら",
        "prompt": "Which particle pair fills the two blanks?",
        "jp": "コーヒー＿紅茶＿どちらがいいですか。",
        "en": "Which would you prefer, coffee or tea?",
        "options": [
          "と / と",
          "や / と",
          "も / も",
          "か / か"
        ],
        "correct": 0,
        "explain": "This pattern requires と after BOTH items: 「AとBとどちらが〜」. や is for non-exhaustive lists ('things like A and B'), which clashes with どちら asking you to pick between exactly two."
      }
    ],
    "2": [
      {
        "id": "N4-2-0",
        "type": "choice",
        "tag": "〜ところです",
        "prompt": "Which form attaches to ところです to mean 'about to start'?",
        "options": [
          "Dictionary form (辞書形)",
          "〜ている form",
          "た form",
          "ない form"
        ],
        "correct": 0,
        "explain": "The three ところです differ only by the form in front: dictionary form = about to start (出かけるところです), 〜ている = in the middle of (出かけているところです), た form = just finished (出かけたところです)."
      },
      {
        "id": "N4-2-1",
        "type": "choice",
        "tag": "〜ているところです",
        "prompt": "Which fits the blank?",
        "jp": "今、レポートを書い＿＿＿ところです。",
        "en": "I'm right in the middle of writing the report now.",
        "options": [
          "ている",
          "る",
          "た",
          "ない"
        ],
        "correct": 0,
        "explain": "'In the middle of doing' takes the 〜ている form before ところ. 書くところです would mean you haven't started yet; 書いたところです would mean you just finished."
      },
      {
        "id": "N4-2-2",
        "type": "choice",
        "tag": "〜たところです",
        "prompt": "Which fits the blank?",
        "jp": "今、家に帰っ＿＿ところです。",
        "en": "I just got home this very moment.",
        "options": [
          "た",
          "ている",
          "る",
          "て"
        ],
        "correct": 0,
        "explain": "た form + ところです marks an action finished a moment ago. The あ「今」 in the sentence is your clue — ところ always refers to the immediate present moment, never to yesterday or last week."
      },
      {
        "id": "N4-2-3",
        "type": "choice",
        "tag": "〜までに",
        "prompt": "Which fits the blank?",
        "jp": "レポートは金曜日＿＿＿出してください。",
        "en": "Please submit the report by Friday.",
        "options": [
          "までに",
          "まで",
          "から",
          "ながら"
        ],
        "correct": 0,
        "explain": "Submitting is a ONE-TIME action that has to land somewhere before the deadline — that's までに. 金曜日まで出してください would mean 'keep submitting it continuously until Friday.'"
      },
      {
        "id": "N4-2-4",
        "type": "choice",
        "tag": "〜まで",
        "prompt": "Which fits the blank?",
        "jp": "この仕事が終わる＿＿帰らないでください。",
        "en": "Please don't go home until this work is finished.",
        "options": [
          "まで",
          "までに",
          "ながら",
          "ところ"
        ],
        "correct": 0,
        "explain": "'Don't go home' is a CONTINUOUS state lasting up to the endpoint, so it takes まで. までに would wrongly suggest a single act of not-going-home scheduled before the deadline."
      },
      {
        "id": "N4-2-5",
        "type": "choice",
        "tag": "〜まで vs 〜までに",
        "prompt": "What decides whether you use まで or までに?",
        "options": [
          "Whether the action is continuous (まで) or a one-time act with a deadline (までに)",
          "Whether the time is a clock time (までに) or a date (まで)",
          "Whether the sentence is polite (までに) or casual (まで)",
          "Whether the verb is transitive (まで) or intransitive (までに)"
        ],
        "correct": 0,
        "explain": "It's about the shape of the action, not the kind of time word. まで = something goes on right up to that point (待っています, 勉強しました). までに = something happens once, at some point before that limit (出します, かたづけます, はらいます)."
      },
      {
        "id": "N4-2-6",
        "type": "fill",
        "tag": "〜ながら",
        "prompt": "Type the missing word in hiragana.",
        "jp": "母は音楽を聞き＿＿＿＿料理を作ります。",
        "en": "My mother cooks while listening to music.",
        "answers": [
          "ながら"
        ],
        "explain": "ながら attaches to the verb stem (ます-form minus ます): 聞きます → 聞き + ながら. The main action of the sentence is the SECOND verb — here, cooking."
      },
      {
        "id": "N4-2-7",
        "type": "choice",
        "tag": "〜ながら",
        "prompt": "Why is 「わたしはテレビを見ながら、弟は勉強しました。」wrong?",
        "options": [
          "ながら requires both actions to have the same subject",
          "ながら cannot be used with テレビ",
          "ながら must come at the end of the sentence",
          "ながら cannot be used in the past tense"
        ],
        "correct": 0,
        "explain": "ながら describes ONE person doing two things at once. Here the watcher (わたし) and the studier (弟) are different people, so you need a different connector — for example 〜ている間に or just て-form: わたしがテレビを見ている間に、弟は勉強しました。"
      }
    ],
    "3": [
      {
        "id": "N4-3-0",
        "type": "choice",
        "tag": "〜ませんか",
        "prompt": "Which fits the blank to invite someone along?",
        "jp": "いっしょに映画を見に行き＿＿＿＿か。",
        "en": "Won't you go see a movie with me?",
        "options": [
          "ませんか",
          "ますか",
          "ましたか",
          "たいか"
        ],
        "correct": 0,
        "explain": "〜ませんか is the standard invitation form. The negative shape is what makes it soft and polite — it leaves the listener room to decline, unlike the blunter 行きますか ('are you going?')."
      },
      {
        "id": "N4-3-1",
        "type": "choice",
        "tag": "〜ましょうか",
        "prompt": "Which fits the blank when YOU are offering to do it for the other person?",
        "jp": "電気、つけ＿＿＿＿か。",
        "en": "Shall I turn on the light?",
        "options": [
          "ましょう",
          "ません",
          "たい",
          "ください"
        ],
        "correct": 0,
        "explain": "〜ましょうか offers to do something on the listener's behalf. Context decides between the two readings of ましょうか: if only the speaker will act, it's an offer; if both will act, it's a proposal ('shall we?')."
      },
      {
        "id": "N4-3-2",
        "type": "choice",
        "tag": "〜ませんか",
        "prompt": "One of these invitations is ungrammatical. Which one?",
        "options": [
          "いっしょに行くませんか。",
          "いっしょに行きませんか。",
          "いっしょに行きましょう。",
          "いっしょに行きましょうか。"
        ],
        "correct": 0,
        "explain": "ませんか attaches to the verb STEM, not the dictionary form: 行きます → 行き + ませんか = 行きませんか. 行くませんか incorrectly glues ませんか onto the dictionary form 行く."
      },
      {
        "id": "N4-3-3",
        "type": "choice",
        "tag": "〜ませんか vs 〜ましょう",
        "prompt": "What's the difference between 行きませんか and 行きましょう?",
        "options": [
          "ませんか invites and leaves room to refuse; ましょう assumes you've already agreed",
          "ませんか is casual; ましょう is polite",
          "ませんか is past tense; ましょう is future",
          "There is no difference in usage"
        ],
        "correct": 0,
        "explain": "ませんか opens the question — it's the natural first move. ましょう pushes forward on something already settled, so it usually comes after agreement: 「行きませんか。」「いいですね。」「じゃ、行きましょう。」"
      },
      {
        "id": "N4-3-4",
        "type": "fill",
        "tag": "〜ましょう",
        "prompt": "Type the missing part in hiragana.",
        "jp": "疲れたから、少し休み＿＿＿＿。",
        "en": "I'm tired, so let's rest a little.",
        "answers": [
          "ましょう"
        ],
        "explain": "ましょう proposes a joint action — 'let's.' It attaches to the verb stem: 休みます → 休み + ましょう."
      },
      {
        "id": "N4-3-5",
        "type": "choice",
        "tag": "〜ましょうか",
        "prompt": "「じゃ、帰りましょうか。」— what is the speaker doing?",
        "en": "Said at 5pm, to a colleague.",
        "options": [
          "Suggesting that they both head home",
          "Asking permission to go home alone",
          "Ordering the listener to go home",
          "Asking whether the listener already went home"
        ],
        "correct": 0,
        "explain": "With a verb both people can do together and a shared situation (it's 5 o'clock for both of them), ましょうか reads as a joint proposal: 'shall we head home?'"
      },
      {
        "id": "N4-3-6",
        "type": "choice",
        "tag": "〜ましょうか",
        "prompt": "「何を食べましょうか。」means:",
        "options": [
          "What shall we eat?",
          "What did you eat?",
          "Do you want to eat something?",
          "You must eat something."
        ],
        "correct": 0,
        "explain": "ましょうか with a question word asks the listener to help decide a shared plan. It's the natural follow-up once you've both agreed to eat together."
      },
      {
        "id": "N4-3-7",
        "type": "choice",
        "tag": "〜ませんか",
        "prompt": "Someone says 「あした、うちに来ませんか。」You can't make it. Which reply is most natural in Japanese?",
        "options": [
          "あの、あしたはちょっと……。",
          "いいえ、行きません。",
          "だめです。",
          "来ません。"
        ],
        "correct": 0,
        "explain": "A flat いいえ、行きません is grammatically fine but socially blunt. Trailing off with ちょっと…… is the standard soft refusal — the listener understands the 'no' without you having to say it."
      }
    ],
    "4": [
      {
        "id": "N4-4-0",
        "type": "choice",
        "tag": "〜(られ)ます",
        "prompt": "Which particle fits the blank?",
        "jp": "ジョーさんは日本語＿話せます。",
        "en": "Joe can speak Japanese.",
        "options": [
          "が",
          "を",
          "に",
          "で"
        ],
        "correct": 0,
        "explain": "When a verb becomes potential, its object normally switches from を to が. 日本語を話します (speaks Japanese) → 日本語が話せます (can speak Japanese)."
      },
      {
        "id": "N4-4-1",
        "type": "fill",
        "tag": "〜(られ)ます",
        "prompt": "Type the potential form of 飲む in plain form (〜る).",
        "answers": [
          "飲める",
          "のめる"
        ],
        "explain": "Group 1 verbs shift the final う-row sound to the え-row and add る: 飲む → 飲める, 行く → 行ける, 話す → 話せる. Group 2 verbs take られる instead: 食べる → 食べられる."
      },
      {
        "id": "N4-4-2",
        "type": "choice",
        "tag": "見えます・聞こえます",
        "prompt": "Which particle fits the blank?",
        "jp": "まどから海＿見えます。",
        "en": "You can see the sea from the window.",
        "options": [
          "が",
          "を",
          "は",
          "に"
        ],
        "correct": 0,
        "explain": "見えます and 聞こえます describe something being naturally perceptible, so the thing perceived is the SUBJECT and takes が. 海を見えます is ungrammatical."
      },
      {
        "id": "N4-4-3",
        "type": "choice",
        "tag": "見えます vs 見られます",
        "prompt": "Which fits the blank?",
        "jp": "このびじゅつかんでは有名なえが＿＿＿＿＿。",
        "en": "At this museum you can see famous paintings.",
        "options": [
          "見られます",
          "見えます",
          "見ます",
          "見せます"
        ],
        "correct": 0,
        "explain": "見えます = something enters your view whether you try or not (the sea outside a window). 見られます = you have the opportunity to deliberately look at something. Visiting a museum to view paintings is deliberate, so 見られます."
      },
      {
        "id": "N4-4-4",
        "type": "choice",
        "tag": "〜ことができます",
        "prompt": "Which particle fits the blank?",
        "jp": "日本語を勉強すること＿できます。",
        "options": [
          "が",
          "を",
          "に",
          "で"
        ],
        "correct": 0,
        "explain": "The frame is 「〜ことができます」— こと nominalizes the verb and が marks it as the subject of できます. A very common slip is writing ことをできます or 勉強するがことできます."
      },
      {
        "id": "N4-4-5",
        "type": "choice",
        "tag": "〜ことができます",
        "prompt": "Which form does こと attach to here? Pick the correct sentence.",
        "options": [
          "この建物の中に入ることができません。",
          "この建物の中に入るができません。",
          "この建物の中に入りことができません。",
          "この建物の中に入ってことができません。"
        ],
        "correct": 0,
        "explain": "こと attaches to the DICTIONARY form of the verb: 入る + こと + が + できません. Neither the stem (入り) nor the て-form works here."
      },
      {
        "id": "N4-4-6",
        "type": "choice",
        "tag": "〜(られ)ます",
        "prompt": "Why is 見えられます wrong?",
        "options": [
          "見えます is already a potential-meaning verb, so it can't take られ again",
          "見えます can only be used in the past tense",
          "見えます is never used with people",
          "見えられます is correct — it's just very formal"
        ],
        "correct": 0,
        "explain": "見える and 聞こえる already carry the 'can be seen/heard' meaning built in. Adding the potential ending on top double-marks it. The same goes for 聞こえられます."
      },
      {
        "id": "N4-4-7",
        "type": "choice",
        "tag": "聞こえます vs 聞きます",
        "prompt": "「となりのへやから音楽が聞こえます。」means:",
        "options": [
          "Music can be heard from the room next door (it just reaches me)",
          "I am deliberately listening to music in the next room",
          "I want to listen to music next door",
          "Please listen to the music next door"
        ],
        "correct": 0,
        "explain": "聞こえます is passive perception — the sound arrives at your ears without you choosing it. Deliberately listening is 聞きます, and having the chance to listen is 聞けます."
      }
    ],
    "5": [
      {
        "id": "N4-5-0",
        "type": "choice",
        "tag": "〜たことがあります",
        "prompt": "Which fits the blank?",
        "jp": "前に一度テレビドラマに出＿＿ことがあります。",
        "en": "I've appeared in a TV drama once before.",
        "options": [
          "た",
          "る",
          "ている",
          "ない"
        ],
        "correct": 0,
        "explain": "Past EXPERIENCE requires the た form before ことがあります. Dropping the た changes the meaning entirely — 出ることがあります would mean 'I sometimes appear.'"
      },
      {
        "id": "N4-5-1",
        "type": "choice",
        "tag": "〜ことがあります",
        "prompt": "Which fits the blank?",
        "jp": "母はこのごろ人の名前を忘れる＿＿があります。",
        "en": "My mother sometimes forgets people's names these days.",
        "options": [
          "こと",
          "たこと",
          "ところ",
          "もの"
        ],
        "correct": 0,
        "explain": "Dictionary form + ことがあります = 'it sometimes happens that...'. This is about an occasional present-day occurrence, not a past experience, so no た."
      },
      {
        "id": "N4-5-2",
        "type": "choice",
        "tag": "〜たことがあります",
        "prompt": "Why is 「きのう富士山に登ったことがあります。」wrong?",
        "options": [
          "たことがあります is for unspecified past experience, so it clashes with a specific recent time like きのう",
          "富士山 cannot be used with 登る",
          "たことがあります can only be used in questions",
          "It should be 登りましたことがあります"
        ],
        "correct": 0,
        "explain": "たことがあります means 'I have (at some point) done this.' Pinning it to an exact recent day defeats that. For yesterday, just use the plain past: きのう富士山に登りました。"
      },
      {
        "id": "N4-5-3",
        "type": "choice",
        "tag": "〜たことがある vs 〜ことがある",
        "prompt": "What's the difference between 食べたことがあります and 食べることがあります?",
        "options": [
          "たことがある = have eaten before (experience); ことがある = sometimes eat (occasional)",
          "たことがある = ate yesterday; ことがある = will eat tomorrow",
          "たことがある is polite; ことがある is casual",
          "There is no meaningful difference"
        ],
        "correct": 0,
        "explain": "The た is doing all the work. With it, you're reporting something in your life history. Without it, you're reporting how often something happens nowadays."
      },
      {
        "id": "N4-5-4",
        "type": "fill",
        "tag": "〜たことがありますか",
        "prompt": "Type the missing character in hiragana.",
        "jp": "入院し＿ことがありますか。",
        "en": "Have you ever been hospitalized?",
        "answers": [
          "た"
        ],
        "explain": "する → した before ことがあります. Asking about experience always takes the た form; the natural 'never' answer is 一度もありません."
      },
      {
        "id": "N4-5-5",
        "type": "choice",
        "tag": "〜ことがあります",
        "prompt": "Why is 「毎日勉強することがあります。」odd?",
        "options": [
          "ことがあります means 'occasionally,' which contradicts 毎日 ('every day')",
          "勉強する cannot take ことがあります",
          "It should be 勉強したことがあります",
          "毎日 cannot appear at the start of a sentence"
        ],
        "correct": 0,
        "explain": "ことがあります specifically marks something as NON-routine — it happens now and then. For a daily habit just say 毎日勉強します。"
      },
      {
        "id": "N4-5-6",
        "type": "choice",
        "tag": "〜たことがありません",
        "prompt": "Which is the natural way to answer 「入院したことがありますか。」with 'no, never'?",
        "options": [
          "いえ、一度もありません。",
          "いえ、入院しません。",
          "いえ、ないことがあります。",
          "いえ、一度もしました。"
        ],
        "correct": 0,
        "explain": "一度も + negative = 'not even once.' It pairs naturally with the experience pattern. 入院しません would just mean 'I don't get hospitalized (as a rule),' which doesn't answer the question."
      },
      {
        "id": "N4-5-7",
        "type": "choice",
        "tag": "〜ことがあります",
        "prompt": "Which fits the blank?",
        "jp": "雪の日は道ですべる＿＿がありますから、注意してください。",
        "en": "On snowy days you can sometimes slip on the road, so please be careful.",
        "options": [
          "こと",
          "たこと",
          "ところ",
          "ため"
        ],
        "correct": 0,
        "explain": "This warns about something that occasionally happens — dictionary form + ことがあります. すべったことがあります would instead mean 'I have slipped before,' a personal anecdote rather than a warning."
      }
    ],
    "6": [
      {
        "id": "N4-6-0",
        "type": "choice",
        "tag": "〜てもいいです",
        "prompt": "Which fits the blank?",
        "jp": "ここにすわっ＿＿いいですか。",
        "en": "May I sit here?",
        "options": [
          "ても",
          "ては",
          "なくても",
          "なければ"
        ],
        "correct": 0,
        "explain": "て-form + もいいです asks for or grants permission. Note the て-form of すわる is すわって (small っ) — すわてもいいですか is a very common spelling slip."
      },
      {
        "id": "N4-6-1",
        "type": "choice",
        "tag": "〜てはいけません",
        "prompt": "Which fits the blank?",
        "jp": "としょかんの中で大きい声で話し＿＿いけません。",
        "en": "You mustn't talk loudly inside the library.",
        "options": [
          "ては",
          "ても",
          "なくては",
          "なければ"
        ],
        "correct": 0,
        "explain": "て-form + はいけません states a prohibition. Contrast the particle: てもいい = permission ('even if you do, it's fine'), てはいけない = prohibition ('as for doing that, it won't do')."
      },
      {
        "id": "N4-6-2",
        "type": "choice",
        "tag": "〜なくてもいいです",
        "prompt": "Which fits the blank?",
        "jp": "もう薬を飲ま＿＿＿＿もいいですよ。",
        "en": "You don't need to take the medicine anymore.",
        "options": [
          "なくて",
          "ないで",
          "なければ",
          "なくては"
        ],
        "correct": 0,
        "explain": "ない form → drop い → add くて: 飲まない → 飲まなくて + もいいです = 'you don't have to drink it.' 飲まないでもいいです is not the standard form here."
      },
      {
        "id": "N4-6-3",
        "type": "choice",
        "tag": "〜なければなりません",
        "prompt": "Which fits the blank?",
        "jp": "あしたは朝早く起き＿＿＿＿なりません。",
        "en": "I have to get up early tomorrow morning.",
        "options": [
          "なければ",
          "なくても",
          "ても",
          "ては"
        ],
        "correct": 0,
        "explain": "ない form → drop い → add ければ: 起きない → 起きなければ + なりません = 'must get up.' Literally 'if I don't get up, it won't do.'"
      },
      {
        "id": "N4-6-4",
        "type": "fill",
        "tag": "〜なければなりません",
        "prompt": "Type the missing part in hiragana.",
        "jp": "Eメールのへんじを書か＿＿＿＿＿なりません。",
        "en": "I have to write a reply to the email.",
        "answers": [
          "なければ"
        ],
        "explain": "書く → 書かない → 書かなければ + なりません. Watch out for the common blend 書かなければもいいです, which mixes the 'must' and 'don't have to' patterns together."
      },
      {
        "id": "N4-6-5",
        "type": "choice",
        "tag": "〜なくてもいいです",
        "prompt": "「駅に近くなくてもいいです。」means:",
        "options": [
          "It doesn't have to be near the station.",
          "It mustn't be near the station.",
          "It has to be near the station.",
          "Is it near the station?"
        ],
        "correct": 0,
        "explain": "なくてもいい = the absence of a requirement, not a prohibition. い-adjectives take the same route: 近い → 近くない → 近くなくて + もいいです."
      },
      {
        "id": "N4-6-6",
        "type": "choice",
        "tag": "〜てもいいです",
        "prompt": "Which fits the blank?",
        "jp": "安いへやをさがしています。せま＿＿＿＿いいです。",
        "en": "I'm looking for a cheap room. It's fine if it's small.",
        "options": [
          "くても",
          "でも",
          "ても",
          "ては"
        ],
        "correct": 0,
        "explain": "For い-adjectives, drop い and add くても: せまい → せまくても. Na-adjectives and nouns use でも instead: じょうぶでなくてもいい, Tシャツではいけません."
      },
      {
        "id": "N4-6-7",
        "type": "choice",
        "tag": "〜てはいけません",
        "prompt": "You want to tell your BOSS not to work so late. Why is 「帰ってはいけません」a bad choice?",
        "options": [
          "てはいけません is a flat prohibition from a position of authority, so it's rude to a superior",
          "てはいけません cannot be used with 帰る",
          "てはいけません is only for written Japanese",
          "てはいけません can only be used in questions"
        ],
        "correct": 0,
        "explain": "てはいけません is what a teacher says to a student or a parent to a child. Speaking upward, soften it — e.g. あまり遅くまで働かないほうがいいですよ or a request form instead."
      }
    ],
    "7": [
      {
        "id": "N4-7-0",
        "type": "choice",
        "tag": "〜がほしいです",
        "prompt": "Which particle fits the blank?",
        "jp": "わたしは自分のへや＿ほしいです。",
        "en": "I want my own room.",
        "options": [
          "が",
          "を",
          "に",
          "で"
        ],
        "correct": 0,
        "explain": "ほしい is an い-adjective, not a verb, so the thing wanted is marked with が, not を. わたしは自分のへやをほしいです is ungrammatical."
      },
      {
        "id": "N4-7-1",
        "type": "choice",
        "tag": "〜ほしがっています",
        "prompt": "Which fits the blank?",
        "jp": "弟は新しいゲームを＿＿＿＿＿います。",
        "en": "My little brother wants a new video game.",
        "options": [
          "ほしがって",
          "ほしくて",
          "ほしいで",
          "ほしがりて"
        ],
        "correct": 0,
        "explain": "You can't read someone else's mind, so Japanese marks third-party desire with がる: ほしい → ほしがる → ほしがっています. Note the object flips back to を with the がる verb."
      },
      {
        "id": "N4-7-2",
        "type": "choice",
        "tag": "〜がほしい vs 〜ほしがる",
        "prompt": "Why is 「弟はこのゲームがほしいです。」problematic?",
        "options": [
          "ほしいです states an inner feeling directly, which Japanese reserves for the speaker",
          "ゲーム cannot be used with ほしい",
          "弟 must always take を",
          "It should be ほしいでした"
        ],
        "correct": 0,
        "explain": "Plain ほしい/たい assert what someone feels inside — only safe for yourself (or in a question to the listener). For a third party, switch to ほしがっています / たがっています, which report observable signs."
      },
      {
        "id": "N4-7-3",
        "type": "choice",
        "tag": "〜たいです",
        "prompt": "Which fits the blank?",
        "jp": "ああ、ゆっくり本が読み＿＿なあ。",
        "en": "Ahh, I want to read a book slowly and leisurely.",
        "options": [
          "たい",
          "ほしい",
          "たがる",
          "ましょう"
        ],
        "correct": 0,
        "explain": "たい expresses wanting to DO something and attaches to the verb stem: 読みます → 読み + たい. ほしい is for wanting a THING, not an action."
      },
      {
        "id": "N4-7-4",
        "type": "choice",
        "tag": "〜といいです",
        "prompt": "Which fits the blank?",
        "jp": "いい仕事が見つかる＿＿＿＿ですね。",
        "en": "I hope you find a good job.",
        "options": [
          "といい",
          "たい",
          "ほしい",
          "ながら"
        ],
        "correct": 0,
        "explain": "といいです expresses a hope about something you can't control — the weather, someone else's luck, an outcome. It attaches to the dictionary form."
      },
      {
        "id": "N4-7-5",
        "type": "choice",
        "tag": "〜といいです",
        "prompt": "Which fits the blank to mean 'I hope it doesn't rain'?",
        "jp": "運動会の日、雨がふら＿＿といいですけど……。",
        "options": [
          "ない",
          "る",
          "た",
          "ながら"
        ],
        "correct": 0,
        "explain": "The hope is that rain does NOT happen, so the verb before といい must be negative: ふらないといいです. 雨がふるといいですね would mean you're hoping FOR rain."
      },
      {
        "id": "N4-7-6",
        "type": "fill",
        "tag": "〜たかったです",
        "prompt": "Type the missing part in hiragana (past tense of 〜たい).",
        "jp": "7時の新幹線に乗り＿＿＿＿のですが、間に合いませんでした。",
        "en": "I wanted to catch the 7 o'clock shinkansen, but I didn't make it in time.",
        "answers": [
          "たかった"
        ],
        "explain": "たい behaves like an い-adjective, so its past is たかった (not たいでした): 乗りたい → 乗りたかった. The negative is 乗りたくない → 乗りたくなかった."
      },
      {
        "id": "N4-7-7",
        "type": "choice",
        "tag": "〜といいです",
        "prompt": "Why is 「わたしはあした早く起きるといいです。」odd?",
        "options": [
          "といいです is for things outside your control, but getting up early is your own choice",
          "といいです cannot be used about tomorrow",
          "起きる cannot take といいです",
          "It should be 起きたといいです"
        ],
        "correct": 0,
        "explain": "If you control the action, express intention instead: あした早く起きようと思います or 起きなければなりません. Save といいです for outcomes you can only hope for."
      }
    ],
    "8": [
      {
        "id": "N4-8-0",
        "type": "choice",
        "tag": "〜そうです（様態）",
        "prompt": "Which fits the blank?",
        "jp": "わあ、おいし＿＿＿なケーキですね。",
        "en": "Wow, that cake looks delicious.",
        "options": [
          "そう",
          "らしい",
          "みたい",
          "よう"
        ],
        "correct": 0,
        "explain": "Appearance そう attaches to the い-adjective stem (drop い): おいしい → おいし + そう. When it then modifies a noun it behaves like a na-adjective: おいしそうなケーキ."
      },
      {
        "id": "N4-8-1",
        "type": "choice",
        "tag": "〜そうです（様態）",
        "prompt": "What is the appearance-そう form of いい ('good')?",
        "options": [
          "よさそう",
          "いそう",
          "いいそう",
          "よそう"
        ],
        "correct": 0,
        "explain": "いい is irregular here — it borrows from よい, giving よさそう. The same happens with ない → なさそう. 「いいそうです」 would instead be hearsay ('I hear it's good')."
      },
      {
        "id": "N4-8-2",
        "type": "choice",
        "tag": "〜そうです（様態）",
        "prompt": "Which fits the blank?",
        "jp": "あ、テーブルの上のコップがおち＿＿ですよ。",
        "en": "Oh, the cup on the table looks like it's about to fall.",
        "options": [
          "そう",
          "らしい",
          "ながら",
          "たい"
        ],
        "correct": 0,
        "explain": "With verbs, appearance そう attaches to the stem and means 'looks like it's about to happen': おちます → おち + そう. This is a judgement from what you can see right now."
      },
      {
        "id": "N4-8-3",
        "type": "choice",
        "tag": "様態 vs 伝聞",
        "prompt": "What's the difference between おいしそうです and おいしいそうです?",
        "options": [
          "おいしそう = it looks delicious (your own impression); おいしいそう = I hear it's delicious (hearsay)",
          "おいしそう is casual; おいしいそう is polite",
          "おいしそう is past; おいしいそう is present",
          "They mean exactly the same thing"
        ],
        "correct": 0,
        "explain": "The connection tells them apart. Appearance そう cuts the adjective down to its stem (おいし-). Hearsay そう follows the plain form intact (おいしい + そうです). Same syllables, opposite sources of information."
      },
      {
        "id": "N4-8-4",
        "type": "choice",
        "tag": "〜まま",
        "prompt": "Which fits the blank?",
        "jp": "きのう、まどを開け＿＿ままねました。",
        "en": "Yesterday I fell asleep leaving the window open.",
        "options": [
          "た",
          "る",
          "て",
          "ない"
        ],
        "correct": 0,
        "explain": "まま describes a state left unchanged, so the verb before it is in the た form: 開けた + まま = 'in the state of having opened it.' 開けるまま is not valid."
      },
      {
        "id": "N4-8-5",
        "type": "choice",
        "tag": "〜まま",
        "prompt": "Which fits the blank?",
        "jp": "くつをはい＿＿まま部屋に入らないでください。",
        "en": "Please don't enter the room while still wearing your shoes.",
        "options": [
          "た",
          "る",
          "ている",
          "て"
        ],
        "correct": 0,
        "explain": "Same rule: はく → はいた + まま. Nouns connect with の (先月のまま) and い-adjectives connect directly (きたないまま) — but verbs always take the た form."
      },
      {
        "id": "N4-8-6",
        "type": "choice",
        "tag": "〜がっています",
        "prompt": "Why is 「わたしはこわがっています。」wrong?",
        "options": [
          "がる reports someone else's visible signs of feeling, so it can't describe your own feelings",
          "こわい cannot take がる",
          "It should be past tense",
          "わたし cannot be the topic of a sentence"
        ],
        "correct": 0,
        "explain": "You know your own feelings directly, so you just say わたしはこわいです。がる exists precisely because you can only INFER other people's feelings from the outside."
      },
      {
        "id": "N4-8-7",
        "type": "fill",
        "tag": "〜がっています",
        "prompt": "Type the missing part in hiragana.",
        "jp": "犬が死にました。母はさびし＿＿＿＿います。",
        "en": "The dog died. My mother is showing signs of loneliness.",
        "answers": [
          "がって"
        ],
        "explain": "さびしい → drop い → さびし + がる → さびしがっています. Use 〜がっています for how someone is right now; 〜がります for a standing tendency (弟はこわい話をいやがります)."
      }
    ],
    "9": [
      {
        "id": "N4-9-0",
        "type": "choice",
        "tag": "〜ので",
        "prompt": "Which fits the blank in this polite excuse to a superior?",
        "jp": "すみません、頭がいたい＿＿、今日は休みます。",
        "en": "Excuse me, I have a headache, so I'll take today off.",
        "options": [
          "ので",
          "から",
          "ため",
          "のに"
        ],
        "correct": 0,
        "explain": "ので presents the reason as objective circumstance, which sounds softer and more deferential. から asserts the reason more forcefully — fine among friends, a bit blunt when excusing yourself to a boss."
      },
      {
        "id": "N4-9-1",
        "type": "choice",
        "tag": "〜から",
        "prompt": "Which fits the blank?",
        "jp": "あぶない＿＿、さわらないで！",
        "en": "It's dangerous, so don't touch it!",
        "options": [
          "から",
          "ので",
          "のに",
          "まで"
        ],
        "correct": 0,
        "explain": "から suits urgent warnings and strong personal assertions. It's also the natural choice before a command or prohibition — ので sits awkwardly there."
      },
      {
        "id": "N4-9-2",
        "type": "choice",
        "tag": "〜ので",
        "prompt": "Which fits the blank?",
        "jp": "この子はまだ5さい＿ので、バス代はかかりません。",
        "en": "This child is still 5, so there's no bus fare.",
        "options": [
          "な",
          "の",
          "だ",
          "で"
        ],
        "correct": 0,
        "explain": "Nouns and na-adjectives take な before ので: 5さいなので, 静かなので. A frequent error is 静かのなので or 静かだので."
      },
      {
        "id": "N4-9-3",
        "type": "choice",
        "tag": "〜くて（原因）",
        "prompt": "Which fits the blank?",
        "jp": "友だちがい＿＿＿て、さびしい。",
        "en": "I don't have any friends, and I'm lonely.",
        "options": [
          "なく",
          "ない",
          "なくて",
          "ないで"
        ],
        "correct": 0,
        "explain": "The negative ない is an い-adjective, so its て-form drops い and adds くて: いない → いなくて. さびしいて is a common mistake — it must be さびしくて."
      },
      {
        "id": "N4-9-4",
        "type": "choice",
        "tag": "〜で（原因）",
        "prompt": "Which fits the blank?",
        "jp": "しんぱい＿、よくねむれませんでした。",
        "en": "I was worried, and couldn't sleep well.",
        "options": [
          "で",
          "て",
          "くて",
          "だで"
        ],
        "correct": 0,
        "explain": "Na-adjectives and nouns connect with で: しんぱいで, 病気で. Verbs use て (おくれて), い-adjectives use くて (いたくて). しんぱいだで is not a form."
      },
      {
        "id": "N4-9-5",
        "type": "choice",
        "tag": "〜からです",
        "prompt": "Which sentence attaches からです correctly?",
        "options": [
          "れんしゅうが足りなかったからです。",
          "れんしゅうが足りなかったからだです。",
          "静かからです。",
          "静かでからです。"
        ],
        "correct": 0,
        "explain": "からです follows the plain form directly for verbs and い-adjectives. For na-adjectives and nouns you need だ first: 静かだからです, 学生だからです."
      },
      {
        "id": "N4-9-6",
        "type": "choice",
        "tag": "〜て（原因）",
        "prompt": "Why is 「頭がいたくて、今日休みたいです。」unnatural?",
        "options": [
          "The て-cause form can't be followed by a want/request/command clause",
          "いたい cannot take くて",
          "休みたい is not a real form",
          "It needs to be in the past tense"
        ],
        "correct": 0,
        "explain": "て-cause works when the result is an involuntary feeling or state (ねむれませんでした, さびしい). When the second clause expresses your intention or a request, switch to から/ので: 頭がいたいので、今日休みたいです。"
      },
      {
        "id": "N4-9-7",
        "type": "fill",
        "tag": "〜て（原因）",
        "prompt": "Type the missing character in hiragana.",
        "jp": "おくれ＿、すみませんでした。",
        "en": "Sorry for being late.",
        "answers": [
          "て"
        ],
        "explain": "Set apologies and thanks take the plain て-form as their cause: おくれて、すみません／教えてくれて、ありがとう. Using ので here would sound stiff and over-explained."
      }
    ],
    "10": [
      {
        "id": "N4-10-0",
        "type": "choice",
        "tag": "〜に（目的）",
        "prompt": "Which particle fits the blank?",
        "jp": "デパートへくつを買い＿行きます。",
        "en": "I'm going to the department store to buy shoes.",
        "options": [
          "に",
          "で",
          "を",
          "は"
        ],
        "correct": 0,
        "explain": "Verb stem + に + a MOVEMENT verb (行く・来る・帰る) expresses the purpose of going somewhere: 買い + に + 行きます. With する-nouns, drop を: さんぽに行きました (not さんぽをに)."
      },
      {
        "id": "N4-10-1",
        "type": "choice",
        "tag": "〜ため(に)",
        "prompt": "Which fits the blank?",
        "jp": "けっこんしきの＿＿＿に、いろいろじゅんびをしています。",
        "en": "I'm making various preparations for the wedding.",
        "options": [
          "ため",
          "よう",
          "そう",
          "ながら"
        ],
        "correct": 0,
        "explain": "ために states the purpose of a deliberate action. After a noun it takes の (けっこんしきのために); after a verb it takes the dictionary form (しゅっせきするため)."
      },
      {
        "id": "N4-10-2",
        "type": "choice",
        "tag": "〜ように",
        "prompt": "Which fits the blank?",
        "jp": "話がよく聞こえる＿＿＿に、前のほうにすわりましょう。",
        "en": "Let's sit near the front so we can hear the talk well.",
        "options": [
          "よう",
          "ため",
          "そう",
          "とき"
        ],
        "correct": 0,
        "explain": "聞こえる is something you can't will into happening, so the goal clause takes ように. ために would require a goal you directly control."
      },
      {
        "id": "N4-10-3",
        "type": "choice",
        "tag": "ため vs ように",
        "prompt": "What decides whether a purpose clause takes ために or ように?",
        "options": [
          "ために takes a volitional verb you control; ように takes a non-volitional verb or potential/negative form",
          "ために is polite; ように is casual",
          "ために is for the past; ように is for the future",
          "ために is for people; ように is for objects"
        ],
        "correct": 0,
        "explain": "Compare 日本語を勉強するために日本へ行きます (studying is your choice → ため) with 日本語が話せるように毎日練習します (being able to speak isn't something you can just decide → よう). Potential forms, 〜ない, and verbs like 分かる・聞こえる all pull toward ように."
      },
      {
        "id": "N4-10-4",
        "type": "choice",
        "tag": "〜ないように",
        "prompt": "Which fits the blank?",
        "jp": "けがをし＿＿＿ように、気をつけてね。",
        "en": "Be careful not to get hurt.",
        "options": [
          "ない",
          "た",
          "る",
          "て"
        ],
        "correct": 0,
        "explain": "To express a goal of AVOIDING something, use the ない form + ように: けがをしないように, おくれないように. Negative goals essentially always take ように rather than ために."
      },
      {
        "id": "N4-10-5",
        "type": "fill",
        "tag": "〜に（目的）",
        "prompt": "Type the missing particle in hiragana.",
        "jp": "父はこうえんへさんぽ＿行きました。",
        "en": "My father went to the park to take a walk.",
        "answers": [
          "に"
        ],
        "explain": "さんぽ is a する-noun, so it connects straight to に before the movement verb: さんぽに行きました. Adding を (さんぽをに) is ungrammatical."
      },
      {
        "id": "N4-10-6",
        "type": "choice",
        "tag": "〜に（目的）",
        "prompt": "Why is 「本を読みに勉強しました。」wrong?",
        "options": [
          "The purpose-に pattern requires a movement verb (行く・来る・帰る) as the main verb",
          "読む cannot be used with に",
          "It should be 読むに",
          "勉強する can never follow another verb"
        ],
        "correct": 0,
        "explain": "This に only works when you GO somewhere for a purpose. 勉強しました involves no movement, so you need ために instead: 本を読むために勉強しました。"
      },
      {
        "id": "N4-10-7",
        "type": "choice",
        "tag": "〜ため(に)",
        "prompt": "Why is 「母が晩ご飯を作るために、わたしは買い物に行きました。」wrong?",
        "options": [
          "ために requires the same subject in both clauses",
          "作る cannot take ために",
          "買い物 cannot be the object of 行く",
          "ために cannot be used in the past tense"
        ],
        "correct": 0,
        "explain": "With ために, the person doing the purpose and the person doing the action must match. When the subjects differ, use ように instead: 母が晩ご飯を作れるように、わたしは買い物に行きました。"
      }
    ],
    "11": [
      {
        "id": "N4-11-0",
        "type": "choice",
        "tag": "〜し",
        "prompt": "Which fits the blank?",
        "jp": "この部屋は静か＿＿＿、広いです。",
        "en": "This room is quiet, and it's spacious too.",
        "options": [
          "だし",
          "でし",
          "なし",
          "がし"
        ],
        "correct": 0,
        "explain": "し attaches to the PLAIN form. A na-adjective's plain form ends in だ, so 静かだ + し = 静かだし. (For i-adjectives you just add し: 安いし.)"
      },
      {
        "id": "N4-11-1",
        "type": "choice",
        "tag": "〜も〜し",
        "prompt": "Which fits the blank?",
        "jp": "山田さんは頭＿＿＿いいし、スポーツもできます。",
        "en": "Yamada is smart, and on top of that he's good at sports.",
        "options": [
          "も",
          "が",
          "は",
          "を"
        ],
        "correct": 0,
        "explain": "The 〜も〜し、〜も… frame stacks points in the same direction. Using も in BOTH halves is what signals 'and what's more' — with が it would just be a neutral list of facts."
      },
      {
        "id": "N4-11-2",
        "type": "fill",
        "tag": "〜し",
        "prompt": "Type the missing word in hiragana.",
        "jp": "あの店は安い＿＿＿、店員も親切だから、よく行きます。",
        "en": "That shop is cheap, and the staff are kind too, so I go there often.",
        "answers": [
          "し"
        ],
        "explain": "し piles up reasons that all point to the same conclusion, then から delivers it. Note that し implies 'and there are other reasons besides' — it never means the list is complete."
      },
      {
        "id": "N4-11-3",
        "type": "choice",
        "tag": "〜たり〜たり",
        "prompt": "Which fits the blank?",
        "jp": "休みの日は、そうじをしたり、洗濯を＿＿＿します。",
        "en": "On my days off I do things like cleaning and laundry.",
        "options": [
          "したり",
          "して",
          "する",
          "しては"
        ],
        "correct": 0,
        "explain": "〜たり〜たり must be completed on BOTH sides before する closes it. Leaving the second verb as して or する breaks the pattern — it becomes a plain sequence instead of a sample list."
      },
      {
        "id": "N4-11-4",
        "type": "choice",
        "tag": "〜たり〜たり",
        "prompt": "Which fits the blank?",
        "jp": "最近、天気が暑くなったり＿＿＿します。",
        "en": "Lately the weather turns hot, then cold, back and forth.",
        "options": [
          "寒くなったり",
          "寒くなって",
          "寒くなり",
          "寒くなると"
        ],
        "correct": 0,
        "explain": "With a pair of opposites, たり〜たり describes an alternating back-and-forth. The second half has to take たり too; the た-form is what the り attaches to (寒くなった → 寒くなったり)."
      },
      {
        "id": "N4-11-5",
        "type": "choice",
        "tag": "〜し vs 〜たり",
        "prompt": "What's the real difference between 〜し and 〜たり〜たり?",
        "jp": "",
        "en": "",
        "options": [
          "し stacks reasons or qualities that all hold at once; たり lists a couple of representative actions out of many",
          "し is polite and たり is casual",
          "し is for the past and たり is for the present",
          "There is no real difference — they're interchangeable"
        ],
        "correct": 0,
        "explain": "し says 'this is true, and also this' — the points coexist and usually build toward a conclusion. たり〜たり picks out sample activities from a wider set, so it's about examples, not accumulation."
      },
      {
        "id": "N4-11-6",
        "type": "choice",
        "tag": "〜たり〜たり",
        "prompt": "One of these 〜たり sentences is ungrammatical. Which one?",
        "jp": "",
        "en": "",
        "options": [
          "きのうは、映画を見たり、買い物をしたりです。",
          "きのうは、映画を見たり、買い物をしたりしました。",
          "週末は、料理をしたり、そうじをしたりします。",
          "公園で子どもたちが走ったり、遊んだりしていました。"
        ],
        "correct": 0,
        "explain": "〜たり〜たり has to be closed with a form of する, not です. The correct version is 見たり、買い物をしたりしました。"
      },
      {
        "id": "N4-11-7",
        "type": "fill",
        "tag": "〜たり〜たり",
        "prompt": "Type the missing word in hiragana.",
        "jp": "パーティーでは、歌を歌ったり、おどっ＿＿＿しました。",
        "en": "At the party we did things like singing and dancing.",
        "answers": [
          "たり"
        ],
        "explain": "おどる → た-form おどった → おどったり. The り simply rides on the た-form, which is why the second half here is おどったり and not おどりたり."
      }
    ],
    "12": [
      {
        "id": "N4-12-0",
        "type": "choice",
        "tag": "〜かもしれません",
        "prompt": "Which fits the blank?",
        "jp": "空が暗いですね。雨が降る＿＿＿。",
        "en": "The sky's dark. It might rain.",
        "options": [
          "かもしれません",
          "はずです",
          "ようにします",
          "ことにします"
        ],
        "correct": 0,
        "explain": "かもしれません expresses a bare possibility — it might, it might not. はずです would claim you have solid grounds to EXPECT rain, which a merely dark sky doesn't give you."
      },
      {
        "id": "N4-12-1",
        "type": "choice",
        "tag": "〜はずです",
        "prompt": "Which fits the blank?",
        "jp": "山田さんは毎日ここに来ますから、今日も来る＿＿＿。",
        "en": "Yamada comes here every day, so he should come today too.",
        "options": [
          "はずです",
          "かもしれません",
          "つもりです",
          "ようです"
        ],
        "correct": 0,
        "explain": "はずです draws a confident expectation from a known fact — he comes daily, so today should be no different. つもりです would state HIS intention, which you can't do for someone else."
      },
      {
        "id": "N4-12-2",
        "type": "choice",
        "tag": "〜かもしれません vs 〜はずです",
        "prompt": "How do かもしれません and はずです differ in how certain the speaker is?",
        "jp": "",
        "en": "",
        "options": [
          "はずです is a confident expectation backed by a reason; かもしれません is a mere possibility with no strong grounds",
          "かもしれません is more certain than はずです",
          "はずです is polite and かもしれません is casual",
          "They express exactly the same level of certainty"
        ],
        "correct": 0,
        "explain": "Think of はず as 'it ought to be so, given what I know' and かも as 'it could go either way.' はず needs grounds; かも explicitly avoids committing to any."
      },
      {
        "id": "N4-12-3",
        "type": "choice",
        "tag": "〜ようです",
        "prompt": "Which fits the blank?",
        "jp": "田中さんの部屋は暗いですね。もう寝た＿＿＿。",
        "en": "Tanaka's room is dark. It seems he's already gone to bed.",
        "options": [
          "ようです",
          "つもりです",
          "ようにします",
          "ことです"
        ],
        "correct": 0,
        "explain": "ようです reports the impression you form from evidence in front of you — the dark room. It's a judgement about someone else's situation, drawn from what you can observe."
      },
      {
        "id": "N4-12-4",
        "type": "choice",
        "tag": "〜ようです・〜みたいです",
        "prompt": "Which fits the blank?",
        "jp": "この料理は少し辛い＿＿＿ですね。",
        "en": "This dish seems a bit spicy, doesn't it?",
        "options": [
          "みたい",
          "みたいな",
          "みたいの",
          "みたいだ"
        ],
        "correct": 0,
        "explain": "みたい attaches straight onto the plain form (辛い + みたい) and then takes です. It's the casual twin of よう — but unlike よう, it never needs な after an i-adjective."
      },
      {
        "id": "N4-12-5",
        "type": "choice",
        "tag": "〜はずです",
        "prompt": "Which fits the blank?",
        "jp": "この部屋は静か＿＿＿はずです。となりに誰も住んでいませんから。",
        "en": "This room should be quiet — nobody lives next door.",
        "options": [
          "な",
          "だ",
          "の",
          "で"
        ],
        "correct": 0,
        "explain": "はず behaves like a noun, so a na-adjective in front of it takes な: 静かなはず. (A noun would take の instead: 学生のはず.)"
      },
      {
        "id": "N4-12-6",
        "type": "choice",
        "tag": "〜かもしれません",
        "prompt": "One of these かもしれません sentences is ungrammatical. Which one?",
        "jp": "",
        "en": "",
        "options": [
          "あしたは雨ですかもしれません。",
          "あしたは雨かもしれません。",
          "この本は高いかもしれません。",
          "彼は来ないかもしれません。"
        ],
        "correct": 0,
        "explain": "かもしれません follows the PLAIN form, so a noun stands bare in front of it — 雨かもしれません. Inserting です before it is the classic mistake."
      },
      {
        "id": "N4-12-7",
        "type": "fill",
        "tag": "〜ようです",
        "prompt": "Type the missing word in hiragana.",
        "jp": "外がぬれています。夜、雨が降った＿＿＿です。",
        "en": "It's wet outside. It seems it rained during the night.",
        "answers": [
          "よう"
        ],
        "explain": "You didn't see the rain — you're inferring it from the wet ground. That's exactly what ようです is for: a conclusion drawn from evidence you can point to."
      }
    ],
    "13": [
      {
        "id": "N4-13-0",
        "type": "choice",
        "tag": "〜なさい",
        "prompt": "Which fits the blank?",
        "jp": "早く＿＿＿なさい。学校におくれますよ。",
        "en": "Get up quickly. You'll be late for school.",
        "options": [
          "起き",
          "起きる",
          "起きて",
          "起きた"
        ],
        "correct": 0,
        "explain": "なさい attaches to the ます-stem: 起きます → 起き + なさい. It's a firm instruction a parent or teacher gives — never something you'd say upward to a superior."
      },
      {
        "id": "N4-13-1",
        "type": "choice",
        "tag": "〜ほうがいいです",
        "prompt": "Which fits the blank?",
        "jp": "熱があるんですか。今日は早く＿＿＿ほうがいいですよ。",
        "en": "You have a fever? You'd better go home early today.",
        "options": [
          "帰った",
          "帰る",
          "帰って",
          "帰り"
        ],
        "correct": 0,
        "explain": "For positive advice, 〜ほうがいい normally takes the た-form: 帰ったほうがいい. (The negative side keeps ない: 帰らないほうがいい.)"
      },
      {
        "id": "N4-13-2",
        "type": "choice",
        "tag": "〜ないと",
        "prompt": "Which fits the blank?",
        "jp": "あしたテストだから、勉強し＿＿＿。",
        "en": "There's a test tomorrow, so I have to study.",
        "options": [
          "ないと",
          "ないで",
          "なくて",
          "ないので"
        ],
        "correct": 0,
        "explain": "〜ないと (short for 〜ないといけない) is the casual way to say 'I've got to.' The consequence is left hanging — it's understood that something bad follows if you don't."
      },
      {
        "id": "N4-13-3",
        "type": "choice",
        "tag": "〜なさい vs 〜ほうがいい",
        "prompt": "Your boss looks unwell. Which is appropriate?",
        "jp": "",
        "en": "",
        "options": [
          "少し休んだほうがいいですよ。",
          "少し休みなさい。",
          "少し休めなさい。",
          "少し休みなさいですよ。"
        ],
        "correct": 0,
        "explain": "なさい talks DOWN to the listener, so it's wrong toward a boss. ほうがいいですよ offers the same suggestion as advice the listener is free to take."
      },
      {
        "id": "N4-13-4",
        "type": "choice",
        "tag": "〜ないほうがいいです",
        "prompt": "Which fits the blank?",
        "jp": "体によくないですから、たばこは＿＿＿ほうがいいです。",
        "en": "It's bad for your health, so you'd better not smoke.",
        "options": [
          "吸わない",
          "吸わなかった",
          "吸って",
          "吸い"
        ],
        "correct": 0,
        "explain": "Negative advice uses the plain ない form — 吸わないほうがいい. Note the asymmetry with positive advice, which prefers the た-form (吸ったほうがいい)."
      },
      {
        "id": "N4-13-5",
        "type": "fill",
        "tag": "〜なさい",
        "prompt": "Type the missing word in hiragana.",
        "jp": "ご飯を食べる前に、手を洗い＿＿＿。",
        "en": "Wash your hands before you eat.",
        "answers": [
          "なさい"
        ],
        "explain": "洗います → stem 洗い → 洗いなさい. This is the register a parent uses with a child, or a test paper uses in its instructions (答えなさい)."
      },
      {
        "id": "N4-13-6",
        "type": "choice",
        "tag": "〜ないと",
        "prompt": "What is left unsaid at the end of 「もう行かないと。」?",
        "jp": "",
        "en": "",
        "options": [
          "いけません / だめです — the bad consequence of not going",
          "ください — it's a request to the listener",
          "でしょう — it's a guess about the future",
          "ますか — it's a question"
        ],
        "correct": 0,
        "explain": "The full form is 行かないといけません. In speech the ending is dropped and the trailing と does the work, which is why 「行かないと。」on its own already means 'I've got to go.'"
      },
      {
        "id": "N4-13-7",
        "type": "choice",
        "tag": "〜ほうがいいです",
        "prompt": "One of these pieces of advice is ungrammatical. Which one?",
        "jp": "",
        "en": "",
        "options": [
          "早く寝るほうがいいでした。",
          "早く寝たほうがいいです。",
          "無理をしないほうがいいです。",
          "医者に行ったほうがいいですよ。"
        ],
        "correct": 0,
        "explain": "いい is an i-adjective, so its past is よかった — いいでした doesn't exist. Advice about the present simply stays 〜たほうがいいです."
      }
    ],
    "14": [
      {
        "id": "N4-14-0",
        "type": "choice",
        "tag": "〜と…",
        "prompt": "Which fits the blank?",
        "jp": "春になる＿＿＿、桜がさきます。",
        "en": "When spring comes, the cherry blossoms bloom.",
        "options": [
          "と",
          "たら",
          "ば",
          "なら"
        ],
        "correct": 0,
        "explain": "と is for automatic, always-true consequences — natural laws, machines, directions. Given spring, blossom follows every time, with no choice involved."
      },
      {
        "id": "N4-14-1",
        "type": "choice",
        "tag": "〜と…",
        "prompt": "One of these と sentences is ungrammatical. Which one?",
        "jp": "",
        "en": "",
        "options": [
          "駅に着くと、電話してください。",
          "このボタンをおすと、切符が出ます。",
          "まっすぐ行くと、右に銀行があります。",
          "冬になると、雪がふります。"
        ],
        "correct": 0,
        "explain": "と can't be followed by a request, command, invitation or intention — only by an inevitable result. For a request, use たら: 駅に着いたら、電話してください。"
      },
      {
        "id": "N4-14-2",
        "type": "choice",
        "tag": "〜ば…",
        "prompt": "Which fits the blank?",
        "jp": "安けれ＿＿＿、買います。",
        "en": "If it's cheap, I'll buy it.",
        "options": [
          "ば",
          "たら",
          "なら",
          "と"
        ],
        "correct": 0,
        "explain": "安い → 安ければ. For i-adjectives the ば form replaces い with ければ, and it states a general condition for the action that follows."
      },
      {
        "id": "N4-14-3",
        "type": "choice",
        "tag": "〜たら…",
        "prompt": "Which fits the blank?",
        "jp": "宿題が＿＿＿、遊びに行ってもいいですよ。",
        "en": "Once your homework is finished, you may go out and play.",
        "options": [
          "終わったら",
          "終わると",
          "終われば",
          "終わるなら"
        ],
        "correct": 0,
        "explain": "たら handles a one-off sequence — first this finishes, then that becomes possible — and unlike と it happily takes permission, requests and commands after it."
      },
      {
        "id": "N4-14-4",
        "type": "choice",
        "tag": "〜たら vs 〜と",
        "prompt": "Why can't you say 「駅に着くと、電話してください」?",
        "jp": "",
        "en": "",
        "options": [
          "と only introduces results that follow automatically, so it can't be followed by a request",
          "着く cannot be used with と",
          "と can only be used in the past tense",
          "電話する cannot follow a conditional"
        ],
        "correct": 0,
        "explain": "This is the single most useful rule about と: the second half must be an inevitable consequence. Anything involving the listener's will — please do, let's do, I'll do — needs たら or ば instead."
      },
      {
        "id": "N4-14-5",
        "type": "fill",
        "tag": "〜ば…",
        "prompt": "Type the missing word in hiragana.",
        "jp": "この薬を飲め＿＿＿、すぐ元気になりますよ。",
        "en": "If you take this medicine, you'll feel better right away.",
        "answers": [
          "ば"
        ],
        "explain": "飲む → 飲めば. For u-verbs, the ば form changes the final -u to -e and adds ば. It presents taking the medicine as the condition that brings the result about."
      },
      {
        "id": "N4-14-6",
        "type": "choice",
        "tag": "〜ば…",
        "prompt": "Which fits the blank?",
        "jp": "お金が＿＿＿、旅行に行けるのに。",
        "en": "If only I had money, I could go travelling.",
        "options": [
          "あれば",
          "あると",
          "あったら",
          "あるなら"
        ],
        "correct": 0,
        "explain": "ば…のに is the standard frame for a wish about something contrary to fact. ば is especially at home in these regretful 'if only' sentences."
      },
      {
        "id": "N4-14-7",
        "type": "choice",
        "tag": "〜と…",
        "prompt": "Which fits the blank?",
        "jp": "この道をまっすぐ行く＿＿＿、左に郵便局があります。",
        "en": "If you go straight along this road, there's a post office on the left.",
        "options": [
          "と",
          "なら",
          "ば",
          "たら"
        ],
        "correct": 0,
        "explain": "Giving directions is one of と's core jobs: follow this route and that landmark appears, reliably, for anyone. The result is a fact about the world, not a plan."
      }
    ],
    "15": [
      {
        "id": "N4-15-0",
        "type": "choice",
        "tag": "〜なら…",
        "prompt": "Which fits the blank?",
        "jp": "「京都へ行きたいんですが。」「京都＿＿＿、秋がいちばんいいですよ。」",
        "en": "\"I'd like to go to Kyoto.\" \"If it's Kyoto you mean, autumn is best.\"",
        "options": [
          "なら",
          "たら",
          "と",
          "ば"
        ],
        "correct": 0,
        "explain": "なら picks up a topic the OTHER person just raised and gives advice about it. That reactive quality — 'speaking of Kyoto' — is what separates it from the other conditionals."
      },
      {
        "id": "N4-15-1",
        "type": "choice",
        "tag": "〜たら…（発見）",
        "prompt": "Which fits the blank?",
        "jp": "うちへ帰っ＿＿＿、友だちが待っていました。",
        "en": "When I got home, my friend was waiting.",
        "options": [
          "たら",
          "ば",
          "と言って",
          "なら"
        ],
        "correct": 0,
        "explain": "たら + past reports a discovery: you did something and then found an unexpected situation. ば can't be used this way, since it states conditions rather than narrating what happened."
      },
      {
        "id": "N4-15-2",
        "type": "choice",
        "tag": "〜なら vs 〜たら",
        "prompt": "Which ordering does なら express in 「日本へ行くなら、カメラを買います」?",
        "jp": "",
        "en": "",
        "options": [
          "Buying the camera comes BEFORE going to Japan",
          "Buying the camera comes AFTER arriving in Japan",
          "Both happen at exactly the same time",
          "The camera is bought instead of going to Japan"
        ],
        "correct": 0,
        "explain": "This is なら's trademark: the main clause can precede the condition in time. With たら (日本へ行ったら) the camera would be bought after arriving — a genuinely different plan."
      },
      {
        "id": "N4-15-3",
        "type": "choice",
        "tag": "〜なら…",
        "prompt": "Which fits the blank?",
        "jp": "そんなに＿＿＿なら、少し休んだらどうですか。",
        "en": "If you're that tired, why not rest a bit?",
        "options": [
          "疲れている",
          "疲れていて",
          "疲れていた",
          "疲れていれば"
        ],
        "correct": 0,
        "explain": "なら attaches to the plain form, so 疲れている + なら. The speaker is responding to a state the listener has just revealed, then offering a suggestion."
      },
      {
        "id": "N4-15-4",
        "type": "choice",
        "tag": "〜たら…（発見）",
        "prompt": "Which fits the blank?",
        "jp": "まどを開けたら、雪が＿＿＿。",
        "en": "When I opened the window, it was snowing.",
        "options": [
          "降っていました",
          "降るでしょう",
          "降りましょう",
          "降ってください"
        ],
        "correct": 0,
        "explain": "Discovery たら needs a PAST main clause, because you're reporting what you found. A guess, an invitation, or a request can't be what you discovered on opening the window."
      },
      {
        "id": "N4-15-5",
        "type": "fill",
        "tag": "〜なら…",
        "prompt": "Type the missing word in hiragana.",
        "jp": "「新しいパソコンを買いたいです。」「パソコン＿＿＿、あの店が安いですよ。」",
        "en": "\"I want to buy a new computer.\" \"For computers, that shop is cheap.\"",
        "answers": [
          "なら"
        ],
        "explain": "The listener brought computers up, and you're narrowing to that topic before advising. Nouns take なら directly — no だ in between."
      },
      {
        "id": "N4-15-6",
        "type": "choice",
        "tag": "〜なら…",
        "prompt": "One of these なら sentences is ungrammatical. Which one?",
        "jp": "",
        "en": "",
        "options": [
          "春になるなら、桜がさきます。",
          "日本語を勉強するなら、この本がいいですよ。",
          "安いなら、買います。",
          "行くなら、電車が便利です。"
        ],
        "correct": 0,
        "explain": "なら can't be used for an automatic natural consequence — that's と's job: 春になると、桜がさきます。なら needs a topic someone has raised or a supposition being entertained."
      },
      {
        "id": "N4-15-7",
        "type": "choice",
        "tag": "〜たら vs 〜なら",
        "prompt": "Which fits the blank?",
        "jp": "駅に＿＿＿、電話してください。",
        "en": "When you arrive at the station, please call me.",
        "options": [
          "着いたら",
          "着くと",
          "着けば",
          "着くなら"
        ],
        "correct": 0,
        "explain": "The call happens AFTER arriving, and the sentence is a request — both point to たら. 着くなら would mean 'if you're planning to go to the station,' with the call coming first."
      }
    ]
  },
  "N3": {
    "1": [
      {
        "id": "N3-1-0",
        "type": "choice",
        "tag": "〜ないうちに",
        "prompt": "Which fits the blank? (練習1課-1)",
        "jp": "（＿＿＿）うちに、聞いたことをメモしておいたほうがいい。",
        "en": "You'd better jot down what you heard before you forget.",
        "options": [
          "忘れる",
          "忘れない",
          "忘れている"
        ],
        "correct": 1,
        "explain": "〜ないうちに means 'while ~ has not yet happened' — i.e. do it before the change occurs. 忘れないうちに = 'before you forget.' 忘れるうちに would be nonsense, since うちに needs a state that still holds."
      },
      {
        "id": "N3-1-1",
        "type": "choice",
        "tag": "〜ているうちに",
        "prompt": "Which fits the blank? (練習1課-2)",
        "jp": "ほかのことに気を（＿＿＿）うちにご飯を食べる時間がなくなってしまった。",
        "en": "While my attention was taken up by other things, I ran out of time to eat.",
        "options": [
          "取られた",
          "取られない",
          "取られている"
        ],
        "correct": 2,
        "explain": "うちに attaches to a state that is currently continuing, so the 〜ている form is what's needed: 気を取られている (being distracted) is the ongoing state during which the time ran out."
      },
      {
        "id": "N3-1-2",
        "type": "choice",
        "tag": "〜間に",
        "prompt": "Which fits the blank? (練習1課-3)",
        "jp": "お風呂に（＿＿＿）間に、配達の人が来たようだ。",
        "en": "It seems the delivery person came while I was in the bath.",
        "options": [
          "入る",
          "入った",
          "入っている"
        ],
        "correct": 2,
        "explain": "間に needs a continuing state as its frame. 入っている = 'am/was in the bath' (the ongoing state); 入る would be the moment of getting in, which is too brief to contain another event."
      },
      {
        "id": "N3-1-3",
        "type": "choice",
        "tag": "〜間 vs 〜間に",
        "prompt": "Which fits the blank? (練習1課-4)",
        "jp": "わたしは夏休みの（＿＿＿）、アメリカの友だちの家にいた。",
        "en": "I was at my friend's house in America for the whole summer break.",
        "options": [
          "中で",
          "間",
          "間に"
        ],
        "correct": 1,
        "explain": "This is the 間 vs 間に split: いた is a state lasting the WHOLE period, so it takes 間. 間に is for a one-off event that happens at some point inside the period (夏休みの間に一度旅行した)."
      },
      {
        "id": "N3-1-4",
        "type": "choice",
        "tag": "〜なければ vs 〜てからでないと",
        "prompt": "Which fits the blank? (練習1課-5)",
        "jp": "4時に（＿＿＿）飛行機の時間には間に合わない。",
        "en": "If you don't get up at 4, you won't make it in time for the flight.",
        "options": [
          "起きなければ",
          "起きてからでなければ",
          "起きられてからでないと"
        ],
        "correct": 0,
        "explain": "A plain conditional is what's wanted here, so 起きなければ. 〜てからでないと means 'unless you FIRST do ~ (as a necessary preliminary step)', which doesn't fit — getting up at 4 isn't a preparatory step for the flight's departure time, it's simply the condition."
      },
      {
        "id": "N3-1-5",
        "type": "choice",
        "tag": "〜てからでないと",
        "prompt": "Which fits the blank? (練習1課-6)",
        "jp": "もっと暑くなってからでないと（＿＿＿）。",
        "en": "Not until it gets hotter will you be able to swim in the sea.",
        "options": [
          "海では泳げない",
          "仕事をしても疲れない",
          "扇風機を使わなくてもいい"
        ],
        "correct": 0,
        "explain": "〜てからでないと must be followed by a NEGATIVE clause — 'unless X happens first, Y can't happen.' Only 海では泳げない is negative and logically depends on it getting hotter first."
      },
      {
        "id": "N3-1-6",
        "type": "choice",
        "tag": "辞書形＋ところ",
        "prompt": "Which fits the blank? (練習1課-7)",
        "jp": "間もなく2時に（＿＿＿）ところです。",
        "en": "It's just about to turn 2 o'clock.",
        "options": [
          "なる",
          "なった",
          "なっている"
        ],
        "correct": 0,
        "explain": "間もなく ('shortly') signals something that hasn't happened yet, so you need dictionary form + ところ = 'about to.' なったところ would mean it just turned 2, which contradicts 間もなく."
      },
      {
        "id": "N3-1-7",
        "type": "choice",
        "tag": "〜ところを",
        "prompt": "Which fits the blank? (練習1課-8)",
        "jp": "学校を休んで遊んでいる（＿＿＿）友だちのお母さんに見られた。",
        "en": "I was seen by my friend's mother while skipping school and messing around.",
        "options": [
          "ところで",
          "ところに",
          "ところを"
        ],
        "correct": 2,
        "explain": "When the ところ (the scene/moment) is itself the OBJECT of the following verb — being seen, caught, photographed — it takes を. 見られる acts on the scene, hence ところを見られた."
      },
      {
        "id": "N3-1-8",
        "type": "choice",
        "tag": "〜ところだから",
        "prompt": "Which fits the blank? (練習1課-9)",
        "jp": "今、出かける準備をしている（＿＿＿）ちょっと待って。",
        "en": "I'm getting ready to go out right now, so wait a moment.",
        "options": [
          "ところで",
          "ところを",
          "ところだから"
        ],
        "correct": 2,
        "explain": "The second half is a request that follows FROM the situation, so you need a reason connector: ところだから ('because I'm right in the middle of ~'). ところを would require a verb acting on the scene."
      },
      {
        "id": "N3-1-9",
        "type": "choice",
        "tag": "〜ところに",
        "prompt": "Which fits the blank? (練習1課・2課-1)",
        "jp": "ちょうどメールを書いている（＿＿＿）本人が来た。",
        "en": "Just as I was writing the email, the person themselves showed up.",
        "options": [
          "までに",
          "間",
          "ところに"
        ],
        "correct": 2,
        "explain": "ところに marks the precise moment something else interrupts. ちょうど reinforces that timing. 間 would describe a stretch of time rather than the instant of interruption."
      },
      {
        "id": "N3-1-10",
        "type": "choice",
        "tag": "〜ているうちに",
        "prompt": "Which fits the blank? (練習1課・2課-2)",
        "jp": "先生の説明を聞いている（＿＿＿）だんだんわかってきた。",
        "en": "As I listened to the teacher's explanation, I gradually came to understand.",
        "options": [
          "うちに",
          "たびに",
          "ところを"
        ],
        "correct": 0,
        "explain": "うちに is the one that pairs with a gradual change (だんだん〜てきた) happening over the course of an ongoing action. たびに would mean 'every time,' implying repeated separate occasions."
      },
      {
        "id": "N3-1-11",
        "type": "choice",
        "tag": "〜たとき",
        "prompt": "Which fits the blank? (練習1課・2課-3)",
        "jp": "今朝（＿＿＿）のどが痛かった。",
        "en": "When I woke up this morning, my throat hurt.",
        "options": [
          "起きたとき",
          "起きたついでに",
          "起きているうちに"
        ],
        "correct": 0,
        "explain": "A simple point in time calls for plain 〜たとき. ついでに needs a deliberate action you tack something onto, and うちに needs a continuing state — neither fits waking up and noticing a sore throat."
      },
      {
        "id": "N3-1-12",
        "type": "choice",
        "tag": "〜てからでないと",
        "prompt": "Which fits the blank? (練習1課・2課-4)",
        "jp": "自分の目で（＿＿＿）何ともお答えできません。",
        "en": "Until I've checked with my own eyes, I can't give you any answer.",
        "options": [
          "確かめたとおりに",
          "確かめてからでないと",
          "確かめたから"
        ],
        "correct": 1,
        "explain": "Checking is a necessary FIRST step before answering becomes possible, and the result clause is negative (お答えできません) — that's exactly the 〜てからでないと…ない frame."
      },
      {
        "id": "N3-1-13",
        "type": "choice",
        "tag": "〜たまま",
        "prompt": "Which fits the blank? (練習1課・2課-7)",
        "jp": "あの子はここにかばんを（＿＿＿）どこかへ行ってしまった。",
        "en": "That kid left their bag here and wandered off somewhere.",
        "options": [
          "置いている間",
          "置いたついでに",
          "置いたまま"
        ],
        "correct": 2,
        "explain": "まま describes a state left unchanged — the bag was put down and stayed that way while they left. 置いている間 would need a second event happening inside that period, which 行ってしまった doesn't fit."
      }
    ],
    "2": [
      {
        "id": "N3-2-0",
        "type": "choice",
        "tag": "〜とおり",
        "prompt": "Which fits the blank? (練習2課-1)",
        "jp": "人生は自分の（＿＿＿）とおりにはいかない。",
        "en": "Life doesn't go the way you think it will.",
        "options": [
          "考え",
          "計画",
          "思う"
        ],
        "correct": 2,
        "explain": "とおり takes a VERB in plain form directly (思うとおり). Nouns need の in front instead — 考えのとおり / 計画どおり — so only 思う slots straight in before とおり here."
      },
      {
        "id": "N3-2-1",
        "type": "choice",
        "tag": "〜のとおり",
        "prompt": "Which fits the blank? (練習2課-2)",
        "jp": "この絵の（＿＿＿）30年前はこの辺は畑だった。",
        "en": "Just as this picture shows, 30 years ago this area was fields.",
        "options": [
          "とおり",
          "どおり",
          "とおりの"
        ],
        "correct": 0,
        "explain": "After a noun + の, it stays as とおり (この絵のとおり). The voiced どおり form only appears when it attaches straight onto a noun with no の: 予定どおり, 計画どおり."
      },
      {
        "id": "N3-2-2",
        "type": "choice",
        "tag": "〜によって（違う）",
        "prompt": "Which fits the blank? (練習2課-3)",
        "jp": "この虫は地方によって呼び方が（＿＿＿）そうだ。",
        "en": "I hear this insect's name varies depending on the region.",
        "options": [
          "違う",
          "同じだ",
          "似ている"
        ],
        "correct": 0,
        "explain": "〜によって in this use means 'varies according to ~,' so the predicate must express variation. 同じだ or 似ている would contradict the whole point of によって."
      },
      {
        "id": "N3-2-3",
        "type": "choice",
        "tag": "〜によっては",
        "prompt": "Which fits the blank? (練習2課-4)",
        "jp": "あしたは、所によっては（＿＿＿）。",
        "en": "Tomorrow, in some places, it may rain.",
        "options": [
          "天気が皆違う",
          "どこも雨が降る",
          "雨が降るかもしれない"
        ],
        "correct": 2,
        "explain": "によっては (with は) singles out SOME cases from the whole — 'in certain places.' That pairs naturally with a hedge like かもしれない. どこも ('everywhere') contradicts the 'only some' meaning."
      },
      {
        "id": "N3-2-4",
        "type": "choice",
        "tag": "〜たびに",
        "prompt": "Which fits the blank? (練習2課-5)",
        "jp": "彼女はデートのたびに（＿＿＿）。",
        "en": "Every time she goes on a date, she turns up late.",
        "options": [
          "元気がない",
          "遅れてくる",
          "忙しそうだ"
        ],
        "correct": 1,
        "explain": "たびに ('every time') needs a repeated EVENT as its result, not a standing state. 遅れてくる is an action that recurs each date; 元気がない and 忙しそうだ describe conditions, which don't work with たびに."
      },
      {
        "id": "N3-2-5",
        "type": "choice",
        "tag": "〜ば〜ほど",
        "prompt": "Which fits the blank? (練習2課-6)",
        "jp": "この絵は本物ではないが、見れば（＿＿＿）本物に見える。",
        "en": "This painting isn't real, but the more you look at it, the more real it seems.",
        "options": [
          "見るほど",
          "見えるほど",
          "見ないほど"
        ],
        "correct": 0,
        "explain": "The 〜ば〜ほど frame repeats the SAME verb: ば-form + dictionary form + ほど. 見れば見るほど. Swapping in a different verb (見える) or a negative breaks the pattern."
      },
      {
        "id": "N3-2-6",
        "type": "choice",
        "tag": "〜なら〜ほど",
        "prompt": "Which fits the blank? (練習2課-7)",
        "jp": "刺身は（＿＿＿）新鮮なほどおいしい。",
        "en": "The fresher sashimi is, the tastier it is.",
        "options": [
          "新鮮だと",
          "新鮮なら",
          "新鮮でなければ"
        ],
        "correct": 1,
        "explain": "For na-adjectives the pattern is 〜なら〜なほど: 新鮮なら新鮮なほど. It's the na-adjective counterpart of 〜ば〜ほど, so the first half must be the なら form."
      },
      {
        "id": "N3-2-7",
        "type": "choice",
        "tag": "〜ながら",
        "prompt": "Which fits the blank? (練習2課-8)",
        "jp": "カンさんはピアノを（＿＿＿）歌を歌うのが上手だ。",
        "en": "Kan is good at singing while playing the piano.",
        "options": [
          "弾くたびに",
          "弾きながら",
          "弾くついでに"
        ],
        "correct": 1,
        "explain": "Two actions performed simultaneously by one person = ながら. たびに would mean 'every time he plays' (repeated occasions), and ついでに means seizing the opportunity to do something extra — neither is simultaneity."
      },
      {
        "id": "N3-2-8",
        "type": "choice",
        "tag": "〜ついでに",
        "prompt": "Which fits the blank? (練習2課-9)",
        "jp": "銀行に行ったついでに（＿＿＿）。",
        "en": "While I was out at the bank, I stopped by the flower shop.",
        "options": [
          "偶然リーさんに会った",
          "自転車に乗った",
          "花屋に寄った"
        ],
        "correct": 2,
        "explain": "ついでに needs a DELIBERATE secondary action taken advantage of the trip. 花屋に寄った is a choice; 偶然会った is pure coincidence (no intent), and 自転車に乗った is just how you travelled, not an extra errand."
      },
      {
        "id": "N3-2-9",
        "type": "choice",
        "tag": "〜どおり",
        "prompt": "Which fits the blank? (練習1課・2課-5)",
        "jp": "今日のスポーツ大会は（＿＿＿）行います。",
        "en": "Today's sports meet will be held as scheduled.",
        "options": [
          "予定どおり",
          "予定のうちに",
          "予定によって"
        ],
        "correct": 0,
        "explain": "Attached directly to a noun with no の, とおり voices to どおり: 予定どおり = 'as planned.' This is the standard set phrase for events going ahead as scheduled."
      },
      {
        "id": "N3-2-10",
        "type": "choice",
        "tag": "〜たびに",
        "prompt": "Which fits the blank? (練習1課・2課-6)",
        "jp": "わたしの場合、引っ越しする（＿＿＿）物が増える。",
        "en": "In my case, every time I move house my belongings increase.",
        "options": [
          "ところに",
          "たびに",
          "ついでに"
        ],
        "correct": 1,
        "explain": "'Every time X happens, Y happens' is たびに. ついでに would wrongly suggest the increase was a deliberate errand tacked onto moving, and ところに marks a one-off interrupting moment."
      },
      {
        "id": "N3-2-11",
        "type": "choice",
        "tag": "〜ば〜ほど",
        "prompt": "Which fits the blank? (練習1課・2課-8)",
        "jp": "山道を（＿＿＿）見える景色が広がっていく。",
        "en": "The higher you climb the mountain path, the wider the view spreads out.",
        "options": [
          "登れば登るほど",
          "登っていって",
          "登っていってから"
        ],
        "correct": 0,
        "explain": "The sentence expresses two things increasing together (climbing ↑, view ↑), which is exactly 〜ば〜ほど. The other options just describe the climbing without linking it proportionally to the view."
      },
      {
        "id": "N3-2-12",
        "type": "choice",
        "tag": "〜によっては",
        "prompt": "Which fits the blank? (練習1課・2課-9)",
        "jp": "感謝の言葉でも、言い方（＿＿＿）悪い意味に聞こえることもある。",
        "en": "Even words of thanks can sound negative depending on how you say them.",
        "options": [
          "どおりでは",
          "のたびに",
          "によっては"
        ],
        "correct": 2,
        "explain": "によっては = 'depending on (some cases of) ~.' It pairs naturally with こともある, which also hedges toward 'sometimes.' This is the same によっては as 所によっては雨."
      }
    ],
    "3": [
      {
        "id": "N3-3-0",
        "type": "choice",
        "tag": "〜ほどだ",
        "prompt": "Which fits the blank? (練習3課-1)",
        "jp": "パーティーではたくさんのごちそうが出た。（＿＿＿）ほどだった。",
        "en": "So much food came out at the party — to the point that we couldn't eat it all.",
        "options": [
          "全部食べた",
          "全部食べられる",
          "全部は食べられない"
        ],
        "correct": 2,
        "explain": "〜ほどだ illustrates the DEGREE of what was just said. Since the point is how much food there was, the illustration has to show excess: 'we couldn't finish it all.' 全部食べられる would undercut the point entirely."
      },
      {
        "id": "N3-3-1",
        "type": "choice",
        "tag": "〜ほど",
        "prompt": "Which fits the blank? (練習3課-2)",
        "jp": "最近、食事する時間もないほど（＿＿＿）。",
        "en": "Lately I've been so busy I don't even have time to eat.",
        "options": [
          "忙しい",
          "ひまだ",
          "あまり食べない"
        ],
        "correct": 0,
        "explain": "Here ほど comes FIRST and sets the degree ('to the extent of having no time to eat'), so the predicate must be the quality being measured — 忙しい. ひまだ ('free') is the opposite of what having no time implies."
      },
      {
        "id": "N3-3-2",
        "type": "choice",
        "tag": "〜くらいだ",
        "prompt": "Which fits the blank? (練習3課-3)",
        "jp": "きのうは本当に寒くて、体が（＿＿＿）くらいだった。",
        "en": "Yesterday was so cold I thought my body would freeze.",
        "options": [
          "凍った",
          "凍るかと思う",
          "凍るかどうか"
        ],
        "correct": 1,
        "explain": "くらいだ takes an exaggerated illustration of the degree. 凍るかと思う ('I thought it might freeze') is that hyperbole. 凍った would claim it literally happened, which the sentence isn't saying."
      },
      {
        "id": "N3-3-3",
        "type": "choice",
        "tag": "〜ほど…はない",
        "prompt": "Which fits the blank? (練習3課-4)",
        "jp": "京都の紅葉ほど美しいものは（＿＿＿）。",
        "en": "There is nothing as beautiful as Kyoto's autumn leaves.",
        "options": [
          "ほかにもある",
          "ほかにない",
          "ほかにも少ない"
        ],
        "correct": 1,
        "explain": "〜ほど…はない is a superlative frame: 'nothing is as ~ as X.' It REQUIRES a negative ending. ほかにもある ('there are others too') contradicts the whole construction."
      },
      {
        "id": "N3-3-4",
        "type": "choice",
        "tag": "〜ぐらい…はない",
        "prompt": "Which fits the blank? (練習3課-5)",
        "jp": "日本で富士山ぐらい（＿＿＿）山はないと思う。",
        "en": "I don't think there's any mountain in Japan as beautiful as Mt Fuji.",
        "options": [
          "きれいな",
          "高い",
          "ほかの"
        ],
        "correct": 0,
        "explain": "ぐらい…はない leans toward a SUBJECTIVE evaluation — how you rate something, not a measurable fact. That suits きれいな. For a purely objective ranking like height, ほど is the more natural choice."
      },
      {
        "id": "N3-3-5",
        "type": "choice",
        "tag": "〜くらいなら",
        "prompt": "Which fits the blank? (練習3課-6)",
        "jp": "（＿＿＿）くらいなら、今の生活レベルでがまんしよう。",
        "en": "Rather than take a punishing job, I'll put up with my current standard of living.",
        "options": [
          "いい仕事がない",
          "仕事がほしい",
          "きつい仕事をする"
        ],
        "correct": 2,
        "explain": "〜くらいなら means 'if it would come to ~, then I'd rather...'. The clause before it must be the UNDESIRABLE option being rejected — doing gruelling work — with the preferred option after it."
      },
      {
        "id": "N3-3-6",
        "type": "choice",
        "tag": "〜くらいなら",
        "prompt": "Which fits the blank? (練習3課-7)",
        "jp": "何もしないで後で残念がるくらいなら、（＿＿＿）ほうがいい。",
        "en": "Rather than do nothing and regret it later, it's better to try even if you fail.",
        "options": [
          "何も残念がらない",
          "あまりがんばらない",
          "失敗してもやってみた"
        ],
        "correct": 2,
        "explain": "The くらいなら clause names what you want to avoid (regretting it), so the second half must be the positive alternative you'd rather pick: trying anyway. Note ほうがいい takes the た form here."
      },
      {
        "id": "N3-3-7",
        "type": "choice",
        "tag": "〜に限る",
        "prompt": "Which fits the blank? (練習3課-8)",
        "jp": "旅行先でおいしい店が知りたければ、その土地の人に（＿＿＿）に限る。",
        "en": "If you want to find good restaurants while travelling, nothing beats asking the locals.",
        "options": [
          "聞く",
          "聞いた",
          "聞いている"
        ],
        "correct": 0,
        "explain": "〜に限る ('nothing beats ~') attaches to the DICTIONARY form of a verb. It states a general recommendation, so a past or progressive form doesn't fit."
      },
      {
        "id": "N3-3-8",
        "type": "choice",
        "tag": "〜に限る",
        "prompt": "Which fits the blank? (練習3課-9)",
        "jp": "眠れないときは（＿＿＿）に限る。",
        "en": "When you can't sleep, there's nothing like warm milk.",
        "options": [
          "4、5時間",
          "温かいミルク",
          "朝、起きられない"
        ],
        "correct": 1,
        "explain": "に限る also takes a NOUN, naming the best remedy. 温かいミルク is the recommended thing; 4、5時間 is just a duration, and 朝起きられない is a problem rather than a solution."
      }
    ],
    "4": [
      {
        "id": "N3-4-0",
        "type": "choice",
        "tag": "〜のに対して",
        "prompt": "Which fits the blank? (練習4課-1)",
        "jp": "前のアパートが冬も暖かかったのに対して、（＿＿＿）はとても寒い。",
        "en": "Whereas my previous apartment was warm even in winter, my current one is very cold.",
        "options": [
          "今のアパート",
          "わたしの職場",
          "山川さんの家"
        ],
        "correct": 0,
        "explain": "〜のに対して contrasts two COMPARABLE things on the same axis. The first half is about 前のアパート, so the natural counterpart is 今のアパート — comparing it to a workplace or someone else's house isn't a like-for-like contrast."
      },
      {
        "id": "N3-4-1",
        "type": "choice",
        "tag": "〜のに対して",
        "prompt": "Which fits the blank? (練習4課-2)",
        "jp": "旧製品は長い間よく売れているのに対して、この新製品は（＿＿＿）。",
        "en": "Whereas the old product has sold well for a long time, this new product isn't very popular.",
        "options": [
          "あした発売になる",
          "あまり人気がない",
          "すぐに売りきれた"
        ],
        "correct": 1,
        "explain": "に対して needs the two halves to point in OPPOSITE directions. Against 'sells well,' the contrast is 'isn't popular.' すぐに売りきれた would agree with the first half rather than contrast with it."
      },
      {
        "id": "N3-4-2",
        "type": "choice",
        "tag": "〜反面",
        "prompt": "Which fits the blank? (練習4課-3)",
        "jp": "この町は、夏は大勢の観光客でにぎやかな反面、（＿＿＿）。",
        "en": "This town is lively with tourists in summer, but on the flip side, few people come in winter.",
        "options": [
          "冬は人が少ない",
          "冬もスキー客が多い",
          "一年中人が来る"
        ],
        "correct": 0,
        "explain": "反面 presents the opposite side of the SAME subject. Against summer's crowds, the flip side is winter's emptiness. The other two options simply extend the 'busy' idea instead of reversing it."
      },
      {
        "id": "N3-4-3",
        "type": "choice",
        "tag": "〜一方(で)",
        "prompt": "Which fits the blank? (練習4課-4)",
        "jp": "自動化は人の労働を減らしてくれる一方で、人の工夫する能力を（＿＿＿）。",
        "en": "While automation reduces human labour, it also lowers people's capacity for ingenuity.",
        "options": [
          "変えてくれる",
          "高くしてくれる",
          "低くしてしまう"
        ],
        "correct": 2,
        "explain": "一方で pairs a benefit with a drawback. 減らしてくれる is the upside, so the other side must be a downside — 低くしてしまう, where てしまう adds the note of regret."
      },
      {
        "id": "N3-4-4",
        "type": "choice",
        "tag": "〜一方(で)",
        "prompt": "Which fits the blank? (練習4課-5)",
        "jp": "山口君は（＿＿＿）一方で、静かに本を読むのも好きだと言う。",
        "en": "Yamaguchi is mad about soccer, but on the other hand he says he also likes reading quietly.",
        "options": [
          "よく図書館に行く",
          "サッカーに夢中になる",
          "本をたくさん買う"
        ],
        "correct": 1,
        "explain": "一方で contrasts two different SIDES of one person. Against 'likes reading quietly,' the contrasting trait is the energetic one — soccer. Going to libraries or buying books would just repeat the reading side."
      },
      {
        "id": "N3-4-5",
        "type": "choice",
        "tag": "〜というより",
        "prompt": "Which fits the blank? (練習4課-6)",
        "jp": "今日は急に気温が下がって、（＿＿＿）というより寒かった。",
        "en": "The temperature suddenly dropped today — it was cold rather than merely cool.",
        "options": [
          "涼しい",
          "暖かい",
          "暑い"
        ],
        "correct": 0,
        "explain": "〜というより replaces a nearly-right description with a better one, so both sides must sit on the SAME scale with the second being stronger. 涼しい → 寒かった is that upgrade; 暖かい and 暑い are the wrong direction entirely."
      },
      {
        "id": "N3-4-6",
        "type": "choice",
        "tag": "〜というより",
        "prompt": "Which fits the blank? (練習4課-7)",
        "jp": "うちでは、犬のチロはペットというより（＿＿＿）。",
        "en": "In our house, Chiro the dog is family rather than a pet.",
        "options": [
          "家族なんです",
          "動物なんです",
          "かわいいんです"
        ],
        "correct": 0,
        "explain": "というより needs a competing LABEL for the same thing. 家族 is an alternative category to ペット. 動物 is a broader category rather than a rival one, and かわいい is an attribute, not a label."
      },
      {
        "id": "N3-4-7",
        "type": "choice",
        "tag": "〜かわりに",
        "prompt": "Which fits the blank? (練習4課-8)",
        "jp": "このアルバイトはきついかわりに（＿＿＿）。",
        "en": "This part-time job is tough, but to make up for it the pay is good.",
        "options": [
          "休みがない",
          "給料がいい",
          "やってみたい"
        ],
        "correct": 1,
        "explain": "This かわりに expresses a TRADE-OFF — a drawback offset by a compensating benefit. Against きつい, the compensation is good pay. 休みがない would just pile on another drawback."
      },
      {
        "id": "N3-4-8",
        "type": "choice",
        "tag": "〜かわりに",
        "prompt": "Which fits the blank? (練習4課-9)",
        "jp": "わたしは夜（＿＿＿）かわりに朝早く起きて勉強しています。",
        "en": "Instead of staying up at night, I go to bed early and get up early to study.",
        "options": [
          "遅く帰る",
          "眠くなる",
          "早く寝る"
        ],
        "correct": 2,
        "explain": "Here かわりに means 'in place of' — one deliberate choice swapped for another. Sleeping early is what you do INSTEAD, and it's what makes rising early possible. 眠くなる isn't a choice at all, it's an involuntary state."
      }
    ],
    "5": [
      {
        "id": "N3-5-0",
        "type": "choice",
        "tag": "〜ために（原因）",
        "prompt": "Which fits the blank? (練習5課-1)",
        "jp": "パソコンがこわれてしまったために、（＿＿＿）。",
        "en": "Because my computer broke, I couldn't put the documents together.",
        "options": [
          "新しいのを買おう",
          "資料が作れなかった",
          "直してくれませんか"
        ],
        "correct": 1,
        "explain": "Causal ために reports a RESULT that actually happened. It can't be followed by a volitional (買おう) or a request (直してくれませんか) — for those you'd use から or ので instead."
      },
      {
        "id": "N3-5-1",
        "type": "choice",
        "tag": "〜によって（原因）",
        "prompt": "Which fits the blank? (練習5課-2)",
        "jp": "台風15号によって（＿＿＿）。",
        "en": "The bridge was washed away by Typhoon No. 15.",
        "options": [
          "橋が流された",
          "明日は大雨だろう",
          "明日は外出したくない"
        ],
        "correct": 0,
        "explain": "によって naming a cause pairs with an objective event, very often in the passive. A guess about tomorrow (だろう) or a personal wish (たくない) isn't a factual consequence of the typhoon."
      },
      {
        "id": "N3-5-2",
        "type": "choice",
        "tag": "〜によって（手段）",
        "prompt": "Which fits the blank? (練習5課-3)",
        "jp": "高い技術（＿＿＿）詳しい健康チェックができるようになった。",
        "en": "Thanks to advanced technology, detailed health checks became possible.",
        "options": [
          "によって",
          "によれば",
          "によると"
        ],
        "correct": 0,
        "explain": "This is によって in its 'by means of' sense. によると and によれば both introduce an information SOURCE ('according to ~'), which doesn't fit — technology is the means here, not the person telling you."
      },
      {
        "id": "N3-5-3",
        "type": "choice",
        "tag": "〜から（原因）",
        "prompt": "Which fits the blank? (練習5課-4)",
        "jp": "小さな不注意（＿＿＿）大問題が起こることもある。",
        "en": "A small piece of carelessness can sometimes cause a big problem.",
        "options": [
          "から",
          "まで",
          "には"
        ],
        "correct": 0,
        "explain": "から marks the origin a result grows out of. まで marks an endpoint and には a target, neither of which can express 'this is what it came from.'"
      },
      {
        "id": "N3-5-4",
        "type": "choice",
        "tag": "〜ことから",
        "prompt": "Which fits the blank? (練習5課-5)",
        "jp": "自転車の事故が増えたことから、（＿＿＿）。",
        "en": "Because bicycle accidents increased, police warnings became stricter.",
        "options": [
          "気をつけよう",
          "自転車には乗りたくない",
          "警察の注意がきびしくなった"
        ],
        "correct": 2,
        "explain": "ことから introduces an objective fact leading to an objective outcome. A resolution (気をつけよう) or a personal feeling (乗りたくない) is subjective, so neither can follow it."
      },
      {
        "id": "N3-5-5",
        "type": "choice",
        "tag": "〜せいで",
        "prompt": "Which fits the blank? (練習5課-6)",
        "jp": "弟のせいで（＿＿＿）。",
        "en": "Because of my little brother, I got told off by our mother.",
        "options": [
          "楽しかった",
          "よく遊べた",
          "母にしかられた"
        ],
        "correct": 2,
        "explain": "せいで assigns BLAME, so the result must be something bad. 楽しかった and よく遊べた are positive outcomes — those would call for おかげで instead."
      },
      {
        "id": "N3-5-6",
        "type": "choice",
        "tag": "〜おかげで",
        "prompt": "Which fits the blank? (練習5課-7)",
        "jp": "この薬（＿＿＿）病気を治すことができた。",
        "en": "Thanks to this medicine, I was able to cure the illness.",
        "options": [
          "のおかげで",
          "のせいで",
          "から"
        ],
        "correct": 0,
        "explain": "おかげで is the mirror image of せいで: it credits a GOOD outcome. Recovering from illness is clearly positive, so せいで (blame) would be wrong here."
      },
      {
        "id": "N3-5-7",
        "type": "choice",
        "tag": "〜のだから",
        "prompt": "Which fits the blank? (練習5課-8)",
        "jp": "やっと運転免許が取れたんだから、（＿＿＿）。",
        "en": "Now that I've finally got my driving licence, I want to buy a car.",
        "options": [
          "車を買った",
          "車を買いたい",
          "車は買わなかった"
        ],
        "correct": 1,
        "explain": "のだから presents a reason the speaker treats as settled, and what follows is their resulting will or judgement. 買いたい is that. A bare past fact (買った) doesn't need のだから's emphasis."
      },
      {
        "id": "N3-5-8",
        "type": "choice",
        "tag": "〜ので vs 〜んですから",
        "prompt": "Which fits the blank? (練習5課-9)",
        "jp": "先生、すみません。かぜをひいて（＿＿＿）、今日は休ませてください。",
        "en": "Sorry, sensei — I've caught a cold, so please let me take today off.",
        "options": [
          "しまったので",
          "しまったんですから",
          "しまって"
        ],
        "correct": 0,
        "explain": "んですから pushes a reason at the listener as if they should already accept it, which is too forceful toward a teacher. Neutral, polite ので is the right register for a request to a superior."
      },
      {
        "id": "N3-5-9",
        "type": "choice",
        "tag": "〜ために（原因）",
        "prompt": "Which fits the blank? (練習5課・6課-1)",
        "jp": "今年は梅雨に雨の量が少なかった（＿＿＿）、米や野菜などがよく育っていない。",
        "en": "Because there was little rain this rainy season, the rice and vegetables haven't grown well.",
        "options": [
          "おかげで",
          "ために",
          "のなら"
        ],
        "correct": 1,
        "explain": "The outcome is bad, so おかげで (which credits a good result) is out. ために is the neutral causal connector that works regardless of whether the result is welcome."
      },
      {
        "id": "N3-5-10",
        "type": "choice",
        "tag": "〜から（原因）",
        "prompt": "Which fits the blank? (練習5課・6課-2)",
        "jp": "今日は（＿＿＿）、早く家に帰りたい。",
        "en": "I'm tired today, so I want to go home early.",
        "options": [
          "疲れたせいで",
          "疲れたのでは",
          "疲れたから"
        ],
        "correct": 2,
        "explain": "The second half is the speaker's own wish (帰りたい), which から supports naturally. せいで frames the reason as something to blame and sits oddly with simply wanting to go home."
      }
    ],
    "6": [
      {
        "id": "N3-6-0",
        "type": "choice",
        "tag": "〜のなら",
        "prompt": "Which fits the blank? (練習6課-1)",
        "jp": "会社員B「（＿＿＿）なら後片付けはわたしがやっておくから、早く行って。」",
        "en": "B: \"If you're out of time, I'll do the tidying up, so hurry along.\" (A has just said they'll miss the 5 o'clock train.)",
        "options": [
          "遅れない",
          "急がない",
          "時間がない"
        ],
        "correct": 2,
        "explain": "のなら picks up what the other person just said and responds to it. A said they're about to be late and must hurry, so B restates that as 時間がない before offering help."
      },
      {
        "id": "N3-6-1",
        "type": "choice",
        "tag": "〜ては",
        "prompt": "Which fits the blank? (練習6課-2)",
        "jp": "体の調子が悪くては（＿＿＿）。",
        "en": "If you're in poor health, work probably won't progress.",
        "options": [
          "仕事が進まないだろう",
          "仕事を休んでもいいよ",
          "あした仕事をしよう"
        ],
        "correct": 0,
        "explain": "〜ては introduces a condition the speaker views negatively, so what follows must be an unwanted consequence. Permission (休んでもいい) or a plan (しよう) doesn't carry that negative weight."
      },
      {
        "id": "N3-6-2",
        "type": "choice",
        "tag": "〜さえ〜ば",
        "prompt": "Which fits the blank? (練習6課-3)",
        "jp": "一人暮らしでも、お金さえ（＿＿＿）。",
        "en": "Even living alone, as long as you have money you won't have any trouble.",
        "options": [
          "なければ困る",
          "あれば困らない",
          "なければアルバイトをする"
        ],
        "correct": 1,
        "explain": "さえ〜ば means 'that one thing is all it takes.' The pattern needs the positive ば form plus a satisfactory result: money alone is enough to keep you out of trouble."
      },
      {
        "id": "N3-6-3",
        "type": "choice",
        "tag": "〜さえ〜ば",
        "prompt": "Which fits the blank? (練習6課-4)",
        "jp": "ハンドルさえ直せばこの自転車は（＿＿＿）だろう。",
        "en": "If only the handlebars were fixed, this bike would still be usable.",
        "options": [
          "もう使えない",
          "まだ使える",
          "使いにくい"
        ],
        "correct": 1,
        "explain": "さえ〜ば promises that fixing ONE thing is sufficient. The payoff therefore has to be positive — まだ使える. もう使えない would contradict the whole point of naming a single easy fix."
      },
      {
        "id": "N3-6-4",
        "type": "choice",
        "tag": "たとえ〜ても",
        "prompt": "Which fits the blank? (練習6課-5)",
        "jp": "たとえどんなに（＿＿＿）、賛成する人が少なければ実行できない。",
        "en": "No matter how good the plan is, it can't be carried out if few people support it.",
        "options": [
          "よくない案でも",
          "いい案でも",
          "案を考えなくても"
        ],
        "correct": 1,
        "explain": "たとえ〜ても concedes the most favourable case and says it still isn't enough. Pairing it with よくない案 would remove the concession — of course a bad plan fails."
      },
      {
        "id": "N3-6-5",
        "type": "choice",
        "tag": "たとえ〜ても",
        "prompt": "Which fits the blank? (練習6課-6)",
        "jp": "たとえ国を離れても、ぼくは君のことを（＿＿＿）。",
        "en": "Even if I leave the country, I won't forget you.",
        "options": [
          "忘れないよ",
          "忘れるかもしれない",
          "もう思い出せない"
        ],
        "correct": 0,
        "explain": "たとえ〜ても sets up a hardship that will NOT change the outcome, so the main clause must resist it. 忘れるかもしれない would give in to the condition instead of standing against it."
      },
      {
        "id": "N3-6-6",
        "type": "choice",
        "tag": "〜たら（反事実）",
        "prompt": "Which fits the blank? (練習6課-7)",
        "jp": "ああ、よかった。気がつくのが（＿＿＿）火事になったかもしれない。",
        "en": "Oh, thank goodness. If I'd noticed any later, it might have turned into a fire.",
        "options": [
          "遅いと",
          "遅いなら",
          "遅かったら"
        ],
        "correct": 2,
        "explain": "This is a counterfactual about the past — it didn't happen, but it nearly did. That requires the past conditional 遅かったら. と states a general rule and なら responds to what someone said."
      },
      {
        "id": "N3-6-7",
        "type": "choice",
        "tag": "〜ばよかった",
        "prompt": "Which fits the blank? (練習6課-8)",
        "jp": "学生時代にもっと勉強すれば（＿＿＿）と、今ではとても残念だ。",
        "en": "I really regret it now — I wish I'd studied more in my student days.",
        "options": [
          "いい",
          "よさそうだ",
          "よかった"
        ],
        "correct": 2,
        "explain": "〜ばよかった is the set expression for regretting what you DIDN'T do. The past form is what makes it a regret; 〜ばいい would be advice about the future instead."
      },
      {
        "id": "N3-6-8",
        "type": "choice",
        "tag": "〜さえ〜ば",
        "prompt": "Which fits the blank? (練習5課・6課-3)",
        "jp": "あなたは（＿＿＿）どんな仕事でもするんですか。",
        "en": "Would you really do any job at all, as long as the pay is high?",
        "options": [
          "給料さえ高ければ",
          "給料が高いのでは",
          "給料が高いのだから"
        ],
        "correct": 0,
        "explain": "どんな仕事でも ('any job whatsoever') is the sweeping result of one single condition being met, which is exactly what さえ〜ば sets up: high pay alone is enough."
      }
    ],
    "7": [
      {
        "id": "N3-7-0",
        "type": "choice",
        "tag": "〜では（情報源）",
        "prompt": "Which fits the blank? (練習7課-1)",
        "jp": "（＿＿＿）、「ズボン」はフランス語から来た言葉だということです。",
        "en": "According to the teacher's explanation, 'zubon' is a word that came from French.",
        "options": [
          "先生の説明は",
          "先生の説明では",
          "先生の説明からは"
        ],
        "correct": 1,
        "explain": "To mark where reported information came from, use では. Plain は would make the explanation the topic being described, rather than the source of the report that follows."
      },
      {
        "id": "N3-7-1",
        "type": "choice",
        "tag": "〜によると",
        "prompt": "Which fits the blank? (練習7課-2)",
        "jp": "今朝の新聞（＿＿＿）、痛み止めの新しい薬が発売されるということだ。",
        "en": "According to this morning's paper, a new painkiller is going on sale.",
        "options": [
          "によって",
          "によったら",
          "によると"
        ],
        "correct": 2,
        "explain": "によると is the standard 'according to ~' for a source, and it pairs with a hearsay ending like ということだ. によって would mean 'by means of' or 'caused by,' which isn't a source."
      },
      {
        "id": "N3-7-2",
        "type": "choice",
        "tag": "〜と言われている",
        "prompt": "Which fits the blank? (練習7課-3)",
        "jp": "（＿＿＿）、この家は300年ぐらい前に建てられたと言われている。",
        "en": "It isn't certain, but this house is said to have been built about 300 years ago.",
        "options": [
          "確かではないが",
          "山川さんの話では",
          "林さんから聞いたのだが"
        ],
        "correct": 0,
        "explain": "と言われている is IMPERSONAL — 'people say' — so it clashes with naming a specific individual as the source. 確かではないが matches that vague, unattributed quality."
      },
      {
        "id": "N3-7-3",
        "type": "choice",
        "tag": "〜そうだ（伝聞）",
        "prompt": "Which fits the blank? (練習7課-4)",
        "jp": "今、テレビの天気予報で見たんだけど、あしたは全国的に雨だ（＿＿＿）よ。",
        "en": "I just saw it on the TV forecast — apparently it'll rain nationwide tomorrow.",
        "options": [
          "と聞いている",
          "と言われている",
          "そうだ"
        ],
        "correct": 2,
        "explain": "Hearsay そうだ reports something you took in from a specific source just now, which fits 今…見たんだけど. と言われている would imply a long-standing general saying instead."
      },
      {
        "id": "N3-7-4",
        "type": "choice",
        "tag": "〜とか",
        "prompt": "Which fits the blank? (練習7課-5)",
        "jp": "足の裏を日に当てると健康に（＿＿＿）とか。本当だろうか。",
        "en": "Apparently sunning the soles of your feet is good for your health. I wonder if that's true.",
        "options": [
          "いい",
          "いいです",
          "いいそうだ"
        ],
        "correct": 0,
        "explain": "Hearsay とか attaches to the PLAIN form, so いい is what's needed. Adding です or stacking a second hearsay marker (そうだ) on top would both be wrong before とか."
      },
      {
        "id": "N3-7-5",
        "type": "choice",
        "tag": "〜って",
        "prompt": "Which fits the blank? (練習7課-6)",
        "jp": "A「あしたは（＿＿＿）。」B「わあ。いやだなあ。あしたは野球の練習があるんだ。」",
        "en": "A: \"They say it'll be hot tomorrow.\" B: \"Ugh, no — I've got baseball practice tomorrow.\"",
        "options": [
          "暑いと",
          "暑いって",
          "暑くって"
        ],
        "correct": 1,
        "explain": "って is the casual spoken equivalent of そうだ — 'I hear that ~.' B's dismayed reaction shows A was passing on news, not stating a condition (暑いと) or a cause (暑くて)."
      },
      {
        "id": "N3-7-6",
        "type": "choice",
        "tag": "〜という",
        "prompt": "Which fits the blank? (練習7課-7)",
        "jp": "昔、この地方には、珍しい習慣が（＿＿＿）という。",
        "en": "It is said that long ago this region had an unusual custom.",
        "options": [
          "あった",
          "あったそうだ",
          "あったんだって"
        ],
        "correct": 0,
        "explain": "という is itself the hearsay marker, and it attaches to the plain form. Options b and c already contain their own hearsay markers, so using them here would report the same thing twice."
      },
      {
        "id": "N3-7-7",
        "type": "choice",
        "tag": "〜という",
        "prompt": "Which fits the blank? (練習7課-8)",
        "jp": "この地域の土地の値段は今後もあまり高く（＿＿＿）という。",
        "en": "It's said that land prices in this area won't rise much from here on either.",
        "options": [
          "なりません",
          "ならないでしょう",
          "ならないだろう"
        ],
        "correct": 2,
        "explain": "What comes before という must be in PLAIN form, which rules out the polite なりません and でしょう. だろう is the plain counterpart of でしょう, so ならないだろう is the fit."
      }
    ],
    "8": [
      {
        "id": "N3-8-0",
        "type": "choice",
        "tag": "〜はずがない",
        "prompt": "Which fits the blank? (練習8課-1)",
        "jp": "わたしはこんなに健康に注意しているのだ。（＿＿＿）はずがない。",
        "en": "I take such good care of my health. There's no way I could get ill.",
        "options": [
          "病気になる",
          "病気にならない",
          "病気ではない"
        ],
        "correct": 0,
        "explain": "はずがない already supplies the negation ('there's no way that ~'), so the clause inside it stays POSITIVE. Putting a negative in as well would double up and reverse the meaning."
      },
      {
        "id": "N3-8-1",
        "type": "choice",
        "tag": "〜わけがない",
        "prompt": "Which fits the blank? (練習8課-2)",
        "jp": "田中さんにはそのことを先週話したのだから、（＿＿＿）。",
        "en": "I told Tanaka about it last week, so there's no way he doesn't know.",
        "options": [
          "知るわけがない",
          "知っているわけがない",
          "知らないわけがない"
        ],
        "correct": 2,
        "explain": "He was told, so he must know. To say 'it's impossible that he DOESN'T know' you need the negative 知らない inside わけがない — the two negatives together give a strong positive."
      },
      {
        "id": "N3-8-2",
        "type": "choice",
        "tag": "〜とは限らない",
        "prompt": "Which fits the blank? (練習8課-3)",
        "jp": "強いチームではないが、（＿＿＿）とは限らない。",
        "en": "They're not a strong team, but that doesn't mean they can never win.",
        "options": [
          "絶対勝てない",
          "必ず勝てる",
          "絶対負けない"
        ],
        "correct": 0,
        "explain": "とは限らない denies a sweeping claim, so what sits inside it should be an absolute one. Following 'they're not strong,' the over-generalisation being rejected is 絶対勝てない."
      },
      {
        "id": "N3-8-3",
        "type": "choice",
        "tag": "〜わけではない",
        "prompt": "Which fits the blank? (練習8課-4)",
        "jp": "旅行に（＿＿＿）わけではなく、二日目から参加するつもりなのです。",
        "en": "It's not that I'm not going on the trip — I plan to join from the second day.",
        "options": [
          "行ける",
          "行かない",
          "行きたい"
        ],
        "correct": 1,
        "explain": "わけではない softly denies an assumption the listener might have formed. They'd have assumed 'you're not coming,' so 行かない is what gets denied before the real plan is given."
      },
      {
        "id": "N3-8-4",
        "type": "choice",
        "tag": "〜ないことはない",
        "prompt": "Which fits the blank? (練習8課-5)",
        "jp": "わたしたち兄弟は仲がよくないことはないが、（＿＿＿）。",
        "en": "It's not that my siblings and I don't get on, but we're rarely together.",
        "options": [
          "いつもいっしょにいる",
          "いっしょにいることもある",
          "いっしょにいることは少ない"
        ],
        "correct": 2,
        "explain": "ないことはない is a grudging, half-hearted 'well, not exactly not.' が then signals a qualification, so the second half has to pull back — 'but we're seldom together,' not 'we're always together.'"
      }
    ]
  }
};
