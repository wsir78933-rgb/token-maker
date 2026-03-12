---
slug: "how-to-make-vtt-tokens"
title: "如何制作真正适合实战的 VTT Token"
description: "一套更贴近实战的 Token 制作流程，重点是构图、识别度、遮罩选择和导出判断，而不是单纯堆装饰。"
excerpt: "从选图、裁切到导出尺寸，这篇文章帮助你做出在真实 VTT 战斗场景里依然清晰的 Token。"
author: "Token Maker 编辑组"
publishedAt: "2026-03-12"
updatedAt: "2026-03-12"
category: "制作流程"
tags: ["vtt", "token 工作流", "裁切", "识别度"]
featured: true
draft: false
cover: "/blog/covers/zh/how-to-make-vtt-tokens.svg"
coverAlt: "如何制作真正适合实战的 VTT Token 封面"
seoTitle: "如何制作 VTT Token：适用于 DnD、Roll20 和 Foundry VTT"
seoDescription: "学习一套更实用的 VTT Token 制作流程，包括选图、裁切、遮罩选择和导出策略，让角色与怪物在实战中更清晰。"
relatedPostSlugs: ["how-to-make-foundry-vtt-tokens", "how-to-make-roll20-tokens", "token-size-and-resolution"]
relatedTemplateSlugs: ["circle-token-maker", "monster-token-maker", "transparent-token-maker"]
ctaQuery: "/zh?mask=circle&preset=classic#editor-workspace"
---
## 先选“缩小以后还能认出来”的原图

很多 Token 出问题，不是在导出时，而是在选图时。原图如果在全尺寸下很好看，但一缩小就失去主体，那它就不适合作为实战 Token。

更合适的原图通常具备这些特征：

- 主体轮廓明确
- 光线稳定
- 背景不喧宾夺主
- 一眼能抓住脸或主要轮廓

> Token 不是海报，它首先是一个识别工具。

## 裁切时优先保证识别，而不是保留全部细节

在真实战斗地图里，最重要的是玩家能不能一眼认出这个单位，而不是是否完整保留了肩甲、披风或背景叙事。

### 一个有效的裁切通常会做到这三件事

- 把眼睛或主体焦点放在略高于中心的位置
- 删除无助于识别的背景区域
- 保住最有辨识度的脸部或轮廓

如果角色戴着头盔、有角或宽帽，宁可多留一点头顶空间，也不要把最关键的识别特征切掉。

## 遮罩不是装饰，它决定了 Token 的阅读方式

不同遮罩会直接影响 Token 在地图上的表现。

- 圆形更适合头像型 Token，尤其适合角色和 NPC
- 方形更适合保留边缘细节，或适配更强的网格视觉
- 六边形更适合战棋、区域标记或单位计数器

如果你还不确定，先从圆形开始。它通常是最稳妥的选择。

如果你想直接开始做，最适合先打开的是[圆形 Token 制作器](/zh/templates/circle-token-maker)。如果你做的是遭遇战生物、主体轮廓比头像居中更重要，那么[怪物 Token 制作器](/zh/templates/monster-token-maker)通常更合适。

## 边框应该辅助识别，而不是抢走注意力

很多 Token 的问题不在于没有边框，而在于边框太想成为主角。边框真正的作用，是帮助主体从地图背景里跳出来，或者帮你传达阵营、敌我、精英级别等信息。

适合使用更强边框的场景：

- 地图本身很杂
- 这个 Token 是 Boss 或精英怪
- 需要快速区分角色类型

适合使用更轻边框的场景：

- 原图对比已经足够强
- 同一批次要做很多 NPC
- Token 需要融入地图而不是压住地图

如果原图本身已经足够清楚，很多时候直接走[透明背景 Token 制作器](/zh/templates/transparent-token-maker)这种更轻的路径，会比继续叠装饰边框更有效。

## 导出尺寸要服务真实使用场景

不要一上来就导出最大尺寸。大多数 VTT 场景里，裁切和对比度的重要性高于盲目放大。

### 一个实用的尺寸规则

1. 日常使用先从 `512` 开始
2. 想保留更好的透明边缘或长期归档，再用 `1024`
3. `2048` 留给精品资源、商用素材或特殊场景

关键不是“越大越好”，而是“是否值得更大”。如果你还拿不准 `512`、`1024` 和 `2048` 什么时候分别值得用，可以继续看这篇[VTT Token 尺寸怎么选](/zh/blog/token-size-and-resolution)。

如果你想直接验证这套判断，可以先打开这篇文章对应的[编辑器预设](/zh?mask=circle&preset=classic#editor-workspace)，调整一次裁切，再决定是否真的需要更大导出尺寸。

## 导出前做一次轻量复查

在批量导出之前，快速检查这几个问题：

- 缩小到地图视角后，能不能立刻认出来？
- 主体是否明显强于背景？
- 边框是在帮助识别，还是在制造噪音？
- 最重要的脸部或轮廓有没有保住？
- 导出尺寸是否符合实际用途？

如果这些问题都能回答清楚，这个 Token 基本就已经准备好了。之后你可以继续看[更适合 Foundry VTT 的 Token 流程](/zh/blog/how-to-make-foundry-vtt-tokens)、[更适合 Roll20 的 Token 流程](/zh/blog/how-to-make-roll20-tokens)和[VTT Token 尺寸怎么选](/zh/blog/token-size-and-resolution)，再按平台或资产目标继续细化。
