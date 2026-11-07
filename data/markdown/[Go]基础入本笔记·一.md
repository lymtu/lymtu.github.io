slug: '87ab79f92afc001c'
title: '[Go]基础入本笔记·一'
description: ''
createdAt: 1794033513645
updatedAt: null

=== meta ===

[学习视频](https://www.bilibili.com/video/BV1DdvxBCEu9/?spm_id_from=333.337.search-card.all.click&vd_source=bf805acc8b9cfec6f7242db0a7b8fe7b)

Go是一种静态强类型、编译型，并具有GC功能的编程语言，内置并发支持。

### 声明

```go
var str string = "hello" // 变量

str1 := "hello" // 自动推断类型

const pi = 3.14 // 常量
```

### 类型

#### 数字

```go
/*
 int
 int8: -2^7 ~ 2^7-1
 int16: -2^15 ~ 2^15-1
 int32: -2^31 ~ 2^31-1
 int64: -2^63 ~ 2^63-1

 uint8: 0 ~ 2^8-1
 uint16: 0 ~ 2^16-1
 uint32: 0 ~ 2^32-1
 uint64: 0 ~ 2^64-1

 float32: 1.2e-38 ~ 3.4e38
 float64: 2.3e-308 ~ 1.7e308
*/

var num1 int = 1 // int会根据系统架构自动选择32位或64位
num2 := 2 // 自动推断类型
var num3 float32 = 3.14

// 计算时需要转换类型
var result float32 = float32(num1) + float32(num2) + num3 + 1

var num4 int // 默认为0
```

#### 字符串

创建后不可通过index更改

```go
var str1 = "hello"
str2 := `hello
world`

var str3 string // 默认为""
```

对于多个字符串拼接，使用`+`，或者更高效的`strings.Builder`和`strings.Join`

- `+`会在每一次都复制运算字符
- `strings.Builder`会使用一个`[]byte`来存储字符串，在拼接时不会复制运算字符
- `strings.Join`会使用`[]string`来存储字符串，在拼接时不会复制运算字符

所以已知字符串数量时，使用`strings.Join`，未知时使用`strings.Builder`

```go main.go
package main

import (
	"fmt"
	"strings"
)

func main() {
	var strMap = []string{"你好", "，","世界"}
	var strBuilder strings.Builder
	for _,v := range strMap {
		strBuilder.WriteString(v)
	}
	resultStr := strBuilder.String()

    fmt.Println("你好" + "，" + "世界") // 你好，世界
	fmt.Println(resultStr) // 你好，世界
	fmt.Println(strings.Join(strMap, "")) // 你好，世界
}
```

#### 布尔

```go
bool1 := true

var boo2 bool // 默认为false
```

#### 数组

```go
var arr [3]int = [3]int{1, 2, 3} // 固定长度

arr[0] = 2
// 访问 1～3索引 arr[1:3]，得到 [2 2]

arr1 := [...]int{1, 2, 3} // 自动推断长度
```

#### 切片

动态长度的数组

```go
var slice []int = []int{1, 2, 3} // 长度为3，容量为3

slice1 := make([]int, 3, 5) // [0 0 0] 3为长度，5为容量
slice1 = append(slice1, 1) // [0 0 0 1]
```

#### 映射map

```go
var map1 = map[string]int{"a": 1, "b": 2} // 键值对

// 访问 map1["c"]，返回(0, false)

map1["c"] = 3
map1["d"] = 4

map2 := make(map[string]int) // {}
map2["e"] = 5
```

### 条件

```go
if 1 || 2 {
    // do something
} else if 1 && 2 {
    // do something
} else {
    // do something
}

switch {
    case value = 1:
        // 默认break
    default:
        // do something
}

switch value {
    case 1:
        // 默认break
    default:
        // do something
}
```

### 循环

```go
for {
    // do something
    break
}

for i := 0; i < 10; i++ {
    // do something
}

for key, value := range map1 {
    // do something
}

for index, value := range slice {
    // do something
}
```

### 函数

```go main.go
package main

import (
    "errors"
    "fmt"
)

func main() {
    result, remainder, err := intDivision(10, 3)

    if err != nil {
        fmt.Printf(err.Error())
    } else {
        fmt.Printf("result: %v, remainder: %v", result, remainder)
    }
}

func intDivision(numberator int, denominator int) (int, int, error) {
    var err error // 默认为nil
    if denominator == 0 {
        error = errors.New("除数不能为0")
        return 0, 0, err
    }

    return numberator / denominator, numberator % denominator, err
}
```

---

### gopls

Go语言官方提供的语言服务器，用于代码补全、跳转定义、格式化等。

### 安装

```shell
go install golang.org/x/tools/gopls@latest
```
