---
slug: "how-to-make-foundry-vtt-tokens"
title: "如何制作更适合 Foundry VTT 的 Token"
description: "Foundry VTT 更容易暴露一套 Token 是否统一。这篇文章重点讲透明边缘、风格规则和长期资产的一致性。"
excerpt: "如果你希望一整套 Foundry 战役 Token 看起来像同一个资产库，而不是临时拼起来的头像集合，这篇文章更适合你。"
author: "Token Maker 编辑组"
publishedAt: "2026-03-10"
updatedAt: "2026-03-12"
category: "平台指南"
tags: ["foundry vtt", "透明 png", "战役资产", "风格统一"]
featured: false
draft: false
cover: "/blog/covers/zh/how-to-make-foundry-vtt-tokens.svg"
coverAlt: "如何制作更适合 Foundry VTT 的 Token 封面"
seoTitle: "如何制作 Foundry VTT Token：更统一的战役资产流程"
seoDescription: "学习如何制作更适合 Foundry VTT 的 Token，包括透明边缘、边框规则和导出策略，让整套战役资产更统一。"
relatedPostSlugs: ["how-to-make-vtt-tokens", "token-size-and-resolution", "how-to-make-roll20-tokens"]
relatedTemplateSlugs: ["circle-token-maker", "hex-token-maker", "transparent-token-maker"]
ctaQuery: "/zh?mask=circle&preset=warrior#editor-workspace"
---
## Foundry VTT 会放大不统一的问题

Foundry 的场景表现力很强，灯光、阴影、地形和图层一叠起来，一套 Token 是否统一会非常明显。如果玩家、怪物和 NPC 都各自使用完全不同的边框语言，整场战役会显得像拼装出来的。

所以更适合 Foundry 的流程，不是先加效果，而是先定规则。

## 在批量制作之前，先确定一套视觉规则

更实用的做法，是在开始做图之前就先定好这几件事：

- 用哪一两种遮罩作为主方案
- 玩家和敌人分别使用什么边框家族
- 默认导出尺寸是多少
- 透明边缘应该控制到什么程度

这样做的价值，远高于给每个 Token 单独堆一堆视觉效果。

如果你还在决定从哪里开始，角色头像类最稳的起点通常是[圆形 Token 制作器](/zh/templates/circle-token-maker)；如果你还会做战术标记或计数单位，[六边形 Token 制作器](/zh/templates/hex-token-maker)会更顺手。如果你想先看一套更通用的底层流程，可以先读[如何制作真正适合实战的 VTT Token](/zh/blog/how-to-make-vtt-tokens)，再回到 Foundry 场景里细化规则。

## 透明边缘比炫技滤镜更重要

Foundry 很常见的场景，是黑暗地牢、复杂地形和动态光照同时存在。这个时候，Token 的透明边缘是否干净，会比阴影、发光或颗粒特效更直接地影响观感。

优先保证这些事：

- 边缘足够干净
- 主体轮廓清楚
- 对比足够明确

尽量少依赖这些东西：

- 很重的发光
- 过强的外阴影
- 会和原图打架的复杂边框纹理

如果你需要层级感，更推荐用边框家族或强调色，而不是堆特效。

如果你的重点是透明边缘和主体轮廓，而不是装饰性边框，那么直接从[透明背景 Token 制作器](/zh/templates/transparent-token-maker)进入会更贴近 Foundry 的实际场景。

## 用边框语言区分角色职责

Foundry 战役通常会积累很多 Token，所以更应该把边框当作一种长期规则。

### 一个很实用的分层方式

- 玩家角色：更亮、更干净的金属或细环
- 友军：更柔和的色调或较轻的强调色
- 普通敌人：克制的深色金属或骨质边框
- 精英与 Boss：对比更强、更明显的边框语言

这样做能帮助整张场景图更快被扫读，而不必全靠名字识别。

## 导出尺寸应该围绕“复用价值”来判断

如果某个 Token 会在长战役里长期复用，或者你希望以后继续积累资产库，那么适度提高导出尺寸是有意义的。但这依然不代表所有 Token 都应该导得很大。

一个实用规则是：

- 临时遭遇或一次性素材用 `512`
- 长期战役资产和核心角色素材用 `1024`

只在真正高价值资源上再往更高尺寸走。

如果你还在犹豫 `512` 和 `1024` 该怎么选，可以直接接着看这篇[VTT Token 尺寸怎么选](/zh/blog/token-size-and-resolution)。

## Foundry 批量导出前的复查方式

在正式导出一批 Token 之前，最好至少在两类场景里快速看一遍：

- 黑暗洞穴或夜景地图
- 明亮室内或城市场景

如果在这两种环境里都还能保持：

- 边缘干净
- 主体清楚
- 阵营和职责区分明确
- 整体像一个统一资产库

那么这套 Foundry Token 基本就已经达标了。

真正开始做图时，可以直接打开这篇文章对应的[Foundry 预设编辑器](/zh?mask=circle&preset=warrior#editor-workspace)，先做一批样张再统一导出。
