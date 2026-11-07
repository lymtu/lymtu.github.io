slug: '7e50bdc5c2e062e9'
title: '[Go]基础入本笔记·二'
description: '字符串和编码的转换'
createdAt: 1794038488444
updatedAt: null

=== meta ===

对于ASCII(7-bit, 1 byte)无法表示的字符，Go语言采用UTF-8编码，UTF-8编码使用1到4个字节来表示一个字符，编码规则如下：

| Unicode范围                             | UTF-8编码方式                       |
| --------------------------------------- | ----------------------------------- |
| 1 - 127 (U+0000 - U+007F)               | 0xxxxxxx                            |
| 128 - 2,047 (U+0080 - U+07FF)           | 110xxxxx 10xxxxxx                   |
| 2048 - 65,535 (U+0800 - U+FFFF)         | 1110xxxx 10xxxxxx 10xxxxxx          |
| 65,536 - 1,114,111 (U+10000 - U+10FFFF) | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |

UTF-8编码可以表示Unicode字符集中的所有字符，包括ASCII字符。UTF-8编码是一种可变长度的编码方式，可以节省存储空间。

对于一个unicode字符，比如：

```go
const str = "你好"
str1 := str[0]
fmt.Printf("%v, %T\n", str1, str1) // 228, uint8

for i,v:= range str {
	fmt.Println(i,v)
    // 0 20320
    // 3 22909
}

fmt.Println(len(str)) // 6
```

这里两个中文字分别占用3 byte，所以str[0]是第一个字符的编码，而不是第一个字符本身。

```go
var str = []rune("你好")

fmt.Println(str) // [20320 22909]
```

rune类型是int32的别名，表示一个Unicode码点。

```go
const str = '你' // rune
```
