export interface BlogPostCommentReturn {
  commentId: string;
  blogId: string;
  parentCommentId: string | null;
  likes: string[];
  title: string;
  author: string;
  body: string;
  createdOn: Date;
  lastUpdated: Date;
  deleted: boolean;
  replies: BlogPostCommentReturn[];
  topLevelCommentCount: number;
  totalCommentCount: number;
}

export interface BlogPostReturn {
  blogId: string;
  title: string;
  body: string;
  author: string;
  createdOn: Date;
  lastUpdated: Date;
  comments: BlogPostCommentReturn[];
  likes: string[];
  deleted: boolean;
  topLevelCommentCount: number;
  totalCommentCount: number;
}
export interface BlogPostEditDetails {
  title?: string;
  body?: string;
}

export interface CommentDetails {
  title: string;
  body: string;
  parentCommentId?: string | null;
}

export enum SortTypes {
  DATE_ASC = 1,
  DATE_DEC,
  TITLE_ASC,
  TITLE_DEC,
  LIKES_ASC,
  LIKES_DEC,
}
