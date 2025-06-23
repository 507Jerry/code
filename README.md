# QR Code 生成器

一个功能完整的 React QR Code 生成器组件，支持多种内容类型、自定义样式、Logo 上传和拖拽等功能。

## ✨ 功能特性

### 📌 输入内容功能
- **URL / 网站链接** - 生成网站二维码
- **任意文本** - 生成文本内容二维码
- **电话号码** - 扫码直接拨号
- **短信** - 扫码预填短信内容
- **邮件** - 扫码预填邮箱地址
- **名片** - vCard 格式名片信息
- **Wi-Fi 登录** - 扫码自动连接 Wi-Fi

### 🎨 美化功能
- **颜色自定义** - 前景色和背景色选择器
- **Logo 上传** - 支持 PNG/JPEG 格式
- **Logo 拖拽** - 可拖拽调整 Logo 位置
- **Logo 设置** - 大小和透明度调节
- **尺寸选择** - 200px / 400px / 600px
- **实时预览** - 输入时自动刷新

### 📦 导出与交互功能
- **下载 PNG** - 一键下载高质量图片
- **复制剪贴板** - 复制二维码到剪贴板
- **拖拽保存** - 拖拽二维码保存到本地
- **直接打印** - 点击按钮打印二维码

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 📦 依赖说明

- **React** - 前端框架
- **qrcode.react** - QR Code 生成库
- **react-color** - 颜色选择器组件
- **html2canvas** - 图片生成和复制功能
- **Tailwind CSS** - 样式框架

## 🎯 使用方法

### 基本使用

```jsx
import QRCodeGenerator from './QRCodeGenerator';

function App() {
  return (
    <div>
      <QRCodeGenerator />
    </div>
  );
}
```

### 集成到现有项目

1. 复制 `QRCodeGenerator.jsx` 文件到你的项目
2. 安装必需的依赖：
   ```bash
   npm install qrcode.react react-color html2canvas
   ```
3. 确保项目已配置 Tailwind CSS
4. 在需要的地方导入并使用组件

## 🎨 自定义样式

组件使用 Tailwind CSS 进行样式设计，你可以通过修改 CSS 类来自定义外观：

```jsx
// 修改容器样式
<div className="custom-container">
  <QRCodeGenerator />
</div>
```

## 📱 响应式设计

组件完全响应式，支持：
- 桌面端：左右分栏布局
- 移动端：上下堆叠布局
- 平板端：自适应布局

## 🔧 技术实现

### 核心功能
- **QR Code 生成**：使用 `qrcode.react` 库
- **颜色选择**：集成 `react-color` 组件
- **图片处理**：使用 `html2canvas` 进行截图
- **拖拽功能**：原生 JavaScript 实现
- **文件上传**：HTML5 File API

### 状态管理
- 使用 React Hooks (`useState`, `useEffect`, `useRef`)
- 响应式状态更新
- 实时预览功能

## 🐛 常见问题

### Q: Logo 拖拽不工作？
A: 确保 Logo 已上传，并且浏览器支持拖拽功能。

### Q: 复制功能失败？
A: 检查浏览器是否支持 Clipboard API，某些浏览器可能需要 HTTPS 环境。

### Q: 打印功能异常？
A: 确保浏览器允许弹窗，某些浏览器可能会阻止打印窗口。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请提交 Issue 或联系开发者。 