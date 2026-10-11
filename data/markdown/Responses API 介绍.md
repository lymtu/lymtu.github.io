slug: c90f84423a048f71
title: Responses API 介绍
description:
createdAt: 1791592638669
updatedAt: null

=== meta ===

OpenAI 在 2025 年 3 月推出 `/v1/responses`，定位是面向 reasoning 与 agent 场景的新一代 API 原语；它要取代的 Assistants API，已于 2026 年 8 月 26 日正式停用。

Chat Completions 把所有东西都塞进一条条 `message`，工具调用靠额外字段打补丁；Responses 则把对话拆成了更细、更多样的 **Item**——模型想了什么、要调什么工具、工具返回了什么，各占一条。

### 四种核心 Item

| Item                   | 产生方     | 出现在哪      | 说明                                                                                                                                         |
| ---------------------- | ---------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`              | 用户、模型 | 输入与输出    | 对话正文。`content` 是数组：`input_text` 是自己发的，`output_text` 是模型回的；输入侧 `role` 用 `user`/`developer`，输出侧固定是 `assistant` |
| `reasoning`            | 模型       | 只在 `output` | 模型的思考过程，只给 `summary[]`，原始思维链加密不外露                                                                                       |
| `function_call`        | 模型       | 只在 `output` | 模型请求调用你的函数，带 `name`、`arguments`、`call_id`，但它**不会**替你执行                                                                |
| `function_call_output` | 用户       | 只在 `input`  | 你执行完的结果，靠 `call_id` 与上面的 `function_call` 配对                                                                                   |

Item 是按「实际发生过的动作」产生的，而不是固定格式的占位：模型没动脑子就没有 `reasoning`，没调工具就没有 `function_call`。

### 第一步：用户提问

用户问的是天气，模型的知识里没有实时答案，正好逼出一次工具调用。这一轮的 `input` 就是一条 `user` 消息：

```json
[
  {
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "北京现在天气怎么样？"
      }
    ]
  }
]
```

`instructions` 单独承担系统级指导，相当于一条 system 消息，不混在这份 `input` 数组里；`input` 也可以直接给一句字符串，等价于一条 `user` 消息。往后每一步，都是往这份输入历史后面接 Item。

### 第二步：模型返回工具调用意图

模型这轮的 `output` 有两条：

```json
[
  {
    "type": "reasoning",
    "id": "rs_1",
    "summary": [
      {
        "type": "summary_text",
        "text": "需要查一下北京的实时天气"
      }
    ]
  },
  {
    "type": "function_call",
    "id": "fc_1",
    "call_id": "call_1",
    "name": "get_weather",
    "arguments": "{\"city\":\"北京\"}"
  }
]
```

`reasoning` 只是给你看一眼的思考摘要，原始思维链加密不外露；真正要动手的是 `function_call`——它把「想调哪个函数、参数是什么」写成了一条 Item，至于执行，模型不管。

注意这轮**没有** `message`：模型话还没说完，它先要工具结果，而 `call_id` 就是这次调用和将来那条结果的唯一纽带。

### 第三步：拼消息和工具结果

下一轮的 `input` 就是「历史 + 模型这轮的输出 + 一条 `function_call_output`」：

```json
[
  {
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "北京现在天气怎么样？"
      }
    ]
  },
  {
    "type": "reasoning",
    "id": "rs_1",
    "summary": [
      {
        "type": "summary_text",
        "text": "需要查一下北京的实时天气"
      }
    ]
  },
  {
    "type": "function_call",
    "id": "fc_1",
    "call_id": "call_1",
    "name": "get_weather",
    "arguments": "{\"city\":\"北京\"}"
  },
  {
    "type": "function_call_output",
    "call_id": "call_1",
    "output": "晴，25℃"
  }
]
```

这里`function_call_output` 必须和同一次请求里的 `function_call` 成对出现，`call_id` 对不上服务端会直接报 400。
所以别只回传结果，上一轮的 `function_call` 要一起带上；`reasoning` 也建议原样带着，省得模型丢掉思考上下文。

### 第四步：模型给出最终回答

工具结果回到上下文后，模型才把话说完，这一轮 `output` 里第一次出现 `message`：

```json
[
  {
    "type": "message",
    "id": "msg_1",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "output_text",
        "text": "北京现在晴，25℃。",
        "annotations": []
      }
    ]
  }
]
```

`output_text` 不是某个字段，而是 SDK 把各条 `message` 里的 `output_text` 拼起来后的便捷属性。
判断这轮是否结束也很简单：`output` 里没有 `function_call`，就是最终回答。

### 第五步：拼上用户第二次提问

接着模型这轮的输出，把用户的新问题接成一条 `user` 消息，第三次请求的 `input` 就是攒到现在的全部历史：

```json
[
  {
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "北京现在天气怎么样？"
      }
    ]
  },
  {
    "type": "reasoning",
    "id": "rs_1",
    "summary": [
      {
        "type": "summary_text",
        "text": "需要查一下北京的实时天气"
      }
    ]
  },
  {
    "type": "function_call",
    "id": "fc_1",
    "call_id": "call_1",
    "name": "get_weather",
    "arguments": "{\"city\":\"北京\"}"
  },
  {
    "type": "function_call_output",
    "call_id": "call_1",
    "output": "晴，25℃"
  },
  {
    "type": "message",
    "id": "msg_1",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "output_text",
        "text": "北京现在晴，25℃。",
        "annotations": []
      }
    ]
  },
  {
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "那明天呢？"
      }
    ]
  }
]
```

不想自己维系这份历史，可以用 `previous_response_id` 让服务端托管上下文（需要 `store` 开启，默认就是）。这时第三步的 `input` 里只剩一条 `function_call_output`，其余交给服务端。不过它省的是手、不是钱：历史 Item 依然按输入 token 计费（能命中缓存的另算），`instructions` 也不会自动继承，每轮都得重发。

### 顺带一提：内置工具在服务端执行

`web_search_call`、`file_search_call`、`code_interpreter_call`、`computer_call`、`mcp_call` 这类 Item，对应的是 OpenAI 服务端执行的内置工具。你只在 `tools` 里声明、不用自己实现，所以 `output` 里等不到它们的 `function_call`——它们自己就是一条执行记录。

搜索在服务端跑完、结果塞回上下文继续推理，最后才产出 `message`。对本地 loop 而言，这些 `*_call` 更像是审计用的记录，看完就行，不像 `function_call` 那样还需要你回传一条 `function_call_output`。

把这五步串起来，就是一次标准的 agent 循环：读 `output`、有 `function_call` 就执行并把结果拼回去、有 `message` 就交给用户、用户再问就接着攒历史。Item 模型要解决的说到底就三件事——谁产生的、出现在输入还是输出、靠什么字段配对。

_—— Big Pickle · deepseek-v4.1-flash_

---

背着ai偷偷说两句：

deepseek生成内容还是没给我惊喜，也就只有速度优势了。这篇两个模型改了总共十多次，每次都出小问题。最后就这样吧。
