# instances-container
[![NPM](https://nodei.co/npm/instances-container.png?mini=true)](https://npmjs.org/package/instances-container)
[![Continuous Integration](https://github.com/dimasmds/instances-container/actions/workflows/ci.yml/badge.svg)](https://github.com/dimasmds/instances-container/actions/workflows/ci.yml)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)


> Simple instances or services container for JavaScript.

:bangbang: [Baca deksripsi dalam Bahasa Indonesia.](https://github.com/dimasmds/instances-container/blob/master/README.id-ID.md)

## Introduction
instances-container is a super simple, light, and zero dependencies of service locator for JavaScript. When your project using instances-containers, you can to easily:
 - Make a singleton instance under the hood.
 - Only create instances when needed a.k.a lazy load.
 - Easy to destroy to free up your memory.
 - Easy to use.

## Installation
You can easily install using npm:

    npm install instances-container

## The Simplest Example
The simplest way to use an instance container looks like this:

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

**Registering classes that have parameters**

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

**Registering class have a proxy parameter (destructuring)**

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


## API Documentation
### createServer(options)
Used to create an instance of `Container`. The `options` parameter is `InstanceOption` or `InstanceOption[]`, which means you also can register a single or multiple class while creating a container.

Example: creating a container and registering a single class into it.


```JavaScript
const { createContainer } = require('instances-container');

class Engine {}
const container = createContainer({ Class: Engine });
```

Example: creating container and registering multiple class into it.
```JavaScript
const { createContainer } = require('instances-container');

class Engine {}
class Oil {}
const container = createContainer([ { Class: Engine }, { Class: Oil }]);
```

`createContainer()` will return instance of `Container`.

### Container
The container returned from `createContainer` has some methods.

#### container.getInstance(key)
Get instance from the registered class using a key.

Example:
```JavaScript
const { createContainer } = require('instances-container');

class Engine {}
class Oil {}

const container = createContainer([ { Class: Engine }, { Class: Oil }]);

// get Engine instance
const engine = container.getInstance('Engine');
// get Oil instance
const oil = container.getInstance('Oil');
```

### container.register(options)
Register a single or multiple class to a subject `container`. The `options` is `InstanceOption` or `InstanceOption[]`.

Example: 

```JavaScript
const { createContainer } = require('instances-container');


const container = createContainer();
class Engine {}

// register an Engine class after container creation
container.register({ Class: Engine });

```

### container.destroyInstance(key)
Every registered class that has been accessed will create an instance in `container.instances[key].INSTANCE`.
The `container.destroyInstance(key)` is used to delete the instance of the registered class to free up some memory.

Example:

```JavaScript
const { createContainer } = require('instances-container');


class Engine {}
const container = createContainer({ Class: Engine });

container.getInstance('Engine');

console.log(container.instances.Engine.INSTANCE instanceof Engine); // true

container.destroyInstance('Engine');

console.log(container.instances.Engine.INSTANCE === undefined); // true
```

### container.destroyAllInstances(key)
Used to delete all the instances of the registered class to free up some memory.

Example:

```JavaScript
const { createContainer } = require('instances-container');


class Engine {}
class Oil {}
const container = createContainer([{ Class: Engine }, { Class: Oil }]);

container.getInstance('Engine');
container.getInstance('Oil');

console.log(container.instances.Engine.INSTANCE instanceof Engine); // true
console.log(container.instances.Oil.INSTANCE instanceof Oil); // true

container.destroyAllInstances()

console.log(container.instances.Engine.INSTANCE === undefined); // true
console.log(container.instances.Oil.INSTANCE === undefined); // true

```

### InstanceOption
`InstanceOption` is an option passed to `createContainer` or `container.register`.

| property    | Type                           | Description |
| ----------- | ------------------------------ | ----------- |
| key         | string _(optional)_            | Key for getting or delete an instance from the container. Will use `Class.name` for default. |
| Class       | class or function              | The class or function constructor is to be registered to the container. |
| parameter   | `ParameterOption` _(optional)_ | The property is used to define the parameter options of the class to be registered. If not set, that means the class doesn't require any parameters. |

### ParameterOption
`ParameterOption` is the option required by `InstanceOption` to define `parameter` property.

| property     | Type                           | Description |
| -----------  | ------------------------------ | ----------- |
| injectType   | `"parameter"` or `"destructuring"` _(optional)_ | The type of technique used in assigning parameters to the Class. The default is `"parameter"`, but you can change it to `"destructuring"`. |
| Dependencies | `Dependencies[]`             | Option to put a value that is a dependency (parameter) of the Class. |

### Dependency
`Dependency` is needed to define the dependency value used by `ParameterOption`.

| property    | Type                           | Description |
| ----------- | ------------------------------ | ----------- |
| name        | string _(optional)_            | Object dependency parameter name. **Only define when you are using destructuring inject type**. |
| concrete    | any _(optional)_               | Using a concrete value for dependency. It can be anything. Cannot be set together with `internal` property.  |
| internal    | string _(optional)_            | Using internal value (from `container`) for dependency. The string is the `key` of class. Cannot be set together with `concrete` property. |

