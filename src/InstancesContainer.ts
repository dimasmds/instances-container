import InstanceOption from './definitions/InstanceOption';
import ParameterOption from './definitions/ParameterOption';

export class InstancesContainer {
  static Instances: any = {};

  static registerInstances(options: InstanceOption[]) {
    options.forEach((option) => {
      this.Instances[option.key] = { ...option };
    });
  }

  static registerInstance(option: InstanceOption) {
    this.Instances[option.key] = { ...option };
  }

  static getInstance(key: string): any {
    const Instance = this.Instances[key];

    if (!Instance) {
      throw new Error('instance not found');
    }

    if (Instance.INSTANCE instanceof Instance.Class) {
      return Instance.INSTANCE;
    }

    const parameters = this.buildParameters(Instance.parameter);
    Instance.INSTANCE = Array.isArray(parameters)
      ? new Instance.Class(...parameters)
      : new Instance.Class(parameters);
    return Instance.INSTANCE;
  }

  private static buildParameters(parameter: ParameterOption): any {
    if (parameter.injectType === 'destructuring') {
      const deps: any = {};
      const { dependencies } = parameter;

      // Build destructuring params
      dependencies.forEach((dependency) => {
        if (!dependency.internal && !dependency.concrete) {
          throw new Error('please give concrete or internal type of dependencies');
        }

        if (dependency.internal && dependency.concrete) {
          throw new Error('cannot give concrete and internal together');
        }

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
      if (!dependency.internal && !dependency.concrete) {
        throw new Error('please give concrete or internal type of dependencies');
      }

      if (dependency.internal && dependency.concrete) {
        throw new Error('cannot give concrete and internal together');
      }

      if (dependency.concrete) {
        deps[index] = dependency.concrete;
        return;
      }

      deps[index] = this.getInstance(dependency.internal);
    });

    return deps;
  }

  static deleteInstance(key: string) {
    delete this.Instances[key].INSTANCE;
  }

  static deleteAllInstances() {
    Object.keys(this.Instances).map((key) => delete this.Instances[key].INSTANCE);
  }
}
