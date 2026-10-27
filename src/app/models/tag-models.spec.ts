import { TagModel, TagCreateModel, TagUpdateModel } from './tag-models';

describe('Tag Models', () => {
  it('TagModel should initialize', () => {
    const m = new TagModel();
    expect(m.id).toBe('');
    expect(m.tagName).toBe('');
    expect(m.status).toBeFalse();
  });

  it('TagCreateModel should initialize', () => {
    const m = new TagCreateModel();
    expect(m.tagName).toBe('');
  });

  it('TagUpdateModel should initialize', () => {
    const m = new TagUpdateModel();
    expect(m.id).toBe('');
  });
});
