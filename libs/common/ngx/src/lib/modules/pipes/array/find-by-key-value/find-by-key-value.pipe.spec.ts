import { FindByKeyValuePipe } from './find-by-key-value.pipe';

describe('FindByKeyValuePipe', () => {
  it('create an instance', () => {
    const pipe = new FindByKeyValuePipe();
    expect(pipe).toBeTruthy();
  });
});
