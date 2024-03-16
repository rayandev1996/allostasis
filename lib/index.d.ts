import { AllostasisConstructor, Chain, Communities, Profile, ProfileTypeBasedOnCommunities, Post, PostComment, Education, Experience, Chat, ChatMessage, ENV, PROVIDER_TYPE, Article, ArticleComment, SDK_MODEL } from './types/allostasis';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { Web3Provider } from '@ethersproject/providers';
import { IPFSHTTPClient } from 'kubo-rpc-client';
import { Client, Session } from '@heroiclabs/nakama-js';
import { DID } from 'dids';
import { StartupArticle, StartupPost, StartupProfile } from './types/startup';
import { PlatformArticle, PlatformPost, PlatformProfile } from './types/platform';
export default class Allostasis<TCommunity extends keyof Communities = keyof Communities> {
    community: TCommunity;
    providerType: PROVIDER_TYPE;
    env: ENV;
    nodeURL: string;
    provider: any;
    chain: Chain;
    ceramic: CeramicClient;
    composeClient: ComposeClient;
    ipfs: IPFSHTTPClient;
    ethersProvider: Web3Provider;
    ethersAddress: string;
    pvtKey: any;
    nakamaClient: Client;
    nakamaSession: Session;
    encryptionDid: DID;
    authenticatedEncryptionDid: string;
    model: SDK_MODEL;
    constructor(community: TCommunity, options: AllostasisConstructor);
    connect(address: string): Promise<{
        did: any;
        authenticatedEncryptionDid: string;
    }>;
    disconnect(): Promise<boolean>;
    isConnected(address: string): Promise<{
        did: any;
        authenticatedEncryptionDid: string;
    }>;
    createOrUpdateProfile(params: Omit<ProfileTypeBasedOnCommunities<TCommunity>, 'publicEncryptionDID'> & {
        publicEncryptionDID?: string;
    }): Promise<ProfileTypeBasedOnCommunities<TCommunity>>;
    createEducation: (params: {
        title: string;
        school: string;
        city: string;
        description: string;
        startDate: Date;
        endDate?: Date;
        profileID: string;
    }) => Promise<Education>;
    updateEducation: (params: {
        id: string;
        title: string;
        school: string;
        city: string;
        description: string;
        startDate: Date;
        endDate?: Date;
        profileID: string;
        isDeleted?: boolean;
    }) => Promise<Education>;
    createExperience: (params: {
        title: string;
        company: string;
        city: string;
        description: string;
        startDate: Date;
        endDate?: Date;
        profileID: string;
    }) => Promise<Experience>;
    updateExperience: (params: {
        id: string;
        title: string;
        company: string;
        city: string;
        description: string;
        startDate: Date;
        endDate?: Date;
        profileID: string;
        isDeleted?: boolean;
    }) => Promise<Education>;
    getProfile(): Promise<ProfileTypeBasedOnCommunities<TCommunity>>;
    getUserProfile(id: string): Promise<Profile>;
    getUserProfiles(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
        };
    }): Promise<{
        users: Profile[];
        cursor: string;
    }>;
    getCommunityUserProfile(id: string): Promise<ProfileTypeBasedOnCommunities<TCommunity>>;
    createArticle(params: {
        abstract: string;
        visualAbstract: string;
        price: number;
        body: string;
        tags?: string[];
        attachment?: string;
        externalURL?: string;
        isEncrypted?: boolean;
        profileID: string;
    }): Promise<Article>;
    updateArticle(params: {
        id: string;
        abstract: string;
        visualAbstract: string;
        price: string;
        body: string;
        tags?: string[];
        attachment?: string;
        externalURL?: string;
        isEncrypted?: boolean;
        unifiedAccessControlConditions?: string;
        encryptedSymmetricKey?: string;
        profileID: string;
    }): Promise<Article>;
    getArticles(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
            profiles?: string[];
        };
    }): Promise<{
        articles: Article[];
        cursor: string;
    }>;
    getArticle(params: {
        id: string;
    }): Promise<Article | undefined>;
    createArticleComment: (params: {
        content: string;
        articleID: string;
        profileID: string;
        replyingTo?: string;
    }) => Promise<ArticleComment | undefined>;
    likeArticle: (params: {
        articleID: string;
        profileID: string;
    }) => Promise<boolean>;
    createPost(params: {
        body: string;
        tags?: string[];
        attachment?: string;
        externalURL?: string;
        isEncrypted?: boolean;
        profileID: string;
    }): Promise<Post>;
    updatePost(params: {
        id: string;
        body: string;
        tags?: string[];
        attachment?: string;
        externalURL?: string;
        isEncrypted?: boolean;
        unifiedAccessControlConditions?: string;
        encryptedSymmetricKey?: string;
        profileID: string;
    }): Promise<Post>;
    getPosts(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
            profiles?: string[];
        };
    }): Promise<{
        posts: Post[];
        cursor: string;
    }>;
    getPost(params: {
        id: string;
    }): Promise<Post | undefined>;
    createPostComment: (params: {
        content: string;
        postID: string;
        profileID: string;
        replyingTo?: string;
    }) => Promise<PostComment | undefined>;
    likePost: (params: {
        postID: string;
        profileID: string;
    }) => Promise<boolean>;
    follow: (params: {
        targetProfileID: string;
        profileID: string;
    }) => Promise<boolean>;
    userFollows: (params: {
        targetProfileID: string;
        profileID: string;
    }) => Promise<boolean>;
    getOrCreateChat(params: {
        profileID: string;
        recipientProfileID: string;
        channelID: string;
    }): Promise<Chat>;
    getChats(params: {
        profile: string;
        cursor: string;
    }): Promise<{
        chats: Chat[];
        cursor: string;
    }>;
    sendMessage(params: {
        content: string;
        chatID: string;
        profileID: string;
        messageType: string;
        encryptionDid?: string[];
        publicEncryptionDIDs?: string[];
    }): Promise<ChatMessage>;
    createOrUpdateStartupProfile(params: Omit<StartupProfile, 'publicEncryptionDID'> & {
        publicEncryptionDID?: string;
    }): Promise<StartupProfile>;
    getStartupProfile(): Promise<StartupProfile>;
    getStartupProfileByID(id: string): Promise<StartupProfile>;
    getStartupProfiles(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
        };
    }): Promise<{
        users: PlatformProfile[];
        cursor: string;
    }>;
    createStartupArticle(params: {
        abstract: string;
        visualAbstract: string;
        price: number;
        body: string;
        tags?: string[];
        attachment?: string;
        externalURL?: string;
        isEncrypted?: boolean;
        profileID: string;
    }): Promise<StartupArticle>;
    updateStartupArticle(params: {
        id: string;
        abstract: string;
        visualAbstract: string;
        price: string;
        body: string;
        tags?: string[];
        attachment?: string;
        externalURL?: string;
        isEncrypted?: boolean;
        unifiedAccessControlConditions?: string;
        encryptedSymmetricKey?: string;
        profileID: string;
    }): Promise<StartupArticle>;
    getStartupArticles(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
            profiles?: string[];
        };
    }): Promise<{
        articles: StartupArticle[];
        cursor: string;
    }>;
    getStartupArticle(params: {
        id: string;
    }): Promise<StartupArticle | undefined>;
    createStartupPost(params: {
        body: string;
        tags?: string[];
        attachment?: string;
        profileID: string;
    }): Promise<StartupPost>;
    updateStartupPost(params: {
        id: string;
        body: string;
        tags?: string[];
        attachment?: string;
        profileID: string;
    }): Promise<StartupPost>;
    getStartupPosts(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
            profiles?: string[];
        };
    }): Promise<{
        posts: StartupPost[];
        cursor: string;
    }>;
    getStartupPost(params: {
        id: string;
    }): Promise<StartupPost | undefined>;
    createOrUpdatePlatformProfile(params: Omit<PlatformProfile, 'publicEncryptionDID'> & {
        publicEncryptionDID?: string;
    }): Promise<PlatformProfile>;
    getPlatformProfile(): Promise<PlatformProfile>;
    getPlatformProfileByID(id: string): Promise<PlatformProfile>;
    getPlatformProfiles(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
        };
    }): Promise<{
        users: PlatformProfile[];
        cursor: string;
    }>;
    createPlatformArticle(params: {
        abstract: string;
        visualAbstract: string;
        price: number;
        body: string;
        tags?: string[];
        attachment?: string;
        externalURL?: string;
        isEncrypted?: boolean;
        profileID: string;
    }): Promise<PlatformArticle>;
    updatePlatformArticle(params: {
        id: string;
        abstract: string;
        visualAbstract: string;
        price: string;
        body: string;
        tags?: string[];
        attachment?: string;
        externalURL?: string;
        isEncrypted?: boolean;
        unifiedAccessControlConditions?: string;
        encryptedSymmetricKey?: string;
        profileID: string;
    }): Promise<PlatformArticle>;
    getPlatformArticles(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
            profiles?: string[];
        };
    }): Promise<{
        articles: PlatformArticle[];
        cursor: string;
    }>;
    getPlatformArticle(params: {
        id: string;
    }): Promise<PlatformArticle | undefined>;
    createPlatformPost(params: {
        body: string;
        tags?: string[];
        attachment?: string;
        profileID: string;
    }): Promise<PlatformPost>;
    updatePlatformPost(params: {
        id: string;
        body: string;
        tags?: string[];
        attachment?: string;
        profileID: string;
    }): Promise<PlatformPost>;
    getPlatformPosts(params: {
        numberPerPage: number;
        cursor: string;
        search?: {
            q?: string;
            profiles?: string[];
        };
    }): Promise<{
        posts: PlatformPost[];
        cursor: string;
    }>;
    getPlatformPost(params: {
        id: string;
    }): Promise<PlatformPost | undefined>;
}
