slug: 01964fe7b269a341
title: 文章项新增slug
description: 
createdAt: 1790473022998
updatedAt: null

=== meta ===

本项目初期使用顺序id作为文章路由名，但是展示出来显得有点low。

后边换成了中文文件名（`articles.title`）作为路由名，结果和github pages路径解析冲突了。

`react router`打包后产物是encode字符，浏览器里请求encode路径到github pages后，好像会解析成中文，以至于无法匹配到产物，文章路由404。

所以现在用slug（`hash(timestamp)`）作为路由名。

> `yaml` 的解析居然能直接把 `Number` 类型解析出来，以至于一开始slug截取6位时，对 `41e942` 解析成了 `Infinity`。
>
> `yaml` 还是太先进了，和 `json` 一样解出 `String` 多好。