export interface ResultItem {
  id: number | string;
  divCode: string;
  divComment: string;
  sequence: number;
  descInfo: string;
  use: boolean;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
  children: ResultItem[] | [];
}
