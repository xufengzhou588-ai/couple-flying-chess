# Mini games: Chinese, English, and Spanish copy standard

Status: the four player-facing mini games now have English, Simplified Chinese, and US Spanish copy and matching male/female voice clips for internal TestFlight testing. Older text-led experiments remain in source but are hidden from the catalog. Automated key coverage and full-round play checks run in all three languages. Native speaker review and couple playtests below remain open before public release.

## Audience and intent

- English: conversational US English. A line should sound like something someone might actually say to their partner.
- Chinese: conversational Simplified Chinese. Write the feeling and action naturally; do not copy English sentence order or idioms.
- Spanish: neutral, conversational Spanish for US players who prefer Spanish. Address a partner with *tú*. Avoid *vosotros*, region-specific slang, and unnecessary gender assumptions. A native US Spanish editor must make the final regional call.
- In every language, keep the same playable action, relationship stage, level of flirtation, freedom to pass, and ending. Translate the experience, not individual words.

## Draft examples for editorial review

| Context | English source | Chinese draft | Spanish draft |
| --- | --- | --- | --- |
| First Date, Again: flirty opening | I was about to call it a quiet night. Then you walked in. | 我本来以为今晚会很平静。结果你一来，就不一样了。 | Pensaba que iba a ser una noche tranquila. Hasta que llegaste tú. |
| First Date, Again: playful callback | Apparently I needed a year to come up with “hi.” Worth the wait? | 我花了一年才鼓起勇气跟你说“嗨”。还算值得等吗？ | Me tomó un año animarme a decirte «hola». ¿Valió la pena esperar? |
| Secret Mission: consent boundary | An invitation is the whole mission. A yes is never required. | 发出邀请就算完成任务。对方不必答应。 | Con invitar basta para completar la misión. La otra persona no tiene que decir que sí. |
| Double Yes: reveal rule | Only ideas you both say yes to are revealed. | 只有你们都选了“愿意”的点子才会揭晓。 | Solo se muestran las ideas a las que los dos dijeron que sí. |
| Chemistry Dice: pass action | Pass this move | 这次先跳过 | Paso por ahora |

These are examples of rewriting for spoken rhythm. They are not a substitute for review of the complete game and its screen context.

## Release gates

1. **Complete inventory.** Put every player-visible line, button, accessibility label, clue, answer, hint, and dynamic fragment under a stable key. The build must fail if a selected language falls back to English or has a missing key.
2. **Meaning check.** For each item, record the intended action and tone. A second reviewer compares the translation with the source while seeing the game screen. Preserve choice, skip, privacy, and mutual-consent rules exactly.
3. **Naturalness check.** Native editors for Simplified Chinese and US Spanish rewrite awkward lines. They read dialogue aloud without the English beside it. If it sounds like an instruction manual, stiff pickup line, or machine translation, rewrite it.
4. **Playability check.** Play every game in all three languages, including newly dating, established, and married paths and both moods. For mysteries, verify that translated clues still lead to the indexed answer and that hints or illustrations do not reveal it early.
5. **Screen check.** Check small phones and dynamic text: wrapping, clipped controls, names, plurals, quotes, screen reader labels, and direction of the next action.
6. **Couple playtest.** Ask at least one couple per target language to play aloud. Note where they hesitate, laugh at an unintended meaning, misunderstand a rule, or skip a line because it feels unnatural. Revise and rerun the affected card.

Translation tools and back-translation can help find omissions. They cannot certify that flirting, jokes, or cultural references feel natural. The locale is ready for release only after the complete copy and gameplay pass these gates.
