title: Agent应用开发·一
description: 架构介绍
createdAt: 1788442514347
updatedAt: 1789785500000
=== meta ===

### 技术选型

- [x] [Bun](https://bun.sh/)

### 架构参考

- [x] [QwenPaw v1](https://github.com/agentscope-ai/QwenPaw/tree/v1.1.12)

> QwenPaw 是个参考 OpenClaw 功能的国产产品。仍然在飞速迭代中。
> 其中，Agent运行被拆为 `AgentRunner` 和 `QwenPawAgent`。`AgentRunner.query_handle` 函数处理路由，并构建 `QwenPawAgent`。之后好像是通过 `TaskTracker` 去激活和追踪任务。
> 8月刚接触Agent开发，看着这后端架构，脑子也是一团浆糊。因为很少去用Class extend，而且主要loop又用他们阿里自己的运行时库，再加上python的同步写法，感觉有点难理解。
> 好在经过半个月的研读，终于理解了一丝。
> 现在来搓个项目练练手。

---

我准备写三个Class，分别是：

- `SesstionManager`: 消息会话管理，或许该叫 `MessageManager`；
- `Runner`: Agent运行时，处理Agent任务和输出；
- `Agent`: Agent请求和响应处理。

> QwenPaw里，因为系统提示词，工具和Skill在会话中是动态变化的，所以 `Runner` 中，每次都会通过 `build_env_prompt` 构建系统提示词，之后通过 `toolkit` 注册工具、技能等。每次new新的 `QwenPawAgent`，达到动态更新效果。

### 具体设计

#### SessionManager

负责会话列表管理。

通过 `getOrCreateSession` 来创建就行了。

```ts
class SessionManager {
  private sessionMap: Map<string, Session> = new Map();

  get sessions(): Session[] {}

  getOrCreateSession(sessionId: string): Session {}

  removeSession(sessionId: string): void {}

  getSession(sessionId: string): Session | undefined {}
}

// 全局共用
export const sessionManager = new SessionManager();
```

> **插一嘴**
>
> ts提供的 `private` 我不太习惯用，后边可能会换成 `#` 语法。毕竟 `#sessionMap` 一眼就能看出来是个私有属性。

#### Session

管理会话信息和状态。

当前加的 `pendingPrompt` 有点过度设计，毕竟没有与之配套的功能。

`Message` 做了工厂函数，本文先不赘述了。

```ts
class Session {
  #messages: Message[] = [];
  runner: Runner;
  id: string;
  pendingPrompt: string[] = [];

  constructor({ sessionId }: { sessionId: string }) {
    this.runner = new Runner(this);
    this.id = sessionId;
  }

  get messages(): Message[] {}

  // 给模型的消息
  // 当前选择的是OpenAi旧的请求格式，
  // 又因为消息会额外存储一些meta，
  // 所以需要做一些转换
  get normalMessages(): NormalMessage[] {}

  pushUserMessage(props: UserMessageProps): void {}

  pushAssistantMessage(props: AssistantMessageProps): void {}

  pushToolMessage(props: ToolMessageProps): void {}

  consumeHumanMessage(): void {}

  pushHumanMessage(prompt: string): void {}
}
```

#### Runner

运行时管理。

`abortController` 功能还没接入，不确定写法是否存在问题

```ts
export class Runner {
  #status: "idle" | "running" = "idle";
  #session: Session;

  #buffer: AgentResponse[] = [];
  #subscribers: Set<SubscribeCallback> = new Set();

  #abortController: AbortController = new AbortController();

  constructor(session: Session) {
    this.#session = session;
  }

  /**
   * 外部挂载获得event的函数
   * callback就是个传入event的函数
   */
  subscribe(callback: SubscribeCallback): void {}

  #errorHandler(error: Error): void {}

  // 消息分发
  #emit(message: AgentResponse): void {}

  async run() {
    // 状态更新

    // 想做一个用户消息pendding，
    // 但是初期先就这样吧，
    // 得把工具接入才能loop。
    let oldestHumanMessage: string | undefined =
      this.#session.consumeHumanMessage();

    while (oldestHumanMessage) {
      this.#session.pushUserMessage({ content: oldestHumanMessage });

      this.#abortController = new AbortController();

      const messages: Message[] = this.#session.normalMessages;

      const agent = new Agent();

      const asyncGenerator = agent.ask(
        messages,
        this.#abortController.signal,
      ) as AsyncGenerator<AgentResponse, void, unknown>;

      await this.#execute(asyncGenerator).catch((error) =>
        this.#errorHandler(error),
      );

      oldestHumanMessage = this.#session.consumeHumanMessage();
    }

    this.#emit({ type: "done" });

    console.log(this.#buffer);

    // 消息存储，只是简单存一下思考和正文
    this.#buffer.map((message, index) => {});

    // 状态更新
  }

  // 模型输出消息转换处理
  // 并把结果emit分发
  async #execute(
    asyncGenerator: AsyncGenerator<AgentResponse, void, unknown>,
  ) {}

  get isRunning() {}

  abort() {}
}
```

#### Agent

处理请求和响应。

```ts
export class Agent {
  // 消息转换
  async *#consume(stream: ReadableStream<any> | null) {}

  // 设置了public，所以前边不new对象也可以调用
  public async *ask(
    messages: Message[],
    signal?: AbortSignal,
    option?: Partial<Options>,
  ) {}
}
```

---

大部分还是代码或功能罗列，下一篇再讲具体问题吧。
