import InstanceOption from './definitions/InstanceOption';
import Dependencies from './definitions/Dependencies';

class InstancesContainer {
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

    if (Instance.INSTANCE instanceof Instance.Class) {
      return Instance.INSTANCE;
    }

    const dependencies = this.buildDependencies(Instance.dependencies);
    Instance.INSTANCE = new Instance.Class(dependencies);
    return Instance.INSTANCE;
  }

  private static buildDependencies(dependencies: Dependencies[]): any {
    const deps = {};

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

  static deleteInstance(key: string) {
    delete this.Instances[key].INSTANCE;
  }

  static deleteAllInstances() {
    Object.keys(this.Instances).map((key) => delete this.Instances[key].INSTANCE);
  }
}

export default InstancesContainer;
