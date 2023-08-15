import { AllostasisConstructor, Chat, ChatMessage, Communities, Profile, ProfileTypeBasedOnCommunities } from './types/allostasis';
import { GreeniaProfile } from './types/greenia';
export default class Allostasis {
    private community;
    private nodeURL;
    private provider;
    private chain;
    private ceramic;
    private composeClient;
    private lit;
    constructor(community: keyof Communities, options: AllostasisConstructor);
    connect(): Promise<{
        did: any;
        address: string;
    }>;
    disconnect(address?: string): Promise<boolean>;
    isConnected(): Promise<{
        did: any;
        address: string;
    }>;
    createOrUpdateProfile<T extends typeof this.community>(params: ProfileTypeBasedOnCommunities<T>): Promise<ProfileTypeBasedOnCommunities<T>>;
    getProfile(): Promise<Profile | GreeniaProfile>;
    getUserProfile(id: string): Promise<ProfileTypeBasedOnCommunities<typeof this.community>>;
    createChat(recipient: string): Promise<Chat>;
    getChat(id: string): Promise<Chat>;
    sendMessage(content: string, chatId: string, profileId: string, userAddress: string, recipientAddress: string): Promise<ChatMessage>;
}
