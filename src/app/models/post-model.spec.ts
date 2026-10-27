import { postCreateModel, Paging, PostInfo, PostCategories, PostTags, PostModel, GetPostModel, PostUpdateModel, ChangePostStatusModel } from './post-model';
import { AuthorModel } from './user-models';

describe('Post Models', () => {
  it('postCreateModel should initialize with defaults', () => {
    const m = new postCreateModel();
    expect(m.postName).toBe('');
    expect(m.categoriesIds).toEqual([]);
    expect(m.tagsIds).toEqual([]);
  });

  it('Paging should initialize with defaults', () => {
    const m = new Paging();
    expect(m.pageSize).toBe(0);
    expect(m.curPage).toBe(0);
  });

  it('PostInfo should initialize with defaults', () => {
    const m = new PostInfo();
    expect(m.id).toBe('');
    expect(m.like).toBe(0);
    expect(m.author instanceof AuthorModel).toBeTrue();
  });

  it('PostCategories should initialize', () => {
    const m = new PostCategories();
    expect(m.categoryName).toBe('');
  });

  it('PostTags should initialize', () => {
    const m = new PostTags();
    expect(m.tagName).toBe('');
  });

  it('PostModel should initialize', () => {
    const m = new PostModel();
    expect(m.postInfo instanceof PostInfo).toBeTrue();
    expect(m.postCategories).toEqual([]);
    expect(m.postTags).toEqual([]);
  });

  it('GetPostModel should initialize', () => {
    const m = new GetPostModel();
    expect(m.paging instanceof Paging).toBeTrue();
    expect(m.listPosts).toEqual([]);
  });

  it('PostUpdateModel should initialize', () => {
    const m = new PostUpdateModel();
    expect(m.id).toBe('');
    expect(m.categoriesIds).toEqual([]);
  });

  it('ChangePostStatusModel should initialize', () => {
    const m = new ChangePostStatusModel();
    expect(m.postId).toBe('');
    expect(m.status).toBe('');
  });
});
