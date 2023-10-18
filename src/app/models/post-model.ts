import { AuthorModel } from './user-models';

export class postCreateModel {
  postName = '';
  summary = '';
  content = '';
  thumbnail = '';
  categoriesIds: string[] = [];
  tagsIds: string[] = [];
}
export class Paging {
  pageSize = 0;
  curPage = 0;
  recordCount = 0;
  pageCount = 0;
}
export class PostInfo {
  id = '';
  postName = '';
  summary = '';
  content = '';
  createDate = new Date();
  author = new AuthorModel();
  like = 0;
  dislike = 0;
  thumbnail = '';
  status = false;
  adminStatus = '';
}

export class PostCategories {
  id = '';
  categoryName = '';
  description = '';
}
export class PostTags {
  id = '';
  tagName = '';
  description = '';
}
export class PostModel {
  postInfo = new PostInfo();
  postCategories: PostCategories[] = [];
  postTags: PostTags[] = [];
}
export class GetPostModel {
  paging: Paging = new Paging();
  listPosts: PostModel[] = [];
}
export class PostUpdateModel {
  id = '';
  postName = '';
  summary = '';
  content = '';
  thumbnail = '';
  categoriesIds: string[] = [];
  tagsIds: string[] = [];
}
export class ChangePostStatusModel {
  postId = '';
  status = '';
}
