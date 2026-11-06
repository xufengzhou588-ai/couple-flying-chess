# Off Script — 美区情侣小游戏原型

这是 Couple Flight 的本地玩法原型。面向刚开始约会、相处一段时间和已婚的成年伴侣，同机轮流操作，以英文内容检验搭讪、接话、秘密揭晓、共同选择和合作解谜是否有趣。内容尚未经美国英语母语编辑或真实情侣试玩验证。

## 飞行棋与八款小游戏同站试玩

仓库根目录运行 `npm run build:unified-preview`，会在 `dist/` 中放入飞行棋首页与 `/games/` 下的八款小游戏。仅该试玩构建开启飞行棋首页的小游戏入口；正常 `npm run build` 和当前 TestFlight 构建不会显示这个入口。小游戏页使用飞行棋的夜间背景、品牌抬头、玫瑰金强调色，并提供返回棋盘的链接。

运行 `node_modules/.bin/vite preview --host 127.0.0.1 --port 5181` 后，可在 `http://127.0.0.1:5181/` 与 `http://127.0.0.1:5181/games/` 往返。`npm run test:unified-preview` 检查两个入口互通、八款小游戏均可设置并开局；测试其他网址时设置 `UNIFIED_PREVIEW_URL`。八款小游戏仍只支持同一设备交接；飞行棋的远程联机不会自动延伸到它们。

## 启动和检查

在仓库根目录运行，复用项目现有 React / Vite / TypeScript，无新增应用依赖：

```sh
node_modules/.bin/vite --config prototypes/date-night/vite.config.ts
node_modules/.bin/tsc --noEmit -p prototypes/date-night/tsconfig.json
node_modules/.bin/eslint prototypes/date-night/*.ts prototypes/date-night/*.tsx
node_modules/.bin/vite build --config prototypes/date-night/vite.config.ts
```

试玩地址：`http://127.0.0.1:5180/`。静态构建输出到 `build/date-night-prototype/`，不改动正式 App 的入口和 release feature flags。

浏览器验证脚本需要现有 Playwright 和 Chrome：

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node prototypes/date-night/test-playtest.mjs
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node prototypes/date-night/test-more-games.mjs
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node prototypes/date-night/test-illustrations.mjs
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node prototypes/date-night/test-after-hours.mjs
```

也可以将 Playwright 置于 Node 可解析的位置后，直接运行脚本。截图与结果写入被 Git 忽略的 `test-artifacts/date-night/`。

## 当前确实能玩的内容

此前讨论的六类玩法均有对应原型：职业幻想剧场（First Date, Again）、心动骰子（Heart Dice）、默契猜心（Read My Mind）、双人秘密任务（Secret Mission）、心愿拍卖会（Wish Auction）和双人约会密室（Date Night Mystery）。Double Yes 是额外的共同兴趣选择玩法；The Slow Burn 是验证付费情趣方向的单场景样章。

| 游戏 | 完整流程 | 内容体量 |
| --- | --- | --- |
| First Date, Again | 双方私下看角色 → 四段对话 → 一起选择剧情反转 → 提出下一次约会 → 脱离角色复盘 → 交换角色重玩 | 调酒师与陌生人 1 个场景；错过的匹配 / 同日生日 2 个分支；Playful / Flirty 两种语气；每段 2 条开场及分别对应的接话提示 |
| Secret Mission | 各自领取不同任务 → 可换任务 → 隐藏交接 → 自由聊天 / 可选计时 → 私下回看 → 先猜后揭晓 | 18 张任务，抽取关系阶段对应任务和通用任务 |
| Double Yes | A 私下选 8 张活动 → 隐藏交接 → B 独立选择 → 仅展示双方明确选择的交集 → 选一个三步小约会 → 结束反馈 | 22 个活动，包含每阶段 2 个定制活动；每局 8 张，无重复 |
| Heart Dice | 轮流抽问题与说法转折 → 可重抽转折一次或跳过 → 四轮后继续聊 | 每阶段 6 个专属问题；Playful / Flirty 不同文本；6 种转折 |
| Read My Mind | 一人私下选答案 → 另一人私下猜 → 揭晓并追问 → 交换角色，四轮 | 每阶段 5 个问题；不以猜中率评价关系 |
| Wish Auction | 双方各 5 个虚拟代币 → 私下对 4 个小约会出价 → 双方都出价才扣代币 → 选定细节并形成清单 | 每阶段 4 个专属愿望；任何一方可 Pass，无扣币 |
| Date Night Mystery | 各自看不同线索 → 口头交换 → 共选答案 → 错误获得提示 → 三个场景完成故事 | 每阶段 3 个连贯谜题，共 9 个 |
| The Slow Burn | 双方私下对 3 种亲近方式选 Yes / Maybe / Pass，并写下对伴侣的一个真实细节 → 仅揭晓共同开放的选择 → 选择其一，玩一段 3 幕场景 → 各自的细节进入台词提示 | 1 个样章，3 种互动，3 个关系阶段的场景与开场；尚无付费或远程功能 |

八个模式均有可玩的开始、过程与结尾。关系阶段会影响题库、任务、活动、场景或收尾问题。模式间暂时独立。Double Yes 的结果能打开对应的三步约会，但不会自动带入 First Date 的剧情。不存在陌生人搜索、线上聊天、账号系统、情侣远程绑定或支付。

## 付费方向的门槛

免费情侣软件已经能提供问题库、简单测验、约会建议和基础调情卡。不能仅把问题写得更大胆、插图画得更多就视为付费价值。我们的候选付费体验应是一局能推进的双人场景：私下表达今晚的舒适度；只揭晓共同愿意尝试的互动；让双方真实细节进入角色与接话；每一步都有可说、可做、可暂停的选择；结束时留下两人自己的片段，而非一张通用分数卡。

The Slow Burn 目前仅有一个可玩的样章，**尚未达到可收费的内容体量**。下一步应验证情侣是否真会在场景里放下手机互动、是否愿意重玩其他分支。只有多场景剧情、足够不同的关系阶段版本、原创美式英语台词、细节回扣与一致的视觉表现经试玩验证后，才适合讨论定价和内容包。App Store 官方页面显示 [Spicer](https://apps.apple.com/us/app/spicer-sex-ideas-for-couples/id1335558932) 已提供私下 Yes / Maybe / No 匹配和付费高级内容包，[Desire](https://apps.apple.com/us/app/desire-couples-game/id923073855) 已提供挑战、积分和付费类别；这些机制本身不能成为我们的独占卖点。它们未公开付费销量。

任务和活动在当前应用会话中优先抽取未见过的内容。内容耗尽后会循环；刷新会清除历史。First Date 是固定编写的两个分支，不会动态生成无限剧情。

## 这款产品给情侣什么

编辑主线是情侣之间的情趣：让两个人有机会逗对方、欣赏对方、表达想靠近的心情，并把一次游戏延伸成下一次约会。每个新问题或新配图都应回答「这会让两个人产生什么有趣的互动？」；答不上来就不加入。

核心假设：两个人在一起，却未必知道今晚聊什么、如何开口提出小愿望、如何给熟悉的相处带来新鲜感。原型提供的是互动的开场与流程：

- 开口更容易：一句可借用的搭讪、一个自然的回应、一个继续聊的方向。
- 发现更多：揭晓共同兴趣，以及伴侣的故事和小偏好。
- 做点实际的事：把一个共同选择变成无需复杂准备的小约会。
- 留下共同回忆：一段即兴对话、一个只有两个人懂的笑话，或一个愿意再做的活动。

这些是待验证的体验目标，不是改善关系或增加亲密程度的效果证明。当前原型也不衡量“真实关系分数”。

## 关于兴趣配对与搭讪

当前的配对单位是**一对已有伴侣的共同选择**。它不能帮助用户寻找陌生人。共同兴趣适合作为话题入口，但仅有共同兴趣还不等于双方有交流意愿或关系目标一致。

可优先验证的后续方向：双方选兴趣 → 共同选择决定场景和话题 → 用新身份重新搭讪 → 回到现实安排小约会。例如共同选择音乐，进入唱片店场景，搭讪从某首歌的故事开始。该串联尚未实现。

陌生人兴趣配对属于另一个“认识新人”的产品方向，需要独立设计身份、关系意图、匹配、双向接受与聊天流程。本次原型没有扩展为社交平台。

## 美式英语写作原则

目标是自然的美国英语约会口吻；不把所有美国用户视为同一种喜好。

1. 每句尽量能自然说出口，不写命令式长台词。
2. 使用轻微自嘲、具体偏好和低风险的幽默，避免冒犯对方来制造所谓张力。
3. 提示双方接话：分享一个细节，然后沿着这个细节追问。
4. 让前面聊到的内容在后面再次出现，使邀请有针对性。
5. Playful 提供日常故事和轻松调侃；Flirty 提供更明确的欣赏和邀请。两者都是可选语气，不是等级排名。
6. 不固定角色性别；姓名 / 昵称可自填，角色可交换。没有必须喝酒、穿制服或拍照的任务。
7. 避免把对方的配合当作任务完成条件。提出邀请本身即可，跳过没有惩罚。

## 对话样例与设计意图

以下均为本原型编写的台词，不是调研访谈或真实用户引语。

| 英文样例 | 使用位置 | 中文设计意图 |
| --- | --- | --- |
| So, are we celebrating something, or making up a reason? | 调酒师开场 | 从情境切入，留给对方回答空间 |
| I was going with “Tuesday,” but I’m open to better ideas. | 对方接话 | 用小小的日常幽默接住邀请 |
| I was about to call it a quiet night. Then you walked in. | Flirty 开场 | 明确表达关注，不要求对方配合动作 |
| Then I picked a good time to show up. | Flirty 回应 | 对前一句 quiet night 的搭讪作自然回应 |
| What’s a tiny hill you’re absolutely willing to die on? | Playful 聊天 | 询问无伤大雅的小坚持；需母语试玩确认理解负担 |
| What’s something you could talk about for way too long? | 替代问题 | 发现对方真正投入的兴趣 |
| Okay, but you’re not allowed to judge me until I finish the story. | 接话提示 | 给讲故事的人一个轻松开场 |
| So we both went with the bold strategy of saying absolutely nothing. | 错过匹配的反转 | 双方一起自嘲，避免责备谁没主动 |
| I think I owe you a first message. Can I try it in person? | 反转后的再次搭讪 | 把新情境变成可操作的下一句 |
| I’d like another hour with you. What should we do with it? | 结尾邀请 | 直白但留有选择空间 |
| Deal. But I’m choosing the snacks. | 回应邀请 | 让接受邀请带一点个人偏好 |
| What did I say that you’d like to hear from me more often? | 脱离角色后的复盘 | 把扮演中的体验带回真实的两个人 |

## 原型交互与隐私边界

- 同一手机在交接时先遮住卡片，接收者主动点开；另一方的私密任务不在当前页面中渲染。
- 标签页隐藏时，已经打开的私密卡重新盖住；任务计时器暂停。
- Double Yes 只把双方 `true` 的活动展示为结果，未匹配的选择不展示。Read My Mind 和 Wish Auction 也先遮盖私密选择，再展示双方结果。
- The Slow Burn 只有双方均选择 Yes 或 Maybe 的互动才会出现；任一方 Pass 的选项保持隐藏。Maybe 只表示愿意被询问，不代表同意具体动作。两人的私人细节仅在进入共同场景后按回合显示。
- Wish Auction 的代币仅是游戏内虚拟点数，双方均出价才扣除；它与真实支付无关。
- 关系阶段由用户自行选择，不根据关系时长或婚姻状态推断亲密边界。
- 没有匹配时提供友好空状态及重新抽取 / 换游戏入口。
- 姓名、选择和任务只保存在当前页面内存，未写 localStorage、sessionStorage 或服务器。它不是防止另一位持机者主动翻看的身份验证机制。
- 刷新会清除当前局；离开游戏有确认。正常换局保留昵称、关系阶段和语气，方便继续试玩。
- 使用系统字体与本地 SVG 小插图，没有图片 CDN、字体、分析或聊天服务的外部请求。

## 视觉节奏与市场参照

2026-11-05 查看 Google Play 官方页面时，[Paired](https://play.google.com/store/apps/details?id=com.getpaired.app&hl=en_US) 与 [Couple Game](https://play.google.com/store/apps/details?id=com.jmm.couplegame&hl=en_US) 都显示 100 万+ Android 下载；前者强调双方回答后解锁伴侣答案，后者强调分主题测验与猜测。[Between](https://play.google.com/store/apps/details?id=kr.co.vcnc.android.couple&hl=en_US) 显示 1000 万+ Android 下载，产品重点包含共享照片和回忆。这些是全球 Android 商店的安装量区间，不是美国市场下载量或付费销量，也不能证明某种视觉风格导致下载。

题卡只在能画出具体问题、物件或情境时配原创小插图：例如「画对方」配画纸、「旧照片」配照片、「家中约会」配家。抽象兴趣、个性和开放式愿望不硬配图，让提问有呼吸空间。猜心题的图不能提示某个选项；解谜共答题在揭晓前不显示答案图，揭晓后才出现对应情境。首页的图代表游戏玩法，屏幕阅读器会跳过装饰图。

市场资料提示的是互动结构，而非插图密度：双方先独立回答或猜测，再揭晓并聊一个具体细节；题材可按关系阶段和舒适度选择；共同回忆可以成为后续约会的素材。这些是待验证的设计借鉴，不是销量归因。

## 试玩要回答的问题

建议先邀请 12–20 对符合目标的成年情侣做探索性试玩，轮换八个游戏的试玩顺序，避免把顺序效应误认为玩法优劣。

- 一个人愿意玩时，另一人是否也愿意？
- 第一轮多久开始真正对话？在哪里停住或觉得尴尬？
- 哪句英文愿意借用，哪句像广告或写好的台词？允许他们当场改写。
- 能否靠回扣对方的回答继续聊，而非不停读下一张卡？
- 揭晓是否产生了笑声、意外或新的发现？
- 结束后会主动再开一局，还是只在主持人提示下继续？
- 一周内是否自主再次使用？更想增加职业、故事分支还是共同活动？

先观察行为，再问喜欢程度。此样本量用于发现问题和筛选方向；不能代表整个美国市场。后续付费测试需有清楚的内容范围和实际可交付版本。

## 调研背景

本轮创作沿用此前已读取的公开资料：

- [Paired](https://www.paired.com/)：每日问题、测验和游戏是其公开产品组成。
- [The Adventure Challenge](https://www.theadventurechallenge.com/products/couples-edition-book/)：刮开前保留惊喜，同时给出活动时间和预算提示。
- [Lovewick](https://lovewick.com/)：问题、约会灵感、共同回忆，以及避免用测验羞辱伴侣的定位。
- [Spicer](https://apps.apple.com/us/app/spicer-sex-ideas-for-couples/id1335558932)：双方各自对亲密点子选 Yes / Maybe / No；只有双方都开放的点子才出现为匹配，任一方选 No 则不公开。可借鉴的是“先私下表达、再揭晓共同愿意尝试的事”，但需写成我们的情侣约会语气，并把舒适度选择交给双方。

这些资料用于理解现有表达方式，并不能证明本原型的受欢迎程度。文案、任务、视觉和代码为本轮原创实现。
