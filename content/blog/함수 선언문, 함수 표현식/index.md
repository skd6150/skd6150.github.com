---
title: 함수 선언문, 함수 표현식
date: "2022-01-29"
categories: ["JS"]
---

### 호이스팅

#### 호이스팅 전

```js
console.log(a) // undefined
var a = 1
console.log(a) // 1
```

#### 호이스팅 후

```js
var a
console.log(a) // undefined
a = 1
console.log(a) // 1
```

자바스크립트 코드가 실행될때 자바스크립트 엔진은 실행 콘텍스트에 현재 콘텍스트와 관련된 코드의 식별자 정보를 저장한다. 즉, 코드가 실행되기 전에 자바스크립트 엔진은 이미 실행 할 코드의 변수명을 모두 알고있게 되고 마치 변수 선언부가 스코프의 최상단에 올라간 것처럼 작동한다. 이 현상을 호이스팅이라고 한다.

### 함수 선언문, 함수 표현식

#### 호이스팅 전

```js
console.log(f1) // undefined
console.log(f2) // function

var f1 = function () {} // 함수 표현식
function f2() {} // 함수 선언문

console.log(f1) // function
console.log(f2) // function
```

#### 호이스팅 후

```js
var f1 // 선언부만 hoisting
var f2 = function f2() {} // 전체가 hoisting

console.log(f1) // undefined
console.log(f2) // function

f1 = function () {}

console.log(f1) // function
console.log(f2) // function
```

함수를 선언하는 방법으로 함수를 값으로서 변수에 저장하는 함수 표현식과 별도의 할당 없이 함수를 정의하는 함수 선언문이 있다.

함수 표현식의 경우 다른 변수들 처럼 선언부만 호이스팅 되었지만, 함수 선언문의 경우 전체가 호이스팅되어 함수 선언문 이전에서도 함수를 사용할 수 있다.

#### 함수 선언문

```js
f() // world
function f() {
  console.log("hello")
}
f() // world
function f() {
  console.log("world")
}
f() // world
```

#### 함수 표현식

```js
f() // error: Uncaught TypeError: f is not a function
var f = function () {
  console.log("hello")
}
f() // hello
var f = function () {
  console.log("world")
}
f() // world
```

함수 선언문과 함수 표현식 중 함수 표현식이 더 권장되는 방법이다. 함수 선언문의 경우 실수로 같은 이름의 함수가 두번 정의되었을 때 가장 뒤에 정의된 함수가 이전에 정의되었던 함수들을 모두 override해서 예기치 못한 문제가 발생할 수 있다. 또한, 함수 선언 이전에 함수를 사용한 경우에도 동작하는 함수 선언문과 달리 함수 표현식에서는 에러가 검출되어 함수 표현식의 경우가 디버깅이 더 용이하다.

#### 번외

```js
var f1 = function f2() {
  console.log("hello world")
}
f1() // hello world
f2() // error: Uncaught ReferenceError: f2 is not defined
```

위 처럼 함수 표현식에서 함수명을 정의한 경우를 기명 함수 표현식이라고 한다. 기명 함수 표현식 또한 일반적인 함수 표현식 처럼 선언부가 호이스팅 된다. 주의할 점으로 함수명 f2는 f2 함수 내부에서만 사용이 가능하고 함수 밖에선 f2로 함수 호출이 불가능하다.

과거 브라우저의 디버거가 함수 표현식의 익명함수 함수명을 undefined나 unnamed로 나타내는 문제가 있어 사용했던 방법이라고 한다. 현재는 함수명 없이 익명함수로도 디버거에서 함수명을 잘 보여주기 때문에 잘 사용하지 않는 방법이다.
