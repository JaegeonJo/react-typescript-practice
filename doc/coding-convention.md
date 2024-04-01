Written by [@limgit](https://github.com/limgit)

### Coding Style

- 변수 이름 및 함수 이름은 `camelCasing`을, 타입 이름, 컴포넌트 이름 및 enum 이름은 `PascalCasing`을, 상수 이름은 `SNAKE_CASING_UPPERCASE`을 사용합니다.
- ESLint가 linting을 해주고 있기 때문에 스타일 가이드는 ESLint를 따릅니다.
    - 단, max-len 등의 룰 같은 경우는 disable 하는 것이 가독성에 도움이 된다고 판단되면 부분적으로 disable 할 수 있습니다(`.eslintrc.js`를 수정해 전역적으로 disable 하지 말아주세요. 다만, 특정 rule이 거의 모든 상황에서 disable 되고 있다고 할 경우 maintainer와의 상의를 통해 `.eslintrc.js`를 수정할 수 있습니다.).
- TS 설정으로 인해 배열 원소 접근 등에서 undefined 타입이 자동으로 포함됩니다. 만약, 코드 로직상 해당 구문에서 `undefined`가 발생할 수 없다는 것이 보장되면(즉, 반드시 원소가 있다는 것이 보장되면), non-null assertion을 추가하고 주석으로 그 이유를 간략하게 기술합니다.
    ```
      function example(array: number[]): number {
          if (array.length === 0) return -1;
          const first = array[0]!; // Non-null assertion due to the above statement
          return Math.abs(first);
      }
    ```
    
- `var`은 어떤 경우에도 사용하지 않으며, 변수를 mutable하게 사용하는 것(`let` 선언 등)은 **최대한 지양**합니다. 거의 대부분의 상황에서 declarative한 코드(const 선언 등)만을 사용하는 것으로도 코드를 작성할 수 있습니다. - [Declarative Programming](https://en.wikipedia.org/wiki/Declarative_programming) 및 [Functional Programming](https://en.wikipedia.org/wiki/Functional_programming)을 참고하세요.
    - 이는 Side effect의 가능성을 최대한 줄여 코드를 예측 가능하고 읽기 쉽게 만들기 위함입니다.
    - DOs
      ```
      // Double elements
      const doubled = [1, 2, 3].map((x) => x * 2);
      // Conditional value
      const conditional = isCondition() ? 3 : 4;
      // Sum the array
      const arraySum = [1, 2, 3].reduce((acc, curr) => acc + curr, 0);
      ```
        
    - DON’Ts
      ```
      // Double elements
      let doubled = [1, 2, 3];
      for (let i = 0; i < doubled.length; i += 1) {
          doubled[i] = doubled[i] * 2;
      }
      // Conditional value
      let conditional = 4;
      if (isCondition()) conditional = 3;
      // Sum the array
      const array = [1, 2, 3];
      let arraySum = 0;
      for (let i = 0; i < array.length; i += 1) {
          arraySum += array[i];
      }
      ```
        
    - 변수를 mutable하게 사용할 수밖에 없는 로직이거나, 그렇게 하는 것이 가독성에 도움이 되는 케이스들이 있습니다(복잡한 알고리즘의 구현 등). 그럴 경우, 해당 파트를 최소한으로 잡아 함수로 묶어 다른 코드에 side effect가 미치지 않도록 합니다.
        - 만약 재사용성이 없어 보이는 로직일 경우, [IIFE](https://developer.mozilla.org/ko/docs/Glossary/IIFE) 형태를 활용합니다. 예를 들면, 아래와 같은 형태가 있습니다.
      ```
      const someConditionalValue = (() => {
        let flag = true;
        if (cond1) flag = false;
        if (cond2) flag = !flag;
        if (flag) return 1;
        return 0;
      })();
      ```
            
- 특정 component/logic을 모듈화 할때는 over abstraction에 주의하세요. 알맞게 만들어진 모듈은 서로간의 coupling이 느슨합니다.
    - 코드를 작성하다 보면 중복된 코드가 보이고, 이를 없애고 싶은 마음이 들 때가 있습니다. 자연스러운 현상이지만, **의미적 중복**과 **형식적 중복**을 명확히 구분해야 합니다. 전자는 모듈화/추상화를 통해 중복을 제거해야 하지만, 후자의 경우 제거하지 않는 편이 추후 유지보수에 더 도움이 되는 경우가 많습니다.
    - 형식적 중복과 의미적 중복을 구분하기 위한 쉬운 방법 중 하나는 ’이 부분이 변경되었을 때 중복으로 보이는 다른 부분도 똑같은 변경이 일어나야 하는가?’를 생각해보는 것입니다. 답이 ’예’라면 의미적 중복일 가능성이 높고, ’아니오’라면 형식적 중복일 가능성이 높습니다.
    - 형식적 중복의 잘못된 모듈화로 발생하는 대표적인 문제로는 추후 요구되는 스펙 변경에 따른 과한 분기 추가 등이 있습니다.
