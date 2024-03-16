export interface StartupProfile {
  creator?: {
    id: string;
  };
  id?: string;
  name?: string;
  slogan?: string;
  cover?: string;
  logo?: string;
  projectHistory?: string;
  projectCompellingVideo?: string;
  projectVision?: string;
  projectMission?: string;
  requestedFund?: number;
  fundingStartDate?: Date;
  email?: string;
  phoneNumber?: string;
  address?: string;
  socialLinks?: string[];
  did?: string;
  walletAddress?: string;
  posts?: StartupPost[];
  postsCount?: number;
  articles?: StartupArticle[];
  articlesCount?: number;
  nakamaID?: string;
  platformID?: string;
  publicEncryptionDID?: {
    id: string;
  };
}

export interface StartupPost {
  id?: string;
  creator?: {
    id: string;
  };
  content?: string;
  createdAt?: any;
  isDeleted?: boolean;
  profileID?: string;
  profile?: StartupProfile;
  tags?: string[];
  attachment?: string;
  commentsCount?: number;
  likesCount?: number;
  comments?: StartupPostComment[];
  likes?: StartupPostLike[];
}

export interface StartupPostComment {
  creator?: {
    id: string;
  };
  id?: string;
  content?: string;
  createdAt?: any;
  postID?: string;
  isDeleted?: boolean;
  parentID?: string;
  profileID?: string;
  profile?: StartupProfile;
}

export interface StartupPostLike {
  creator?: {
    id: string;
  };
  id?: string;
  postID?: string;
  isDeleted?: boolean;
  profileID?: string;
  profile?: StartupProfile;
}

export interface StartupArticle {
  createdAt?: any;
  id?: string;
  creator?: {
    id: string;
  };
  abstract?: string;
  visualAbstract?: string;
  body?: string;
  price?: number;
  unifiedAccessControlConditions?: string;
  encryptedSymmetricKey?: string;
  isDeleted?: boolean;
  isEncrypted?: boolean;
  profileID?: string;
  profile?: StartupProfile;
  tags?: string[];
  attachment?: string;
  externalURL?: string;
  commentsCount?: number;
  likesCount?: number;
  comments?: StartupArticleComment[];
  likes?: StartupArticleLike[];
}

export interface StartupArticleComment {
  creator?: {
    id: string;
  };
  id?: string;
  content?: string;
  createdAt?: any;
  articleID?: string;
  isDeleted?: boolean;
  replyingToID?: string;
  profileID?: string;
  profile?: StartupProfile;
}

export interface StartupArticleLike {
  creator?: {
    id: string;
  };
  id?: string;
  articleID?: string;
  isDeleted?: boolean;
  profileID?: string;
  profile?: StartupProfile;
}
