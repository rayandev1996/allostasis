"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c649vlt9aulg5ylaigtvz48y7hwcivzg0lr1r8cua8i1sgmhjo6',
            accountRelation: { type: 'single' }
        },
        Asset: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6ca60n3puilridoe5aces94zovdny8d2f81x3f4b9skdvo8vtsnk',
            accountRelation: { type: 'list' }
        },
        Post: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c9ygme40t294135bmkkugcjkaotqewsu83a02tzbcy1i6fyhc4f',
            accountRelation: { type: 'list' }
        },
        Article: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6cafaywaha0gs6e4vvzs2gr9xyz9amryg74o5ww6vk7qemab4s0g',
            accountRelation: { type: 'list' }
        },
        PostComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c7h26tcqsadvi57fxbk2irfm9zpgxa3sp5equq93cylfpsjrm81',
            accountRelation: { type: 'list' }
        },
        PostLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c7lyrirgtiaumocnwcv7xr7r7qbobv3zc5bhxreaqp0gq4nhjtj',
            accountRelation: { type: 'list' }
        },
        ArticleLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6caohxgg54j5hk4o974y4wfhoppezsd8bwexa2woskt6c83fnxxx',
            accountRelation: { type: 'list' }
        },
        ArticleComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c77udwq03vm2kwuqsgofrbydl3bkktrakurhiyoyg3pntoy5gse',
            accountRelation: { type: 'list' }
        }
    },
    objects: {
        Profile: {
            logo: { type: 'string', required: false },
            name: { type: 'string', required: false, indexed: true },
            cover: { type: 'string', required: false },
            email: { type: 'string', required: false },
            slogan: { type: 'string', required: false },
            address: { type: 'string', required: false },
            nakamaID: { type: 'string', required: false },
            phoneNumber: { type: 'string', required: false },
            socialLinks: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false }
            },
            projectVision: { type: 'string', required: false },
            requestedFund: { type: 'integer', required: false, indexed: true },
            projectHistory: { type: 'string', required: false },
            projectMission: { type: 'string', required: false },
            fundingStartDate: { type: 'date', required: false, indexed: true },
            publicEncryptionDID: { type: 'did', required: false },
            projectCompellingVideo: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            posts: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c9ygme40t294135bmkkugcjkaotqewsu83a02tzbcy1i6fyhc4f',
                    property: 'profileID'
                }
            },
            postsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9ygme40t294135bmkkugcjkaotqewsu83a02tzbcy1i6fyhc4f',
                    property: 'profileID'
                }
            },
            articles: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cafaywaha0gs6e4vvzs2gr9xyz9amryg74o5ww6vk7qemab4s0g',
                    property: 'profileID'
                }
            },
            articlesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cafaywaha0gs6e4vvzs2gr9xyz9amryg74o5ww6vk7qemab4s0g',
                    property: 'profileID'
                }
            },
            assets: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6ca60n3puilridoe5aces94zovdny8d2f81x3f4b9skdvo8vtsnk',
                    property: 'profileID'
                }
            },
            assetsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6ca60n3puilridoe5aces94zovdny8d2f81x3f4b9skdvo8vtsnk',
                    property: 'profileID'
                }
            }
        },
        Asset: {
            tag1: { type: 'string', required: false },
            tag2: { type: 'string', required: false },
            tag3: { type: 'string', required: false },
            tag4: { type: 'string', required: false },
            tag5: { type: 'string', required: false },
            tag6: { type: 'string', required: false },
            tag7: { type: 'string', required: false },
            tag8: { type: 'string', required: false },
            tag9: { type: 'string', required: false },
            image: { type: 'string', required: false },
            tag10: { type: 'string', required: false },
            title: { type: 'string', required: true },
            createdAt: { type: 'datetime', required: true },
            profileID: { type: 'streamid', required: true },
            description: { type: 'string', required: false },
            externalURL: { type: 'string', required: false },
            animationURL: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c649vlt9aulg5ylaigtvz48y7hwcivzg0lr1r8cua8i1sgmhjo6',
                    property: 'profileID'
                }
            }
        },
        Post: {
            body: { type: 'string', required: false },
            tag1: { type: 'string', required: false, indexed: true },
            tag2: { type: 'string', required: false, indexed: true },
            tag3: { type: 'string', required: false, indexed: true },
            tag4: { type: 'string', required: false, indexed: true },
            tag5: { type: 'string', required: false, indexed: true },
            tag6: { type: 'string', required: false, indexed: true },
            tag7: { type: 'string', required: false, indexed: true },
            tag8: { type: 'string', required: false, indexed: true },
            tag9: { type: 'string', required: false, indexed: true },
            tag10: { type: 'string', required: false, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            attachment: { type: 'string', required: false, indexed: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c649vlt9aulg5ylaigtvz48y7hwcivzg0lr1r8cua8i1sgmhjo6',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7h26tcqsadvi57fxbk2irfm9zpgxa3sp5equq93cylfpsjrm81',
                    property: 'postID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c7h26tcqsadvi57fxbk2irfm9zpgxa3sp5equq93cylfpsjrm81',
                    property: 'postID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7lyrirgtiaumocnwcv7xr7r7qbobv3zc5bhxreaqp0gq4nhjtj',
                    property: 'postID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c7lyrirgtiaumocnwcv7xr7r7qbobv3zc5bhxreaqp0gq4nhjtj',
                    property: 'postID'
                }
            }
        },
        Article: {
            body: { type: 'string', required: true, indexed: true },
            tag1: { type: 'string', required: false, indexed: true },
            tag2: { type: 'string', required: false, indexed: true },
            tag3: { type: 'string', required: false, indexed: true },
            tag4: { type: 'string', required: false, indexed: true },
            tag5: { type: 'string', required: false, indexed: true },
            tag6: { type: 'string', required: false, indexed: true },
            tag7: { type: 'string', required: false, indexed: true },
            tag8: { type: 'string', required: false, indexed: true },
            tag9: { type: 'string', required: false, indexed: true },
            price: { type: 'integer', required: true, indexed: true },
            tag10: { type: 'string', required: false, indexed: true },
            abstract: { type: 'string', required: true, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            attachment: { type: 'string', required: false, indexed: true },
            externalURL: { type: 'string', required: false, indexed: true },
            isEncrypted: { type: 'boolean', required: true, indexed: true },
            visualAbstract: { type: 'string', required: false, indexed: true },
            encryptedSymmetricKey: { type: 'string', required: false },
            unifiedAccessControlConditions: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c649vlt9aulg5ylaigtvz48y7hwcivzg0lr1r8cua8i1sgmhjo6',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c77udwq03vm2kwuqsgofrbydl3bkktrakurhiyoyg3pntoy5gse',
                    property: 'articleID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c77udwq03vm2kwuqsgofrbydl3bkktrakurhiyoyg3pntoy5gse',
                    property: 'articleID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6caohxgg54j5hk4o974y4wfhoppezsd8bwexa2woskt6c83fnxxx',
                    property: 'articleID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6caohxgg54j5hk4o974y4wfhoppezsd8bwexa2woskt6c83fnxxx',
                    property: 'articleID'
                }
            }
        },
        PostComment: {
            postID: { type: 'streamid', required: true, indexed: true },
            content: { type: 'string', required: false, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            replyingToID: { type: 'streamid', required: false, indexed: true },
            post: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c9ygme40t294135bmkkugcjkaotqewsu83a02tzbcy1i6fyhc4f',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c649vlt9aulg5ylaigtvz48y7hwcivzg0lr1r8cua8i1sgmhjo6',
                    property: 'profileID'
                }
            }
        },
        PostLike: {
            postID: { type: 'streamid', required: true, indexed: true },
            status: { type: 'boolean', required: true, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            post: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c9ygme40t294135bmkkugcjkaotqewsu83a02tzbcy1i6fyhc4f',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c649vlt9aulg5ylaigtvz48y7hwcivzg0lr1r8cua8i1sgmhjo6',
                    property: 'profileID'
                }
            }
        },
        ArticleLike: {
            articleID: { type: 'streamid', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            article: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6cafaywaha0gs6e4vvzs2gr9xyz9amryg74o5ww6vk7qemab4s0g',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c649vlt9aulg5ylaigtvz48y7hwcivzg0lr1r8cua8i1sgmhjo6',
                    property: 'profileID'
                }
            }
        },
        ArticleComment: {
            content: { type: 'string', required: true, indexed: true },
            articleID: { type: 'streamid', required: true, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            replyingToID: { type: 'streamid', required: false, indexed: true },
            article: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6cafaywaha0gs6e4vvzs2gr9xyz9amryg74o5ww6vk7qemab4s0g',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c649vlt9aulg5ylaigtvz48y7hwcivzg0lr1r8cua8i1sgmhjo6',
                    property: 'profileID'
                }
            }
        }
    },
    enums: {},
    accountData: {
        profile: { type: 'node', name: 'Profile' },
        assetList: { type: 'connection', name: 'Asset' },
        postList: { type: 'connection', name: 'Post' },
        articleList: { type: 'connection', name: 'Article' },
        postCommentList: { type: 'connection', name: 'PostComment' },
        postLikeList: { type: 'connection', name: 'PostLike' },
        articleLikeList: { type: 'connection', name: 'ArticleLike' },
        articleCommentList: { type: 'connection', name: 'ArticleComment' }
    }
};
