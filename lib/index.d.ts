import { AllostasisConstructor, Chain, Communities, Profile, ProfileTypeBasedOnCommunities, Post, PostComment, Education, Experience, Chat, ChatMessage, ENV, PROVIDER_TYPE } from './types/allostasis';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { Web3Provider } from '@ethersproject/providers';
import { IPFSHTTPClient } from 'kubo-rpc-client';
import { Client, Session } from '@heroiclabs/nakama-js';
import { DID } from 'dids';
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
    constructor(community: TCommunity, options: AllostasisConstructor);
    connect(): Promise<{
        did: any;
        address: string;
        authenticatedEncryptionDid: string;
    }>;
    connectManual(provider: any, entropy: any): Promise<{
        did: any;
        address: string;
        authenticatedEncryptionDid: string;
    }>;
    disconnect(address?: string): Promise<boolean>;
    isConnected(): Promise<{
        did: any;
        address: string;
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
}
