// eslint-disable-next-line max-classes-per-file
import { InstancesContainer } from '../InstancesContainer';
import InstanceOption from '../definitions/InstanceOption';

class OtherDummyClass {}

class DummyClass {
  private deps: OtherDummyClass;

  constructor({ deps } : any) {
    this.deps = deps;
  }
}

class DummyClassWithNormalParam {
  private deps: OtherDummyClass;

  constructor(deps: any) {
    this.deps = deps;
  }
}

describe('InstanceContainer', () => {
  afterEach(() => {
    InstancesContainer.Instances = {};
  });

  describe('registerInstance', () => {
    it('should register one instance correctly', () => {
      const instance: InstanceOption = {
        key: 'DummyClass',
        Class: DummyClass,
        parameter: {
          injectType: 'destructuring',
          dependencies: [
            {
              name: 'deps',
              concrete: {},
            },
          ],
        },
      };

      InstancesContainer.registerInstance(instance);

      expect(InstancesContainer.Instances[instance.key])
        .toBeInstanceOf(Object);
      expect(InstancesContainer.Instances[instance.key].Class)
        .toEqual(instance.Class);
      expect(InstancesContainer.Instances[instance.key].parameter)
        .toEqual(instance.parameter);
      expect(InstancesContainer.Instances[instance.key].parameter.dependencies)
        .toEqual(instance.parameter.dependencies);
    });
  });

  describe('registerInstances', () => {
    it('should register all instances correctly', () => {
      const instancesToRegister: InstanceOption[] = [
        {
          key: 'DummyClassOne',
          Class: DummyClass,
          parameter: {
            injectType: 'destructuring',
            dependencies: [
              {
                name: 'deps',
                concrete: {},
              },
            ],
          },
        },
        {
          key: 'OtherDummyClass',
          Class: OtherDummyClass,
          parameter: {
            injectType: 'destructuring',
            dependencies: [],
          },
        },
        {
          key: 'DummyClassTwo',
          Class: DummyClass,
          parameter: {
            injectType: 'destructuring',
            dependencies: [
              {
                name: 'deps',
                internal: 'OtherDummyClass',
              },
            ],
          },
        },
      ];

      InstancesContainer.registerInstances(instancesToRegister);

      expect(InstancesContainer.Instances.DummyClassOne)
        .toBeInstanceOf(Object);
      expect(InstancesContainer.Instances.DummyClassOne.Class)
        .toEqual(instancesToRegister[0].Class);
      expect(InstancesContainer.Instances.DummyClassOne.parameter)
        .toEqual(instancesToRegister[0].parameter);

      expect(InstancesContainer.Instances.OtherDummyClass)
        .toBeInstanceOf(Object);
      expect(InstancesContainer.Instances.OtherDummyClass.Class)
        .toEqual(instancesToRegister[1].Class);
      expect(InstancesContainer.Instances.OtherDummyClass.parameter)
        .toEqual(instancesToRegister[1].parameter);

      expect(InstancesContainer.Instances.DummyClassTwo)
        .toBeInstanceOf(Object);
      expect(InstancesContainer.Instances.DummyClassTwo.Class)
        .toEqual(instancesToRegister[2].Class);
      expect(InstancesContainer.Instances.DummyClassTwo.parameter)
        .toEqual(instancesToRegister[2].parameter);
    });
  });

  describe('getInstance', () => {
    it('should return instance correctly when given concrete dependencies', () => {
      const instance: InstanceOption = {
        key: 'DummyClass',
        Class: DummyClass,
        parameter: {
          injectType: 'destructuring',
          dependencies: [
            {
              name: 'deps',
              concrete: {},
            },
          ],
        },
      };

      InstancesContainer.registerInstance(instance);

      const dummyClass = InstancesContainer.getInstance('DummyClass');

      expect(dummyClass).toBeInstanceOf(instance.Class);
      expect(dummyClass.deps).toEqual(instance.parameter.dependencies[0].concrete);
    });

    it('should return instance correctly when given injectType parameter', () => {
      const instance: InstanceOption = {
        key: 'DummyClassWithNormalParam',
        Class: DummyClassWithNormalParam,
        parameter: {
          injectType: 'parameter',
          dependencies: [
            {
              name: 'deps',
              concrete: {},
            },
          ],
        },
      };

      InstancesContainer.registerInstance(instance);

      const dummyClass = InstancesContainer.getInstance('DummyClassWithNormalParam');

      expect(dummyClass).toBeInstanceOf(instance.Class);
      expect(dummyClass.deps).toEqual(instance.parameter.dependencies[0].concrete);
    });

    it('should throw error when getting not found instance', () => {
      expect(() => InstancesContainer.getInstance('bla'))
        .toThrowError('instance not found');
    });

    it('should create only one instance', () => {
      const instance: InstanceOption = {
        key: 'DummyClass',
        Class: DummyClass,
        parameter: {
          injectType: 'destructuring',
          dependencies: [
            {
              name: 'deps',
              concrete: {},
            },
          ],
        },
      };

      InstancesContainer.registerInstance(instance);

      const dummyClass = InstancesContainer.getInstance('DummyClass');
      const dummyClass2 = InstancesContainer.getInstance('DummyClass');

      expect(dummyClass === dummyClass2).toEqual(true);
    });

    it('should return instance correctly when given internal dependencies', () => {
      const instancesToRegister: InstanceOption[] = [
        {
          key: 'OtherDummyClass',
          Class: OtherDummyClass,
          parameter: {
            injectType: 'destructuring',
            dependencies: [],
          },
        },
        {
          key: 'DummyClass',
          Class: DummyClass,
          parameter: {
            injectType: 'destructuring',
            dependencies: [
              {
                name: 'deps',
                concrete: {},
              },
            ],
          },
        },
      ];

      InstancesContainer.registerInstances(instancesToRegister);

      const dummyClass = InstancesContainer.getInstance('DummyClass');

      expect(dummyClass).toBeInstanceOf(DummyClass);
      expect(dummyClass.deps).toEqual(InstancesContainer.getInstance('OtherDummyClass'));
    });

    it('should throw error when instance dependencies not set concrete or internal', () => {
      const instance: InstanceOption = {
        key: 'DummyClass',
        Class: DummyClass,
        parameter: {
          injectType: 'destructuring',
          dependencies: [
            {
              name: 'deps',
            },
          ],
        },
      };

      InstancesContainer.registerInstance(instance);

      expect(() => InstancesContainer.getInstance('DummyClass'))
        .toThrowError('please give concrete or internal type of dependencies');
    });

    it('should throw error when instance dependencies set concrete and internal together', () => {
      const instance: InstanceOption = {
        key: 'DummyClass',
        Class: DummyClass,
        parameter: {
          injectType: 'destructuring',
          dependencies: [
            {
              name: 'deps',
              concrete: {},
              internal: 'dummy',
            },
          ],
        },
      };

      InstancesContainer.registerInstance(instance);

      expect(() => InstancesContainer.getInstance('DummyClass'))
        .toThrowError('cannot give concrete and internal together');
    });
  });

  describe('deleteInstance', () => {
    it('should delete instance correctly', () => {
      const instance: InstanceOption = {
        key: 'DummyClass',
        Class: DummyClass,
        parameter: {
          injectType: 'destructuring',
          dependencies: [
            {
              name: 'deps',
              concrete: {},
            },
          ],
        },
      };

      InstancesContainer.registerInstance(instance);

      InstancesContainer.getInstance(instance.key);

      expect(InstancesContainer.Instances[instance.key].INSTANCE).toBeInstanceOf(instance.Class);

      InstancesContainer.deleteInstance(instance.key);

      expect(InstancesContainer.Instances[instance.key].INSTANCE).toEqual(undefined);
    });
  });

  describe('deleteAllInstances', () => {
    it('should delete all instances correctly', () => {
      const instances: InstanceOption[] = [
        {
          key: 'DummyClass',
          Class: DummyClass,
          parameter: {
            injectType: 'destructuring',
            dependencies: [
              {
                name: 'deps',
                concrete: {},
              },
            ],
          },
        },
        {
          key: 'DummyClass2',
          Class: DummyClass,
          parameter: {
            injectType: 'destructuring',
            dependencies: [
              {
                name: 'deps',
                concrete: {},
              },
            ],
          },
        },
      ];

      InstancesContainer.registerInstances(instances);

      InstancesContainer.getInstance(instances[0].key);
      InstancesContainer.getInstance(instances[1].key);

      expect(InstancesContainer.Instances[instances[0].key].INSTANCE)
        .toBeInstanceOf(instances[0].Class);
      expect(InstancesContainer.Instances[instances[1].key].INSTANCE)
        .toBeInstanceOf(instances[1].Class);

      InstancesContainer.deleteAllInstances();

      expect(InstancesContainer.Instances[instances[0].key].INSTANCE)
        .toEqual(undefined);
      expect(InstancesContainer.Instances[instances[1].key].INSTANCE)
        .toEqual(undefined);
    });
  });
});
