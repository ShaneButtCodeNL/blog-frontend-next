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
