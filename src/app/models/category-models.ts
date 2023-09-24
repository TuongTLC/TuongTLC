export class categoryCreateModel {
  categoryName?: string;
  description?: string;
}
export class categoryUpdateModel {
  id?: string;
  categoryName?: string;
  description?: string;
}
export class categoryModel {
  id?: string;
  categoryName?: string;
  description?: string;
  createdBy?: string;
  createdDate?: string;
  status?: boolean;
}
