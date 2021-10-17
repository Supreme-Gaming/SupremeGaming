import { MarkdownParsePipe } from './markdown-parse.pipe';

describe('MarkdownParsePipe', () => {
  it('create an instance', () => {
    const pipe = new MarkdownParsePipe();
    expect(pipe).toBeTruthy();
  });
});
