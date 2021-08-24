// @ts-nocheck
// eslint-disable-next-line max-classes-per-file
import { Container } from '../index';

describe('instance-container', () => {
  describe('Container', () => {
    describe('verify instance options', () => {
      it('should throw error when instance option not array', () => {
        expect(() => new Container()).toThrowError('should define an instance options');
        expect(() => new Container({})).toThrowError('options should be an array');
      });

      it('should throw error when option item not an object', () => {
        const instanceOptions: any[] = ['string', 1, {}];

        expect(() => new Container(instanceOptions)).toThrowError('options item should be an instance option object');
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

          expect(() => new Container(instanceOptions)).toThrowError('parameter should be a parameter option object');
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

              expect(() => new Container(instanceOptions)).toThrowError('dependencies item should be a dependency object');
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

              expect(() => new Container(instanceOptions)).toThrowError('unknownA, unknownB is not allowed in dependency object');
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

              expect(() => new Container(instanceOptions)).toThrowError('dependency should contain key when using destructuring inject type');
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
          });
        });
      });
    });
  });
});
