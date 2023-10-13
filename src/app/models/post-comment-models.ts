export class PostCommentInsertModel {
  PostId = '';
  CommentContent = '';
  ParentCommentId = null as string | null;
}

export class PostCommentUpdateModel {
  CommentId = '';
  Content = null as string | null;
  Status = null as boolean | null;
}
export class PostCommentModel {
  id = '';
  commenter: PostCommenter = new PostCommenter();
  postId = '';
  parentCommentId = '';
  content = '';
  commentDate: Date = new Date();
  like = 0;
  dislike = 0;
  status = false;
  replies: PostCommentModel[] = [];
}

export class PostCommenter {
  id = '';
  commenterName = '';
  username = '';
}