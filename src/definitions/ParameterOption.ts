import Dependencies from './Dependencies';

interface ParameterOption {
  injectType: 'parameter' | 'destructuring'
  dependencies: Dependencies[]
}

export default ParameterOption;
