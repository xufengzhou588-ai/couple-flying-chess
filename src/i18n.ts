import { Locale, ThemeAudience } from './types';

export const localeLabels: Record<Locale, string> = {
  zh: '中文',
  en: 'EN',
  es: 'ES'
};

export const t = {
  zh: {
    brand: '情侣飞行棋',
    edition: '夜间版',
    tagline: '给已经在一起的你们，加一点今晚限定的情趣',
    heroLine1: '选一档热度，',
    heroLine2: '慢慢玩到心跳。',
    selectedThemes: '已选主题',
    tonightCards: '今晚卡牌',
    heatRoute: '升温路线',
    random: '随机',
    navPlay: '开局',
    navCards: '题库',
    back: '返回',
    chooseTheme: '选择今晚的任务主题',
    cards: '张任务卡',
    startGame: '开始今晚航线',
    finalRewards: '终点奖励',
    rewardsReady: '项已准备',
    premiumEntry: '今晚高级体验',
    premiumEntryHint: '约会剧本、道具盲盒、声音表情和高热度题库',
    inviteEntry: '邀请另一半',
    inviteEntryHint: '生成房间码和链接',
    joinEntry: '加入房间',
    joinEntryHint: '输入对方给的邀请码',
    unlocked: '进度解锁',
    chooseTaskTheme: '选择任务主题',
    themeHint: '已按亲密程度由浅入深排序；从刚恋爱到同居伴侣，按你们今晚的舒适度选。',
    themesTitle: '任务主题库',
    themesSubtitle: '由浅入深管理每一局的亲密边界',
    create: '新建',
    noDesc: '还没有描述',
    cardUnit: '卡',
    audience: {
      common: '双方通用',
      male: '仅男士',
      female: '仅女士'
    } satisfies Record<ThemeAudience, string>,
    playerBlue: '男士',
    playerRed: '女士',
    maleTurn: '男士回合',
    femaleTurn: '女士回合',
    selectedPrompt: '请先为双方选择有任务卡的主题。',
    leaveConfirm: '离开本局并回到首页？当前棋盘进度会重置。',
    heatStage: '升温阶段',
    stageHints: {
      ice: '从日常切到约会状态',
      warm: '耳语、牵手、慢慢靠近',
      hot: '奖励和小惩罚开始变有趣',
      night: '更亲密，也更尊重边界'
    },
    stages: {
      ice: '破冰',
      warm: '微醺',
      hot: '升温',
      night: '夜色'
    },
    turn: '回合',
    rollHint: '点击骰子前进，落到心动格翻挑战卡',
    position: '位置',
    routeName: '心动航线',
    start: '起',
    winner: '今晚的终点奖励由你决定。',
    winnerLabel: '今晚赢家',
    again: '再来一局',
    taskVisualSuffix: '升温卡',
    flipTask: '点击翻开今晚的情趣挑战',
    executeBy: '由',
    execute: '执行',
    themeQuoteOpen: '「',
    themeQuoteClose: '」',
    taskConsent: '情趣来自默契；任何挑战都可以降级、跳过或换成拥抱。',
    rejectStart: '拒绝：回到起点',
    rejectBack: '拒绝：后退1~3格',
    accept: '接受挑战',
    taskBonus: '默契加码：再坚持',
    visualLabels: {
      whisper: '耳语',
      hands: '牵手',
      blindbox: '触觉盲盒',
      props: '情趣道具',
      reward: '终点奖励',
      hug: '拥抱',
      gaze: '对视',
      couch: '依偎',
      close: '靠近'
    },
    eventTitles: {
      collision: '贴近追尾',
      lucky: '心动奖励',
      trap: '暧昧陷阱'
    },
    taskFrom: '任务来自',
    mysteryTheme: '神秘主题',
    fallbackTask: '今晚临时加一条：给对方一个温柔拥抱。',
    soundOn: '关闭夜间氛围音',
    soundOff: '开启夜间氛围音',
    premium: {
      title: 'Tonight Pass 体验预览',
      subtitle: '不是只卖题库，而是卖一整场更会玩的约会。',
      badge: '商业化原型',
      price: '$2.99 / 晚',
      plan: '建议：免费可玩基础棋局；付费解锁完整夜间体验包。',
      features: [
        '主题剧本：破冰、升温、盲眼触觉、终点奖励按节奏串起来',
        '亲密真心话大冒险：真心话、默契题、边界确认和用户自定义终局卡',
        '道具玩法：眼罩、羽毛、冰块、热毛巾、巧克力等可执行挑战',
        '角色反应：男女角色表情、暧昧音效、骰子和环境音增强沉浸感',
        '高级题库：更大胆但保留边界确认、降级和跳过机制'
      ],
      secondaryPrice: '$5.99 / 月',
      secondaryPlan: 'Couple Plus 可包含每周新剧本、节日包、AI 定制题库和情侣偏好记忆。',
      close: '知道了'
    },
    truthDare: {
      premiumBadge: 'Tonight Pass',
      categoryBadge: '真心话大冒险',
      editorHint: '这套牌适合两个人都选择同一主题。默认卡负责节奏，最后几张留给你们写自己的真心话和大冒险。',
      kindLabel: '卡片类型',
      intensityLabel: '强度',
      addCustomFinal: '加入终局自定义卡',
      taskKinds: {
        truth: '真心话',
        dare: '大冒险',
        chemistry: '默契题',
        boundary: '边界',
        custom: '自定义'
      },
      intensities: {
        gentle: '温柔',
        flirty: '暧昧',
        heated: '升温',
        finale: '终局'
      },
      customFinalCards: [
        '读出一条你们提前写好的真心话；如果还没写，现在各写一条放进题库。',
        '由对方问一个自定义真心话，问题必须让关系更亲近而不是让人难堪。',
        '执行一条你们自己写的大冒险；任何一方都可以降级成拥抱。',
        '双方各写一个今晚小愿望，随机抽一条作为终点前加码。'
      ]
    },
    themeDepth: {
      levelPrefix: 'L',
      flexibleLevel: '可调',
      customLevel: '自定义',
      sortedHint: '由浅入深',
      stages: {
        early: {
          title: '刚恋爱适合',
          hint: '轻松、甜、少尴尬，适合刚确定关系或还在建立亲密默契的两个人。'
        },
        warming: {
          title: '热恋升温',
          hint: '适合已经习惯拥抱、亲吻和撒娇，想把气氛慢慢推热一点。'
        },
        flexible: {
          title: '可甜可辣',
          hint: '真心话和大冒险可自定义，适合从刚恋爱到稳定情侣按边界调节。'
        },
        steady: {
          title: '稳定情侣',
          hint: '适合能自然沟通喜欢和不喜欢，愿意尝试更暧昧互动的情侣。'
        },
        intimate: {
          title: '亲密伴侣',
          hint: '适合已经有明确同意和暂停词，双方都能舒服表达边界。'
        },
        cohabit: {
          title: '同居/熟悉',
          hint: '适合已经住在一起或非常熟悉彼此，尴尬感少，玩得更放松。'
        },
        deep: {
          title: '深度亲密',
          hint: '适合长期伴侣，彼此边界、节奏和安全感都很清楚。'
        },
        boundary: {
          title: '高亲密边界',
          hint: '只建议双方非常明确同意时选择；任何时候都可以降级或暂停。'
        },
        custom: {
          title: '自定义主题',
          hint: '你们自己写的玩法，请按实际关系阶段和边界来调整。'
        }
      }
    },
    invite: {
      title: '邀请另一半加入',
      subtitle: '生成房间码或链接，对方用同一个 App 加入后会同步棋盘。',
      joinTitle: '加入另一半的房间',
      joinSubtitle: '粘贴对方发来的邀请链接，或者直接输入房间码。',
      inviteTab: '发起邀请',
      joinTab: '加入房间',
      localTitle: '本地同屏',
      localDesc: '两个人用同一台手机或平板，适合当面约会、卧室、沙发局。',
      remoteTitle: '异地联机',
      remoteDesc: '一方生成房间码，另一方在同一个 App 里输入房间码加入。',
      roomCode: '房间码',
      joinedRoom: '已加入房间',
      joinInputLabel: '邀请码或邀请链接',
      joinPlaceholder: 'ABC123',
      joinButton: '加入',
      joinedButton: '已加入',
      joinInvalid: '请输入有效的邀请码或邀请链接。',
      pasteHint: '可以粘贴完整邀请链接，也可以只输入 6 位房间码。',
      qrTitle: '二维码邀请',
      qrHint: '让对方打开同一个 App，点加入房间后扫码即可进入。',
      scanQr: '扫码加入',
      scanTitle: '扫描邀请二维码',
      scanHint: '把镜头对准对方手机上的二维码，识别后会自动加入房间。',
      scanStarting: '正在打开相机',
      scanError: '相机无法打开或没有识别到二维码，请改用输入邀请码。',
      stopScan: '停止扫码',
      remoteReady: '实时房间配置已就绪',
      remoteConnecting: '正在连接实时房间',
      remoteError: '实时房间暂时无法连接',
      remoteErrorHint: '请确认 Supabase 项目处于运行状态后重试；本地同屏仍可正常游玩。',
      remotePending: '实时房间尚未就绪',
      remotePendingHint: '当前可先使用本地同屏模式；恢复在线服务后即可使用邀请码同步。',
      channel: '频道',
      yourRole: '你的身份',
      hostRole: '房主',
      guestRole: '加入方',
      onlineStatus: '在线状态',
      partnerOnline: '对方在线',
      partnerWaiting: '等待对方',
      copyLink: '复制邀请链接',
      copied: '已复制',
      share: '分享',
      next: '对方加入同一房间后，双方手机会同步棋盘、骰子、任务卡和奖励池。',
      joinNext: '加入后请等房主进入同一房间；连接成功后会拉取房主当前棋局。',
      close: '关闭'
    },
    remote: {
      roomLabel: '房间',
      partnerOnline: '对方在线',
      partnerWaiting: '等待对方',
      partnerTurn: '等待对方操作',
      hostOnlyStart: '远程房间由房主开始本局。你加入后会自动同步。',
      hostOnlyReset: '当前远程棋局由房主返回或重置，避免两台手机进度冲突。',
      hostPlayerLocked: '远程房间里，加入方先负责女士棋子；男士棋子由房主设置。',
      taskLocked: '这张任务卡需要由对方确认，当前手机只同步观看。'
    },
    video: {
      open: '视频小窗',
      title: '异地陪玩小窗',
      start: '打开摄像头',
      stop: '关闭摄像头',
      local: '你',
      partner: '另一半',
      waiting: '等待另一半加入',
      hint: '现在是本地预览；接入 WebRTC 后显示对方画面。',
      denied: '无法打开摄像头，请检查浏览器权限。'
    },
    reward: {
      setupTitle: '设置终点奖励池',
      setupHint: '选择3–5项。先到终点的人会随机看到其中3项。',
      selected: '已选择',
      minimum: '至少选择3项',
      maximum: '最多选择5项',
      done: '保存奖励池',
      categories: {
        sweet: '甜蜜',
        flirty: '调情',
        'after-dark': '夜色',
        wild: '自由'
      },
      finalTitle: 'Final Choice',
      finalHint: '赢家从今晚共同允许的奖励中选择一项。',
      choose: '选择这个奖励',
      intensityTitle: '由另一方选择执行方式',
      standard: '标准版',
      gentle: '温柔版',
      confirmed: '今晚奖励已确定',
      playAgain: '完成后再来一局',
      close: '回到首页'
    },
    form: {
      newTheme: '新建主题',
      editTheme: '编辑主题',
      themeName: '主题名称',
      desc: '描述',
      audience: '适用对象',
      cancel: '取消',
      save: '保存',
      createAndEdit: '创建并编辑',
      namePlaceholder: '例如：微醺沙发局',
      descPlaceholder: '例如：轻暧昧、重氛围、可随时降级',
      nameRequired: '请输入主题名称',
      editHint: '任务越具体，翻牌越有画面。',
      aiGenerate: 'AI 生成暧昧任务卡',
      addTask: '新增任务卡',
      taskPlaceholder: '例如：靠近但暂停5秒再亲吻',
      taskList: '任务卡列表',
      emptyTasks: '还没有任务卡，先添加几条今晚可以执行的小挑战。',
      addTaskAria: '添加任务',
      deleteTaskAria: '删除任务'
    },
    ai: {
      title: 'AI 导入任务',
      subtitle: '提示词已约束为暧昧但不色情。',
      copied: '已复制',
      copy: '复制提示词',
      promptLabel: '提示词',
      pasteLabel: '粘贴 AI 返回的 JSON',
      importMode: '导入方式',
      append: '追加',
      replace: '覆盖',
      import: '导入',
      pasteJson: '请粘贴 JSON',
      badFormat: '格式不正确，需要数组或包含 tasks 数组的对象',
      noTasks: '没有解析到任务文本',
      parseFailed: 'JSON 解析失败，请确认没有多余文字',
      placeholder: '{"tasks":["牵手保持一整轮","靠近耳边说一句秘密"]}'
    }
  },
  en: {
    brand: 'Couple Flight Chess',
    edition: 'After Dark',
    tagline: 'For couples who still make each other blush',
    heroLine1: 'Pick your heat.',
    heroLine2: 'Try to keep a straight face.',
    selectedThemes: 'Players ready',
    tonightCards: 'Dares loaded',
    heatRoute: 'Chaos mode',
    random: 'Wild',
    navPlay: 'Play',
    navCards: 'Dare Deck',
    back: 'Back',
    chooseTheme: 'Pick deck',
    cards: 'dare cards',
    startGame: 'Let’s Play',
    finalRewards: 'Final rewards',
    rewardsReady: 'ready',
    premiumEntry: 'Date Night Pass',
    premiumEntryHint: 'Scripts, props, voices, bolder decks',
    inviteEntry: 'Invite Partner',
    inviteEntryHint: 'Create a code or link',
    joinEntry: 'Join Room',
    joinEntryHint: 'Enter your partner’s code',
    unlocked: 'unlocked',
    chooseTaskTheme: 'Choose Your Dare Deck',
    themeHint: 'Sorted from gentle to intense. Choose by your comfort level tonight.',
    themesTitle: 'Dare Decks',
    themesSubtitle: 'Manage intimacy levels from first-date-safe to deeply familiar',
    create: 'Make One',
    noDesc: 'No description yet',
    cardUnit: 'cards',
    audience: {
      common: 'For both',
      male: 'For him',
      female: 'For her'
    } satisfies Record<ThemeAudience, string>,
    playerBlue: 'Him',
    playerRed: 'Her',
    maleTurn: 'His turn',
    femaleTurn: 'Her turn',
    selectedPrompt: 'Pick a dare deck for both players before you start.',
    leaveConfirm: 'Quit this round? All that hard-earned flirting will reset.',
    heatStage: 'Current vibe',
    stageHints: {
      ice: 'Leave roommate mode at the door',
      warm: 'Whispers, lingering hands, suspicious eye contact',
      hot: 'Dares get bolder and poker faces disappear',
      night: 'Very close, very playful, always mutual'
    },
    stages: {
      ice: 'Cute Trouble',
      warm: 'Flirting',
      hot: 'No Poker Face',
      night: 'After Dark'
    },
    turn: 'Turn',
    rollHint: 'Roll the dice. Try not to look nervous.',
    position: 'Spot',
    routeName: 'Flirt Track',
    start: 'Start',
    winner: 'You made it. Pick tonight’s victory reward.',
    winnerLabel: 'Tonight’s Winner',
    again: 'Run It Back',
    taskVisualSuffix: 'dare',
    flipTask: 'Tap to reveal your questionable life choice',
    executeBy: 'Dare goes to',
    execute: 'tonight',
    themeQuoteOpen: '“',
    themeQuoteClose: '”',
    taskConsent: 'Keep it fun and mutual. Soften it, skip it, or trade it for a hug anytime.',
    rejectStart: 'Chicken Out: Back to Start',
    rejectBack: 'Pass: Back 1–3 Spaces',
    accept: 'I’m In',
    taskBonus: 'Chemistry bonus: add',
    visualLabels: {
      whisper: 'Whisper',
      hands: 'Hands',
      blindbox: 'Blindfold',
      props: 'Props',
      reward: 'Reward',
      hug: 'Hug',
      gaze: 'Gaze',
      couch: 'Cuddle',
      close: 'Close'
    },
    eventTitles: {
      collision: 'Caught You',
      lucky: 'Lucky You',
      trap: 'Well, This Is Awkward'
    },
    taskFrom: 'Pulled from',
    mysteryTheme: 'Mystery Deck',
    fallbackTask: 'Emergency dare: give your partner a slow, shameless hug.',
    soundOn: 'Turn off date-night music',
    soundOff: 'Turn on date-night music',
    premium: {
      title: 'Tonight Pass Preview',
      subtitle: 'Not just more dares. A whole date night that knows how to escalate.',
      badge: 'Monetization prototype',
      price: '$2.99 / night',
      plan: 'Suggested model: keep the base board free; unlock the full after-dark experience as a one-night pass.',
      features: [
        'Guided scripts that connect warm-up, teasing, blindfold play, and final rewards',
        'Intimate Truth or Dare with truths, chemistry checks, boundaries, and custom finale cards',
        'Prop-based mini games with blindfolds, feathers, ice, warm towels, chocolate, and fingertips',
        'Character reactions with flirty voices, dice sounds, mood music, and expressive avatars',
        'Premium decks that get bolder while keeping consent, softer options, and passes built in'
      ],
      secondaryPrice: '$5.99 / month',
      secondaryPlan: 'Couple Plus can add weekly scripts, holiday packs, AI-custom decks, and saved couple preferences.',
      close: 'Got it'
    },
    truthDare: {
      premiumBadge: 'Tonight Pass',
      categoryBadge: 'Truth or Dare',
      editorHint: 'This deck works best when both players choose it. Defaults carry the rhythm; the final cards are for your own truths and dares.',
      kindLabel: 'Card type',
      intensityLabel: 'Intensity',
      addCustomFinal: 'Add Custom Finale Cards',
      taskKinds: {
        truth: 'Truth',
        dare: 'Dare',
        chemistry: 'Chemistry',
        boundary: 'Boundary',
        custom: 'Custom'
      },
      intensities: {
        gentle: 'Soft',
        flirty: 'Flirty',
        heated: 'Heated',
        finale: 'Finale'
      },
      customFinalCards: [
        'Read a truth you wrote together. If you have not written one yet, each add one to this deck now.',
        'Your partner asks a custom truth that should bring you closer, not embarrass you.',
        'Do one custom dare you wrote. Either person may soften it into a hug.',
        'Each write one little wish for tonight, then draw one before the finish.'
      ]
    },
    themeDepth: {
      levelPrefix: 'L',
      flexibleLevel: 'Flexible',
      customLevel: 'Custom',
      sortedHint: 'Gentle to Intense',
      stages: {
        early: {
          title: 'New Couple',
          hint: 'Sweet, light, and low-awkwardness. Good for couples still building comfort.'
        },
        warming: {
          title: 'Warming Up',
          hint: 'For couples already comfortable with hugs, kisses, teasing, and slower escalation.'
        },
        flexible: {
          title: 'Flexible Range',
          hint: 'Truth or dare can stay sweet or get bolder through your own boundaries.'
        },
        steady: {
          title: 'Steady Couple',
          hint: 'For partners who can talk naturally about likes, dislikes, and flirty experiments.'
        },
        intimate: {
          title: 'Intimate Partners',
          hint: 'Best when consent, check-ins, and pause words already feel natural.'
        },
        cohabit: {
          title: 'Living Together',
          hint: 'For partners who know each other well and feel less awkward exploring playfully.'
        },
        deep: {
          title: 'Deeply Familiar',
          hint: 'For long-term partners with clear rhythm, trust, and boundaries.'
        },
        boundary: {
          title: 'High Intimacy',
          hint: 'Only choose with clear mutual consent. Soften or pause anytime.'
        },
        custom: {
          title: 'Custom Deck',
          hint: 'Your own rules. Tune it to your actual relationship stage and comfort level.'
        }
      }
    },
    invite: {
      title: 'Invite Your Partner',
      subtitle: 'Create a room code or link. Your partner joins in the same app and the board syncs.',
      joinTitle: 'Join Your Partner’s Room',
      joinSubtitle: 'Paste the invite link, or enter the room code your partner sent.',
      inviteTab: 'Invite',
      joinTab: 'Join',
      localTitle: 'Same Device',
      localDesc: 'Play together on one phone or tablet. Best for couch, bedroom, or date-night mode.',
      remoteTitle: 'Long Distance',
      remoteDesc: 'One person creates a code. The other enters it in the same app to join.',
      roomCode: 'Room Code',
      joinedRoom: 'Joined Room',
      joinInputLabel: 'Invite code or link',
      joinPlaceholder: 'ABC123',
      joinButton: 'Join',
      joinedButton: 'Joined',
      joinInvalid: 'Enter a valid invite code or link.',
      pasteHint: 'Paste the full invite link or just the 6-character room code.',
      qrTitle: 'QR Invite',
      qrHint: 'Your partner opens the same app, taps Join, and scans this code.',
      scanQr: 'Scan QR',
      scanTitle: 'Scan Invite QR',
      scanHint: 'Point the camera at your partner’s QR code. The app joins the room automatically.',
      scanStarting: 'Opening camera',
      scanError: 'Camera could not open or no invite QR was detected. Enter the code instead.',
      stopScan: 'Stop Scan',
      remoteReady: 'Live room is configured',
      remoteConnecting: 'Connecting to the live room',
      remoteError: 'The live room is temporarily unavailable',
      remoteErrorHint: 'Confirm the Supabase project is running, then try again. Same-device play still works.',
      remotePending: 'Live room is not ready',
      remotePendingHint: 'Use same-device play for now. Invite sync will work once the online service is restored.',
      channel: 'Channel',
      yourRole: 'Your role',
      hostRole: 'Host',
      guestRole: 'Guest',
      onlineStatus: 'Status',
      partnerOnline: 'Partner online',
      partnerWaiting: 'Waiting',
      copyLink: 'Copy Invite Link',
      copied: 'Copied',
      share: 'Share',
      next: 'Once your partner joins the same room, both phones sync the board, dice, dare cards, and reward pool.',
      joinNext: 'After joining, wait for the host to enter the same room. The current game state will be pulled in when connected.',
      close: 'Close'
    },
    remote: {
      roomLabel: 'Room',
      partnerOnline: 'Partner online',
      partnerWaiting: 'Waiting for partner',
      partnerTurn: 'Waiting for your partner',
      hostOnlyStart: 'The host starts remote rounds. Once they begin, your phone will sync automatically.',
      hostOnlyReset: 'Only the host can leave or reset this remote round, so both phones stay in sync.',
      hostPlayerLocked: 'In remote rooms, the guest controls Her piece first. The host sets Him.',
      taskLocked: 'This dare needs your partner to confirm. This phone is watching the synced card.',
    },
    video: {
      open: 'Video Bubble',
      title: 'Long-Distance Bubble',
      start: 'Start Camera',
      stop: 'Stop Camera',
      local: 'You',
      partner: 'Partner',
      waiting: 'Waiting for partner',
      hint: 'Local preview for now. WebRTC will bring in your partner later.',
      denied: 'Could not open camera. Check browser permissions.'
    },
    reward: {
      setupTitle: 'Build the Final Reward Pool',
      setupHint: 'Pick 3–5. The winner will get three random choices at the finish.',
      selected: 'selected',
      minimum: 'Pick at least 3',
      maximum: 'Maximum 5',
      done: 'Save Reward Pool',
      categories: {
        sweet: 'Sweet',
        flirty: 'Flirty',
        'after-dark': 'After Dark',
        wild: 'Wild'
      },
      finalTitle: 'Final Choice',
      finalHint: 'The winner picks one reward from tonight’s mutually approved pool.',
      choose: 'Pick This One',
      intensityTitle: 'The other partner chooses the version',
      standard: 'Full Version',
      gentle: 'Gentle Version',
      confirmed: 'Tonight’s reward is locked in',
      playAgain: 'Play Again After',
      close: 'Back Home'
    },
    form: {
      newTheme: 'New Dare Deck',
      editTheme: 'Edit Dare Deck',
      themeName: 'Deck Name',
      desc: 'Description',
      audience: 'Who gets these dares?',
      cancel: 'Cancel',
      save: 'Save',
      createAndEdit: 'Create Deck',
      namePlaceholder: 'Example: Couch Trouble',
      descPlaceholder: 'Example: playful, bold, and easy to dial down',
      nameRequired: 'Give your dare deck a name',
      editHint: 'Specific dares make better stories tomorrow.',
      aiGenerate: 'Generate Flirty Dares',
      addTask: 'Add a Dare',
      taskPlaceholder: 'Example: lean close, pause five seconds, then kiss',
      taskList: 'Dare List',
      emptyTasks: 'This deck is suspiciously innocent. Add a few dares.',
      addTaskAria: 'Add dare',
      deleteTaskAria: 'Delete dare'
    },
    ai: {
      title: 'Import AI Dares',
      subtitle: 'The prompt aims for playful chemistry, humor, and clear consent.',
      copied: 'Copied',
      copy: 'Copy Prompt',
      promptLabel: 'Prompt',
      pasteLabel: 'Paste the AI JSON',
      importMode: 'Import Mode',
      append: 'Append',
      replace: 'Replace',
      import: 'Import',
      pasteJson: 'Please paste JSON',
      badFormat: 'Invalid format: use an array or an object with a tasks array',
      noTasks: 'No dares found',
      parseFailed: 'JSON parse failed. Make sure there is no extra text.',
      placeholder: '{"tasks":["Hold eye contact until someone laughs","Whisper a pickup line like you mean it"]}'
    }
  },
  es: {
    brand: 'Vuelo en Pareja',
    edition: 'Noche',
    tagline: 'Para parejas que todavía saben hacerse sonrojar',
    heroLine1: 'Elijan el ritmo.',
    heroLine2: 'Intenten no sonreír.',
    selectedThemes: 'Listos',
    tonightCards: 'Retos listos',
    heatRoute: 'Ruta de química',
    random: 'Azar',
    navPlay: 'Jugar',
    navCards: 'Mazos',
    back: 'Volver',
    chooseTheme: 'Elige mazo',
    cards: 'retos',
    startGame: 'Empezar',
    finalRewards: 'Premios finales',
    rewardsReady: 'listos',
    premiumEntry: 'Pase de cita',
    premiumEntryHint: 'Guiones, antifaz, voces y mazos intensos',
    inviteEntry: 'Invitar pareja',
    inviteEntryHint: 'Crear código o enlace',
    joinEntry: 'Entrar a sala',
    joinEntryHint: 'Usa el código de tu pareja',
    unlocked: 'desbloqueado',
    chooseTaskTheme: 'Elige tu mazo',
    themeHint: 'Ordenado de suave a intenso. Elijan según la comodidad de esta noche.',
    themesTitle: 'Mazos de retos',
    themesSubtitle: 'Gestiona los niveles de intimidad de suave a muy familiar',
    create: 'Crear',
    noDesc: 'Sin descripción',
    cardUnit: 'retos',
    audience: {
      common: 'Para ambos',
      male: 'Para él',
      female: 'Para ella'
    } satisfies Record<ThemeAudience, string>,
    playerBlue: 'Él',
    playerRed: 'Ella',
    maleTurn: 'Turno de él',
    femaleTurn: 'Turno de ella',
    selectedPrompt: 'Elige un mazo con retos para cada jugador antes de empezar.',
    leaveConfirm: '¿Salir de esta ronda? El progreso del tablero se reiniciará.',
    heatStage: 'Ambiente',
    stageHints: {
      ice: 'Dejen el modo rutina en la puerta',
      warm: 'Susurros, manos cerca y miradas largas',
      hot: 'Los retos suben y las caras serias desaparecen',
      night: 'Muy cerca, muy juguetón y siempre de mutuo acuerdo'
    },
    stages: {
      ice: 'Dulce lío',
      warm: 'Coqueteo',
      hot: 'Sin cara seria',
      night: 'Noche'
    },
    turn: 'Turno',
    rollHint: 'Tira el dado. Intenta no ponerte nervioso.',
    position: 'Casilla',
    routeName: 'Ruta coqueta',
    start: 'Inicio',
    winner: 'Llegaste. Elige el premio de esta noche.',
    winnerLabel: 'Ganador de la noche',
    again: 'Otra ronda',
    taskVisualSuffix: 'reto',
    flipTask: 'Toca para revelar el reto',
    executeBy: 'El reto es para',
    execute: 'esta vez',
    themeQuoteOpen: '“',
    themeQuoteClose: '”',
    taskConsent: 'Que sea divertido y mutuo. Suavicen, salten o cambien por un abrazo cuando quieran.',
    rejectStart: 'Saltar: volver al inicio',
    rejectBack: 'Pasar: retrocede 1–3 casillas',
    accept: 'Acepto',
    taskBonus: 'Bono de química: suma',
    visualLabels: {
      whisper: 'Susurro',
      hands: 'Manos',
      blindbox: 'Antifaz',
      props: 'Accesorios',
      reward: 'Premio',
      hug: 'Abrazo',
      gaze: 'Mirada',
      couch: 'Mimos',
      close: 'Cerca'
    },
    eventTitles: {
      collision: 'Te alcancé',
      lucky: 'Qué suerte',
      trap: 'Reto sorpresa'
    },
    taskFrom: 'Sale de',
    mysteryTheme: 'Mazo misterioso',
    fallbackTask: 'Reto de emergencia: dale a tu pareja un abrazo lento y sincero.',
    soundOn: 'Apagar música de cita',
    soundOff: 'Encender música de cita',
    premium: {
      title: 'Vista previa del Pase de cita',
      subtitle: 'No son solo más retos. Es una noche completa con ritmo propio.',
      badge: 'Prototipo comercial',
      price: '$2.99 / noche',
      plan: 'Modelo sugerido: tablero base gratis; experiencia completa de noche como pase de una cita.',
      features: [
        'Guiones guiados que conectan calentamiento, coqueteo, juegos con antifaz y premios finales',
        'Verdad o reto íntimo con preguntas, química, límites y cartas finales personalizadas',
        'Mini juegos con antifaz, plumas, hielo, toallas tibias, chocolate y caricias suaves',
        'Reacciones de personajes con voces coquetas, sonidos de dado, música y avatares expresivos',
        'Mazos premium más intensos, con consentimiento, versiones suaves y opción de pasar'
      ],
      secondaryPrice: '$5.99 / mes',
      secondaryPlan: 'Couple Plus puede sumar guiones semanales, paquetes de fechas especiales, mazos con IA y preferencias guardadas.',
      close: 'Entendido'
    },
    truthDare: {
      premiumBadge: 'Pase de cita',
      categoryBadge: 'Verdad o reto',
      editorHint: 'Este mazo funciona mejor cuando ambos jugadores lo eligen. Las cartas finales quedan para sus propias verdades y retos.',
      kindLabel: 'Tipo de carta',
      intensityLabel: 'Intensidad',
      addCustomFinal: 'Añadir cartas finales',
      taskKinds: {
        truth: 'Verdad',
        dare: 'Reto',
        chemistry: 'Química',
        boundary: 'Límites',
        custom: 'Personalizada'
      },
      intensities: {
        gentle: 'Suave',
        flirty: 'Coqueta',
        heated: 'Intensa',
        finale: 'Final'
      },
      customFinalCards: [
        'Lean una verdad escrita por ustedes. Si no tienen una, cada persona añade una al mazo ahora.',
        'Tu pareja hace una verdad personalizada que acerque, no que avergüence.',
        'Hagan un reto personalizado escrito por ustedes. Cualquiera puede suavizarlo a un abrazo.',
        'Cada persona escribe un pequeño deseo de esta noche y sacan uno antes de la meta.'
      ]
    },
    themeDepth: {
      levelPrefix: 'L',
      flexibleLevel: 'Flexible',
      customLevel: 'Personal',
      sortedHint: 'Suave a intenso',
      stages: {
        early: {
          title: 'Recién juntos',
          hint: 'Dulce, ligero y con poca incomodidad. Ideal cuando todavía construyen confianza.'
        },
        warming: {
          title: 'Subiendo clima',
          hint: 'Para parejas cómodas con abrazos, besos, bromas y un ritmo lento.'
        },
        flexible: {
          title: 'Rango flexible',
          hint: 'Verdad o reto puede quedarse tierno o subir según sus propios límites.'
        },
        steady: {
          title: 'Pareja estable',
          hint: 'Para quienes pueden hablar con naturalidad de gustos, límites y coqueteo.'
        },
        intimate: {
          title: 'Pareja íntima',
          hint: 'Mejor cuando el consentimiento, las pausas y las preguntas ya se sienten naturales.'
        },
        cohabit: {
          title: 'Viven juntos',
          hint: 'Para parejas muy familiarizadas, con menos vergüenza y más confianza.'
        },
        deep: {
          title: 'Muy familiar',
          hint: 'Para relaciones largas con ritmo, confianza y límites claros.'
        },
        boundary: {
          title: 'Alta intimidad',
          hint: 'Solo con consentimiento mutuo claro. Pueden suavizar o pausar cuando quieran.'
        },
        custom: {
          title: 'Mazo personal',
          hint: 'Sus propias reglas. Ajústenlo a su etapa real y nivel de comodidad.'
        }
      }
    },
    invite: {
      title: 'Invita a tu pareja',
      subtitle: 'Crea un código o enlace. Tu pareja entra con la misma app y el tablero se sincroniza.',
      joinTitle: 'Entra a la sala de tu pareja',
      joinSubtitle: 'Pega el enlace de invitación o escribe el código de sala.',
      inviteTab: 'Invitar',
      joinTab: 'Entrar',
      localTitle: 'Mismo dispositivo',
      localDesc: 'Jueguen en un teléfono o tablet. Ideal para sofá, cita en casa o noche tranquila.',
      remoteTitle: 'A distancia',
      remoteDesc: 'Una persona crea el código; la otra lo escribe en la misma app para entrar.',
      roomCode: 'Código de sala',
      joinedRoom: 'Sala conectada',
      joinInputLabel: 'Código o enlace',
      joinPlaceholder: 'ABC123',
      joinButton: 'Entrar',
      joinedButton: 'Dentro',
      joinInvalid: 'Escribe un código o enlace válido.',
      pasteHint: 'Puedes pegar el enlace completo o solo el código de 6 caracteres.',
      qrTitle: 'Invitación QR',
      qrHint: 'Tu pareja abre la misma app, toca Entrar y escanea este código.',
      scanQr: 'Escanear QR',
      scanTitle: 'Escanear invitación',
      scanHint: 'Apunta la cámara al QR de tu pareja. La app entrará a la sala automáticamente.',
      scanStarting: 'Abriendo cámara',
      scanError: 'No se pudo abrir la cámara o no se detectó un QR válido. Escribe el código.',
      stopScan: 'Detener escaneo',
      remoteReady: 'Sala en vivo configurada',
      remoteConnecting: 'Conectando a la sala en vivo',
      remoteError: 'La sala en vivo no está disponible',
      remoteErrorHint: 'Confirma que el proyecto de Supabase esté activo y vuelve a intentarlo. El juego local sigue funcionando.',
      remotePending: 'La sala en vivo aún no está lista',
      remotePendingHint: 'Usa el modo local por ahora. La invitación se sincronizará cuando vuelva el servicio en línea.',
      channel: 'Canal',
      yourRole: 'Tu rol',
      hostRole: 'Anfitrión',
      guestRole: 'Invitado',
      onlineStatus: 'Estado',
      partnerOnline: 'Pareja conectada',
      partnerWaiting: 'Esperando',
      copyLink: 'Copiar enlace',
      copied: 'Copiado',
      share: 'Compartir',
      next: 'Cuando tu pareja entre a la misma sala, ambos teléfonos sincronizan tablero, dado, retos y premios.',
      joinNext: 'Después de entrar, espera a que quien creó la sala esté conectado; se cargará la partida actual.',
      close: 'Cerrar'
    },
    remote: {
      roomLabel: 'Sala',
      partnerOnline: 'Pareja conectada',
      partnerWaiting: 'Esperando pareja',
      partnerTurn: 'Esperando a tu pareja',
      hostOnlyStart: 'La persona anfitriona inicia la partida remota. Tu teléfono se sincroniza automáticamente.',
      hostOnlyReset: 'Solo la persona anfitriona puede salir o reiniciar la partida remota para mantener todo sincronizado.',
      hostPlayerLocked: 'En salas remotas, quien entra controla primero la ficha de ella. La persona anfitriona configura la de él.',
      taskLocked: 'Este reto debe confirmarlo tu pareja. Este teléfono solo mira la carta sincronizada.'
    },
    video: {
      open: 'Burbuja de video',
      title: 'Burbuja a distancia',
      start: 'Abrir cámara',
      stop: 'Cerrar cámara',
      local: 'Tú',
      partner: 'Pareja',
      waiting: 'Esperando a tu pareja',
      hint: 'Vista local por ahora. WebRTC mostrará a tu pareja más adelante.',
      denied: 'No se pudo abrir la cámara. Revisa los permisos del navegador.'
    },
    reward: {
      setupTitle: 'Arma el premio final',
      setupHint: 'Elige 3–5. Al llegar a la meta, el ganador verá tres opciones al azar.',
      selected: 'seleccionados',
      minimum: 'Elige al menos 3',
      maximum: 'Máximo 5',
      done: 'Guardar premios',
      categories: {
        sweet: 'Dulce',
        flirty: 'Coqueto',
        'after-dark': 'Noche',
        wild: 'Libre'
      },
      finalTitle: 'Elección final',
      finalHint: 'El ganador elige un premio del conjunto aprobado por ambos.',
      choose: 'Elegir este',
      intensityTitle: 'La otra persona elige la versión',
      standard: 'Versión completa',
      gentle: 'Versión suave',
      confirmed: 'Premio de la noche confirmado',
      playAgain: 'Jugar otra vez después',
      close: 'Volver al inicio'
    },
    form: {
      newTheme: 'Nuevo mazo',
      editTheme: 'Editar mazo',
      themeName: 'Nombre del mazo',
      desc: 'Descripción',
      audience: '¿Para quién son?',
      cancel: 'Cancelar',
      save: 'Guardar',
      createAndEdit: 'Crear mazo',
      namePlaceholder: 'Ejemplo: Sofá y coqueteo',
      descPlaceholder: 'Ejemplo: juguetón, cálido y fácil de suavizar',
      nameRequired: 'Ponle nombre al mazo',
      editHint: 'Los retos concretos dejan mejores historias.',
      aiGenerate: 'Generar retos coquetos',
      addTask: 'Añadir reto',
      taskPlaceholder: 'Ejemplo: acércate, espera cinco segundos y luego da un beso',
      taskList: 'Lista de retos',
      emptyTasks: 'Este mazo está demasiado inocente. Añade algunos retos.',
      addTaskAria: 'Añadir reto',
      deleteTaskAria: 'Eliminar reto'
    },
    ai: {
      title: 'Importar retos de IA',
      subtitle: 'El prompt busca química juguetona, humor y consentimiento claro.',
      copied: 'Copiado',
      copy: 'Copiar prompt',
      promptLabel: 'Prompt',
      pasteLabel: 'Pega el JSON de la IA',
      importMode: 'Modo de importación',
      append: 'Añadir',
      replace: 'Reemplazar',
      import: 'Importar',
      pasteJson: 'Pega un JSON',
      badFormat: 'Formato inválido: usa un arreglo o un objeto con una lista tasks',
      noTasks: 'No se encontraron retos',
      parseFailed: 'Falló el parseo del JSON. Revisa que no haya texto extra.',
      placeholder: '{"tasks":["Mírense hasta que alguien se ría","Susurra un piropo como si fuera en serio"]}'
    }
  }
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
  : T extends Record<string, unknown>
    ? { [K in keyof T]: Widen<T[K]> }
    : T;

export type Translation = Widen<(typeof t)['zh']>;
