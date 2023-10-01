import { AllostasisConstructor, Chain, ChatMessage, Communities, Profile, ProfileTypeBasedOnCommunities } from './types/allostasis';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { Web3Provider } from '@ethersproject/providers';
import { IPFSHTTPClient } from 'kubo-rpc-client';
import { IFeeds, IMessageIPFS, IUser, Message, MessageWithCID, SignerType } from '@pushprotocol/restapi';
export default class Allostasis<TCommunity extends keyof Communities = keyof Communities> {
    private community;
    private nodeURL;
    provider: any;
    chain: Chain;
    ceramic: CeramicClient;
    composeClient: ComposeClient;
    lit: LitNodeClient;
    ipfs: IPFSHTTPClient;
    ethersProvider: Web3Provider;
    ethersSigner: SignerType;
    ethersAddress: string;
    chatUser: IUser;
    pvtKey: any;
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
    getChats(): Promise<IFeeds[]>;
    createChat(recipient: string): Promise<MessageWithCID>;
    getChatHistory(recipient: string): Promise<IMessageIPFS[]>;
    sendChatMessage(recipient: string, message: Message): Promise<MessageWithCID>;
    sendChatMessageFile(file: Blob, chatId: string, profileId: string, userAddress: string, recipientAddress: string): Promise<ChatMessage>;
    decryptContent(content: string, unifiedAccessControlConditions: string, encryptedSymmetricKey: string): Promise<string>;
}
