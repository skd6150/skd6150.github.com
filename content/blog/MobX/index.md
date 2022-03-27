---
title: MobX
date: "2022-03-22"
categories: ["React"]
---

복잡한 웹 어플리케이션의 전역상태를 저장하기 위해서 많은경우 상태관리 라이브러리를 사용한다. 대표적으로 Redux, MobX, React의 경우 Recoil, Context API 등 여러 선택지가 있다. 그 중 MobX를 써보고 배운점들을 정리해보았다.

### MobX

```js
import { makeObservable, observable, action } from "mobx"

class Todo {
  id = Math.random()
  title = ""
  finished = false

  constructor(title) {
    makeObservable(this, {
      title: observable,
      finished: observable,
      toggle: action,
    })
    this.title = title
  }

  toggle() {
    this.finished = !this.finished
  }
}

class TodoList {
  todos = []
  get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length
  }
  constructor(todos) {
    makeObservable(this, {
      todos: observable,
      unfinishedTodoCount: computed,
    })
    this.todos = todos
  }
}
```

위 코드는 Todo라는 도메인 객체와 여러개의 Todo를 관리하는 TodoList 도메인 스토어를 정의한 코드이다. 클래스의 필드와 메소드는 일반 자바스크립트 클래스와 다를 것이 없지만 makeObservable함수를 통해 MobX store로 변경된다.

makeObservable함수의 두번째 인자로 전달된 객체에 observable, action, computed라는 키워드들이 있는데 아래와 같은 의미를 가진다.

![](./flow.png)

#### observable

observable은 state를 저장하는 필드이자, 추적 가능한 필드임을 정의하는 주석이다. observable로 지정된 필드들은 관찰받으면서 값이 변경되면 computed를 다시 계산하고 reaction을 일으킨다.

Todolist의 todos와 Todo의 title, finished가 여기에 해당한다.

#### action

observable을 변경시키기 위한 메소드임을 정의하는 주석이다.

Todo의 toggle이 여기에 해당한다.

#### computed

computed는 getter에 정의되는 주석으로, 관련된 observable이 변경되었을 때 필요한 값을 계산하고 캐싱해준다.

TodoList의 unfinishedTodoCount가 여기에 해당한다.

#### reaction

reaction은 특정 observable state에 변화가 일어날 때 자동적으로 실행되는 부수효과를 말한다. autorun이나 reaction, when 등을 사용할 수 있는데 autorun의 사용방법은 아래와 같다.

```js
autorun(effect: (reaction) => void)
```

autorun을 정의하게 되면 effect 함수 내에서 쓰이는 observable들이 action을 통해 변경될 때 해당 effect 함수가 실행되게 된다.

```js
const myTodo = new Todo("myTodo")
const todoAutorun = autorun(() => {
  console.log(myTodo.id, myTodo.finished)
})
myTodo.toggle()
console.log(getDependencyTree(todoAutorun))
```

위 코드처럼 autorun의 effect함수가 myTodo의 id와 finished를 읽고있을 때, myTodo.toggle이 실행되면서 myTodo의 finished가 변경되었고 autorun의 effect함수가 실행되어 myTodo의 id와 finished가 콘솔에 출력되었음을 볼 수 있다.

이때 autorun은 어떤 observable의 변화를 감지하는지 확인하기 위해 getDependencyTree로 종속성 트리를 가져왔을 때 dependencies로 Todo의 finished가 있고 Todo의 finished가 변경되었을 때 effect함수가 실행됨을 확인할 수 있다.

Todo의 makeObservable에서 id는 observable로 지정해주지 않았기 때문에 Todo.id는 effect 함수에서 사용됨에도 종속성 트리에 포함되지 않고 같은 의미로 id가 변경되어도 effect함수가 실행되지 않는다.

![](./capture.png)

#### makeAutoObservable

클래스의 각 요소가 observable, action, computed 중 어느것에 해당하는지 정의해야 하는 makeObservable함수와 달리 makeAutoObservable함수를 사용하면 각 요소에 대해 주석을 지정해주지 않아도 각 요소의 역할을 추론해 정의해준다.

```js
import { makeObservable, observable, action } from "mobx"

class TodoList {
  todos = []
  get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length
  }
  constructor(todos) {
    makeAutoObservable(this)
    this.todos = todos
  }
}
```

### React 적용

"mobx-react-lite" 라이브러리의 observer HoC로 React에서 MobX를 사용할 수 있다. observer HoC는 React 컴포넌트의 렌더링 중 사용되는 모든 observable을 구독시켜 해당 observable이 변경되면 컴포넌트를 다시 렌더링한다.

```jsx
const MyComponent = observer(({ todo }) => {
  return (
    <div className={todo.finished ? "finished" : ""}>
      <span>{todo.title}</span>
    </div>
  )
})
```

위 코드의 경우엔 todo를 props로 가져왔지만, observable이 어디서 어떤 방식으로 전해지는지 상관이 없기 때문에 props로 전달하는 방식 외에도 전역변수나 React Context 등을 사용할 수 있다. 아래는 React Context를 사용한 예시이다.

```js
// App.js
import React, { createContext } from "react"
export const TodoContext = createContext()
const state = new Todo()
const App = () => {
  return (
    <TodoContext.Provider value={state}>
      <MyComponent />
    </TodoContext.Provider>
  )
}
```

```jsx
// MyComponent.jsx
import { TodoContext } from "./App.js"
const MyComponent = observer(() => {
  const todo = useContext(TodoContext)
  return (
    <div className={todo.finished ? "finished" : ""}>
      <span>{todo.title}</span>
    </div>
  )
})
```

### 느낀점

Redux의 경우엔 action, reducer 등 작성할 코드의 양이 MobX에 비교해서 많고 값을 변경할 때 불변성을 지키는데 적지않은 노력이 들어갔는데 그에반해 MobX는 코드도 간결하고 불변성을 신경쓰지 않아도 된다는 점이 편리했다.

그러나 버전이 바뀌면서 바뀐 내용이 많아서인지 2-3년 전에 작성된 블로그 글이 공식문서와 내용 차이가 있는 경우가 많았고 자유도가 높아서 다양한 활용방법 중 어느 것이 정답인지 혼란스러웠다.
