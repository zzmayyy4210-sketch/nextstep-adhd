# 小步 · NextStep 🌱

把脑袋里的大任务，变成眼前的小动作。一个中文、手机优先、面向容易启动困难的人设计的任务助手。

## 已实现

- 输入任务，生成一组微步骤；一次只呈现当前动作。
- 低精力 / 普通精力模式；再拆小一点；卡住帮助；休息与恢复。
- 倒计时、撤回、完成反馈、历史任务和本机进度保存。
- 导出任务、清除本机记录；无账号、无追踪脚本。
- 手机布局、PWA 清单、离线基础模式。支持的安卓浏览器可添加到主屏幕；这不是 APK。
- 可选 OpenRouter 免费 AI 路由，密钥仅在服务器。未配置、限流、超时或格式错误时明确降级为基础规则。

## 立即本机运行

安装 Node.js 20 或更新版本后，在项目目录运行：

```sh
npm start
```

打开 `http://localhost:3000`。无需安装依赖、无需密钥，基础模式立即可用。同一 Wi-Fi 的手机可访问电脑局域网 IP 的 3000 端口（取决于本机防火墙）；手机远程使用需线上部署。

## 免费 AI

在 [OpenRouter](https://openrouter.ai/) 自行创建账户和 API key，将 `OPENROUTER_API_KEY` 设为服务器环境变量。项目只调用 `openrouter/free`，不自动切换收费模型。免费额度、模型可用性、地区和提供方条款由平台决定，并非无限免费。没有提供商账户和密钥时，无法声称 AI 已经接通。

Node 20.6+ 可复制 `.env.example` 为 `.env`，填入配置后运行 `node --env-file=.env server.mjs`。`npm start` 使用已注入的系统环境变量，不自动读取 `.env`。

可设置 `APP_ACCESS_CODE` 作为小范围试用邀请码。使用者在设置里输入；邀请码只保存在该浏览器会话。基础模式不需要邀请码。

## 部署与分享

### GitHub Pages（免费基础模式）

仓库设置 → Pages → Deploy from a branch → 选择 `main` 和 `/docs` → Save。仓库的 `docs/` 是 `public/` 的静态镜像。此模式没有服务器，因此只能进行基础规则拆分；AI 不会接通。项目路径和离线缓存均使用相对路径。

### Vercel（支持 AI）

将此 GitHub 仓库导入 Vercel，Framework Preset 选择 Other，保留项目根目录，不配置构建命令或输出目录覆盖。仓库 `vercel.json` 提供页面和 API 路由。部署后设置 `OPENROUTER_API_KEY`，重新部署即可启用。是否有免费托管额度以及使用资格，以托管商当前政策为准。

### 任何 Node.js 托管

运行 `npm start`，监听环境变量 `PORT`（默认 3000）。生产环境使用 HTTPS；PWA 离线功能要求 HTTPS 或 localhost。

## 数据与边界

任务保存在当前设备的 localStorage，最多保留最近30个任务；没有跨设备同步。用户点击拆分且服务器配置 AI 时，任务会发送给 OpenRouter 及其模型提供方，应在输入前了解其数据政策，避免敏感信息。基础模式不发送任务。工具用于组织日常任务，不提供医疗诊断或治疗。

服务端提供输入长度校验、超时、输出结构校验、可选邀请码和每 IP 每实例24小时20次的内存限流。无服务器多实例或重启会重置限额，不能视为严格全局每日额度；大规模公开前应接入持久化限流和身份认证。本地服务器不信任转发头，反向代理场景需要按可信代理配置用户 IP。Vercel 适配器使用平台注入的 `x-real-ip`。邀请制适合小范围测试，不等于完整账户系统。

## 检查

```sh
npm test
npm run check
```

静态镜像更新：将 `public/` 文件复制到 `docs/`。GitHub Actions 会检查两者一致并运行测试。

## 来源

- [OpenRouter 免费路由](https://openrouter.ai/openrouter/free)
- [OpenRouter 调用限制](https://openrouter.ai/docs/api_reference/limits)

代码以 MIT 许可证提供。
