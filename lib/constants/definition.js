"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            id: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
            accountRelation: { type: 'single' }
        },
        Article: {
            id: 'kjzl6hvfrbw6cankvgnn9dluhh057jp3wo515fefblyfd2ew6ngis7o34gkxbv2',
            accountRelation: { type: 'list' }
        },
        ArticleComment: {
            id: 'kjzl6hvfrbw6c9mga4hz9i53yr79s8sjpd7cz57jpqxgm0y2tavi2y7nxvfy3nc',
            accountRelation: { type: 'list' }
        },
        ArticleLike: {
            id: 'kjzl6hvfrbw6cbcts0egi1fr8uapw71hcjqu7o1wr2lcdbc25qa5ep3ii2r6xxi',
            accountRelation: { type: 'list' }
        },
        ArticlePermissionRequest: {
            id: 'kjzl6hvfrbw6c62434jskboy25bm25a5ym5ni0bzoxrmmgsd4lo3rlbziuyiwa5',
            accountRelation: { type: 'list' }
        },
        ArticlePermissionRequestStatus: {
            id: 'kjzl6hvfrbw6c6uabt6althg6t71dcs86hglyhqz2jtmzfv7er279wjsdn07yi8',
            accountRelation: { type: 'list' }
        },
        Follow: {
            id: 'kjzl6hvfrbw6c5kxlf7rz62y47sgycum3fu9y6wbbc5gvqwz6rawjqnobchuquf',
            accountRelation: { type: 'list' }
        },
        Chat: {
            id: 'kjzl6hvfrbw6c9voacu22d44n9qclr0gte090elzp4yunhvbvkxh3yxlk626p6a',
            accountRelation: { type: 'list' }
        },
        GreeniaProfile: {
            id: 'kjzl6hvfrbw6c81xqg432mn3y4am6674c0zhg1aw6sh3d074k8ftsqfv2wez86l',
            accountRelation: { type: 'single' }
        },
        GreeniaProfileEducation: {
            id: 'kjzl6hvfrbw6c7bpg7zk1m29l3bvbud7v3jj64c0otaivw1aznc3gl0ggfpzydg',
            accountRelation: { type: 'list' }
        },
        GreeniaProfileExperience: {
            id: 'kjzl6hvfrbw6c7rjcz1b8qlrzmyf52zbddm53okcpururos8l3di0zw90d21ckq',
            accountRelation: { type: 'list' }
        },
        ChatMessage: {
            id: 'kjzl6hvfrbw6c90hsp3vesq1fd9dmzb3d68noja59zqw6dkrq7v3ig2nv5r6myq',
            accountRelation: { type: 'list' }
        }
    },
    objects: {
        Profile: {
            name: { type: 'string', required: false },
            email: { type: 'string', required: false },
            avatar: { type: 'string', required: false },
            avatiaProfileID: { type: 'string', required: false },
            weariaProfileID: { type: 'string', required: false },
            embodiaProfileID: { type: 'string', required: false },
            greeniaProfileID: { type: 'string', required: false },
            centeriaProfileID: { type: 'string', required: false },
            incarniaProfileID: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            articles: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cankvgnn9dluhh057jp3wo515fefblyfd2ew6ngis7o34gkxbv2',
                    property: 'profileID'
                }
            },
            articlesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cankvgnn9dluhh057jp3wo515fefblyfd2ew6ngis7o34gkxbv2',
                    property: 'profileID'
                }
            },
            followings: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c5kxlf7rz62y47sgycum3fu9y6wbbc5gvqwz6rawjqnobchuquf',
                    property: 'profileID'
                }
            },
            followingsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c5kxlf7rz62y47sgycum3fu9y6wbbc5gvqwz6rawjqnobchuquf',
                    property: 'profileID'
                }
            },
            followers: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c5kxlf7rz62y47sgycum3fu9y6wbbc5gvqwz6rawjqnobchuquf',
                    property: 'targetProfileID'
                }
            },
            followersCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c5kxlf7rz62y47sgycum3fu9y6wbbc5gvqwz6rawjqnobchuquf',
                    property: 'targetProfileID'
                }
            },
            chats: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c9voacu22d44n9qclr0gte090elzp4yunhvbvkxh3yxlk626p6a',
                    property: 'profileID'
                }
            },
            chatsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9voacu22d44n9qclr0gte090elzp4yunhvbvkxh3yxlk626p6a',
                    property: 'profileID'
                }
            },
            receivedChats: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c9voacu22d44n9qclr0gte090elzp4yunhvbvkxh3yxlk626p6a',
                    property: 'recipientProfileID'
                }
            },
            receivedChatsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9voacu22d44n9qclr0gte090elzp4yunhvbvkxh3yxlk626p6a',
                    property: 'recipientProfileID'
                }
            }
        },
        Article: {
            body: { type: 'string', required: true },
            tags: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false }
            },
            price: { type: 'float', required: true },
            title: { type: 'string', required: true },
            community: { type: 'string', required: true },
            createdAt: { type: 'datetime', required: true },
            isDeleted: { type: 'boolean', required: true },
            profileID: { type: 'streamid', required: true },
            thumbnail: { type: 'string', required: false },
            isEncrypted: { type: 'boolean', required: true },
            shortDescription: { type: 'string', required: true },
            encryptedSymmetricKey: { type: 'string', required: false },
            unifiedAccessControlConditions: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c9mga4hz9i53yr79s8sjpd7cz57jpqxgm0y2tavi2y7nxvfy3nc',
                    property: 'articleID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9mga4hz9i53yr79s8sjpd7cz57jpqxgm0y2tavi2y7nxvfy3nc',
                    property: 'articleID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cbcts0egi1fr8uapw71hcjqu7o1wr2lcdbc25qa5ep3ii2r6xxi',
                    property: 'articleID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cbcts0egi1fr8uapw71hcjqu7o1wr2lcdbc25qa5ep3ii2r6xxi',
                    property: 'articleID'
                }
            },
            permissionRequests: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c62434jskboy25bm25a5ym5ni0bzoxrmmgsd4lo3rlbziuyiwa5',
                    property: 'articleID'
                }
            }
        },
        ArticleComment: {
            content: { type: 'string', required: true },
            articleID: { type: 'streamid', required: true },
            isDeleted: { type: 'boolean', required: true },
            profileID: { type: 'streamid', required: true },
            replyingToID: { type: 'streamid', required: false },
            article: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6cankvgnn9dluhh057jp3wo515fefblyfd2ew6ngis7o34gkxbv2',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'profileID'
                }
            }
        },
        ArticleLike: {
            articleID: { type: 'streamid', required: true },
            isDeleted: { type: 'boolean', required: true },
            profileID: { type: 'streamid', required: true },
            article: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6cankvgnn9dluhh057jp3wo515fefblyfd2ew6ngis7o34gkxbv2',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'profileID'
                }
            }
        },
        ArticlePermissionRequest: {
            content: { type: 'string', required: false },
            articleID: { type: 'streamid', required: true },
            isDeleted: { type: 'boolean', required: true },
            profileID: { type: 'streamid', required: true },
            article: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6cankvgnn9dluhh057jp3wo515fefblyfd2ew6ngis7o34gkxbv2',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'profileID'
                }
            },
            status: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c6uabt6althg6t71dcs86hglyhqz2jtmzfv7er279wjsdn07yi8',
                    property: 'articlePermissionRequestID'
                }
            }
        },
        ArticlePermissionRequestStatus: {
            status: { type: 'boolean', required: true },
            articlePermissionRequestID: { type: 'streamid', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            articlePermissionRequest: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c62434jskboy25bm25a5ym5ni0bzoxrmmgsd4lo3rlbziuyiwa5',
                    property: 'articlePermissionRequestID'
                }
            }
        },
        Follow: {
            isDeleted: { type: 'boolean', required: true },
            profileID: { type: 'streamid', required: true },
            targetProfileID: { type: 'streamid', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'profileID'
                }
            },
            targetProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'targetProfileID'
                }
            }
        },
        Chat: {
            createdAt: { type: 'datetime', required: true },
            isDeleted: { type: 'boolean', required: true },
            profileID: { type: 'streamid', required: true },
            recipientProfileID: { type: 'streamid', required: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'profileID'
                }
            },
            recipientProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'recipientProfileID'
                }
            },
            messages: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c90hsp3vesq1fd9dmzb3d68noja59zqw6dkrq7v3ig2nv5r6myq',
                    property: 'chatID'
                }
            },
            messagesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c90hsp3vesq1fd9dmzb3d68noja59zqw6dkrq7v3ig2nv5r6myq',
                    property: 'chatID'
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
        },
        ChatMessage: {
            body: { type: 'string', required: true },
            chatID: { type: 'streamid', required: true },
            createdAt: { type: 'datetime', required: true },
            profileID: { type: 'streamid', required: true },
            encryptedSymmetricKey: { type: 'string', required: true },
            unifiedAccessControlConditions: { type: 'string', required: true },
            chat: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c9voacu22d44n9qclr0gte090elzp4yunhvbvkxh3yxlk626p6a',
                    property: 'chatID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7g3x1rriupy6k8nn89xqyv9h7ubeelsoshd78d9zbgrajrgu0x',
                    property: 'profileID'
                }
            }
        }
    },
    enums: {},
    accountData: {
        profile: { type: 'node', name: 'Profile' },
        articleList: { type: 'connection', name: 'Article' },
        articleCommentList: { type: 'connection', name: 'ArticleComment' },
        articleLikeList: { type: 'connection', name: 'ArticleLike' },
        articlePermissionRequestList: {
            type: 'connection',
            name: 'ArticlePermissionRequest'
        },
        articlePermissionRequestStatusList: {
            type: 'connection',
            name: 'ArticlePermissionRequestStatus'
        },
        followList: { type: 'connection', name: 'Follow' },
        chatList: { type: 'connection', name: 'Chat' },
        greeniaProfile: { type: 'node', name: 'GreeniaProfile' },
        greeniaProfileEducationList: {
            type: 'connection',
            name: 'GreeniaProfileEducation'
        },
        greeniaProfileExperienceList: {
            type: 'connection',
            name: 'GreeniaProfileExperience'
        },
        chatMessageList: { type: 'connection', name: 'ChatMessage' }
    }
};
