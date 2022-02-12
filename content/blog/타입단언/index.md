---
title: 타입단언(Type assertions)
date: "2022-02-10"
categories: ["TS", "React"]
---

### 타입단언

React의 useState hook은 value와 setValue함수를 담은 배열을 반환하는데 일반적으로 [배열 구조 분해 문법](https://ko.reactjs.org/docs/hooks-state.html#tip-what-do-square-brackets-mean)을 통해 값을 전달받아 활용한다.

```ts
const [count, setCount] = useState(0)
```

typescript에서 useState처럼 type이 다른 두가지 요소를 담은 배열을 반환하는 custom hook을 만들때, 아래와 같은 코드는 type error가 발생한다.

```tsx
const useMyHook = (initialValue: number) => {
  const [count, setCount] = useState(initialValue)
  const countHandler = () => {
    setCount(count + 1)
  }
  return [count, countHandler]
}

const App = () => {
  const [count, countHandler] = useMyHook(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={countHandler}>click</button> // error!
    </div>
  )
}
```

위 코드에서 typescript 컴파일러는 useMyHook 함수가 반환하는 배열의 타입을 number타입과 () => void 타입이 모두 들어갈 수 있는 유니언 타입으로 추론한다. 따라서 App 컴포넌트의 count와 countHandler가 원래 의도했던 것 처럼 각각 number와 () => void 타입으로 선언되지 않고 count와 countHandler 모두 number | () => void인 유니언 타입으로 선언된다. 때문에 컴파일러는 button 태그의 onClick 콜백함수로 number type이 들어올 수 있다고 판단하고 오류를 발생시키게 된다.

이렇듯 typescript 컴파일러가 개발자의 의도와 달리 타입을 추론한 경우 타입추론을 통해 변수의 타입을 정정해 사용해야 한다.

### 예시

```ts
const useMyHook = (initialValue: number) => {
  const [count, setCount] = useState(initialValue)
  const countHandler = () => {
    setCount(count + 1)
  }
  return [count, countHandler] as [number, () => void]
}

const [count, countHandler] = useMyHook(0) // [number, () => void]
countHandler() // ok
```

아까같은 문제를 해결하는 여러 방법 중 하나는 as 키워드로 타입을 정해주는 것이다. 위 코드처럼 useMyHook함수가 반환하는 배열을 number와 () => void를 가진 튜플로 정의하게 되면 countHandler의 타입이 () => void로 정해져 오류없이 함수 호출이 가능하게 된다.

```ts
const useMyHook = (initialValue: number) => {
  const [count, setCount] = useState(initialValue)
  const countHandler = () => {
    setCount(count + 1)
  }
  return [count, countHandler] as const
}

const [count, countHandler] = useMyHook(0) // readonly [number, () => void]
countHandler() // ok
```

혹은 [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)을 통해 해결할 수 있다. useMyHook함수가 반환하는 배열에 as const 키워드를 사용하면 useMyHook함수의 반환값의 타입이 readonly속성이 매핑된 튜플로 적용된다. 따라서 앞선 경우와 같이 countHandler의 타입이 () => void로 정해져 오류없이 함수 호출이 가능하게 된다.

```ts
const useMyHook = (initialValue: number): [number, () => void] => {
  const [count, setCount] = useState(initialValue)
  const countHandler = () => {
    setCount(count + 1)
  }
  return [count, countHandler] as const
}

const [count, countHandler] = useMyHook(0) // [number, () => void]
countHandler() // ok
```

as 키워드를 사용한 타입단언 외에도 함수를 정의하면서 리턴타입을 [number, () => void] 튜플로 정의해주면 countHandler의 타입이 () => void으로 정해져 함수 호출이 가능하다.
