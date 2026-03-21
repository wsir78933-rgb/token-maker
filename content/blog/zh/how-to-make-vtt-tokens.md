---
slug: "how-to-make-vtt-tokens"
title: "如何制作 VTT Token：尺寸、透明背景、Roll20 与 Foundry VTT 实战指南"
description: "想做真正适合 DnD、Roll20 和 Foundry VTT 的 Token？这篇实战指南覆盖选图、裁切、圆形与方形、透明背景、PNG/WebP、尺寸选择，以及平台导入设置。"
excerpt: "从选图到导入，这篇文章帮你做出真正适合 Roll20、Foundry VTT 和 DnD 地图实战的 VTT Token。"
author: "Token Maker 编辑组"
publishedAt: "2026-03-12"
updatedAt: "2026-03-21"
category: "制作流程"
tags: ["vtt token", "roll20", "foundry vtt", "png", "token 尺寸"]
featured: true
draft: false
cover: "/blog/covers/zh/how-to-make-vtt-tokens.svg"
coverAlt: "如何制作 VTT Token 封面"
seoTitle: "如何制作 VTT Token：尺寸、透明背景、Roll20 与 Foundry VTT 指南"
seoDescription: "学习如何制作真正适合 Roll20、Foundry VTT 和 DnD 的 VTT Token，包括选图、裁切、圆形与方形、透明背景、PNG/WebP、尺寸和导入流程。"
relatedPostSlugs: ["how-to-make-foundry-vtt-tokens", "how-to-make-roll20-tokens", "token-size-and-resolution"]
relatedTemplateSlugs: ["circle-token-maker", "square-token-maker", "transparent-token-maker"]
ctaQuery: "/zh?mask=circle&preset=classic#editor-workspace"
---
如果你搜索的是“**VTT Token 怎么做**”“**Roll20 Token 尺寸**”“**Foundry VTT Token 用 PNG 还是 WebP**”，你真正要解决的通常不是“怎么做一张好看的头像”，而是下面这些更实际的问题：

1. 缩小到地图视角后还能不能一眼认出来
2. 放进复杂地图后会不会被背景吃掉
3. 应该用圆形、方形，还是干净透明主体
4. 应该导出 `PNG`、`WebP`，还是两者都保留
5. 尺寸应该做 `512`、`1024`，还是更大
6. 导入 Roll20 或 Foundry VTT 之后会不会变形、丢设置、难批量管理

这篇文章按这 6 个问题来写，重点是给你一套真正能落地、能复用、也对 SEO 搜索意图更完整的 **VTT Token 制作工作流**。如果你已经明确目标平台，也可以继续看更具体的[Roll20 Token 指南](/zh/blog/how-to-make-roll20-tokens)、[Foundry VTT Token 指南](/zh/blog/how-to-make-foundry-vtt-tokens)和[VTT Token 尺寸怎么选](/zh/blog/token-size-and-resolution)。

## VTT Token 是什么

VTT Token 本质上就是虚拟桌面里的“地图单位图标”。它不只是一个头像，而是一个要在真实战斗场景中承担识别、分类、定位和状态传达的资产。

一个真正好用的 VTT Token，至少要同时满足 4 个条件：

- 缩小后仍然清楚
- 在深浅不同的地图上都能站住
- 导入平台后不变形、不丢关键设置
- 可以被你长期复用，而不是每次重新做

很多文章只讲“怎么加边框”“怎么做得更华丽”，但真正影响上桌体验的，往往是裁切、透明边缘、尺寸判断和平台导入方式。

![VTT Token 制作流程图：先确定平台和用途，再选图、裁切、选择形状与边框、决定尺寸和格式，最后导入 Roll20 或 Foundry VTT。](/blog/inline/zh/vtt-token-workflow-overview.svg)

## 对照视频（YouTube）

如果你更习惯先看一遍视频，再回头按文字步骤做，下面这组内容最值得配合本文一起看。为了避免 YouTube 嵌入播放器触发验证，这里改成 **高清封面卡片 + 新标签打开原视频**。

<a
  class="blog-video-card"
  href="https://www.youtube.com/watch?v=NKQ7RatL89w"
  target="_blank"
  rel="noreferrer"
>
  <picture>
    <source srcset="https://i.ytimg.com/vi_webp/NKQ7RatL89w/maxresdefault.webp" type="image/webp" />
    <img src="https://i.ytimg.com/vi/NKQ7RatL89w/maxresdefault.jpg" alt="How To Create Amazing VTT Character Tokens 高清封面" loading="lazy" />
  </picture>
  <span class="blog-video-card__veil" aria-hidden="true"></span>
  <span class="blog-video-card__badge">YouTube</span>
  <span class="blog-video-card__play" aria-hidden="true">▶</span>
  <span class="blog-video-card__content">
    <strong>How To Create Amazing VTT Character Tokens</strong>
    <em>点击在新标签打开高清视频</em>
  </span>
</a>

- 通用构图和成品方向：[How To Create Amazing VTT Character Tokens](https://www.youtube.com/watch?v=NKQ7RatL89w)
- Roll20 默认 Token 设置：[Connecting Tokens to Character Sheets | Roll20 Tutorial](https://www.youtube.com/watch?v=c-JmxkjLnDU)
- Foundry 动态环进阶：[Dynamic Token Rings in Foundry VTT - Full Guide to Setup, Editing, and Creation](https://www.youtube.com/watch?v=C94zc9daCzg)

## 一套真正能落地的 VTT Token 制作流程

你可以把下面这套流程理解成一个最小闭环：先做对路线判断，再做对裁切、边框、尺寸、格式，最后把默认设置保存到目标平台里。只要这个闭环是稳定的，你后面无论扩成玩家角色库、NPC 素材库还是怪物遭遇包，都会轻松很多。

## 第 1 步：先决定这张 Token 是“跨平台资产”还是“平台专用资产”

这是最容易被忽略，但最影响后续决策的一步。

如果你希望同一套图以后还能给 Roll20、Foundry VTT、Owlbear 或别的桌面复用，优先做 **跨平台资产**：

- 静态边框或非常轻的边缘处理
- 透明背景
- 保留可继续编辑的 `PNG` 母版
- 避免依赖某个平台独有的表现特性

如果你主要就在 Foundry VTT v13 内使用，优先做 **平台专用资产**：

- 主体尽量干净
- 外圈和状态感尽量交给 Dynamic Token Ring
- 最终交付文件可以考虑 `WebP`

根据 Foundry 官方的 [Dynamic Token Rings 文档](https://foundryvtt.com/article/dynamic-token-rings/)，动态环工作流里更推荐把 ring 和背景从最终主体图里拆出去，而不是把所有装饰都烘焙进一张图里。

如果你现在只是想先做出一张稳妥可用的角色 Token，最适合先从[圆形 Token 制作器](/zh/templates/circle-token-maker)开始；如果你更希望保留更多边缘信息，再考虑[方形 Token 制作器](/zh/templates/square-token-maker)。

## 第 2 步：选图时优先“缩小后还能认出来”

很多 Token 从源头就选错了图。

真正适合 VTT 的原图，通常具备这些特征：

- 脸部或主体轮廓明确
- 明暗关系稳定，不是一片灰
- 背景不会抢过主体
- 戴帽子、角、头盔、耳朵这类辨识特征足够清楚

尽量避开这些图：

- 角色离镜头太远
- 背景叙事比人物更复杂
- 逆光严重，缩小后只剩一团黑
- 关键特征刚好贴着画面边缘

一句话判断：**Token 不是海报，它首先是识别工具。**

## 第 3 步：裁切时优先脸和轮廓，不要舍不得背景

好用的 Token 几乎都比你主观感觉“更近一点”。

一个更适合实战的裁切，通常会做到下面 3 件事：

1. 让眼睛、面部或主体焦点略高于中心，而不是压在几何中心
2. 删除对识别没有帮助的背景
3. 保住最重要的轮廓，比如角、帽檐、头盔、下颚线、武器外形

如果你把图缩到地图里一格左右的视觉尺寸后，第一眼看到的还是“背景”“肩甲”“披风”，而不是“这是谁”，说明你还应该再裁近一点。

如果你更在意透明边缘和主体本身，而不是厚重边框，[透明背景 Token 制作器](/zh/templates/transparent-token-maker)通常会比继续堆装饰更有效。

## 第 4 步：圆形、方形和透明主体怎么选

不同形状不只是审美差异，它直接影响地图上的阅读方式。

- **圆形 Token**：最适合玩家角色、NPC 头像和典型 portrait token
- **方形 Token**：更适合保留肩线、武器、怪物轮廓和贴近格子的阅读方式
- **透明主体**：适合需要更自然融入地图，或者准备交给 Foundry Dynamic Token Ring 处理外圈的素材

如果你还拿不准，先从圆形开始通常最稳；如果你在做大批量怪物或遭遇包，直接从[怪物 Token 制作器](/zh/templates/monster-token-maker)进入会更高效。

## 第 5 步：边框不是装饰，而是分类系统

边框最有价值的作用，不是“让图更华丽”，而是让你在复杂地图里更快分辨：

- 玩家角色
- 友军 NPC
- 普通敌人
- 精英或 Boss

所以更好的问题不是“要不要边框”，而是“这圈边框有没有在帮我读图”。

更稳妥的边框规则通常是：

- 玩家角色：更亮、更干净的细环
- 普通 NPC：更轻的中性色
- 常规敌人：更深、更克制的边缘
- Boss：只在少量关键单位上提高对比

如果你使用 Foundry Dynamic Token Ring，Foundry 官方文档明确建议主体图按“**中心 `2/3` 给角色，外围 `1/3` 留给 ring**”来理解构图，并在导出主体图时隐藏 ring 和背景层。这样做的好处是后续状态环、视觉强调和世界内统一规则都更容易维护。

真正容易出问题的做法，是图片里已经做了一圈很重的金属框，进 Foundry 以后又再叠一层动态环。这样几乎一定会让 Token 变脏。

## 第 6 步：VTT Token 尺寸怎么选

先把两个概念分开：

- `512 x 512`、`1024 x 1024` 说的是图片像素尺寸
- `1 x 1`、`2 x 2`、`3 x 3` 说的是它在地图里占几格

这两者不是同一件事。

根据 Foundry 官方 [Dynamic Token Rings](https://foundryvtt.com/article/dynamic-token-rings/) 文档，单格主体图通常建议从 `512px` 起步；Large 常见到 `1024px`；更大的 Gargantuan 才更容易用到 `2048px`。对大多数玩家角色、NPC 和常规怪物来说，这个思路同样适用。

你可以直接按下面这套规则选：

- **`512`**：大多数日常实战 Token，尤其是 1x1 角色、NPC、普通怪
- **`1024`**：长期复用的主角、Boss、精品怪物、经常会放大的资产
- **`2048`**：高价值商用素材、超大体型单位、你明确知道自己需要高分辨率归档时再用

不要把每一张 Token 都无脑导出最大尺寸。大多数时候，**裁切、透明边缘和对比度**带来的提升，比继续堆像素更明显。

如果你想把 `512`、`1024` 和 `2048` 的选择规则看得更细，可以继续看这篇[VTT Token 尺寸怎么选](/zh/blog/token-size-and-resolution)。

## 第 7 步：PNG 还是 WebP？

这是 VTT Token 搜索里最常见的问题之一。更实用的答案不是二选一，而是分角色看：

- **PNG 母版**：最适合制作阶段、透明边缘修整、跨平台复用和后续继续编辑
- **PNG 交付**：最稳，兼容性高，尤其适合 Roll20 和一般跨平台工作流
- **WebP 交付**：更适合主要在 Foundry VTT 内使用、又希望文件体积更轻的素材
- **JPG**：不适合透明 Token，只适合没有透明背景需求的普通图片

Foundry 官方文档明确写到，动态主体图可以保存为 `.webp` 或 `.png`，并指出 `webp` 在约 `80%` 有损质量时，通常能拿到更好的画质和体积平衡。

Roll20 这边的答案更保守。Roll20 在 2025 年 4 月更新的 [Best Practices for Files on Roll20](https://help.roll20.net/hc/en-us/articles/360037256634-Best-Practices-for-Files-on-Roll20) 中明确提到：

- Token 图由于尺寸小，通常最适合 `PNG`
- 如果要落在网格上，图片需要足够的透明 padding
- 如果图片宽高比例和占格比例不匹配，丢到网格上时可能被拉伸

所以最稳的做法通常是：

1. 先导出一份透明 `PNG` 作为母版
2. 要跨平台就直接用 `PNG`
3. 只在 Foundry VTT 内长期使用时，再额外导出 `WebP`

## 第 8 步：怎么把 Token 正确放进 Roll20 和 Foundry VTT

很多文章讲完“做图”就结束了，但真正的踩坑点其实在导入。

### Roll20 的正确落地方式

根据 Roll20 帮助中心在 2025 年 8 月更新的 [Linking Tokens to Journals](https://help.roll20.net/hc/en-us/articles/360039715593-Linking-Tokens-to-Journals)：

- 你可以直接在角色编辑窗口里设置 Default Token
- 拖进 Default Token 区域的资产会**自动按 `1x1` 处理**
- 如果这张 Token 实际应该更大，必须先拖到地图上调好尺寸，再点 `Use Selected Token`
- 如果你只在地图上的实例里改设置，而没有重新保存 Default Token，这些改动不会自动同步

如果你要把角色条、护甲、移动等信息绑定到 Token 上，Roll20 官方也给了非常明确的顺序：先建 Journal，再在 Token 工具里选择 `Represents Character`，再绑定 Bar，最后 `Use Selected Token` 保存。

### Foundry VTT 的正确落地方式

根据 Foundry 官方 [Tokens 文档](https://foundryvtt.com/article/tokens/)：

- 真正决定以后默认表现的是 **Prototype Token**
- 放到场景里的只是 **Placed Token**
- 头像式 portrait token 通常更适合开启 `Lock Rotation`
- `Link Actor Data` 更适合唯一角色，不适合大量泛用怪物

如果你想做一整个怪物库，Foundry 原生的 wildcard 图片模式也很实用。官方文档支持把图片路径配置成类似下面的形式，让同一类怪物随机换立绘：

```text
/your/path/here/Goblin*
```

如果你主要在 Foundry 工作，完整的动态环、主体尺寸、Prototype Token 和批量怪物工作流可以继续看[如何制作 Foundry VTT Token](/zh/blog/how-to-make-foundry-vtt-tokens)。

## VTT Token 最常见的 6 个错误

- 只追求“全图完整”，结果缩小以后认不出是谁
- 边框太厚、特效太重，抢走主体注意力
- 把像素尺寸和地图占格混为一谈
- 每张图都导出成最大尺寸，结果素材库臃肿
- Roll20 的 grid token 没补透明 padding，放上去被拉伸
- 只改了场景里的 Token，没有更新 Roll20 Default Token 或 Foundry Prototype Token

如果你现在这篇文章只想记住一条原则，那就是：**优先做一个缩小后仍然清楚、导入后仍然稳定的 Token，而不是只在大图预览里好看。**

## 常见问题

### VTT Token 用圆形还是方形？

玩家角色和 NPC 头像通常优先用圆形；需要保留更多肩线、武器和怪物轮廓时，方形更合适。如果你准备把外圈交给 Foundry Dynamic Token Ring，干净透明主体会更灵活。

### VTT Token 用 PNG 还是 WebP？

跨平台复用和母版归档优先 `PNG`。如果你主要在 Foundry VTT 内使用，并且想减小文件体积，可以再导出一份 `WebP` 交付版本。

### VTT Token 做 `512` 还是 `1024`？

大多数日常实战素材先从 `512` 开始。只有长期复用的主角、Boss、精品怪物或更大的资产库，才更值得升到 `1024`。`2048` 不应该是默认值。

### Roll20 和 Foundry VTT 的 Token 可以共用吗？

可以，但前提是你把它当作“跨平台资产”来做：透明背景、适度边框、不要依赖 Foundry 专属动态环、保留 `PNG` 母版。这样一套素材更容易在两个平台之间切换。

### 为什么我的 Token 放进 Roll20 后比例怪怪的？

通常是透明 padding 不够，或者图片最终宽高比例和它应该占用的格子比例不一致。Roll20 官方最佳实践明确提醒，落到 gridded tabletop 的 token 需要先把最终尺寸和 padding 做对，否则会被网格矫正到不自然的比例。

### 为什么我的 Token 看起来不糊，但一上桌就不好认？

这通常不是分辨率问题，而是裁切、明暗对比和边框策略出了问题。比起继续加像素，更值得先检查主体是不是足够大、背景是不是够克制、轮廓是不是足够明确。

## 下一步怎么做最快

如果你现在就要开始动手，最直接的路径是：

1. 先打开这篇文章对应的[编辑器预设](/zh?mask=circle&preset=classic#editor-workspace)
2. 做一张玩家角色 Token 和一张怪物 Token
3. 分别放进深色和浅色地图测试一次
4. 再决定它应该走 `PNG` 跨平台路线，还是 Foundry 的动态环路线

这样你得到的就不只是一张“看起来不错”的头像，而是一套真正能用于 Roll20、Foundry VTT 和 DnD 地图实战的 VTT Token 工作流。
