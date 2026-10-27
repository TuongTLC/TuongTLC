import { PostCommentModel, PostCommentInsertModel, PostCommentUpdateModel } from './post-comment-models';

describe('PostComment Models', () => {
  it('PostCommentModel should initialize', () => {
    const m = new PostCommentModel();
    expect(m.id).toBe('');
    expect(m.content).toBe('');
    expect(m.like).toBe(0);
  });

  it('PostCommentInsertModel should initialize', () => {
    const m = new PostCommentInsertModel();
    expect(m.PostId).toBe('');
    expect(m.CommentContent).toBe('');
  });

  it('PostCommentUpdateModel should initialize', () => {
    const m = new PostCommentUpdateModel();
    expect(m.CommentId).toBe('');
    expect(m.Content).toBe('');
  });
});
