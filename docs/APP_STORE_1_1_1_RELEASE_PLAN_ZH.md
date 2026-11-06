# Couple Flight Chess 1.1.1 修复版准备

更新：2026-11-06。账户持有人已在 App Store Connect 确认 1.1 为「可分发」，并创建了 1.1.1 草稿；因此下一次发布使用同一 App 记录下的新版本 1.1.1。

## 本次范围

- 邀请房间中检测到另一半加入后，两端直接进入角色与题库准备页；房主可从该页开局，加入方随棋盘状态自动进入游戏。
- 双方选题库改为房主汇总，避免准备阶段的整盘状态互相覆盖。当前房间仍沿用已有 Supabase Realtime 实现；此次不引入付费小游戏或内购。
- 局域网 HTTP 页面无法调用浏览器实时相机时，扫码页提供拍照识别二维码的入口；原生 App 显示仅包含六位房间码的二维码，另一端扫码即可加入。正式 App 的实时相机扫码仍须真机验证。
- 包含当前源码中的本地角色语音播放修复；须用本次 TestFlight 构建验证男声和女声均可听见。

源码版本为 `MARKETING_VERSION = 1.1.1`、`CURRENT_PROJECT_VERSION = 8`。构建 7 真机联机时出现房主看到对方在线、但准备页没有自动出现的问题。构建 8 将准备页与邀请弹窗开关解耦，并在切换房间时清除旧的在线状态；App Store Connect 已确认构建 8 为 `VALID`，TestFlight 内测状态为 `IN_BETA_TESTING`。

## 已完成的本地检查

- `npm run release:check`：TypeScript、全仓库 ESLint、三语言键校验、本地语音文件校验、Vite 生产构建均通过。
- `REMOTE_TEST_URL=http://<电脑局域网地址>:5174/ npm run test:remote`：两个独立浏览器客户端完成二维码照片识别、加入后弹出准备页、双方选不同角色和题库、房主开局、加入方自动进入棋盘及正确回合控制；模拟原生平台生成的房间码二维码也解码为正确的六位码。
- `npm run ios:sync` 与本机 Xcode 16.1 的 iPhone 16 模拟器 Debug 构建通过。仓库上传工作流使用 GitHub Actions `macos-26`；本地网页与模拟器检查不等于已上传或真机验收。

## 当前发布状态与待办

1. 1.1.1 草稿已关联构建 8，审核备注已更新到构建 8；英文更新说明和三张 iPhone 截图也已保存。草稿尚未提交审核。
2. 在真实 iPhone 上通过 TestFlight 安装构建 8，验证：二维码相机权限及扫码、房间码加入、两端自动进入角色和题库准备页、房主直接开局、双方回合、角色语音、挑战卡以及退出重进。
3. 真机通过后，再核对美国区资料、隐私和审核备注，提交 App Review。保留免费价格；不要加入未完成的付费玩法。

## 可粘贴的英文更新说明

Improved two-player online setup. When your partner joins, both players can choose their characters and decks in the room, and the host can start the game there. We also improved QR joining and voice playback reliability.

## 可粘贴的英文审核备注

To test online play, use two devices with the current build. On device A, tap “Invite Partner” and note the six-character room code. On device B, tap “Join Room” and enter the code. When both devices show that the partner is online, the setup screen appears automatically. The host chooses one character; the guest confirms the other. Each player chooses a deck for their own character. The host taps “We’re ready. Start game”; the guest enters the board automatically. The first turn is random, and only the device controlling that character can roll. The same-device game remains available without an account or invitation.

官方流程：[创建新版本](https://developer.apple.com/help/app-store-connect/update-your-app/create-a-new-version/)、[TestFlight 测试](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)。
