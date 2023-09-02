"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            id: 'kjzl6hvfrbw6c54idp7x7vng2cq9lcdpvs3akepphr0r697fpiuytvwyzy98cv6',
            accountRelation: { type: 'single' }
        },
        Chat: {
            id: 'kjzl6hvfrbw6ca2ht7q6ejvzb193c6cv6p0xdt5usgwvwbfywswir49nuc1mnci',
            accountRelation: { type: 'list' }
        },
        ChatMessage: {
            id: 'kjzl6hvfrbw6c91nm7mdlnbe8fvge1g9zdjnsfvt9inwip4jsck0mn8mcxq4d6i',
            accountRelation: { type: 'list' }
        },
        GreeniaProfile: {
            id: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
            accountRelation: { type: 'single' }
        },
        GreeniaArticle: {
            id: 'kjzl6hvfrbw6c62zrfmgijr75esorupch0fnvc8trg94j42nzraeeusc3m88n8c',
            accountRelation: { type: 'list' }
        },
        GreeniaArticleComment: {
            id: 'kjzl6hvfrbw6c7vu7cp68kzxeh00e2zwnizkdx7akgslp09u6glbusncz2u2jm7',
            accountRelation: { type: 'list' }
        },
        GreeniaArticleLike: {
            id: 'kjzl6hvfrbw6c92lf8tp76xtqd40dnhsj2cavs2uqc460no7ktiss96xluehbnr',
            accountRelation: { type: 'list' }
        },
        GreeniaArticlePermissionRequest: {
            id: 'kjzl6hvfrbw6c7tucbp3scc15j3a0zx4w7n56hfsfyqiuufmvya1uzdg2k4zm64',
            accountRelation: { type: 'list' }
        },
        GreeniaArticlePermissionRequestStatus: {
            id: 'kjzl6hvfrbw6c6zsxhrz1uq3z6j4mfsi05ymx2l176bctk74wa7ygbi6ule7rzr',
            accountRelation: { type: 'list' }
        },
        GreeniaFollow: {
            id: 'kjzl6hvfrbw6c7ot9q7vo4117xzfb4ufx61cr6372f8av7vm5e0x7cdj5n4apxm',
            accountRelation: { type: 'list' }
        },
        GreeniaProfileEducation: {
            id: 'kjzl6hvfrbw6c7bpg7zk1m29l3bvbud7v3jj64c0otaivw1aznc3gl0ggfpzydg',
            accountRelation: { type: 'list' }
        },
        GreeniaProfileExperience: {
            id: 'kjzl6hvfrbw6c7rjcz1b8qlrzmyf52zbddm53okcpururos8l3di0zw90d21ckq',
            accountRelation: { type: 'list' }
        }
    },
    objects: {
        Profile: {
            name: { type: 'string', required: false },
            email: { type: 'string', required: false },
            avatar: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            chats: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6ca2ht7q6ejvzb193c6cv6p0xdt5usgwvwbfywswir49nuc1mnci',
                    property: 'profileID'
                }
            },
            chatsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6ca2ht7q6ejvzb193c6cv6p0xdt5usgwvwbfywswir49nuc1mnci',
                    property: 'profileID'
                }
            },
            receivedChats: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6ca2ht7q6ejvzb193c6cv6p0xdt5usgwvwbfywswir49nuc1mnci',
                    property: 'recipientProfileID'
                }
            },
            receivedChatsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6ca2ht7q6ejvzb193c6cv6p0xdt5usgwvwbfywswir49nuc1mnci',
                    property: 'recipientProfileID'
                }
            }
        },
        Chat: {
            createdAt: { type: 'datetime', required: true },
            isDeleted: { type: 'boolean', required: true },
            profileID: { type: 'streamid', required: true },
            relationID: { type: 'string', required: false },
            recipientProfileID: { type: 'streamid', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c54idp7x7vng2cq9lcdpvs3akepphr0r697fpiuytvwyzy98cv6',
                    property: 'profileID'
                }
            },
            recipientProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c54idp7x7vng2cq9lcdpvs3akepphr0r697fpiuytvwyzy98cv6',
                    property: 'recipientProfileID'
                }
            },
            messages: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c91nm7mdlnbe8fvge1g9zdjnsfvt9inwip4jsck0mn8mcxq4d6i',
                    property: 'chatID'
                }
            },
            messagesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c91nm7mdlnbe8fvge1g9zdjnsfvt9inwip4jsck0mn8mcxq4d6i',
                    property: 'chatID'
                }
            }
        },
        ChatMessage: {
            body: { type: 'string', required: true },
            chatID: { type: 'streamid', required: true },
            createdAt: { type: 'datetime', required: true },
            profileID: { type: 'streamid', required: true },
            messageType: { type: 'string', required: true },
            encryptedSymmetricKey: { type: 'string', required: true },
            unifiedAccessControlConditions: { type: 'string', required: true },
            chat: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6ca2ht7q6ejvzb193c6cv6p0xdt5usgwvwbfywswir49nuc1mnci',
                    property: 'chatID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c54idp7x7vng2cq9lcdpvs3akepphr0r697fpiuytvwyzy98cv6',
                    property: 'profileID'
                }
            }
        },
        GreeniaProfile: {
            bio: { type: 'string', required: false },
            cover: { type: 'string', required: false },
            skills: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false }
            },
            profileID: { type: 'string', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            experiences: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7rjcz1b8qlrzmyf52zbddm53okcpururos8l3di0zw90d21ckq',
                    property: 'greeniaProfileID'
                }
            },
            educations: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7bpg7zk1m29l3bvbud7v3jj64c0otaivw1aznc3gl0ggfpzydg',
                    property: 'greeniaProfileID'
                }
            },
            followings: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7ot9q7vo4117xzfb4ufx61cr6372f8av7vm5e0x7cdj5n4apxm',
                    property: 'greeniaProfileID'
                }
            },
            followingsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c7ot9q7vo4117xzfb4ufx61cr6372f8av7vm5e0x7cdj5n4apxm',
                    property: 'greeniaProfileID'
                }
            },
            followers: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7ot9q7vo4117xzfb4ufx61cr6372f8av7vm5e0x7cdj5n4apxm',
                    property: 'targetGreeniaProfileID'
                }
            },
            followersCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c7ot9q7vo4117xzfb4ufx61cr6372f8av7vm5e0x7cdj5n4apxm',
                    property: 'targetGreeniaProfileID'
                }
            },
            articles: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c62zrfmgijr75esorupch0fnvc8trg94j42nzraeeusc3m88n8c',
                    property: 'greeniaProfileID'
                }
            },
            articlesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c62zrfmgijr75esorupch0fnvc8trg94j42nzraeeusc3m88n8c',
                    property: 'greeniaProfileID'
                }
            }
        },
        GreeniaArticle: {
            body: { type: 'string', required: true },
            tags: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false }
            },
            price: { type: 'float', required: true },
            title: { type: 'string', required: true },
            createdAt: { type: 'datetime', required: true },
            isDeleted: { type: 'boolean', required: true },
            thumbnail: { type: 'string', required: false },
            isEncrypted: { type: 'boolean', required: true },
            greeniaProfileID: { type: 'streamid', required: true },
            shortDescription: { type: 'string', required: true },
            encryptedSymmetricKey: { type: 'string', required: false },
            unifiedAccessControlConditions: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            greeniaProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
                    property: 'greeniaProfileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7vu7cp68kzxeh00e2zwnizkdx7akgslp09u6glbusncz2u2jm7',
                    property: 'articleID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c7vu7cp68kzxeh00e2zwnizkdx7akgslp09u6glbusncz2u2jm7',
                    property: 'articleID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c92lf8tp76xtqd40dnhsj2cavs2uqc460no7ktiss96xluehbnr',
                    property: 'articleID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c92lf8tp76xtqd40dnhsj2cavs2uqc460no7ktiss96xluehbnr',
                    property: 'articleID'
                }
            },
            permissionRequests: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7tucbp3scc15j3a0zx4w7n56hfsfyqiuufmvya1uzdg2k4zm64',
                    property: 'articleID'
                }
            }
        },
        GreeniaArticleComment: {
            content: { type: 'string', required: true },
            articleID: { type: 'streamid', required: true },
            isDeleted: { type: 'boolean', required: true },
            replyingToID: { type: 'streamid', required: false },
            greeniaProfileID: { type: 'streamid', required: true },
            article: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c62zrfmgijr75esorupch0fnvc8trg94j42nzraeeusc3m88n8c',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            greeniaProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
                    property: 'greeniaProfileID'
                }
            }
        },
        GreeniaArticleLike: {
            articleID: { type: 'streamid', required: true },
            isDeleted: { type: 'boolean', required: true },
            greeniaProfileID: { type: 'streamid', required: true },
            article: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c62zrfmgijr75esorupch0fnvc8trg94j42nzraeeusc3m88n8c',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            greeniaProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
                    property: 'greeniaProfileID'
                }
            }
        },
        GreeniaArticlePermissionRequest: {
            content: { type: 'string', required: false },
            articleID: { type: 'streamid', required: true },
            isDeleted: { type: 'boolean', required: true },
            greeniaProfileID: { type: 'streamid', required: true },
            article: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c62zrfmgijr75esorupch0fnvc8trg94j42nzraeeusc3m88n8c',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            greeniaProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
                    property: 'greeniaProfileID'
                }
            },
            status: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c6zsxhrz1uq3z6j4mfsi05ymx2l176bctk74wa7ygbi6ule7rzr',
                    property: 'articlePermissionRequestID'
                }
            }
        },
        GreeniaArticlePermissionRequestStatus: {
            status: { type: 'boolean', required: true },
            articlePermissionRequestID: { type: 'streamid', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            articlePermissionRequest: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7tucbp3scc15j3a0zx4w7n56hfsfyqiuufmvya1uzdg2k4zm64',
                    property: 'articlePermissionRequestID'
                }
            }
        },
        GreeniaFollow: {
            isDeleted: { type: 'boolean', required: true },
            greeniaProfileID: { type: 'streamid', required: true },
            targetGreeniaProfileID: { type: 'streamid', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            greeniaProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
                    property: 'greeniaProfileID'
                }
            },
            targetGreeniaProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
                    property: 'targetGreeniaProfileID'
                }
            }
        },
        GreeniaProfileEducation: {
            city: { type: 'string', required: true },
            title: { type: 'string', required: true },
            school: { type: 'string', required: true },
            endDate: { type: 'date', required: false },
            isDeleted: { type: 'boolean', required: true },
            startDate: { type: 'date', required: true },
            description: { type: 'string', required: true },
            greeniaProfileID: { type: 'streamid', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            greeniaProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
                    property: 'greeniaProfileID'
                }
            }
        },
        GreeniaProfileExperience: {
            city: { type: 'string', required: true },
            title: { type: 'string', required: true },
            company: { type: 'string', required: true },
            endDate: { type: 'date', required: false },
            isDeleted: { type: 'boolean', required: true },
            startDate: { type: 'date', required: true },
            description: { type: 'string', required: true },
            greeniaProfileID: { type: 'streamid', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            greeniaProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
                    property: 'greeniaProfileID'
                }
            }
        }
    },
    enums: {},
    accountData: {
        profile: { type: 'node', name: 'Profile' },
        chatList: { type: 'connection', name: 'Chat' },
        chatMessageList: { type: 'connection', name: 'ChatMessage' },
        greeniaProfile: { type: 'node', name: 'GreeniaProfile' },
        greeniaArticleList: { type: 'connection', name: 'GreeniaArticle' },
        greeniaArticleCommentList: {
            type: 'connection',
            name: 'GreeniaArticleComment'
        },
        greeniaArticleLikeList: { type: 'connection', name: 'GreeniaArticleLike' },
        greeniaArticlePermissionRequestList: {
            type: 'connection',
            name: 'GreeniaArticlePermissionRequest'
        },
        greeniaArticlePermissionRequestStatusList: {
            type: 'connection',
            name: 'GreeniaArticlePermissionRequestStatus'
        },
        greeniaFollowList: { type: 'connection', name: 'GreeniaFollow' },
        greeniaProfileEducationList: {
            type: 'connection',
            name: 'GreeniaProfileEducation'
        },
        greeniaProfileExperienceList: {
            type: 'connection',
            name: 'GreeniaProfileExperience'
        }
    }
};
