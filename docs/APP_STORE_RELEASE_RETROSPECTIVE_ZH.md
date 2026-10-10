# App Store 上线配置与问题复盘

本文记录 `Couple Flight Chess` 首次上架美区 App Store 的实际配置、审核退回原因、修复动作和后续项目检查清单。目标是让后续 app 在提交前按同一标准自检，减少重复退审。

## 最终上线状态

- App 名称：`Couple Flight Chess`
- Bundle ID：`com.coupleflyingchess.app`
- App Store Connect App ID：`6799199803`
- App Store 版本：`1.0`
- 上线构建：`build 3`
- 最终状态：`READY_FOR_SALE`
- 审核提交状态：`COMPLETE`
- 审核 item 状态：`APPROVED`
- 美区链接：`https://apps.apple.com/us/app/couple-flight-chess/id6799199803`
- 上架区域：美国区
- 是否使用 IDFA：否
- 是否需要登录：否
- 是否有内购或订阅：否

## 关键工程配置

### iOS 标识

- `ios/App/App/Info.plist`
  - `CFBundleShortVersionString` 使用 `$(MARKETING_VERSION)`
  - `CFBundleVersion` 使用 `$(CURRENT_PROJECT_VERSION)`
- `ios/App/App.xcodeproj/project.pbxproj`
  - `MARKETING_VERSION = 1.0`
  - `CURRENT_PROJECT_VERSION = 3`

每次重新上传 App Store Connect，`CURRENT_PROJECT_VERSION` 必须递增。版本号可以仍是 `1.0`，但 build 号不能重复。

### GitHub Actions 云构建

工作流文件：

- `.github/workflows/ios-app-store.yml`

核心配置：

- runner：`macos-26`
- Xcode：GitHub runner 自带 Xcode 26
- 触发方式：`workflow_dispatch`
- 输入项：
  - `upload_to_app_store=true`
- 构建流程：
  - `npm ci`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run i18n:check`
  - `npm run voice:check`
  - `npm run build`
  - `npx cap sync ios`
  - `pod install --repo-update`
  - `xcodebuild archive`
  - `xcodebuild -exportArchive`
  - `xcrun altool --upload-app`

GitHub Secrets 必须配置：

- `APP_STORE_CONNECT_API_KEY_ID`
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_API_KEY_BASE64`

不要提交 `.p8` 私钥、Issuer ID、Key ID、联系人电话、邮箱或 `.local-secrets` 到仓库。

### App Store Connect API

本地辅助查询使用 App Store Connect API。JWT 签名必须使用 ES256 的 raw 64-byte ECDSA signature，不是 ASN.1 DER signature。否则 API 会认证失败。

本地私密文件位置仅用于个人机器，不提交：

- `.local-secrets/appstore_key_id.txt`
- `.local-secrets/appstore_issuer_id.txt`
- `~/.appstoreconnect/private_keys/AuthKey_<KEY_ID>.p8`

## App Store Connect 配置

### 定价与可用性

- 当前只选择美国区上架。
- 只选美区的结果：
  - 美国 Apple ID 可见和下载。
  - 非美区 Apple ID 可能无法搜索、查看或下载。
- 如果后续要全球上架，需要重新检查内容分级、隐私、合规和地区可用性。

### App 隐私

最终隐私配置：

- 不收集数据。
- 不追踪用户。
- 不使用 IDFA。
- 不使用广告 SDK。
- 不使用分析 SDK。
- 不与 data broker 共享数据。
- 不需要 ATT 弹窗。

本次曾经误选过 `Crash Data 用于追踪`，触发了 `Guideline 5.1.2(i)` 退审。后续项目必须按实际 SDK 和数据流填写，不要为了“保险”多选。

### 审核信息

审核信息必须包含：

- 联系人信息。
- 是否需要登录：不需要时明确写 `Not required`。
- 审核备注 Notes。
- 真机录屏附件。
- 测试设备和系统版本。
- 核心功能说明。
- 外部服务说明。
- 区域差异说明。

本项目使用的外部服务说明：

- Supabase Realtime：仅用于可选私密房间同步。
- Netlify：托管隐私政策、支持页面和支持表单。
- 无认证服务、无支付服务、无广告 SDK、无分析 SDK、无 AI 服务。

## 实际遇到的问题

### 问题 1：Guideline 2.1，审核信息不足

Apple 要求补充：

- 真机录屏。
- 测试设备和系统版本。
- app 功能和目标用户说明。
- 主功能访问步骤。
- 外部服务列表。
- 区域差异说明。
- 如涉及受监管行业或第三方授权材料，需要补证明。

处理方式：

- 使用 iPhone 14 Pro、iOS 26.6 录屏。
- 上传录屏附件：`2026-08-24_202228_220.mp4`
- 在审核备注和 Resolution Center 回复中补完整说明。

后续避免方式：

- 提交前就准备真机录屏。
- Notes 写成审核员可以照着操作的步骤，不要只写营销描述。
- 如果不需要登录、样例文件、订阅，也要明确写“不需要”。

### 问题 2：Guideline 5.1.2(i)，隐私追踪声明错误

退审原因：

- App Privacy 中曾声明 Crash Data 用于追踪。
- 但 app 没有 ATT 弹窗，也没有实际追踪能力。

处理方式：

- 删除错误的数据用途。
- 将 App Privacy 更新为不收集数据。
- 发布隐私信息更新。
- Notes 说明：
  - app 不追踪用户。
  - 不使用广告 SDK。
  - 不使用分析 SDK。
  - 不与 data broker 共享数据。
  - 不需要 ATT。

后续避免方式：

- App Privacy 必须按代码实际行为填写。
- 没有 SDK 或数据流就不要多选。
- 如果有第三方 SDK，必须查它是否收集数据、是否追踪、是否需要 ATT。

### 问题 3：Guideline 2.1(a)，双设备私密房间流程不完整

退审原因：

- 审核员使用两台设备加入私密房间后，找不到进入房间或开始私密游戏的入口。
- Apple 测试设备：
  - iPhone 17 Pro Max
  - iPad Air 11-inch (M3)
  - iOS 27.0 / iPadOS 27.0

根因：

- 房主创建房间、加入方加入房间后，界面只显示连接和在线状态。
- 弹窗里没有清晰的主按钮告诉审核员下一步该点哪里。
- 底部导航虽然可以开始游戏，但审核员停留在房间弹窗时无法判断下一步。

修复方式：

- 新增明确主操作：
  - 房主：`Start Private Game`
  - 加入方：`Enter Private Room`
- 双方在线后显示按钮。
- 房主点击后进入棋盘并开始同步。
- 加入方点击后进入棋盘并请求房主当前棋局状态。
- 审核备注补充双设备测试步骤。
- 上传新构建 `build 3`。
- 将版本 1.0 绑定到 build 3。
- 将 review submission item 标记 resolved 并重新提交。

后续避免方式：

- 审核员必须能在当前页面看到下一步按钮。
- 不要依赖“用户知道要点底部导航”。
- 所有远程、扫码、房间、分享、登录、支付、权限功能都要按真机路径走完。
- 如果功能不是发布必要功能，先隐藏，避免审核员测到半成品。

## 本次最终提交备注要点

审核备注中写明：

- 已上传 build 3。
- 已修复私密双设备房间流程。
- 两台设备加入同一房间后会显示明确主按钮。
- 房主点击 `Start Private Game`。
- 加入方点击 `Enter Private Room`。
- 进入棋盘后同步骰子、棋盘移动、任务卡和奖励池。
- app 不需要账号、登录、购买、订阅或样例文件。
- app 不追踪用户。
- 当前仅美区上架，但功能无地区差异。

## 后续项目提交前检查清单

### 代码和构建

- 版本号和 build 号正确。
- build 号每次上传递增。
- `npm run typecheck` 通过。
- `npm run lint` 通过。
- i18n 检查通过。
- 生产构建通过。
- iOS sync 已执行。
- GitHub Actions 成功归档、导出 IPA、上传 App Store Connect。
- App Store Connect 中新 build 状态为 `VALID`。

### 真机功能

- 至少一台真机完整跑主流程。
- 如果有双设备功能，必须两台真机测试。
- 如果有 iPad 支持，必须检查 iPad 画面是否可用。
- 如果有摄像头、相册、定位、通知、蓝牙、通讯录等权限，必须触发一次并确认 purpose string 清楚。
- 如果有网络服务，必须确认服务在线、可访问、错误态可理解。

### 审核资料

- App 名称、分类、年龄分级完整。
- 截图必须展示真实 app 使用画面，不只放封面、登录页或宣传图。
- 隐私政策链接可访问。
- 支持链接可访问。
- App Privacy 按实际代码填写。
- 审核备注包含操作步骤。
- 真机录屏已上传。
- 测试账号已提供；如果不需要登录，明确写不需要。
- 外部服务列表已说明。
- 地区差异已说明。

### App Privacy

- 检查是否有广告 SDK。
- 检查是否有分析 SDK。
- 检查是否收集 crash、diagnostics、contact、location、user content。
- 检查是否把任何数据用于 tracking。
- 如果声明 tracking，必须实现 ATT 并能解释用途。
- 如果没有 tracking，不要选择 `used for tracking`。

### App Review Notes 模板

```text
The app does not require an account, login, purchase, subscription, or sample file. It can be tested immediately after launch.

Core review steps:
1. Launch the app.
2. Follow the main action on the home screen.
3. Complete the main user flow.
4. If testing the private room feature, use two physical devices:
   - Device A creates a room.
   - Device B joins with the room code or QR code.
   - When both devices show Partner online, tap the explicit enter/start button.
   - Confirm that both devices open the board and sync state.

Tested device:
- <device model>, <OS version>

External services:
- <service name>: <exact purpose>

Privacy:
- The app does not track users.
- The app does not use advertising SDKs, analytics SDKs, data brokers, or IDFA.

Regional differences:
- The app functions consistently across all selected regions.
```

## 发布后注意事项

- 已上线版本不要随意改审核提交资料。
- 新功能、新截图、新隐私变更都应创建新版本或新提交。
- 如果改了 App Privacy，确认是否需要重新提交审核。
- 如果扩展到全球上架，重新检查地区合规、内容分级、隐私和本地化。
- 后续项目不要等 Apple 退审后再补录屏和操作说明，提交前一次性准备齐。

## 结论

本次上线最终成功，但连续退审暴露了三个问题：

- 审核资料准备不足。
- 隐私表填写过度。
- 双设备核心路径没有按审核员视角完整验证。

后续项目必须在提交前按本文清单逐项确认。尤其是任何 App Store 页面、截图、描述或审核备注中出现的功能，都必须在真机上可直接访问、可完成、可解释。
