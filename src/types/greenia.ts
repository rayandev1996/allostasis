import {Profile} from "./allostasis";

export interface GreeniaProfile extends Profile {
    greeniaProfileId?: string;
    cover?: string;
    bio?: string;
    skills?: string[];
    educations?: GreeniaProfileEducation[];
    experiences?: GreeniaProfileExperience[];
    articles?: GreeniaArticle[];
    articlesCount?: number;
    followings?: GreeniaFollow[];
    followingsCount?: number;
    followers?: GreeniaFollow[];
    followersCount?: number;
}

export interface GreeniaProfileEducation {
    id?: string;
    title?: string;
    city?: string;
    school?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    isDeleted?: boolean;
}

export interface GreeniaProfileExperience {
    id?: string;
    city?: string;
    title?: string;
    company?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    isDeleted?: boolean;
}

export interface GreeniaArticle {
    creator?: {
        id?: string;
    };
    body?: string;
    creationDate?: any;
    id?: string;
    isDeleted?: boolean;
    isEncrypted?: boolean;
    price?: number;
    greeniaProfileID?: string;
    greeniaProfile?: GreeniaProfile;
    shortDescription?: string;
    tags?: string[];
    thumbnail?: string;
    title?: string;
    encryptedSymmetricKey?: string;
    unifiedAccessControlConditions?: string;
    commentsCount?: number;
    likesCount?: number;
    comments?: GreeniaArticleComment[];
    likes?: GreeniaArticleLike[];
    permissionRequests?: GreeniaArticlePermissionRequest[];
}

export interface GreeniaArticlePermissionRequest {
    id?: string;
    content?: string;
    articleID?: string;
    profileID?: string;
    isDeleted?: boolean;
    status?: GreeniaArticlePermissionRequestStatus[];
    article?: GreeniaArticle;
    greeniaProfile?: GreeniaProfile;
    cursor?: string;
    creator?: {
        id?: string;
    };
}

export interface GreeniaArticlePermissionRequestStatus {
    status: boolean;
    articlePermissionRequestID: string;
}

export interface GreeniaFollow {
    id?: string;
    isDeleted?: boolean;
    profileID?: string;
    targetProfileID?: string;
    creator?: {
        id?: string;
    };
    profile?: GreeniaProfile;
    targetProfile?: GreeniaProfile;
}

export interface GreeniaArticleComment {
    content?: string;
    articleID?: string;
    isDeleted?: boolean;
    replyingToID?: string;
    greeniaProfileID?: string;
    greeniaProfile?: GreeniaProfile
}

export interface GreeniaArticleLike {
    articleID?: string;
    isDeleted?: boolean;
    greeniaProfileID?: string;
    greeniaProfile?: GreeniaProfile
}
