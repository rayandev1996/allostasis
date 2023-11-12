import { GreeniaProfile } from './greenia';
import { EmbodiaProfile } from './embodia';
import { AvatiaProfile } from './avatia';
import { CenteriaProfile } from './centeria';
import { IncarniaProfile } from './incarnia';
import { WeariaProfile } from './wearia';
export interface AllostasisConstructor {
    nodeURL: string;
    provider?: any;
    chain?: Chain;
    infura: {
        url?: string;
        projectId: string;
        apiKey: string;
    };
    connectPush?: boolean;
}
export interface Chain {
    name: string;
    id: number | string;
}
export type Communities = {
    greenia: GreeniaProfile;
    embodia: EmbodiaProfile;
    avatia: AvatiaProfile;
    centeria: CenteriaProfile;
    incarnia: IncarniaProfile;
    wearia: WeariaProfile;
};
export interface Profile {
    id?: string;
    displayName?: string;
    email?: string;
    bio?: string;
    avatar?: string;
    cover?: string;
    chats?: Chat[];
    receivedChats?: Chat[];
    did?: string;
    address?: string;
    walletAddress?: string;
    skills?: string[];
    socialLinks?: string[];
    age?: number;
    phoneNumber?: string;
    accountType?: AccountType;
    gender?: Gender;
    educations?: Education[];
    experiences?: Experience[];
    posts?: Post[];
    postsCount?: number;
    followings?: Follow[];
    followingsCount?: number;
    followers?: Follow[];
    followersCount?: number;
}
export declare enum AccountType {
    PERSONAL = "PERSONAL",
    ENTERPRISE = "ENTERPRISE"
}
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export interface Chat {
    chatId?: string;
    about?: string;
    did?: string;
    intent?: string;
    intentSentBy?: string;
    intentTimestamp?: string;
    publicKey?: string;
    profilePicture?: string;
    threadhash?: string;
    wallets?: string;
    combinedDID?: string;
    name?: string;
    groupInformation?: string;
    msg?: ChatMessage;
}
export interface ChatMessage {
    fromDID?: string;
    toDID?: string;
    messageObj?: {};
    messageContent?: string;
    messageType?: string;
    timestamp?: number;
    fromCAIP10?: string;
    toCAIP10?: string;
    encryptedSecret?: string;
    encType?: string;
    signature?: string;
    sigType?: string;
    verificationProof?: string;
    link?: string;
}
export interface Education {
    id?: string;
    title?: string;
    city?: string;
    school?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    isDeleted?: boolean;
}
export interface Experience {
    id?: string;
    city?: string;
    title?: string;
    company?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
    isDeleted?: boolean;
}
export interface Post {
    id?: string;
    creator?: {
        id?: string;
    };
    body?: string;
    createdAt?: any;
    isDeleted?: boolean;
    isEncrypted?: boolean;
    profileID?: string;
    profile?: Profile;
    tags?: string[];
    attachment?: string;
    externalURL?: string;
    encryptedSymmetricKey?: string;
    unifiedAccessControlConditions?: string;
    commentsCount?: number;
    likesCount?: number;
    comments?: PostComment[];
    likes?: PostLike[];
}
export interface Follow {
    id?: string;
    isDeleted?: boolean;
    profileID?: string;
    targetProfileID?: string;
    creator?: {
        id?: string;
    };
    profile?: Profile;
    targetProfile?: Profile;
}
export interface PostComment {
    id?: string;
    content?: string;
    createdAt?: any;
    postID?: string;
    isDeleted?: boolean;
    replyingToID?: string;
    profileID?: string;
    profile?: Profile;
}
export interface PostLike {
    id?: string;
    postID?: string;
    isDeleted?: boolean;
    profileID?: string;
    profile?: Profile;
}
export type ProfileTypeBasedOnCommunities<T extends keyof Communities> = Communities[T];
