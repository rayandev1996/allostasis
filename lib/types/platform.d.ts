export interface PlatformProfile {
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
    posts?: PlatformPost[];
    postsCount?: number;
    articles?: PlatformArticle[];
    articlesCount?: number;
    nakamaID?: string;
    publicEncryptionDID?: {
        id: string;
    };
}
export interface PlatformPost {
    id?: string;
    creator?: {
        id: string;
    };
    body?: string;
    createdAt?: any;
    isDeleted?: boolean;
    profileID?: string;
    profile?: PlatformProfile;
    tags?: string[];
    attachment?: string;
    commentsCount?: number;
    likesCount?: number;
    comments?: PlatformPostComment[];
    likes?: PlatformPostLike[];
}
export interface PlatformPostComment {
    creator?: {
        id: string;
    };
    id?: string;
    content?: string;
    createdAt?: any;
    postID?: string;
    isDeleted?: boolean;
    replyingToID?: string;
    profileID?: string;
    profile?: PlatformProfile;
}
export interface PlatformPostLike {
    creator?: {
        id: string;
    };
    id?: string;
    postID?: string;
    isDeleted?: boolean;
    profileID?: string;
    profile?: PlatformProfile;
}
export interface PlatformArticle {
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
    profile?: PlatformProfile;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    commentsCount?: number;
    likesCount?: number;
    comments?: PlatformArticleComment[];
    likes?: PlatformArticleLike[];
}
export interface PlatformArticleComment {
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
    profile?: PlatformProfile;
}
export interface PlatformArticleLike {
    creator?: {
        id: string;
    };
    id?: string;
    articleID?: string;
    isDeleted?: boolean;
    profileID?: string;
    profile?: PlatformProfile;
}
