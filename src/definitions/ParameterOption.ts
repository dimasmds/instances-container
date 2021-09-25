import { Dependency } from './Dependency';

export interface ParameterOption {
  injectType?: 'parameter' | 'destructuring'
  dependencies?: Dependency[]
}
