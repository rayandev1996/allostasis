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
    apiKey: string
  }
}

export interface Chain {
  name: string;
  id: number | string;
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
  name?: string;
  email?: string;
  avatar?: string;
  chats?: Chat[];
  receivedChats?: Chat[];
}

export interface Chat {
  id?: string;
  createdAt?: string;
  profile?: Profile;
  profileID?: string;
  recipientProfile?: Profile;
  recipientProfileID?: string;
  isDeleted?: boolean;
  messagesCount?: number;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id?: string;
  messageType?: 'text' | 'file';
  createdAt?: string;
  profile?: Profile;
  body?: string;
  unifiedAccessControlConditions?: string;
  encryptedSymmetricKey?: string;
  chat?: Chat;
}

export type ProfileTypeBasedOnCommunities<T extends keyof Communities> = Communities[T]
