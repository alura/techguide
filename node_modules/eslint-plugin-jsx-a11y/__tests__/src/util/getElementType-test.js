import expect from 'expect';
import getElementType from '../../../src/util/getElementType';
import JSXElementMock from '../../../__mocks__/JSXElementMock';
import JSXAttributeMock from '../../../__mocks__/JSXAttributeMock';

describe('getElementType', () => {
  describe('no settings in context', () => {
    const elementType = getElementType({ settings: {} });

    it('should return the exact tag name for a DOM element', () => {
      expect(elementType(JSXElementMock('input').openingElement)).toBe('input');
    });

    it('should return the exact tag name for a custom element', () => {
      expect(elementType(JSXElementMock('CustomInput').openingElement)).toBe('CustomInput');
    });

    it('should return the exact tag name for names that are in Object.prototype', () => {
      expect(elementType(JSXElementMock('toString').openingElement)).toBe('toString');
    });

    it('should return the default tag name provided', () => {
      expect(elementType(JSXElementMock('span', [JSXAttributeMock('as', 'h1')]).openingElement)).toBe('span');
    });
  });

  describe('components settings in context', () => {
    const elementType = getElementType({
      settings: {
        'jsx-a11y': {
          components: {
            CustomInput: 'input',
          },
        },
      },
    });

    it('should return the exact tag name for a DOM element', () => {
      expect(elementType(JSXElementMock('input').openingElement)).toBe('input');
    });

    it('should return the mapped tag name for a custom element', () => {
      expect(elementType(JSXElementMock('CustomInput').openingElement)).toBe('input');
    });

    it('should return the exact tag name for a custom element not in the components map', () => {
      expect(elementType(JSXElementMock('CityInput').openingElement)).toBe('CityInput');
    });

    it('should return the default tag name since not polymorphicPropName was provided', () => {
      expect(elementType(JSXElementMock('span', [JSXAttributeMock('as', 'h1')]).openingElement)).toBe('span');
    });
  });

  describe('polymorphicPropName settings in context', () => {
    const elementType = getElementType({
      settings: {
        'jsx-a11y': {
          polymorphicPropName: 'asChild',
          components: {
            CustomButton: 'button',
          },
        },
      },
    });

    it('should return the tag name provided by the polymorphic prop, "asChild", defined in the settings', () => {
      expect(elementType(JSXElementMock('span', [JSXAttributeMock('asChild', 'h1')]).openingElement)).toBe('h1');
    });

    it('should return the tag name provided by the polymorphic prop, "asChild", defined in the settings instead of the component mapping tag', () => {
      expect(elementType(JSXElementMock('CustomButton', [JSXAttributeMock('asChild', 'a')]).openingElement)).toBe('a');
    });

    it('should return the tag name provided by the componnet mapping if the polymorphic prop, "asChild", defined in the settings is not set', () => {
      expect(elementType(JSXElementMock('CustomButton', [JSXAttributeMock('as', 'a')]).openingElement)).toBe('button');
    });
  });
});
