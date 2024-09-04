import expect from 'expect';
import { dom } from 'aria-query';
import { elementType } from 'jsx-ast-utils';
import isDOMElement from '../../../src/util/isDOMElement';
import JSXElementMock from '../../../__mocks__/JSXElementMock';

describe('isDOMElement', () => {
  describe('DOM elements', () => {
    dom.forEach((_, el) => {
      it(`should identify ${el} as a DOM element`, () => {
        const element = JSXElementMock(el);
        expect(isDOMElement(elementType(element.openingElement)))
          .toBe(true);
      });
    });
  });
  describe('Custom Element', () => {
    it('should not identify a custom element', () => {
      const element = JSXElementMock('CustomElement');
      expect(isDOMElement(element))
        .toBe(false);
    });
  });
});
