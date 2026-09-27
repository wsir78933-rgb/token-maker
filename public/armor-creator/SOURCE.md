# Armor creator 原始图片来源

这些 PNG 来自 https://rollforfantasy.com/tools/armor-creator.php 使用的目录 https://rollforfantasy.com/images/armor/ 。用户向协调者声明已获得作者授权，本轮按原字节保存，没有重画、没有重新压缩、没有生成替代图。

本地公开路径是 `/armor-creator/<相对路径>`，对应工作树 `public/armor-creator/`。页面不再热链 rollforfantasy.com。

清单目标 1474 条没有达成。已入库 1414 条与源站字节哈希一致，并且 sharp 能解码。男女布甲腿部 `cloth/legs01.png` 到 `cloth/legs30.png` 共 60 条，源站页面 DOM 指向这些地址，但响应 HTTP 200 后最终打开 https://rollforfantasy.com/404.php ，正文是标题为 Page not found 的 HTML。浏览器不能把它们解码成图片。抽查 jpg、gif、webp 以及其他文件名也落到同一 404 页。这 60 份响应放在 artifact 隔离区，没有放进 public。是否改用同序号皮甲原图，或先停用布甲腿部，等用户决定；本文件不代选。

记录时间：2026-09-27T09:22:27.287Z
