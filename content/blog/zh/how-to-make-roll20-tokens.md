---
slug: "how-to-make-roll20-tokens"
title: "如何制作 Roll20 Token：尺寸、PNG 透明背景与 Default Token 完整指南"
description: "面向 Roll20 实战的 Token 制作教程：选图、裁切、圆形与方形、透明 padding、512/1024 像素导出、Default Token 保存，以及常见错误。"
excerpt: "想做真正适合 Roll20 的 Token？这篇文章把选图、裁切、PNG 导出、尺寸判断和 Default Token 设置一次讲清楚。"
author: "Token Maker 编辑组"
publishedAt: "2026-03-08"
updatedAt: "2026-03-22"
category: "Roll20 指南"
tags: ["roll20 token", "roll20 token maker", "png", "default token", "token 尺寸"]
featured: false
draft: false
cover: "/blog/covers/zh/how-to-make-roll20-tokens.svg"
coverAlt: "如何制作 Roll20 Token 封面"
seoTitle: "如何制作 Roll20 Token：尺寸、PNG、透明背景与默认 Token 设置"
seoDescription: "学习如何制作真正适合 Roll20 的 Token，包括选图、裁切、圆形与方形、PNG 透明背景、512/1024 像素导出和 Default Token 设置。"
relatedPostSlugs: ["how-to-make-vtt-tokens", "token-size-and-resolution", "how-to-make-foundry-vtt-tokens"]
relatedTemplateSlugs: ["circle-token-maker", "square-token-maker", "monster-token-maker"]
ctaQuery: "/zh?mask=circle&preset=rogue#editor-workspace"
---
如果你搜索的是“**how to make Roll20 tokens**”“**Roll20 token size**”“**Roll20 token maker**”或者“**Roll20 default token**”，真正要解决的通常不是“怎么给头像套一圈边框”，而是下面这 4 件更实际的事：

1. 缩小到 Roll20 战斗地图里以后还能不能一眼认出来
2. 放进网格后会不会被拉伸、边缘发脏，或者背景把主体吃掉
3. 应该导出 `PNG` 还是 `JPG`，尺寸做 `512` 还是 `1024`
4. 上传到 Roll20 之后，怎样保存成真正可复用的 Default Token

这篇文章按 Roll20 的实际工作流来写，结合官方帮助中心、官方教程视频和公开的无水印高清图片，给你一套能直接上桌的 **Roll20 Token 制作流程**。如果你想边看边做，也可以先打开 [Token Maker 首页编辑器](/zh)，一边对照本文一边裁切、加边框和导出。若你想先看跨平台通用基线，也可以先读[如何制作 VTT Token](/zh/blog/how-to-make-vtt-tokens)，再回来看这篇 Roll20 专用指南。

## 先看两段最值得配合本文的高清视频

如果你更习惯先看一遍流程，再回头按文字逐步做，下面两段视频最值得一起看。一段解决“Token 本身怎么做”，另一段解决“做完以后怎么在 Roll20 里设成默认”。

<a
  class="blog-video-card"
  href="https://www.youtube.com/watch?v=NKQ7RatL89w"
  target="_blank"
  rel="noreferrer"
>
  <picture>
    <img src="/blog/inline/zh/roll20-video-cover-token-guide.jpg" alt="How To Create Amazing VTT Character Tokens 视频封面" loading="lazy" />
  </picture>
  <span class="blog-video-card__veil" aria-hidden="true"></span>
  <span class="blog-video-card__badge">Video Guide</span>
  <span class="blog-video-card__play" aria-hidden="true">▶</span>
  <span class="blog-video-card__content">
    <strong>How To Create Amazing VTT Character Tokens</strong>
    <em>适合先建立对裁切、边框和成品方向的直觉</em>
  </span>
</a>

<a
  class="blog-video-card"
  href="https://www.youtube.com/watch?v=c-JmxkjLnDU"
  target="_blank"
  rel="noreferrer"
>
  <picture>
    <img src="/blog/inline/zh/roll20-video-cover-setup.jpg" alt="Connecting Tokens to Character Sheets | Roll20 Tutorial 视频封面" loading="lazy" />
  </picture>
  <span class="blog-video-card__veil" aria-hidden="true"></span>
  <span class="blog-video-card__badge">Roll20 Tutorial</span>
  <span class="blog-video-card__play" aria-hidden="true">▶</span>
  <span class="blog-video-card__content">
    <strong>Connecting Tokens to Character Sheets</strong>
    <em>适合配合本文最后的 Default Token 设置步骤一起操作</em>
  </span>
</a>

- 通用 Token 制作流程：[How To Create Amazing VTT Character Tokens](https://www.youtube.com/watch?v=NKQ7RatL89w)
- Roll20 默认 Token 设置：[Connecting Tokens to Character Sheets | Roll20 Tutorial](https://www.youtube.com/watch?v=c-JmxkjLnDU)

## Roll20 真正关心的，不是“华丽”，而是“识别和对齐”

截至 **2026 年 3 月**，Roll20 官方帮助中心关于 Token 的建议，核心都集中在几件事上：

- 在 [Best Practices for Files on Roll20](https://help.roll20.net/hc/en-us/articles/360037256634-Best-Practices-for-Files-on-Roll20) 里，Roll20 明确提到 **token images are best suited to PNGs**，而且如果 Token 要对齐网格，文件里需要有足够的透明 padding。
- 在同一篇文档和 [Roll20 FAQ: Image Dimensions](https://help.roll20.net/hc/en-us/articles/227259903-Roll20-FAQ-Image-Dimensions) 里，官方还强调默认地图格子是 `70px x 70px`，并提醒大文件会影响加载与拖拽体验。
- 在 [How to Create a Character](https://help.roll20.net/hc/en-us/articles/360046574454-How-to-Create-a-Character) 和 [Linking Tokens to Journals](https://help.roll20.net/hc/en-us/articles/360039715593-Linking-Tokens-to-Journals) 里，官方说明了如何把图片保存为 Default Token，以及为什么尺寸不对的 Token 要先拖到地图上改好再保存。
- 在 [Token Features](https://help.roll20.net/hc/en-us/articles/360039674573-Token-Features) 里，官方继续补充了 `Represents Character`、Bars、Vision 和默认值同步的逻辑。

这意味着一个真正适合 Roll20 的 Token，优先级应该是：

- 缩小后仍然清楚
- 放进格子后不变形
- 透明边缘足够干净
- 文件不要无脑做大
- 设置完成后能稳定复用

## 第 1 步：先选“缩小后仍然认得出”的源图

很多 Roll20 Token 从第一步就选错了图。你需要的不是最完整的插画，而是最适合缩小阅读的源图。

![来自 Wikimedia Commons 的《Portrait of a Knight》。这类主体清楚、背景克制、脸部和武器轮廓都足够明确的半身像，非常适合做 Roll20 玩家角色或 NPC 的 Token 源图。](/blog/inline/zh/roll20-token-source-portrait.jpg)

上图来自 [Wikimedia Commons 的 Portrait of a Knight](https://commons.wikimedia.org/wiki/File:Portrait_of_a_Knight_A28042.jpg)。它之所以适合做 Roll20 Token，不是因为“画风高级”，而是因为主体占比高、脸部清晰、轮廓稳定，缩小之后依然有可读性。

优先选择这样的图：

- 脸部、头盔、角、耳朵、发型这类识别特征明显
- 背景不抢戏
- 主体和背景有足够明暗对比
- 缩小后第一眼看到的仍然是“角色是谁”，而不是“背景讲了什么故事”

尽量避开这样的图：

- 角色离画面太远
- 背景叙事特别多
- 逆光严重，缩小后只剩一团深色
- 重要特征刚好贴在边缘，后续裁切很容易丢掉

如果你现在就想快速做一张角色头像 Token，通常从[圆形 Token 制作器](/zh/templates/circle-token-maker)起步最快；如果你需要保留更多武器、肩线和轮廓，再考虑[方形 Token 制作器](/zh/templates/square-token-maker)。

## 第 2 步：裁切要比你想象得更近

这是 Roll20 Token 最容易被低估的一步。很多图在编辑器里看着“已经挺近了”，放进 Roll20 地图里却还是显得小。

![来自 Wikimedia Commons 的《The Knight and Man-at-arms》。这类构图完整、背景丰富、同时存在多个视觉重点的作品，在大图里很好看，但如果直接拿来做 Token，识别速度通常不如近裁后的版本。](/blog/inline/zh/roll20-token-busy-composition.jpg)

这张图来自 [Wikimedia Commons 的 The Knight and Man-at-arms](https://commons.wikimedia.org/wiki/File:The_Knight_and_Man-at-arms_MET_MM4991.jpg)。它很好地说明了一个常见误区：你喜欢的是整张画，但 Roll20 需要的是一枚缩小后仍然像“地图单位”的图标。

更适合 Roll20 的裁切，通常会做到下面 3 件事：

1. 让脸部或头部特征成为第一视觉焦点
2. 删除对识别没有帮助的背景
3. 保住最关键的轮廓，比如帽檐、头盔、角、下颚线或武器外形

一个非常实用的自检方法是：把图片缩到你平时地图里一格左右的视觉大小。如果你第一眼看到的还是“背景”“披风”“第二个角色”，而不是“这是谁”，就说明还应该再裁近一点。

## 第 3 步：圆形、方形和边框怎么选

很多人把这一步当成审美问题，但对 Roll20 来说，它更像识别系统设计。

- **圆形 Token**：最适合玩家角色、常驻 NPC、头像型单位
- **方形 Token**：更适合需要保留肩线、武器、翼展或怪物体积感的单位
- **边框**：主要用来做阵营和角色类型的快速分类，而不是装饰

更稳妥的边框规则通常是：

- 玩家角色：更亮、更干净的细环
- 友军 NPC：更轻的中性色边框
- 常规敌人：更深、更克制的边框
- Boss：只在少量关键单位上提高对比

如果你批量做遭遇怪物，直接从[怪物 Token 制作器](/zh/templates/monster-token-maker)进入通常更省时间，因为你真正要统一的是“识别逻辑”，不是每张图都单独追求风格。

## 第 4 步：Roll20 最关键的导出设置

Roll20 官方文档对图片格式的态度其实很明确：普通静态图如果不需要透明，`JPG` 往往更轻；但 **Token 图片最适合 `PNG`**，因为它们通常需要透明背景和更干净的边缘。

如果你只想先做一套稳妥、能长期复用的 Roll20 Token，可以直接用下面这组导出规则：

```text
玩家角色 / NPC
- 512 x 512 PNG
- 透明背景
- 轻边框
- 四周预留 8% 到 12% 的透明 padding

常规怪物
- 512 x 512 PNG
- 优先保留头部和整体轮廓
- 边框比玩家更克制或更深
- 如果单位不是 1x1，占格比例要和最终宽高比例一致

Boss / 长期素材库
- 1024 x 1024 PNG
- 只在你明确需要更高放大余量时再用 1024
```

这里最重要的不是“1024 一定更高级”，而是下面这两个判断：

- Roll20 的默认网格格子是 `70px x 70px`，但这只是平台显示逻辑，不等于你应该把所有素材都导成 `70px`
- 如果单张 Token 文件做得太大，尤其超过约 `1MB` 还没有明显收益，地图中的加载、缩放和拖拽会变得更笨重

换句话说，大多数 `1x1` 的玩家角色、NPC 和常规怪物，`512 x 512 PNG` 已经足够。只有 Boss、经常需要放大展示的资产，或者你在做长期精品素材库时，`1024` 才更值得。

如果你想把 `512`、`1024` 和更高尺寸的取舍看得更细，可以继续读这篇[VTT Token 尺寸怎么选](/zh/blog/token-size-and-resolution)。

## 第 5 步：上传到 Roll20 后，一定要保存成真正可复用的 Default Token

很多教程只教你“怎么做图”，却没有把最后这一步讲透。结果就是图做得不错，但每次拖角色出来都还要重新调尺寸、重新绑 bars、重新设代表角色。

按 Roll20 官方文档，更稳妥的做法是：

1. 先创建或打开你的角色卡
2. 上传 Token 图片，或者从 Art Library 拖入角色编辑界面的 Token 区域
3. 如果这是 `1x1` 角色头像型 Token，可以直接保存
4. 如果这张 Token 实际应该占 `2x2`、`3x3` 或其他更大尺寸，先把它拖到地图上调好大小，再点 `Use Selected Token`
5. 在 Token 设置里补全 `Represents Character`、Bars、Vision 等需要长期复用的项
6. 保存后再从 Journal 或角色卡里重新拖一次，确认默认值已经生效

最容易踩的坑有两个：

- 只在地图上的那个实例里改好了设置，却没有重新保存 Default Token
- 大尺寸怪物直接在角色编辑区保存，结果系统按 `1x1` 记住了默认值

如果你后面改了 bars、vision 或其他 token defaults，别忘了用 [Token Features](https://help.roll20.net/hc/en-us/articles/360039674573-Token-Features) 里提到的默认值同步逻辑，把修改真正写回角色的默认 Token。

## 第 6 步：怪物 Token 比角色 Token 更依赖轮廓

玩家角色通常靠脸和配色识别，怪物更常靠外轮廓识别。对 Roll20 来说，这一点特别重要，因为拥挤战斗里你留给玩家辨认怪物的时间很短。

![来自 Wikimedia Commons 的 Dragon-149393。Roll20 怪物 Token 在缩小状态下，更依赖头部、翅膀、角和整体轮廓，而不是细碎纹理。](/blog/inline/zh/roll20-token-monster-silhouette.png)

上图来自 [Wikimedia Commons 的 Dragon-149393](https://commons.wikimedia.org/wiki/File:Dragon-149393.svg)。它提醒你：怪物 Token 的关键不是“表面细节多不多”，而是轮廓够不够强。

做怪物 Token 时，优先保住这些信息：

- 头部形状
- 角、耳朵、喙、下颚线
- 翅膀、披风、触手这类大轮廓
- 能在深色地图和浅色地图里都站得住的明暗关系

这也是为什么很多怪物 Token 不需要很厚的边框。对怪物来说，真正承担识别功能的，经常是主体自己的外形。

## Roll20 Token 最常见的 7 个错误

- 选图太远，缩小后根本认不出是谁
- 舍不得裁背景，结果主体在格子里太小
- 把圆形和方形当纯审美选择，没有考虑地图阅读方式
- 以为像素越大越好，把所有 Token 都导成超大文件
- 忘了留透明 padding，丢进网格后边缘显得挤或被错误拉伸
- 只在地图实例里改参数，没有重新保存 Default Token
- 把 `1x1`、`2x2` 这样的占格概念和 `512`、`1024` 这样的图片像素概念混为一谈

## 常见问题

### Roll20 Token 用 PNG 还是 JPG？

如果是 Token，优先 `PNG`。这是 Roll20 官方文档明确区分出来的例外场景，因为 Token 通常需要透明背景和更干净的边缘。如果是不需要透明的普通 handout 图或背景图，`JPG` 往往更省体积。

### Roll20 Token 做 512 还是 1024？

大多数 `1x1` 角色、NPC 和常规怪物，`512 x 512` 已经足够。`1024` 更适合 Boss、长期复用的精品资产，或者你明确知道后续还会放大展示的素材。

### Roll20 Token 应该做圆形还是方形？

玩家角色和常驻 NPC 通常优先圆形。需要保留更多武器、肩线、翅膀或怪物轮廓时，方形更合适。实战里最重要的不是“哪种更酷”，而是哪种在地图上更快读懂。

## 最后，用这份检查清单做交付前自检

在你把一批 Token 真正扔进 Roll20 之前，至少检查一次下面这 6 项：

1. 缩小到地图视角后，玩家是否还能一眼认出主体
2. 深色地图和浅色地图里都是否有足够对比
3. 文件是否为透明 `PNG`
4. 四周是否留了足够透明 padding
5. 图片宽高比例和单位占格比例是否一致
6. Default Token、Bars、Vision 和代表角色是否真的保存成功

如果这 6 项都通过，你做出来的就不是“看起来像 Token 的图片”，而是一枚真正适合 Roll20 实战的 Token。

想直接上手的话，最省时间的做法通常是先回到 [Token Maker 首页](/zh) 打开编辑器，再用[圆形 Token 制作器](/zh/templates/circle-token-maker)做一个玩家角色，用[怪物 Token 制作器](/zh/templates/monster-token-maker)做一个敌对怪物，最后把两张图都丢进真实地图里比较。

## 参考资料与素材来源

- Roll20 官方文档：[Best Practices for Files on Roll20](https://help.roll20.net/hc/en-us/articles/360037256634-Best-Practices-for-Files-on-Roll20)
- Roll20 官方文档：[Roll20 FAQ: Image Dimensions](https://help.roll20.net/hc/en-us/articles/227259903-Roll20-FAQ-Image-Dimensions)
- Roll20 官方文档：[How to Create a Character](https://help.roll20.net/hc/en-us/articles/360046574454-How-to-Create-a-Character)
- Roll20 官方文档：[Linking Tokens to Journals](https://help.roll20.net/hc/en-us/articles/360039715593-Linking-Tokens-to-Journals)
- Roll20 官方文档：[Token Features](https://help.roll20.net/hc/en-us/articles/360039674573-Token-Features)
- 视频：[How To Create Amazing VTT Character Tokens](https://www.youtube.com/watch?v=NKQ7RatL89w)
- 视频：[Connecting Tokens to Character Sheets | Roll20 Tutorial](https://www.youtube.com/watch?v=c-JmxkjLnDU)
- 图片来源：[Portrait of a Knight](https://commons.wikimedia.org/wiki/File:Portrait_of_a_Knight_A28042.jpg)
- 图片来源：[The Knight and Man-at-arms](https://commons.wikimedia.org/wiki/File:The_Knight_and_Man-at-arms_MET_MM4991.jpg)
- 图片来源：[Dragon-149393](https://commons.wikimedia.org/wiki/File:Dragon-149393.svg)
