import { UnifiedAccessControlConditions } from '@lit-protocol/types/src/lib/types';
import { AllostasisConstructor, Chain, Communities, Profile, ProfileTypeBasedOnCommunities, Post, PostComment, Education, Experience } from './types/allostasis';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { Web3Provider } from '@ethersproject/providers';
import { IPFSHTTPClient } from 'kubo-rpc-client';
import { Client, Session } from '@heroiclabs/nakama-js';
export default class Allostasis<TCommunity extends keyof Communities = keyof Communities> {
    private community;
    nodeURL: string;
    provider: any;
    chain: Chain;
    ceramic: CeramicClient;
    composeClient: ComposeClient;
    lit: LitNodeClient;
    ipfs: IPFSHTTPClient;
    ethersProvider: Web3Provider;
    ethersAddress: string;
    pvtKey: any;
    nakamaClient: Client;
    nakamaSession: Session;
    constructor(community: TCommunity, options: AllostasisConstructor);
    connect(): Promise<{
        did: any;
        address: string;
    }>;
    disconnect(address?: string): Promise<boolean>;
    isConnected(): Promise<{
        did: any;
        address: string;
    }>;
    createOrUpdateProfile(params: ProfileTypeBasedOnCommunities<TCommunity>): Promise<ProfileTypeBasedOnCommunities<TCommunity>>;
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
    encryptContent(content: string, unifiedAccessControlConditions: UnifiedAccessControlConditions): Promise<{
        encryptedString: string;
        encryptedSymmetricKey: string;
        unifiedAccessControlConditions: string;
    }>;
    decryptContent(content: string, unifiedAccessControlConditions: string, encryptedSymmetricKey: string): Promise<string>;
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
}
