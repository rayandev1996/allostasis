"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c91jfefehmxvwnkduaajgxfwdqcsrpf0ngr7t0voq1zw7vasufm',
            accountRelation: { type: 'single' }
        },
        Article: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6ca6t8cygucfvl03z6cycsnl68d2uhwfxoz3ff4mmimc88dd3l60',
            accountRelation: { type: 'list' }
        },
        Post: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6cb541m25odgp7fha6lorrl76pkcf1k93re7wn9xjaitecs97cya',
            accountRelation: { type: 'list' }
        },
        Asset: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c77onio048oogk8gg4v3lumwrn87vxx8p3qk6f2ydp6hj8f3rk4',
            accountRelation: { type: 'list' }
        },
        PostComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6cb8b2wyabjypqywmwvgrdp55z7fehwdwu1kdia5e2mv1s2qifmx',
            accountRelation: { type: 'list' }
        },
        PostLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c6rmyzf02jhvb4q06z4ptwl1syyxleknmj8ry434o59d4iouv6u',
            accountRelation: { type: 'list' }
        },
        ArticleLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6cb7si8021czj6b2madtntripf2wzo6vvm3yo3yx42ao2fseaip6',
            accountRelation: { type: 'list' }
        },
        ArticleComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c8uh70h0qdkli3zuwrklb2by40mqq2jj66co6p29war9qyck7yb',
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
            platformID: { type: 'string', required: false, indexed: true },
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
                    model: 'kjzl6hvfrbw6cb541m25odgp7fha6lorrl76pkcf1k93re7wn9xjaitecs97cya',
                    property: 'profileID'
                }
            },
            postsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cb541m25odgp7fha6lorrl76pkcf1k93re7wn9xjaitecs97cya',
                    property: 'profileID'
                }
            },
            articles: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6ca6t8cygucfvl03z6cycsnl68d2uhwfxoz3ff4mmimc88dd3l60',
                    property: 'profileID'
                }
            },
            articlesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6ca6t8cygucfvl03z6cycsnl68d2uhwfxoz3ff4mmimc88dd3l60',
                    property: 'profileID'
                }
            },
            assets: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c77onio048oogk8gg4v3lumwrn87vxx8p3qk6f2ydp6hj8f3rk4',
                    property: 'profileID'
                }
            },
            assetsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c77onio048oogk8gg4v3lumwrn87vxx8p3qk6f2ydp6hj8f3rk4',
                    property: 'profileID'
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
                    model: 'kjzl6hvfrbw6c91jfefehmxvwnkduaajgxfwdqcsrpf0ngr7t0voq1zw7vasufm',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c8uh70h0qdkli3zuwrklb2by40mqq2jj66co6p29war9qyck7yb',
                    property: 'articleID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c8uh70h0qdkli3zuwrklb2by40mqq2jj66co6p29war9qyck7yb',
                    property: 'articleID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cb7si8021czj6b2madtntripf2wzo6vvm3yo3yx42ao2fseaip6',
                    property: 'articleID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cb7si8021czj6b2madtntripf2wzo6vvm3yo3yx42ao2fseaip6',
                    property: 'articleID'
                }
            }
        },
        Post: {
            body: { type: 'string', required: false, indexed: true },
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
                    model: 'kjzl6hvfrbw6c91jfefehmxvwnkduaajgxfwdqcsrpf0ngr7t0voq1zw7vasufm',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cb8b2wyabjypqywmwvgrdp55z7fehwdwu1kdia5e2mv1s2qifmx',
                    property: 'postID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cb8b2wyabjypqywmwvgrdp55z7fehwdwu1kdia5e2mv1s2qifmx',
                    property: 'postID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c6rmyzf02jhvb4q06z4ptwl1syyxleknmj8ry434o59d4iouv6u',
                    property: 'postID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c6rmyzf02jhvb4q06z4ptwl1syyxleknmj8ry434o59d4iouv6u',
                    property: 'postID'
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
                    model: 'kjzl6hvfrbw6c91jfefehmxvwnkduaajgxfwdqcsrpf0ngr7t0voq1zw7vasufm',
                    property: 'profileID'
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
                    model: 'kjzl6hvfrbw6cb541m25odgp7fha6lorrl76pkcf1k93re7wn9xjaitecs97cya',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91jfefehmxvwnkduaajgxfwdqcsrpf0ngr7t0voq1zw7vasufm',
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
                    model: 'kjzl6hvfrbw6cb541m25odgp7fha6lorrl76pkcf1k93re7wn9xjaitecs97cya',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91jfefehmxvwnkduaajgxfwdqcsrpf0ngr7t0voq1zw7vasufm',
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
                    model: 'kjzl6hvfrbw6ca6t8cygucfvl03z6cycsnl68d2uhwfxoz3ff4mmimc88dd3l60',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91jfefehmxvwnkduaajgxfwdqcsrpf0ngr7t0voq1zw7vasufm',
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
                    model: 'kjzl6hvfrbw6ca6t8cygucfvl03z6cycsnl68d2uhwfxoz3ff4mmimc88dd3l60',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91jfefehmxvwnkduaajgxfwdqcsrpf0ngr7t0voq1zw7vasufm',
                    property: 'profileID'
                }
            }
        }
    },
    enums: {},
    accountData: {
        profile: { type: 'node', name: 'Profile' },
        articleList: { type: 'connection', name: 'Article' },
        postList: { type: 'connection', name: 'Post' },
        assetList: { type: 'connection', name: 'Asset' },
        postCommentList: { type: 'connection', name: 'PostComment' },
        postLikeList: { type: 'connection', name: 'PostLike' },
        articleLikeList: { type: 'connection', name: 'ArticleLike' },
        articleCommentList: { type: 'connection', name: 'ArticleComment' }
    }
};
