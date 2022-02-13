# instances-container
[![NPM](https://nodei.co/npm/instances-container.png?mini=true)](https://npmjs.org/package/instances-container)
[![Continuous Integration](https://github.com/dimasmds/instances-container/actions/workflows/ci.yml/badge.svg)](https://github.com/dimasmds/instances-container/actions/workflows/ci.yml)
[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)


> Simpel instances atau services container untuk JavaScript.

## Introduction
instances-container merupakan package yang sangat sederhana, ringan, dan tidak memiliki dependecies terhadap package lain dalam menerapkan service locator untuk JavaScript. Ketika proyek Anda menggunakan instances-container, Anda dapat secara mudah:
 - Membuat instance singleton di balik layar.
 - Hanya membuat instance ketika dibutuhkan, alias _lazy load_.
 - Instance mudah untuk dihapus guna menghapus ruang penggunaan memori.
 - Mudah untuk digunakan.

## Installation
Anda secara mudah memasang melalui perintah npm berikut:

    npm install instances-container

## The Simplest Example
Cara paling mudah dalam menggunakan instances-container adalah seperti ini:

```JavaScript
const { createContainer } = require('instances-container');

// class yang akan didaftarkan
class Engine {}
	
// membuat container sekaligus mendaftarkan class
const container = createContainer({ Class: Engine });

// engine merupakan instance dari Engine class
const engine = container.getInstance('Engine');
	
// dia singleton secara otomatis
const engine2 = container.getInstance('Engine');
console.log(engine === engine2); // true
```

## More Samples

**Mendaftarkan class yang memiliki parameter**

```JavaScript
const { createContainer } = require('instances-container')

class Engine {}

class Car {
  constructor(engine, power) {
    this.engine = engine;
    this.power = power;
  }
}

// mendaftarkan banyak class ketika membuat container
const container = createContainer([
  {
    Class: Engine,
  },
  // mendaftarkan class Car di mana butuh parameter
  {
    Class: Car,
    parameter: {
      dependencies: [
        {
          internal: 'Engine', // menggunakan instance internal
        },
        {
          concrete: 4, // menggunakan nilai konkrit
        },
      ],
    },
  },
]); 

// mendapatkan instance dari class Car
const car = container.getInstance('Car');

console.log(car instanceof Car); // true
console.log(car.engine instanceof Engine); // true
console.log(car.power); // 10
```

**Mendaftarkan class yang memiliki proxy parameter (destructuring)**

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

// mendaftarkan banyak class ketika membuat container
const container = createContainer([
  {
    Class: Engine,
  },
  // mendaftarkan class Car di mana butuh parameter
  {
    Class: Car,
    parameter: {
      injectType: 'destructuring', // menetapkan injectType dengan nilai 'destructuring' untuk memberikan parameter dengan teknik proxy
      dependencies: [
        {
          name: 'engine', // wajib menetapkan properti `name` ketika menggunakan injectType bernilai 'destructuring'
          internal: 'Engine', // menggunakan instance internal
        },
        {
          name: 'power',
          concrete: 4, // menggunakan nilai konkrit
        },
      ],
    },
  },
]);

// mendapatkan instance dari class Car
const car = container.getInstance('Car');

console.log(car instanceof Car); // true
console.log(car.engine instanceof Engine); // true
console.log(car.power); // 10
```

**Mendaftarkan class dengan kunci (key) yang Anda inginkan**

```JavaScript
const { createContainer } = require('instances-container')

class Engine {}

const container = createContainer({
  key: 'MyEngine', // kunci yang digunakan untuk mendapatkan instance
  Class: Engine,
});

const myEngine = container.getInstance('MyEngine');

console.log(myEngine instanceof Engine); // true

```

**Mendaftarkan class setelah container dibuat**
```JavaScript
const { createContainer } = require('instances-container')

const container = createContainer();

class Engine {}

// Mendaftarkan class melalui objek `container`
container.register({ Class: Engine });

const engine = container.getInstance('Engine');

console.log(engine instanceof Engine); // true


```


## API Documentation
### createServer(options)
Fungsi yang digunakan untuk membuat instance dari `Container`. Parameter `options` merupakan `InstanceOption` atau `InstanceOption[]`, di mana Anda bisa mendaftarkan satu atau banyak class ketika membuat container.

Contoh: membuat container dan mendaftarkan satu class ke dalamnya. 
```JavaScript
const { createContainer } = require('instances-container');

class Engine {}
const container = createContainer({ Class: Engine });
```

Example: membuat container dan mendaftarkan banyak class ke dalamnya.
```JavaScript
const { createContainer } = require('instances-container');

class Engine {}
class Oil {}
const container = createContainer([ { Class: Engine }, { Class: Oil }]);
```

`createContainer()` akan mengembalikan instance dari `Container`.

### Container
Container yang dikembalikan oleh fungsi `createContainer` memiliki beberapa method.

#### container.getInstance(key)
Mendapatkan instance dari class yang terdaftar menggunakan kunci (key).

Example:
```JavaScript
const { createContainer } = require('instances-container');

class Engine {}
class Oil {}

const container = createContainer([ { Class: Engine }, { Class: Oil }]);

// mendapatkan instance Engine
const engine = container.getInstance('Engine');
// mendapatkan instance Oil
const oil = container.getInstance('Oil');
```

### container.register(options)
Mendaftarkan satu atau banyak class ke subjek `container`. Parameter `options` merupakan `InstanceOption` atau `InstanceOption[]`.

Example: 
```JavaScript
const { createContainer } = require('instances-container');


const container = createContainer();
class Engine {}

// mendaftarkan class Engine setelah container dibuat
container.register({ Class: Engine });

```

### container.destroyInstance(key)
Setiap class yang didaftarkan diakses, ia akan membuat instance di dalam properti `container.instances[key].INSTANCE`.
Fungsi `container.destroyInstance(key)` digunakan untuk menghapus instance dari class untuk menghapus ruang penggunaan memory.

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

### container.destroyAllInstances()
Fungsi yang digunakan untuk menghapus seluruh instances dari class yang terdaftar guna menghapus ruang penggunaan memory.

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
`InstanceOption` merupakan opsi yang dilampirkan sebagai argumen fungsi `createContainer` atau `container.register`.

| property    | Type                           | Description |
| ----------- | ------------------------------ | ----------- |
| key         | string _(opsional)_            | Kunci yang digunakan untuk mendapatkan atau menghapus instance dari container. Jika tidak ditetapkan maka akan menggunakan `Class.name`. |
| Class       | class or function              | Class atau Function Constructor yang akan didaftarkan ke container. |
| parameter   | `ParameterOption` _(opsional)_ | Property yang mendefinisikan opsi parameter terhadap class yang akan di daftarkan. Jika tidak ditetapkan, itu berarti class tidak membutuhkan parameter. |

### ParameterOption
`ParameterOption` merupakan opsi yang dibutuhkan oleh `InstanceOption` untuk mendefinisikan properti `parameter`.

| property     | Type                           | Description |
| -----------  | ------------------------------ | ----------- |
| injectType   | `"parameter"` or `"destructuring"` _(opsional)_ | Teknik yang digunakan dalam menetapkan parameter class. Nilai defaultnya adalah `"parameter"`, tapi kamu bisa mengubahnya ke `"destructuring"`. |
| Dependencies | `Dependencies[]`             | Opsi untuk menetapkan nilai dependency dari class. |

### Dependency
`Dependency` is needed to define the dependency value used by `ParameterOption`.

| property    | Type                           | Description |
| ----------- | ------------------------------ | ----------- |
| name        | string _(opsional)_            | Nama dari object dependency. **Hanya dibutuhkan ketika menggunakan injectType bernilai `"destructuring"`**. |
| concrete    | any _(opsional)_               | Menggunakan nilai konkrit sebagai dependency. Bisa dalam bentuk apa pun. Tidak bisa ditetapkan bersamaan dengan properti `internal`.  |
| internal    | string _(opsional)_            | Menggunakan nilai internal (dari `container`) sebagai dependency. String `key` merupakan kunci (key) dari class. Tidak bisa ditetapkan bersamaan dengan properti `concrete`. |

