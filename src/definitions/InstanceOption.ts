import Dependencies from './Dependencies';

interface InstanceOption {
  key: string
  Class: object
  dependencies?: Dependencies[]
}

export default InstanceOption;
