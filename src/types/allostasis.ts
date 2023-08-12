export interface AllostasisConstructor {
  nodeURL: string;
  provider?: any;
  chain?: Chain;
  community: Communities;
}

export interface Chain {
  name: 'mumbai';
  code: number;
}

export type Communities =
  | 'greenia'
  | 'embodia'
  | 'avatia'
  | 'centeria'
  | 'incarnia'
  | 'wearia';

export interface Profile {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface EmbodiaProfile extends Profile {}
export interface AvatiaProfile extends Profile {}
export interface IncarniaProfile extends Profile {}
export interface CenteriaProfile extends Profile {}
export interface WeariaProfile extends Profile {}
