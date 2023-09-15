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
  did?: string;
  address?: string;
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

export type ProfileTypeBasedOnCommunities<T extends keyof Communities> = Communities[T]
