import { isObject } from '../utils';

describe('utils', () => {
  describe('isObject', () => {
    it('should return false if given by non-object', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(1)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject(true)).toBe(false);
    });

    it('should return true if given by object', () => {
      expect(isObject({})).toBe(true);
    });
  });
});
