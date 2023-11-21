import {
  GreeniaProfile
} from './greenia';
import { EmbodiaProfile } from './embodia';
import { AvatiaProfile } from './avatia';
import { CenteriaProfile } from './centeria';
import { IncarniaProfile } from './incarnia';
import { WeariaProfile } from './wearia';

export interface AllostasisConstructor {
  nodeURL: string;
  provider?: any;
  chain?: Chain;
  infura?: {
    url: string;
    projectId: string;
    apiKey: string
  }
  nakama?: {
    server: string;
    port: string;
    key: string;
    useSSL: boolean;
  }
}

export interface Chain {
  name: string;
  id: number | string;
  rpcURLs?: string[];
  blockExplorerUrls?: string[];
  currency?: {
    name: string;
    symbol: string;
    decimals: number;
  }
}

export type Communities = {
  greenia: GreeniaProfile
  embodia: EmbodiaProfile
  avatia: AvatiaProfile
  centeria: CenteriaProfile
  incarnia: IncarniaProfile
  wearia: WeariaProfile
}

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
  nakamaID?: string;
}

export enum AccountType {
  PERSONAL = 'PERSONAL',
  ENTERPRISE = 'ENTERPRISE'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface Chat {
  channelID?: string;
  createdAt?: string;
  id?: string;
  isDeleted?: boolean;
  messagesCount?: number;
  profile?: {
    id?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    nakamaID?: string;
  };
  recipientProfile?: {
    id?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    nakamaID?: string;
  };
  messages?: ChatMessage[];
}

export interface ChatMessage {
  body?: string;
  createdAt?: string;
  encryptedSymmetricKey?: string;
  id?: string;
  messageType?: string;
  profileID?: string;
  unifiedAccessControlConditions?: string;
  profile?: {
    id?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    nakamaID?: string;
  };
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
  profile?: Profile
}

export interface PostLike {
  id?: string;
  postID?: string;
  isDeleted?: boolean;
  profileID?: string;
  profile?: Profile
}

export type ProfileTypeBasedOnCommunities<T extends keyof Communities> = Communities[T]
