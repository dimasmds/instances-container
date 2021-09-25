import { Container } from './Container';
import { InstanceOption } from './definitions';

export const createContainer = (options: InstanceOption[] | InstanceOption = []) => (
  Array.isArray(options) ? new Container(options) : new Container([options])
);
