import {Profile} from "./allostasis";

export interface GreeniaProfile extends Profile {
    cover?: string;
    bio?: string;
    skills?: string[];
    educations: GreeniaProfileEducation[];
    experiences: GreeniaProfileExperience[];
}

export interface GreeniaProfileEducation {
    id: string;
    title: string;
    city: string;
    company: string;
    startDate?: Date;
    endDate?: Date;
    description: string;
    isDeleted: boolean;
}

export interface GreeniaProfileExperience {
    id: string;
    school: string;
    title: string;
    city: string;
    startDate?: Date;
    endDate?: Date;
    description: string;
    isDeleted: boolean;
}
