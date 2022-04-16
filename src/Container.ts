import { InstanceOption, ParameterOption, Dependency } from './definitions';
import { isObject } from './utils';

export class Container {
  instances: any = {};

  constructor(options: InstanceOption[] = []) {
    this.addInstances(options);
  }

  private static verifyOptions(options: InstanceOption[]) {
    if (!Array.isArray(options)) {
      throw new Error('options should be an array');
    }

    options.forEach((option) => {
      if (!isObject(option) || Array.isArray(option)) {
        throw new Error('options item should be an instance option object');
      }

      const keys = Object.keys(option);

      const allowedProps = ['key', 'Class', 'parameter'];

      const unknownProps = keys.filter((key) => !allowedProps.includes(key));

      if (unknownProps.length) {
        throw new Error(`${unknownProps.join(', ')} not allowed in instance option`);
      }

      if (!keys.includes('Class')) {
        throw new Error('instance option should contain Class to be create later on');
      }

      // @ts-ignore
      if (typeof option.Class !== 'function' && typeof option.Class.name !== 'string') {
        throw new Error('Class should be a class or constructor function');
      }

      if (option.parameter) {
        this.verifyParameterOption(option.parameter);
      }
    });
  }

  private static verifyParameterOption(optionParameter: ParameterOption) {
    if (!isObject(optionParameter) || Array.isArray(optionParameter)) {
      throw new Error('parameter should be a ParameterOption object');
    }

    const keys = Object.keys(optionParameter);
    const allowedProps = ['injectType', 'dependencies'];
    const unknownProps = keys.filter((key) => !allowedProps.includes(key));

    if (unknownProps.length) {
      throw new Error(`${unknownProps.join(', ')} is not allowed in parameter option`);
    }

    if (optionParameter.injectType) {
      const allowedValue = ['parameter', 'destructuring'];

      if (!allowedValue.includes(optionParameter.injectType)) {
        throw new Error(`parameter inject type should be ${allowedValue.join(' or ')}`);
      }

      if (optionParameter.dependencies) {
        if (optionParameter.injectType === 'destructuring') {
          this.verifyDestructuringDependencies(optionParameter.dependencies);
          return;
        }

        this.verifyParameterDependencies(optionParameter.dependencies);
      }
    }
  }

  private static verifyDestructuringDependencies(dependencies: Dependency[]) {
    if (!Array.isArray(dependencies)) {
      throw new Error('dependencies should be an array');
    }

    dependencies.forEach((dependency) => {
      if (!isObject(dependency) || Array.isArray(dependency)) {
        throw new Error('dependencies item should be a Dependency object');
      }

      const keys = Object.keys(dependency);
      const allowedProps = ['name', 'concrete', 'internal'];
      const unknownProps = keys.filter((key) => !allowedProps.includes(key));

      if (unknownProps.length) {
        throw new Error(`${unknownProps.join(', ')} is not allowed in Dependency object`);
      }

      if (!dependency.name) {
        throw new Error('dependency should contain name when using destructuring inject type');
      }

      if (typeof dependency.name !== 'string') {
        throw new Error('dependency name should be a string');
      }

      if (dependency.concrete && dependency.internal) {
        throw new Error('cannot define concrete and internal together');
      }

      if (!dependency.concrete && !dependency.internal) {
        throw new Error('please define dependency in concrete or internal');
      }

      if (dependency.internal && typeof dependency.internal !== 'string') {
        throw new Error('internal property only accept string');
      }
    });
  }

  private static verifyParameterDependencies(dependencies: Dependency[]) {
    if (!Array.isArray(dependencies)) {
      throw new Error('dependencies should be an array');
    }

    dependencies.forEach((dependency) => {
      if (!isObject(dependency) || Array.isArray(dependency)) {
        throw new Error('dependencies item should be a dependency object');
      }

      if (dependency.name) {
        throw new Error('no need to define name when using parameter inject type');
      }

      const keys = Object.keys(dependency);
      const allowedProps = ['concrete', 'internal'];
      const unknownProps = keys.filter((key) => !allowedProps.includes(key));

      if (unknownProps.length) {
        throw new Error(`${unknownProps.join(', ')} is not allowed in dependency object`);
      }

      if (dependency.concrete && dependency.internal) {
        throw new Error('cannot define concrete and internal together');
      }

      if (!dependency.concrete && !dependency.internal) {
        throw new Error('please define dependency in concrete or internal');
      }

      if (dependency.internal && typeof dependency.internal !== 'string') {
        throw new Error('internal property only accept string');
      }
    });
  }

  private addInstances(options: InstanceOption[]) {
    Container.verifyOptions(options);

    options.forEach((option) => {
      const { Class, parameter = { injectType: 'parameter', dependencies: [] } } = option;
      const { key = Class.name } = option;

      if (!parameter.injectType) {
        parameter.injectType = 'parameter';
      }

      if (!parameter.dependencies) {
        parameter.dependencies = [];
      }

      this.instances[key] = { key, Class, parameter };
    });
  }

  public getInstance(key: string) {
    const instance = this.instances[key];

    if (!instance) {
      throw new Error(`${key} instance not found`);
    }

    if (instance.INSTANCE instanceof instance.Class) {
      return instance.INSTANCE;
    }

    const parameters = this.buildParameters(instance.parameter);
    instance.INSTANCE = Array.isArray(parameters)
      ? new instance.Class(...parameters)
      : new instance.Class(parameters);
    return instance.INSTANCE;
  }

  public destroyInstance(key: string) {
    if (!this.instances[key]) {
      throw new Error(`Cannot destroy instance with key ${key}. Because it is not exist`);
    }

    delete this.instances[key].INSTANCE;
  }

  public destroyAllInstances() {
    Object.keys(this.instances).forEach((key) => delete this.instances[key].INSTANCE);
  }

  public register(options: InstanceOption[] | InstanceOption) {
    const instancesToAdd = Array.isArray(options) ? options : [options];
    this.addInstances(instancesToAdd);
  }

  private buildParameters(parameter: ParameterOption): any {
    if (parameter.injectType === 'destructuring') {
      const deps: any = {};
      const { dependencies } = parameter;

      // Build destructuring params
      dependencies.forEach((dependency) => {
        if (dependency.concrete) {
          deps[dependency.name] = dependency.concrete;
          return;
        }

        deps[dependency.name] = this.getInstance(dependency.internal);
      });
      return deps;
    }

    // Build normal parameters
    const deps: any = [];
    const { dependencies } = parameter;

    dependencies.forEach((dependency, index) => {
      if (dependency.concrete) {
        deps[index] = dependency.concrete;
        return;
      }

      deps[index] = this.getInstance(dependency.internal);
    });

    return deps;
  }
}
