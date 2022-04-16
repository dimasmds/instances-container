// @ts-nocheck
// eslint-disable-next-line max-classes-per-file
import InstanceOption from '../definitions/InstanceOption';
import { Container } from '../Container';

describe('Container', () => {
  describe('verify instance options', () => {
    it('should throw error when instance option not array', () => {
      expect(() => new Container({})).toThrowError('options should be an array');
    });

    it('should throw error when option item not an object', () => {
      expect(() => new Container(['string', 1, {}])).toThrowError('options item should be an instance option object');
      expect(() => new Container([null, {}, {}])).toThrowError('options item should be an instance option object');
    });

    it('should throw error when instance option contain unknown property', () => {
      const instanceOptions: any[] = [
        {
          key: 'class a',
          Class: class {},
          parameter: {},
          otherProps: {},
          otherProps2: {},
          otherProps3: {},
        },
      ];

      expect(() => new Container(instanceOptions)).toThrowError('otherProps, otherProps2, otherProps3 not allowed in instance option');
    });

    it('should throw error when instance option not contain Class property', () => {
      const instanceOptions: any[] = [
        {
          key: 'class a',
          parameter: {},
        },
      ];

      expect(() => new Container(instanceOptions)).toThrowError('instance option should contain Class to be create later on');
    });

    it('should throw error when instance option Class is not constructor function', () => {
      const instanceOptions: any[] = [
        {
          key: 'class a',
          Class: {},
          parameter: {},
        },
      ];

      expect(() => new Container(instanceOptions)).toThrowError('Class should be a class or constructor function');
    });

    describe('when instance option parameter defined', () => {
      it('should throw error when parameter is not an object', () => {
        const instanceOptions: any[] = [
          {
            key: 'class a',
            Class: class {},
            parameter: [],
          },
          {
            key: 'class b',
            Class: class b {},
            parameter: 'param',
          },
        ];

        expect(() => new Container(instanceOptions)).toThrowError('parameter should be a ParameterOption object');
      });

      it('should throw error when parameter is contain unknown property', () => {
        const instanceOptions: any[] = [
          {
            key: 'class a',
            Class: class {},
            parameter: {
              injectType: 'parameter',
              dependencies: [],
              unknownA: {},
              unknownB: {},
            },
          },
        ];

        expect(() => new Container(instanceOptions)).toThrowError('unknownA, unknownB is not allowed in parameter option');
      });

      describe('when injectType is defined', () => {
        it('should throw error when value is not allowed value', () => {
          const instanceOptions: any[] = [
            {
              key: 'class a',
              Class: class {},
              parameter: {
                injectType: true,
              },
            },
          ];

          expect(() => new Container(instanceOptions)).toThrowError('parameter inject type should be parameter or destructuring');
        });

        describe('when dependencies is defined and injectType is destructuring', () => {
          it('should throw error when value is not an array', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'destructuring',
                  dependencies: {},
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('dependencies should be an array');
          });

          it('should throw error when dependencies item is not an object', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'destructuring',
                  dependencies: [true, 'a'],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('dependencies item should be a Dependency object');
          });

          it('should throw error when dependency is contain unknown property', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'destructuring',
                  dependencies: [
                    {
                      name: 'objA',
                      concrete: {},
                      unknownA: {},
                      unknownB: {},
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('unknownA, unknownB is not allowed in Dependency object');
          });

          it('should throw error when dependency is not contain name property', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'destructuring',
                  dependencies: [
                    {
                      concrete: {},
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('dependency should contain name when using destructuring inject type');
          });

          it('should throw error when dependency name is not string', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'destructuring',
                  dependencies: [
                    {
                      name: true,
                      concrete: {},
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('dependency name should be a string');
          });

          it('should throw error when define concrete and internal together', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'destructuring',
                  dependencies: [
                    {
                      name: 'class a',
                      concrete: {},
                      internal: 'class b',
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('cannot define concrete and internal together');
          });

          it('should throw error when concrete or internal not defined', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'destructuring',
                  dependencies: [
                    {
                      name: 'class a',
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('please define dependency in concrete or internal');
          });

          describe('when internal is defined', () => {
            it('should throw error if not string', () => {
              const instanceOptions: any[] = [
                {
                  key: 'class a',
                  Class: class {},
                  parameter: {
                    injectType: 'destructuring',
                    dependencies: [
                      {
                        name: 'class a',
                        internal: 123,
                      },
                    ],
                  },
                },
              ];

              expect(() => new Container(instanceOptions)).toThrowError('internal property only accept string');
            });
          });
        });

        describe('when dependencies is defined and injectType is parameter', () => {
          it('should throw error when value is not an array', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'parameter',
                  dependencies: {},
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('dependencies should be an array');
          });

          it('should throw error when dependencies item is not an object', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'parameter',
                  dependencies: [true, 'a'],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('dependencies item should be a dependency object');
          });

          it('should throw error when dependency define a name', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'parameter',
                  dependencies: [
                    {
                      name: 'objA',
                      concrete: {},
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('no need to define name when using parameter inject type');
          });

          it('should throw error when dependency is contain unknown property', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'parameter',
                  dependencies: [
                    {
                      concrete: {},
                      unknownA: {},
                      unknownB: {},
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('unknownA, unknownB is not allowed in dependency object');
          });

          it('should throw error when define concrete and internal together', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'parameter',
                  dependencies: [
                    {
                      concrete: {},
                      internal: 'class b',
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('cannot define concrete and internal together');
          });

          it('should throw error when concrete or internal not defined', () => {
            const instanceOptions: any[] = [
              {
                key: 'class a',
                Class: class {},
                parameter: {
                  injectType: 'parameter',
                  dependencies: [
                    {
                    },
                  ],
                },
              },
            ];

            expect(() => new Container(instanceOptions)).toThrowError('please define dependency in concrete or internal');
          });

          describe('when internal is defined', () => {
            it('should throw error if not string', () => {
              const instanceOptions: any[] = [
                {
                  key: 'class a',
                  Class: class {},
                  parameter: {
                    injectType: 'parameter',
                    dependencies: [
                      {
                        internal: 123,
                      },
                    ],
                  },
                },
              ];

              expect(() => new Container(instanceOptions)).toThrowError('internal property only accept string');
            });
          });
        });
      });
    });
  });

  describe('initialize', () => {
    it('should initialize instances correctly when not defined options', () => {
      const container = new Container();

      expect(container).toBeInstanceOf(Container);
    });

    it('should initialize instances correctly when not defined key in parameter options', () => {
      const options: InstanceOption[] = [
        {
          Class: class Car {},
        },
      ];

      const container = new Container(options);

      expect(container.instances.Car).toBeInstanceOf(Object);
      expect(container.instances.Car.key).toBe('Car');
      expect(container.instances.Car.Class).toEqual(options[0].Class);
    });

    it('should initialize instances correctly when defined key in parameter options', () => {
      const options: InstanceOption[] = [
        {
          key: 'CarA',
          Class: class Car {},
        },
      ];

      const container = new Container(options);

      expect(container.instances.CarA).toBeInstanceOf(Object);
      expect(container.instances.CarA.key).toBe('CarA');
      expect(container.instances.CarA.Class).toEqual(options[0].Class);
    });

    it('should initialize instances correctly when parameter object not defined', () => {
      const options: InstanceOption[] = [
        {
          key: 'CarA',
          Class: class Car {},
        },
      ];

      const container = new Container(options);

      expect(container.instances.CarA.parameter).toEqual({
        injectType: 'parameter',
        dependencies: [],
      });
    });

    it('should initialize instances correctly when parameter object is defined with empty object', () => {
      const options: InstanceOption[] = [
        {
          key: 'CarA',
          Class: class Car {},
          parameter: {},
        },
      ];

      const container = new Container(options);

      expect(container.instances.CarA.parameter).toEqual({
        injectType: 'parameter',
        dependencies: [],
      });
    });

    it('should initialize instances correctly when parameter object is only defined dependencies', () => {
      const options: InstanceOption[] = [
        {
          key: 'CarA',
          Class: class Car {},
          parameter: {
            dependencies: [
              {
                concrete: {},
              },
            ],
          },
        },
      ];

      const container = new Container(options);

      expect(container.instances.CarA.parameter).toEqual({
        injectType: 'parameter',
        dependencies: [
          {
            concrete: {},
          },
        ],
      });
    });

    it('should initialize instances correctly when injectType is destructuring', () => {
      const options: InstanceOption[] = [
        {
          key: 'CarA',
          Class: class Car {},
          parameter: {
            injectType: 'destructuring',
          },
        },
      ];

      const container = new Container(options);

      expect(container.instances.CarA.parameter).toEqual({
        injectType: 'destructuring',
        dependencies: [],
      });
    });

    it('should initialize instances correctly when given multiple instances options', () => {
      const options: InstanceOption[] = [
        {
          key: 'CarA',
          Class: class Car {},
          parameter: {
            injectType: 'destructuring',
          },
        },
        {
          key: 'CarB',
          Class: class Car {},
          parameter: {
            injectType: 'parameter',
            dependencies: [
              {
                concrete: {},
              },
            ],
          },
        },
      ];

      const container = new Container(options);

      expect(JSON.stringify(container.instances.CarA)).toEqual(JSON.stringify({
        key: 'CarA',
        Class: class Car {},
        parameter: {
          injectType: 'destructuring',
          dependencies: [],
        },
      }));

      expect(JSON.stringify(container.instances.CarB)).toEqual(JSON.stringify({
        key: 'CarB',
        Class: class Car {},
        parameter: {
          injectType: 'parameter',
          dependencies: [
            {
              concrete: {},
            },
          ],
        },
      }));
    });
  });

  describe('getInstance', () => {
    let container;

    beforeEach(() => {
      const instanceOptions: InstanceOption[] = [
        {
          Class: class Engine {
            constructor(petrol) {
              this.petrol = petrol;
            }
          },
          parameter: {
            dependencies: [
              {
                concrete: {}, // dummy petrol
              },
            ],
          },
        },
        {
          Class: class Car {
            constructor({ engine, doorCount }) {
              this.engine = engine;
              this.doorCount = doorCount;
            }
          },
          parameter: {
            injectType: 'destructuring',
            dependencies: [
              {
                name: 'engine',
                internal: 'Engine',
              },
              {
                name: 'doorCount',
                concrete: 4,
              },
            ],
          },
        },
        {
          Class: class Motorcycle {
            constructor(engine, isMatic) {
              this.engine = engine;
              this.isMatic = isMatic;
            }
          },
          parameter: {
            dependencies: [
              {
                internal: 'Engine',
              },
              {
                concrete: true,
              },
            ],
          },
        },
      ];

      container = new Container(instanceOptions);
    });

    it('should get instance correctly', () => {
      const car = container.getInstance('Car');
      const bike = container.getInstance('Motorcycle');

      expect(car).toBeInstanceOf(container.instances.Car.Class);
      expect(car.doorCount).toEqual(4);
      expect(car.engine).toBeInstanceOf(container.instances.Engine.Class);

      expect(bike).toBeInstanceOf(container.instances.Motorcycle.Class);
      expect(bike.isMatic).toEqual(true);
      expect(bike.engine).toBeInstanceOf(container.instances.Engine.Class);
    });

    it('should throw error when instance not found', () => {
      expect(() => container.getInstance('abc'))
        .toThrow('abc instance not found');
    });

    it('should only create one instance (singleton)', () => {
      const car1 = container.getInstance('Car');
      const car2 = container.getInstance('Car');

      expect(car1 === car2).toBe(true);
    });

    it('should create instance only when needed (lazy)', () => {
      expect(container.instances.Car.INSTANCE).toBe(undefined);
      expect(container.instances.Engine.INSTANCE).toBe(undefined);

      container.getInstance('Car');

      expect(container.instances.Car.INSTANCE)
        .toBeInstanceOf(container.instances.Car.Class);
      expect(container.instances.Engine.INSTANCE)
        .toBeInstanceOf(container.instances.Engine.Class);
    });
  });

  describe('destroyInstance', () => {
    let container;
    beforeEach(() => {
      const instanceOptions: InstanceOption[] = [
        {
          Class: class Engine {
            constructor(petrol) {
              this.petrol = petrol;
            }
          },
          parameter: {
            dependencies: [
              {
                concrete: {}, // dummy petrol
              },
            ],
          },
        },
      ];

      container = new Container(instanceOptions);
    });

    it('should throw error when instance is not found', () => {
      expect(() => container.destroyInstance('not_found'))
        .toThrowError('Cannot destroy instance with key not_found. Because it is not exist');
    });

    it('should delete active instance correctly', () => {
      container.getInstance('Engine');

      expect(container.instances.Engine.INSTANCE)
        .toBeInstanceOf(container.instances.Engine.Class);

      container.destroyInstance('Engine');

      expect(container.instances.Engine.INSTANCE).toEqual(undefined);
    });
  });

  describe('destroyAllInstances', () => {
    let container;
    beforeEach(() => {
      const instanceOptions: InstanceOption[] = [
        {
          Class: class Engine {
            constructor(petrol) {
              this.petrol = petrol;
            }
          },
          parameter: {
            dependencies: [
              {
                concrete: {}, // dummy petrol
              },
            ],
          },
        },
        {
          Class: class Car {
            constructor({ engine, doorCount }) {
              this.engine = engine;
              this.doorCount = doorCount;
            }
          },
          parameter: {
            injectType: 'destructuring',
            dependencies: [
              {
                name: 'engine',
                internal: 'Engine',
              },
              {
                name: 'doorCount',
                concrete: 4,
              },
            ],
          },
        },
      ];

      container = new Container(instanceOptions);
    });

    it('should destroy all active instance', () => {
      container.getInstance('Car');
      expect(container.instances.Engine.INSTANCE)
        .toBeInstanceOf(container.instances.Engine.Class);
      expect(container.instances.Car.INSTANCE)
        .toBeInstanceOf(container.instances.Car.Class);

      container.destroyAllInstances();

      expect(container.instances.Engine.INSTANCE).toBe(undefined);
      expect(container.instances.Car.INSTANCE).toBe(undefined);
    });
  });

  describe('register', () => {
    it('should register class correctly when only given a single instance option', () => {
      const container = new Container();

      class Engine {}

      container.register({ Class: Engine });

      expect(container.instances.Engine.Class).toEqual(Engine);
      expect(container.instances.Engine.key).toEqual('Engine');
    });

    it('should register class correctly when given a multiple instance option', () => {
      const container = new Container();

      class Engine {}

      class Oil {}

      container.register([{ Class: Engine }, { Class: Oil }]);

      expect(container.instances.Engine.Class).toEqual(Engine);
      expect(container.instances.Engine.key).toEqual('Engine');

      expect(container.instances.Oil.Class).toEqual(Oil);
      expect(container.instances.Oil.key).toEqual('Oil');
    });
  });
});
