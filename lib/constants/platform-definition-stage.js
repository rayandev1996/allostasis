"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
exports.definition = {
    models: {
        Profile: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c688dmvwdp0xxamkmi0pdo9cb24xur143qzb05dv60xv9yxwd12',
            accountRelation: { type: 'single' }
        },
        Asset: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c7b7ogar0vuj6mltz82y644vt869k4b62xkb22ubccvoqtmvmt6',
            accountRelation: { type: 'list' }
        },
        Post: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c9mslqhkfkowfxi91ozmaj8z4km8u7oifu1z0qdk3rycyf0cdei',
            accountRelation: { type: 'list' }
        },
        Article: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6cbas44439gp7m1dksfv2bk0yvx1p7i6v2f7rmhnqp0j6jncixum',
            accountRelation: { type: 'list' }
        },
        PostComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c6zytfh480ub35wmpkxayxkfly49sfo86piwk645sczn2n13r41',
            accountRelation: { type: 'list' }
        },
        PostLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c8bd6vafqifuli7aa2vxs42bi1dupdeaspflik5jy2d28jseigj',
            accountRelation: { type: 'list' }
        },
        ArticleLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c8uc1ispov6mx5zoooszn7gtiprfnrcztbz1l1z23l6bb6b8vpr',
            accountRelation: { type: 'list' }
        },
        ArticleComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c5lvhejwop93r06umggj8m2aaw2o2elflzdf5aqthb98wgfbf81',
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
                    model: 'kjzl6hvfrbw6c9mslqhkfkowfxi91ozmaj8z4km8u7oifu1z0qdk3rycyf0cdei',
                    property: 'profileID'
                }
            },
            postsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9mslqhkfkowfxi91ozmaj8z4km8u7oifu1z0qdk3rycyf0cdei',
                    property: 'profileID'
                }
            },
            articles: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cbas44439gp7m1dksfv2bk0yvx1p7i6v2f7rmhnqp0j6jncixum',
                    property: 'profileID'
                }
            },
            articlesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cbas44439gp7m1dksfv2bk0yvx1p7i6v2f7rmhnqp0j6jncixum',
                    property: 'profileID'
                }
            },
            assets: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7b7ogar0vuj6mltz82y644vt869k4b62xkb22ubccvoqtmvmt6',
                    property: 'profileID'
                }
            },
            assetsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c7b7ogar0vuj6mltz82y644vt869k4b62xkb22ubccvoqtmvmt6',
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
                    model: 'kjzl6hvfrbw6c688dmvwdp0xxamkmi0pdo9cb24xur143qzb05dv60xv9yxwd12',
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
                    model: 'kjzl6hvfrbw6c688dmvwdp0xxamkmi0pdo9cb24xur143qzb05dv60xv9yxwd12',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c6zytfh480ub35wmpkxayxkfly49sfo86piwk645sczn2n13r41',
                    property: 'postID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c6zytfh480ub35wmpkxayxkfly49sfo86piwk645sczn2n13r41',
                    property: 'postID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c8bd6vafqifuli7aa2vxs42bi1dupdeaspflik5jy2d28jseigj',
                    property: 'postID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c8bd6vafqifuli7aa2vxs42bi1dupdeaspflik5jy2d28jseigj',
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
                    model: 'kjzl6hvfrbw6c688dmvwdp0xxamkmi0pdo9cb24xur143qzb05dv60xv9yxwd12',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c5lvhejwop93r06umggj8m2aaw2o2elflzdf5aqthb98wgfbf81',
                    property: 'articleID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c5lvhejwop93r06umggj8m2aaw2o2elflzdf5aqthb98wgfbf81',
                    property: 'articleID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c8uc1ispov6mx5zoooszn7gtiprfnrcztbz1l1z23l6bb6b8vpr',
                    property: 'articleID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c8uc1ispov6mx5zoooszn7gtiprfnrcztbz1l1z23l6bb6b8vpr',
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
                    model: 'kjzl6hvfrbw6c9mslqhkfkowfxi91ozmaj8z4km8u7oifu1z0qdk3rycyf0cdei',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c688dmvwdp0xxamkmi0pdo9cb24xur143qzb05dv60xv9yxwd12',
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
                    model: 'kjzl6hvfrbw6c9mslqhkfkowfxi91ozmaj8z4km8u7oifu1z0qdk3rycyf0cdei',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c688dmvwdp0xxamkmi0pdo9cb24xur143qzb05dv60xv9yxwd12',
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
                    model: 'kjzl6hvfrbw6cbas44439gp7m1dksfv2bk0yvx1p7i6v2f7rmhnqp0j6jncixum',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c688dmvwdp0xxamkmi0pdo9cb24xur143qzb05dv60xv9yxwd12',
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
                    model: 'kjzl6hvfrbw6cbas44439gp7m1dksfv2bk0yvx1p7i6v2f7rmhnqp0j6jncixum',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c688dmvwdp0xxamkmi0pdo9cb24xur143qzb05dv60xv9yxwd12',
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
