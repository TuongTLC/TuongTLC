import { CategoryModel, CategoryCreateModel, CategoryUpdateModel } from './category-models';

describe('Category Models', () => {
  it('CategoryModel should initialize', () => {
    const m = new CategoryModel();
    expect(m.id).toBe('');
    expect(m.categoryName).toBe('');
    expect(m.status).toBeFalse();
  });

  it('CategoryCreateModel should initialize', () => {
    const m = new CategoryCreateModel();
    expect(m.categoryName).toBe('');
  });

  it('CategoryUpdateModel should initialize', () => {
    const m = new CategoryUpdateModel();
    expect(m.id).toBe('');
  });
});
