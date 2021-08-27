import InstanceOption from './definitions/InstanceOption';
import { Container } from './Container';

export const createContainer = (options: InstanceOption[] | InstanceOption = []) => (
  Array.isArray(options) ? new Container(options) : new Container([options])
);
