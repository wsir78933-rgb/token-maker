---
slug: "how-to-make-foundry-vtt-tokens"
title: "如何制作 Foundry VTT Token：尺寸、透明背景、导入与批量管理指南"
description: "想给 Foundry VTT 做清晰、可复用的 Token？这篇实战指南覆盖选图、裁切、透明背景、PNG/WebP 导出、Prototype Token 导入、Dynamic Token Ring 和怪物批量管理。"
excerpt: "从 Token Maker 导出到 Foundry VTT 导入，这篇文章给你一套真正能落地的玩家、NPC 和怪物 Token 工作流。"
author: "Token Maker 编辑组"
publishedAt: "2026-03-10"
updatedAt: "2026-03-21"
category: "平台指南"
tags: ["foundry vtt", "token 制作", "prototype token", "dynamic token ring", "透明 webp"]
featured: false
draft: false
cover: "/blog/covers/zh/how-to-make-foundry-vtt-tokens.svg"
coverAlt: "如何制作 Foundry VTT Token 封面"
seoTitle: "如何制作 Foundry VTT Token：尺寸、透明背景、导入与批量管理"
seoDescription: "学习如何制作 Foundry VTT Token，包括尺寸选择、透明背景、PNG 与 WebP、Prototype Token 设置、Dynamic Token Ring 和怪物批量管理。"
relatedPostSlugs: ["how-to-make-vtt-tokens", "token-size-and-resolution", "how-to-make-roll20-tokens"]
relatedTemplateSlugs: ["circle-token-maker", "transparent-token-maker", "monster-token-maker"]
ctaQuery: "/zh?mask=circle&preset=warrior#editor-workspace"
---
如果你搜索的是“**Foundry VTT Token 怎么做**”，大概率不是想看一堆抽象审美建议，而是想尽快解决这几个实际问题：

1. Token 应该做多大，`512` 还是 `1024`
2. 应该导出透明 PNG，还是上传前转成 WebP
3. 边框该直接做进图片里，还是交给 Foundry 处理
4. 怎么把图片真正放进 Actor 的 `Prototype Token`
5. 怪物和 NPC 一多以后，怎么批量管理才不会乱

这篇文章就是按这 5 个问题来写的，而且重点放在 **头像式 portrait token**。如果你做的是俯视的 overhead token，构图和旋转规则会不同；但如果你正在用 Token Maker 做玩家头像、NPC 头像、怪物头像，这套流程就是最接近实际使用的版本。

![Foundry Token 实战流程图](/blog/inline/zh/foundry-token-workflow-overview.svg)

## 先判断你做的是哪一种 Foundry Token

很多文章一上来就讲边框、特效和风格，但 Foundry 用户真正先要决定的，通常是 **Token 的职责**。

### 你现在大概率在这两种方案里二选一

- **静态边框 Token**：边框、强调色和最终外观直接做进图片里，上传以后在任何桌面里看起来都差不多。
- **干净主体 + Foundry Dynamic Token Ring**：图片里尽量只保留角色主体和透明边缘，把外圈、状态感和统一规则交给 Foundry VTT v13 的 Dynamic Token Ring。

### 更实用的选择规则

如果你符合下面这些情况，优先做 **静态边框 Token**：

- 你希望同一套素材以后也能拿去 Roll20、Owlbear 或别的桌面
- 你想让视觉风格完全固定，不依赖 Foundry 世界内的配置
- 你的战役里已经有一套成熟的金属框、骨质框或阵营框规则

如果你符合下面这些情况，优先做 **干净主体 + Dynamic Token Ring**：

- 你主要就在 Foundry VTT v13 里用这套素材
- 你想让状态环、资源视觉和统一外圈由 Foundry 管理
- 你不想把很厚的边框永久烘焙进图片，想保留更多后续调整空间

真正不实用的做法，是两边都占一点：图片里已经有一圈很重的金属框，进 Foundry 之后又再叠一层 Dynamic Token Ring。这样很容易让 Token 在地图里显得又厚又脏。

![静态边框与 Dynamic Token Ring 路线对比图](/blog/inline/zh/foundry-token-static-vs-dynamic-ring.svg)

## 一套真正能落地的 Foundry VTT Token 工作流

## 第 1 步：原图先过“缩小后还能认出来”这一关

Foundry 场景里常常会同时出现地图纹理、光照、阴影、标记、血条和名字。原图如果只是“全尺寸好看”，但缩小以后主体就融进背景，那它从一开始就不适合做 Token。

优先选这种图：

- 脸部或主体轮廓非常明确
- 背景和主体分层清楚
- 光线稳定，不是一片糊掉的逆光
- 缩小后仍然能一眼区分“这是骑士、法师、骷髅还是狼人”

尽量避开这种图：

- 背景细节比角色还抢眼
- 角色离镜头太远
- 头发、头盔、角或武器刚好卡在裁切边缘
- 主体和背景亮度太接近

如果你想先用最稳的入口开始做，角色和 NPC 一般先从[圆形 Token 制作器](/zh/templates/circle-token-maker)进入；如果你更在意透明边缘和干净主体，而不是厚重边框，[透明背景 Token 制作器](/zh/templates/transparent-token-maker)通常更适合 Foundry。

## 第 2 步：裁切时优先识别度，不要舍不得背景

很多 Foundry Token 之所以不清楚，不是因为尺寸不够，而是因为裁切太贪心。你想保住肩甲、披风、法阵和背景叙事，最后反而把最重要的脸部或轮廓压得太小。

一个更适合 Foundry 的头像式裁切，通常会做到这些事：

- 让脸部或主体焦点略高于中心，而不是正好压在几何中心
- 删掉不会提升识别度的背景
- 保住最关键的特征，比如帽檐、角、头盔、尖耳、嘴部轮廓

一个简单判断方法是：把图片想象成已经缩小到地图里 1 格大小，如果你第一眼看见的不是“这个单位是谁”，而只是“这张图挺完整”，那说明还应该裁近一点。

## 第 3 步：先决定边框由图片负责，还是由 Foundry 负责

这是很多文章都会跳过，但对 Foundry 用户非常关键的一步。

### 如果你做静态边框 Token

推荐的思路是：**边框只承担分类，不承担炫技**。

- 玩家角色：更亮、更干净的金属或细环
- 友军 NPC：较轻的中性色或柔和强调色
- 普通敌人：深色金属、骨质或克制的暗色框
- 精英和 Boss：只在少数关键单位上提高对比

边框越是承担“识别角色职责”的工作，就越不需要靠发光、外阴影和复杂纹理去抢戏。

### 如果你打算使用 Dynamic Token Ring

推荐的思路是：**图片尽量干净，外圈尽量少烘焙**。

- 主体轮廓要清楚
- 透明边缘要干净
- 图片里不要再做一层很厚的固定外圈
- 让 Foundry 负责统一外圈、状态感和风格扩展

这也是为什么很多 Foundry 专用 Token，实际比跨平台 Token 更应该从“轻边框甚至无边框”开始做，而不是一开始就把所有装饰焊死在 PNG 上。

## 第 4 步：导出尺寸要服务地图使用，不是服务心理安慰

搜索 “Foundry VTT token size” 时，很多人会把 **图片像素尺寸** 和 **地图上的格子尺寸** 混在一起。它们不是一回事。

- `512 x 512`、`1024 x 1024` 说的是你的图片有多少像素
- `1 x 1`、`2 x 2`、`3 x 3` 说的是 Token 在地图里占多少格

也就是说，一个 `512 x 512` 的图片，完全可以在 Foundry 里作为 `2 x 2` 的 Large 生物使用。怪物占几格，取决于 Token 配置里的宽高；不是取决于你是不是非得导出到特别夸张的像素。

更实用的默认规则是：

- **`512 x 512`**：大多数玩家角色、NPC、临时遭遇怪都够用
- **`1024 x 1024`**：长期复用的主角、Boss、核心 NPC、你会频繁放大的精品素材
- **高于 `1024`**：只留给商用资源、封面级素材或你明确知道自己要归档高分辨率的资产

![Foundry Token 尺寸选择图](/blog/inline/zh/foundry-token-size-decision.svg)

如果你还在纠结 `512`、`1024` 和更大尺寸的差别，可以继续看这篇[VTT Token 尺寸怎么选](/zh/blog/token-size-and-resolution)。

## 第 5 步：导出格式别只盯着 PNG

对 Token Maker 来说，**透明 PNG** 依然是很好的制作母版，因为它干净、通用、方便继续编辑。但如果你是为了放进 Foundry 长期使用，最终上传版本就不一定非得保留 PNG。

更实用的格式规则是：

- **PNG**：适合制作阶段、继续编辑、跨工具流转、保留透明边缘母版
- **WebP**：适合作为上传到 Foundry 的最终交付格式，通常能在清晰度和体积之间取得更好的平衡
- **JPG**：不适合作为透明 Token 的最终格式，因为没有透明背景

所以一个很稳的做法是：**先在 Token Maker 导出透明 PNG，确认裁切和边缘没问题，再把最终交付版本转成 WebP 上传到 Foundry**。这样既不影响你的制作自由，也能让 Foundry 里的素材更轻一点。

## 怎么把 Token 正确放进 Foundry VTT

很多文章讲完“怎么做图”就结束了，但对 Foundry 用户来说，真正的使用门槛往往在导入环节。

### 最小可用流程

1. 把整理好的 Token 放进 Foundry 的用户数据目录，并按战役或类型分文件夹
2. 在 Foundry 里创建或打开对应的 Actor
3. 打开这个 Actor 的 **Prototype Token**
4. 选择 Token 图片，或者在 v13 的 Dynamic Token Ring 工作流里设置主体图
5. 根据生物大小设置宽高，比如 Medium 常见是 `1 x 1`，Large 常见是 `2 x 2`
6. 如果你用的是头像式 portrait token，优先锁定旋转，不要让它跟着朝向一起转
7. 把 Token 拖进深色和浅色地图各看一遍，再决定是否批量导出剩余素材

### 一个特别容易踩坑的点：Prototype Token 和场景里的 Token 不是同一个层级

- **Prototype Token**：决定这个 Actor 以后默认怎么生成 Token
- **Placed Token**：只影响你已经拖进当前场景里的那个实例

如果你改的是场景里那个 Token，却期待以后所有同类怪物都自动更新，最后通常会很痛苦。真正该先改的，是 Actor 上的 `Prototype Token`。

### 头像式 Token 和俯视 Token 的旋转规则也不同

- 头像式 token：通常应该锁定旋转
- 俯视 overhead token：更适合设置南向朝向，再让朝向逻辑自己工作

这就是为什么本文一开始要先限定范围。你现在这篇文章主要服务的是 **头像式 Foundry Token**，不是做战棋俯视贴图。

## 批量管理怪物 Token 时，命名规则比特效更值钱

当你的 Foundry 战役从 20 个 Token 增长到 200 个 Token 时，最影响效率的通常不是画得够不够花，而是 **文件夹和命名是否稳定**。

一个实用的目录结构可以像这样：

```text
tokens/
  pcs/
    elara-warlock.webp
    brom-paladin.webp
  npcs/
    innkeeper-mara.webp
    captain-ren.webp
  monsters/
    goblin/
      goblin-scout-01.webp
      goblin-scout-02.webp
      goblin-boss.webp
    undead/
      skeleton-warrior-01.webp
      skeleton-archer-01.webp
```

这样做的好处有三个：

- 以后找图不会靠记忆
- 怪物变体可以自然扩展
- 很适合接到 Foundry 的 Wildcard Images 工作流里

如果你想让同一类怪物随机使用不同立绘，可以把图片命名成同一模式，然后在 Foundry 里用通配路径，例如：

```text
tokens/monsters/goblin/goblin-scout-*.webp
```

这比手动给每只哥布林逐个换头像更省时间，也更符合 Foundry 的长期管理方式。

## 三种最常见的实际场景，分别怎么做

## 场景一：玩家角色 Token

推荐做法：

- 裁切略留呼吸空间，不要挤得太满
- 让边框承担“玩家角色”识别，而不是承担装饰
- 如果你准备长期使用这个角色，优先导出 `1024`
- 如果你使用 Dynamic Token Ring，就减少固定边框，让主体更干净

不推荐的做法：

- 角色图已经很复杂，还再叠厚重外发光
- 每个玩家都用完全不同的边框语言，结果整张地图像拼盘

## 场景二：怪物遭遇包

推荐做法：

- 裁切比玩家更近一点
- 同一类怪物统一构图和边框家族
- 大多数素材直接走 `512`
- 提前按目录和命名方式组织好，方便通配随机

不推荐的做法：

- 每只怪都做不同的边框和色彩逻辑
- 小怪也导出到特别大的尺寸，最后把素材库搞得很重

如果你经常批量准备遭遇战，直接从[怪物 Token 制作器](/zh/templates/monster-token-maker)进入会比每次从零搭配置更高效。

## 场景三：Boss 或长期复用 NPC

推荐做法：

- 允许比普通单位更强一点的边框对比
- 优先保证脸部或轮廓在缩小后仍然压得住地图
- 默认从 `1024` 开始
- 先在黑暗地牢图和明亮室内图各看一遍

不推荐的做法：

- 觉得“既然是 Boss 就所有效果都加满”
- 因为是重要角色，就把背景叙事保留得过多，反而让头像不清晰

## 发布前复查：把这 7 个问题过一遍

在你批量导出、批量上传或批量挂到 Actor 之前，至少快速检查一次这 7 个问题：

1. 缩小到地图视角后，能不能一眼认出来
2. 深色地图里透明边缘会不会发灰
3. 浅色地图里主体会不会糊成一片
4. 玩家、友军、敌人和 Boss 的规则是否稳定
5. 图片像素尺寸和格子尺寸有没有被你混为一谈
6. 这张图到底应该做成静态边框，还是更适合 Dynamic Token Ring
7. 文件命名和目录是否足够稳定，方便以后复用或随机变体

如果这 7 个问题都能顺利回答，这个 Foundry Token 流程基本就已经成熟了。

## Foundry VTT Token 常见问题

### Foundry VTT Token 用 PNG 还是 WebP？

制作阶段优先透明 PNG，上传到 Foundry 的最终版本优先 WebP。PNG 更适合作为继续编辑的母版，WebP 更适合作为长期使用的交付文件。

### Foundry VTT Token 做 `512` 还是 `1024`？

大多数日常素材先用 `512`。长期主角、Boss 和你会频繁放大的精品素材，再升到 `1024`。不要默认所有 Token 都做成超大尺寸。

### Foundry VTT 的 Large 怪物一定要更大的像素图吗？

不一定。Large 是地图上占 `2 x 2` 格的概念，不等于你必须导出到特别夸张的像素。很多 Large 生物用 `512` 或 `1024` 的图片都完全够用。

### 我一定要把边框直接做进 Token 图片吗？

不一定。如果你要跨平台复用，或者你希望风格完全固定，静态边框更稳。如果你主要在 Foundry VTT v13 内使用，并计划采用 Dynamic Token Ring，那么图片本身更适合保持干净。

### 为什么我的 Token 单独看还行，一放进地图就发脏？

通常是三个原因：

- 裁切太远，主体不够大
- 透明边缘不干净
- 固定边框、发光和地图本身的光照效果互相打架

最直接的解决方式，是把裁切拉近一点，减少厚重特效，并且在深色与浅色地图里都复查一次。

## 最后，直接把文章变成你的实际流程

如果你现在就准备开始做 Foundry Token，最省时间的做法不是继续收藏文章，而是直接打开和本文匹配的[编辑器预设](/zh?mask=circle&preset=warrior#editor-workspace)，先做出一张玩家 Token、一张怪物 Token，再把它们拖进 Foundry 的深色和浅色场景里对比。

做完第一轮以后，你再回头看这篇[如何制作真正适合实战的 VTT Token](/zh/blog/how-to-make-vtt-tokens)和[VTT Token 尺寸怎么选](/zh/blog/token-size-and-resolution)，就会更容易把整套资产库做稳，而不是只做出几张“单看不错、上桌一般”的头像。
