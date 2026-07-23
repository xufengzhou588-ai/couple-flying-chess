# 本地真人语音包说明

当前游戏语音只播放 `public/audio/voice/` 里的本地真人录音。为了避免机械感，系统 TTS 兜底已默认关闭；如果对应文件不存在，该句会静音。

## 推荐音频规格

- 格式优先：`.mp3`，也支持 `.m4a`、`.wav`、`.ogg`
- 建议采样率：44.1 kHz 或 48 kHz
- 建议响度：-16 LUFS 左右，男女声尽量统一音量
- 每条时长：1–4 秒，短促、自然、带一点亲密游戏感
- 权利要求：真人录音需要获得配音者授权；如果购买素材，也要确认允许商业 App 使用

## 女声表演方向

女声建议走“温柔、贴近、舒服”的路线，不要尖、不要装可爱、不要用夸张气泡音。

- 语速：比正常说话慢一点点，但不要拖
- 音色：微笑感、放松、低压力，像靠近耳边轻声说话
- 情绪：温柔陪伴为主，带一点心动，不要攻击性调侃
- 收尾：句尾轻一点，避免突然拔高
- 麦克风：离麦 15–20 cm，防喷麦；后期轻微降噪和音量统一即可

## 文件夹结构

```text
public/audio/voice/
  zh/
    male/
    female/
  en/
    male/
    female/
```

每个文件可以使用以下任一扩展名：`.mp3`、`.m4a`、`.wav`、`.ogg`。同一个语音只需要放一种格式。

## 任务卡语音：20 条

每个语言、每个性别各录 5 条。

| 文件名 | 中文男声台词 | 中文女声台词 | 英文男声台词 | 英文女声台词 |
| --- | --- | --- | --- | --- |
| `task-trap.mp3` | 有点刺激。来吧，我接了。 | 这张有点坏，不过我陪你。 | Well, that escalated quickly. I am in. | This one is a little naughty. I am with you. |
| `task-collision.mp3` | 抓到你了，别想跑。 | 被我抓到啦，靠近一点。 | Caught you, troublemaker. | I caught you. Come a little closer. |
| `task-bold.mp3` | 这张够大胆。我喜欢。 | 嗯，这张有点大胆，我们慢慢来。 | That is bold. Good thing I like a challenge. | This one is bold. We can take it slow. |
| `task-kiss.mp3` | 靠近点，让我来。 | 再靠近一点，好吗。 | Come here, heartbreaker. | Come a little closer, okay? |
| `task-blush.mp3` | 好吧，你成功让我心动了。 | 你这样，我真的会脸红。 | Okay, you win. I am definitely blushing. | You are making me blush for real. |

示例路径：

```text
public/audio/voice/zh/male/task-kiss.mp3
public/audio/voice/zh/female/task-kiss.mp3
public/audio/voice/en/male/task-kiss.mp3
public/audio/voice/en/female/task-kiss.mp3
```

## 骰子反应语音：16 条

每个语言、每个性别各录 4 条。

| 文件名 | 中文男声台词 | 中文女声台词 | 英文男声台词 | 英文女声台词 |
| --- | --- | --- | --- | --- |
| `dice-big-roll.mp3` | 这手气，今晚稳了。 | 我先往前一点，你慢慢跟上来。 | That’s how you roll, babe. | Come on, love. I will wait for you. |
| `dice-small-roll.mp3` | 骰子可能嫉妒我的实力。 | 没关系，慢一点也很好玩。 | The dice clearly fear my potential. | It is okay. Slow can be sweet too. |
| `dice-steady.mp3` | 距离奖励又近了一点。 | 别急，我们慢慢来。 | One step closer to the good part. | No rush. The fun is catching up. |
| `dice-hot-streak.mp3` | 今晚这骰子明显站我这边。 | 今天好运好像一直陪着我。 | The dice have excellent taste tonight. | Looks like luck is being very kind tonight. |

## 替换方式

1. 按上面的路径放入音频文件。
2. 运行 `npm run build`。
3. 本地预览或同步 iOS：`npm run ios:sync`。

只要文件名匹配，游戏会自动使用真人录音，不需要改代码。

## 检查是否录齐

运行：

```bash
npm run voice:check
```

如果提示缺文件，就按提示把对应音频补到 `public/audio/voice/` 下。

## 用 ElevenLabs 批量生成

如果选择 ElevenLabs，可以用项目脚本批量生成固定台词。默认只生成中文女声 9 条。

1. 在 ElevenLabs 后台创建 API Key。
2. 选择一个温柔自然的女声，复制 Voice ID。
3. 在项目根目录创建 `.env.voice`：

```text
ELEVENLABS_API_KEY=你的 API Key
ELEVENLABS_VOICE_ID_ZH_FEMALE=你的女声 Voice ID
```

`.env.voice` 已加入 `.gitignore`，不会提交到 Git。

4. 在终端执行：

```bash
npm run voice:elevenlabs
npm run voice:check
npm run ios:sync
```

如果要先列出账号里的声音：

```bash
ELEVENLABS_LIST_VOICES=1 npm run voice:elevenlabs
```

如果要一次生成全部 36 条：

```bash
VOICE_PACK_SCOPE=all npm run voice:elevenlabs
```

商业发布前，请确认所选 ElevenLabs 账号套餐和声音授权允许商业 App 使用。

## 用 Edge 中文神经声音生成测试版

如果 ElevenLabs 免费账号的中文口音不自然，可以用本地开发脚本生成中文测试音频：

```bash
python3 -m pip install --user edge-tts
npm run voice:edge
npm run voice:check
npm run ios:sync
```

当前中文版测试音频使用：

- 女声：`zh-CN-XiaoxiaoNeural`
- 男声：`zh-CN-YunxiNeural`

这套适合产品体验测试。正式商业发布前，请换成明确允许商用的 Azure/ElevenLabs/MiniMax 授权声源。
