# instances-container
// Badge collection
> Simple instances or services container for JavaScript.

## Introduction
instances-container is a super simple, light, and zero dependencies of DI for JavaScript. When your project using instances-containers, you can to easily:
 - Make a singleton instances under the hood.
 - Only create instances when needed a.k.a lazy load.
 - Easy to destroy to free up your memory.
 - Easy to use.

## Installation
You can easily install using npm:

    npm install instances-container

## The Simplest Example
The simplest way to use instance container is looks like this:

```JavaScript
const { createContainer } = require('instances-container');

// class to be register
class Engine {}
	
// create container also register the class
const container = createContainer({ Class: Engine });

// engine is an instance of Engine class
const engine = container.getInstance('Engine');
	
// it's a singleton under the hood
const engine2 = container.getInstance('Engine');
console.log(engine === engine2); // true
```

## More Samples

**Registering class with parameters**

```JavaScript
const { createContainer } = require('instances-container')

class Engine {}

class Car {
  constructor(engine, power) {
    this.engine = engine;
    this.power = power;
  }
}

// register multiple class while creating container
const container = createContainer([
  {
    Class: Engine,
  },
  // register Car class which need pass parameter
  {
    Class: Car,
    parameter: {
      dependencies: [
        {
          internal: 'Engine', // use internal instance
        },
        {
          concrete: 4, // use concrete value
        },
      ],
    },
  },
]); 

// getting Car instance
const car = container.getInstance('Car');

console.log(car instanceof Car); // true
console.log(car.engine instanceof Engine); // true
console.log(car.power); // 10
```

**Registering class with a proxy parameter (destructuring)**

```JavaScript
const { createContainer } = require('instances-container')

class Engine {}

class Car {
  // proxy parameter
  constructor({ engine, power }) {
    this.engine = engine;
    this.power = power;
  }
}

// register multiple class while creating container
const container = createContainer([
  {
    Class: Engine,
  },
  // register Car class which need pass parameter
  {
    Class: Car,
    parameter: {
      injectType: 'destructuring', // set injectType to 'destructuring' to inject parameter with proxy technique
      dependencies: [
        {
          name: 'engine', // should set name property to dependency if using 'destructuring'
          internal: 'Engine', // use internal instance
        },
        {
          name: 'power',
          concrete: 4, // use concrete value
        },
      ],
    },
  },
]);

// getting Car instance
const car = container.getInstance('Car');

console.log(car instanceof Car); // true
console.log(car.engine instanceof Engine); // true
console.log(car.power); // 10
```

**Registering class with custom key**

```JavaScript
const { createContainer } = require('instances-container')

class Engine {}

const container = createContainer({
  key: 'MyEngine', // key use for getting instance
  Class: Engine,
});

const myEngine = container.getInstance('MyEngine');

console.log(myEngine instanceof Engine); // true

```

**Registering class lately**
```JavaScript
const { createContainer } = require('instances-container')

const container = createContainer();

class Engine {}

// Register class Engine lately
container.register({ Class: Engine });

const engine = container.getInstance('Engine');

console.log(engine instanceof Engine); // true


```

