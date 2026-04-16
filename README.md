# 赛博先贤祠 | Cyber Pantheon

<p align="center">
  <em>纵死侠骨香，不惭世上英。</em>
</p>

<p align="center">
  一座数字时代的精神殿堂 —— 以壮志诗词为纽带，汇聚古今中外的英雄与思想家。
</p>

---

## ✨ 特性

- 🏛️ **沉浸式开场** — 粒子动画 + 《侠客行》逐行浮现
- 📜 **先贤卡片** — 29 组人物，从战国到当代，涵盖中外英雄与思想家
- 🗺️ **时代筛选** — 按朝代/时代快速定位感兴趣的先贤
- ✨ **壮志诗墙** — 三首代表性壮志诗的全文沉浸展示
- 📂 **JSON 驱动** — 修改 `data/figures.json` 即可生成你自己的先贤祠
- 🌓 **东方赛博朋克** — 深墨 × 金 × 赛博青的独特视觉风格
- 📱 **响应式** — 完美适配桌面与移动端

## 🚀 快速开始

### 在线体验

部署到 GitHub Pages 后访问即可。

### 本地运行

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/cyber-pantheon.git
cd cyber-pantheon

# 本地启动（需要一个静态服务器，因为涉及 fetch JSON）
npx serve .
# 或者
python -m http.server 8000
```

## 🍴 创建你自己的先贤祠

1. **Fork** 本项目
2. 编辑 `data/figures.json`，替换为你崇拜的人物
3. 编辑 `data/poetry.json`，选择你的代表诗词
4. 推送到你的 GitHub，启用 GitHub Pages
5. 你的个人精神殿堂就上线了！

### 数据格式

**figures.json** 中每组数据结构：

```json
{
  "id": 1,
  "group": "组名",
  "era": "时代",
  "year": "年代范围",
  "figures": [
    {
      "name": "姓名",
      "fullName": "全名",
      "born": "出生年",
      "died": "卒年",
      "title": "一句话头衔",
      "desc": "功绩描述",
      "quote": "代表性名言"
    }
  ]
}
```

## 🏗️ 技术栈

- **纯前端**：HTML + CSS + Vanilla JS，零框架零依赖
- **粒子系统**：原生 Canvas 2D
- **动画**：CSS Transitions + Intersection Observer
- **字体**：Google Fonts（Noto Serif SC + Noto Sans SC）
- **部署**：GitHub Pages（零成本）

## 📁 项目结构

```
cyber-pantheon/
├── index.html          # 单页入口
├── css/
│   └── style.css       # 设计系统 + 全部样式
├── js/
│   ├── particles.js    # Canvas 粒子动画
│   └── main.js         # 数据渲染 + 交互逻辑
├── data/
│   ├── figures.json    # 先贤人物数据（可自定义）
│   └── poetry.json     # 壮志诗词数据（可自定义）
└── README.md
```

## 📜 收录诗词

| 诗名 | 作者 | 朝代 | 名句 |
|------|------|------|------|
| 《侠客行》 | 李白 | 唐 | 纵死侠骨香，不惭世上英 |
| 《永遇乐·京口北固亭怀古》 | 辛弃疾 | 宋 | 想当年，金戈铁马，气吞万里如虎 |
| 《石灰吟》 | 于谦 | 明 | 粉骨碎身浑不怕，要留清白在人间 |

## ⚠️ 声明

本项目为**个人精神殿堂**，人物选择反映作者个人价值观与审美偏好，不代表任何学术立场或政治主张。

欢迎 Fork 并创建属于你自己的版本。

## 📄 License

MIT License
