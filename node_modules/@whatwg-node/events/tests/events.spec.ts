import { CustomEvent, Event, EventTarget } from '@whatwg-node/events';

describe('EventTarget', () => {
  it('addEventListener + dispatchEvent', () => {
    const target = new EventTarget();
    const listener = jest.fn();
    target.addEventListener('test', listener);
    target.dispatchEvent(new Event('test'));
    expect(listener).toHaveBeenCalled();
  });
  it('removeEventListener', () => {
    const target = new EventTarget();
    const listener = jest.fn();
    target.addEventListener('test', listener);
    target.removeEventListener('test', listener);
    target.dispatchEvent(new Event('test'));
    expect(listener).not.toHaveBeenCalled();
  });
});

describe('CustomEvent', () => {
  it('detail', () => {
    const target = new EventTarget();
    const listener = jest.fn();
    target.addEventListener('test', listener);
    target.dispatchEvent(new CustomEvent('test', { detail: 123 }));
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ detail: 123 }));
  });
});
