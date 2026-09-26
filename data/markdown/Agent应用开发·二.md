title: Agent应用开发·二
description: 思考
createdAt: 1789738700000
updatedAt: null
=== meta ===

本篇来讲讲开发过程中遇到的一些问题/思考。

### Running.#buffer

之所以设置这部分，是参考 `QwenPaw`。外部可能会有多消费消息渠道，存在消费stream不确定失效，因此需要保留一输出的历史消息。

> 做完了才知道也能当context，任务结束后直接存这个 `#buffer` 到消息列表就行了

了解了下其它大佬是怎么处理

比如 [如何实现基于 WebSocket Agent 的断线重连与状态恢复](https://jishuzhan.net/article/2066083661048541185#google_vignette)

这篇介绍了event id的用法，但是刷新界面部分说的不太准，因为刷新界面是重新请求，而不是从event id开始请求。真正断线重连倒是可以参考。

但是我做的是本地agent，还不确定是否会有这方面问题，所以参考了处理方案，但没做event id；

设置 `#buffer` 作为已有event的历史，这样新消费端接入，直接 `#buffer.map` 就可以了。

而存储格式，以 `event.type` 为分割依据，如果有过大的消息，可以再设置个 `maxContent` 继续分 `chunk`。

### ReadableStream

这个应该是前后端数据请求的基础知识了，但是我是半路出家，基本没怎么用过，所以本文才会单开着一部分。

`bun` 里对 `ReadableStream` 有优化处理，参考 [bunjs/stream](https://bun.sh/docs/runtime/streams)，添加了 `pull` 事件。我一开始以为能替代 `start`，询问模型给的参考回答也是可以正常替换，还有背压的好处。

结果前端写好后请求一次就触发cancel了，调试半天还不清楚因为什么，还以为是封装的 `request.stream` 有问题。

### React

前端问题我也一起说了吧，React 19更新了代码规范，以至于之前写的部分习惯都被纠错了。

比如 `useEffect` 里不能直接用 `setState`，可能会导致重复更新问题。

我之前一直喜欢依据外部 `context` 来更新组件的 `state`，比如本项目的 `session` 和 `messages`。但是现在一改，只能把 `messages` 处理放到 `session` 上下文处理里。其它优化方案是把这俩放 `useSyncExternalStore/useReducer` 吧，但是俩逻辑还是拆不出来。

也尝试了 `Solid.js`，上下文中 `createSignal` 的类型定义有点奇怪就没继续了。不过写法大概了解了，用JSX就是好写。

---

模型问答，稍微吐槽两句

chatgpt，qwen，kimi，mimo，四个是我最近用的网页问答。每个都在刚用时候觉得很好用，但是用久了发现都有点问题。

chatgpt废话太多，而且老是拿其它的历史会话来参考，说几句就开始参考几天前的记忆来回答并给建议了。

qwen的上下文可能还不错，但是可能只是滑块式，话题A-B-A时候就连不上，而且善变。

kimi产能不行，订阅没名额，网页也时常断。

mimo最近输出不知道咋回事，老是把正文塞到思考里，而且质量也不咋地。

deepseek harness里模型输出挺快，就是不知道正式使用效果怎么样，它这个项目感觉大部分提交都是agent，框架依据的插件框架，宣传是徒有其表吧。
