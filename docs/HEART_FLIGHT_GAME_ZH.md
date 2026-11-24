# 新游戏草案：吹来的心动 / Heart Flight

状态：**设计与技术验证方案，尚未进入 TestFlight 构建 13**。优先做真实双人操作；沿用“午夜调情”的深色、玫瑰金和心形视觉，三语文案与现有声音系统另行制作。

## 一局怎么玩

1. 两人用房间码进入同一局，选择“送心的人”和“接心的人”。默认头像可以是男生与女生，但角色可互换，也允许其他情侣组合。
2. 接心的人在每轮开始前选择 `Catch / 接住` 或 `Tease / 躲一下`，双方都知道本轮模式。游戏进行三次发射，然后交换角色。
3. 送心的人轻吹自己手机的麦克风。吹气越强，屏幕上的爱心飞得越高；吹气持续时间决定水平距离。发射前有短暂的力度条与倒计时。
4. 接心的人**轻轻倾斜**自己的手机，角色上下移动。爱心靠近时，接住或闪开。使用倾斜角度控制位置，不要求猛烈上下晃动手机。
5. 接住会点亮一个双方同意的亲近环节，例如对视、说一句想念、约下次见面。躲开会给送心的人一次带有玩笑口吻的第二次机会；没有输赢惩罚。

每轮约 20 秒，四到六轮一局。双方都能暂停、重来或跳过。互动等级沿用 `Sweet / Teasing / Bold` 的共同选择；只出现双方同意的内容。

## 让吹气真的像“吹”

- 进入游戏后，送心者主动点一次“开启麦克风”，完成系统授权；只在自己发射时打开采集，发射结束立即关闭。
- 先测 2 秒环境音，再显示实时力度条。用本机音频频谱中持续的宽带气流声估计力度，将结果平滑映射为低、中、高三档轨迹；不要承诺能精确测量风速。说话、音乐和风扇可能误触发，需要真机校准与重试。
- 拒绝麦克风权限时，以按住蓄力后松开发射替代。拒绝运动权限时，接心者可用手指上下滑动。两个替代操作都要真的能玩完整一局。
- 只传力度数值、角色高度和局状态；不上传、不保存原始麦克风音频。采集时在游戏画面持续显示醒目的麦克风状态。

## 联机与同机

远程双手机是主模式。使用独立于飞行棋的房间事件：`ready → countdown → launch(power, duration) → move(y) → catch/dodge → result`。发射轨迹由房主计算并广播，接心方的角色高度最多每秒发送约 10 次；断线时冻结回合并允许重连。既有飞行棋房间码基础设施可复用连接方式，不能直接复用飞行棋的状态消息。

同机模式让送心者对麦克风吹气、接心者在同一块屏幕上用手指滑动角色；陀螺仪只在双手机模式启用。电脑与手机测试时，电脑端可用麦克风发射或用按住蓄力，接心可用鼠标/触控板拖动。

## 美区呈现

| 位置 | English | 中文 | Español |
| --- | --- | --- | --- |
| 名称 | Heart Flight | 吹来的心动 | Corazón al vuelo |
| 送心提示 | “Send a little spark their way.” | “把一点心动吹向对方。” | “Mándale una chispa de cariño.” |
| 接住 | “Got you.” | “接住你了。” | “Te tengo.” |
| 躲开 | “Make me work for it, huh?” | “还得再努力一下，是吧？” | “¿Quieres que me esfuerce un poco más?” |

以上是产品文案草案。三语语音录制与母语校对要在入包前完成。

## 技术前提与验收

苹果要求 App 在访问麦克风前提供使用说明；当前 iOS 工程尚无 `NSMicrophoneUsageDescription`，实际开发入包时需补上。Web 端 `getUserMedia()` 要求安全上下文及用户授权；`WKWebView` 的麦克风与运动传感器各有授权流程。音频分析可用 `AnalyserNode`，但吹气识别算法仍需真机验证。参考：[Apple 麦克风权限](https://developer.apple.com/documentation/bundleresources/protected-resources)、[WebKit 媒体授权](https://developer.apple.com/documentation/webkit/wkuidelegate/webview%28_%3Arequestmediacapturepermissionfor%3Ainitiatedbyframe%3Atype%3Adecisionhandler%3A%29)、[WebKit 运动授权](https://developer.apple.com/documentation/webkit/wkuidelegate/webview%28_%3Arequestdeviceorientationandmotionpermissionfor%3Ainitiatedbyframe%3Adecisionhandler%3A%29)、[MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)、[MDN AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData)。

首个原型需验证：正常吹气能触发三档高度；说话与背景音乐不会频繁误触；接心方轻微倾斜可覆盖整个接球区域；电脑和 iPhone 能完成六轮、换角色、断线重连；拒绝两种权限仍可玩；音频停止后系统麦克风指示消失。通过后再加入目录、图标、三语语音、商店截图与下一版 TestFlight。
