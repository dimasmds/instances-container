// @ts-nocheck
// eslint-disable-next-line max-classes-per-file
import InstanceOption from '../definitions/InstanceOption';
import { createContainer } from '../createContainer';
import { Container } from '../Container';

describe('createContainer', () => {
  it('should create container correctly when not given an option', () => {
    const container = createContainer();

    expect(container).toBeInstanceOf(Container);
  });

  it('should throw error when given by null option', () => {
    expect(() => {
      createContainer(null);
    }).toThrowError(
      'options item should be an instance option object',
    );
  });

  it('should create container correctly when given single instance option', () => {
    const instanceOption: InstanceOption = {
      Class: class Car {},
    };

    const container = createContainer(instanceOption);

    expect(container.instances.Car).toBeInstanceOf(Object);
  });

  it('should create container correctly when given multiple instance options', () => {
    const instanceOptions: InstanceOption[] = [
      {
        Class: class Car {},
      },
      {
        Class: class Engine {},
      },
    ];

    const container = createContainer(instanceOptions);

    expect(container.instances.Engine).toBeInstanceOf(Object);
    expect(container.instances.Car).toBeInstanceOf(Object);
  });
});
