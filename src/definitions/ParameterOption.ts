import Dependency from './Dependency';

interface ParameterOption {
  injectType?: 'parameter' | 'destructuring'
  dependencies?: Dependency[]
}

export default ParameterOption;
