import { AllostasisConstructor, Chain, Chat, ChatMessage, Communities, Profile, ProfileTypeBasedOnCommunities } from './types/allostasis';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { IPFSHTTPClient } from 'kubo-rpc-client';
export default class Allostasis<TCommunity extends keyof Communities = keyof Communities> {
    private community;
    private nodeURL;
    provider: any;
    chain: Chain;
    ceramic: CeramicClient;
    composeClient: ComposeClient;
    lit: LitNodeClient;
    ipfs: IPFSHTTPClient;
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
    getProfile(): Promise<ProfileTypeBasedOnCommunities<TCommunity>>;
    getUserProfile(id: string): Promise<Profile>;
    getCommunityUserProfile(id: string): Promise<ProfileTypeBasedOnCommunities<TCommunity>>;
    createChat(recipient: string): Promise<Chat>;
    getChat(id: string): Promise<Chat>;
    sendChatMessage(content: string, chatId: string, profileId: string, userAddress: string, recipientAddress: string): Promise<ChatMessage>;
    sendChatMessageFile(file: Blob, chatId: string, profileId: string, userAddress: string, recipientAddress: string): Promise<ChatMessage>;
    decryptContent(content: string, unifiedAccessControlConditions: string, encryptedSymmetricKey: string): Promise<string>;
}
