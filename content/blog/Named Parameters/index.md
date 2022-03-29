---
title: Named Parameters
date: "2022-03-29"
categories: ["JS", "TS"]
---

자바스크립트에서 함수를 정의할 때 매개변수의 수가 많아지거나 몇몇 매개변수에 기본값을 지정하고 싶은 경우 default parameter 혹은 named parameter방법으로 매개변수를 전달해 해결할 수 있다.

### default parameter

```js
function myFunc(arg1, arg2 = 2, arg3 = 5) {
  console.log(arg1, arg2, arg3)
}
myFunc(1) // 1, 2, 5
myFunc(1, undefined, 7) // 1, 2, 7
```

위 코드처럼 default parameter가 적용된 arg2나 arg3는 값이 없거나 undefined가 전달되면 미리 정의된 값인 2, 5로 초기화 될 수 있다.

### named parameter

함수가 선언될 때 정의된 매개변수의 순서대로 매개변수가 전달되는 일반적인 방법과 달리, named parameter 방법으로 함수의 매개변수를 전달하면 각 매개변수의 이름과 값을 지정해서 전달할 수 있다.

```js
function myFunc({ arg1, arg2 = 2, arg3 = 5 } = {}) {
  console.log(arg1, arg2, arg3)
}

myFunc({ arg1: 1, arg3: 7 }) // 1, 2, 7
```

근데 뭔가 myFunc이 매개변수를 받는 부분의 표현이 어색하다. 빈 객체가 무언가를 할당하고 있는 것이 직관적으로 이해하기 어렵다.

그래서 저 매개변수들과 빈 객체가 무엇을 의미하는지 확인해보았다.

```js
function myFunc(args = {}) {
  console.log(args)
}

myFunc({ arg1: 1, arg3: 7 }) // { arg1: 1, arg3: 7 }
myFunc() // {}
```

빈 객체 {}는 args의 default parameter이고 함수를 호출할 때 매개변수로 아무것도 전달하지 않으면 args는 정의된 기본값인 {}가 할당되고, 매개변수로 객체를 전달하면 args에 전달한 객체가 그대로 할당되는 것을 확인할 수 있다.

```js
function myFunc({ arg1, arg2 = 2, arg3 = 5 } = {}) {
  console.log(arg1, arg2, arg3)
}

// { arg1, arg2 = 2, arg3 = 5 } = { arg1: 1, arg3: 7 }
myFunc({ arg1: 1, arg3: 7 }) // 1, 2, 7
```

다시 처음 코드로 돌아와서 의미를 해석해보면 입력된 매개변수의 값들이 [구조분해문법](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#%EA%B0%9D%EC%B2%B4_%EA%B5%AC%EC%A1%B0_%EB%B6%84%ED%95%B4)으로 arg1, arg2, arg3에 값을 할당하고 있음을 알 수 있다.

#### typescript

타입스크립트에서 기본값을 적용할 매개변수를 optional로 설정하면 더 쉽고 가독성좋은 코드를 쓸 수 있다.

```ts
function myFunc({
  arg1,
  arg2 = 2,
  arg3 = 5,
}: {
  arg1: number
  arg2?: number
  arg3?: number
}) {
  console.log(arg1, arg2, arg3)
}

myFunc({ arg1: 1, arg3: 7 }) // 1, 2, 7
```