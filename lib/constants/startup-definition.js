"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c7e8vhd2cc6yklpsxb7hgk6o3g0fdrx8xgjcbcbzd1imsvd6xph',
            accountRelation: { type: 'single' }
        },
        Asset: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6cag11nmzu4qzd279uxzccv6vtiajps40wsnq5f5b611irgo3tty',
            accountRelation: { type: 'list' }
        },
        Article: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6cba691bhbzx4aemrgvqh2e8uviz9amvs7phow7fbbwjpg66g5x8',
            accountRelation: { type: 'list' }
        },
        Post: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c8j1xnrhqu79ho3uf5bz42qfyrqlyfbncp88fwg5aj5ljes9n3k',
            accountRelation: { type: 'list' }
        },
        PostComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c9y6agg85bfpfqdgmnj8if5f80pz3kobp9mp4hjhxpxcthq8v2g',
            accountRelation: { type: 'list' }
        },
        PostLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c9b489k4sdozawhqyvy3zm20entzpu0kem5786gqxcr8ml9z4vt',
            accountRelation: { type: 'list' }
        },
        ArticleLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c6x9b590ugyyj76hw9764unhl72i5xza1tfg21eafx5ahoq40zz',
            accountRelation: { type: 'list' }
        },
        ArticleComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c9vyeo99ruds8pkdp7in075shwlm9lhrah4l5relel1ao3q3n56',
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
                    model: 'kjzl6hvfrbw6c8j1xnrhqu79ho3uf5bz42qfyrqlyfbncp88fwg5aj5ljes9n3k',
                    property: 'profileID'
                }
            },
            postsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c8j1xnrhqu79ho3uf5bz42qfyrqlyfbncp88fwg5aj5ljes9n3k',
                    property: 'profileID'
                }
            },
            articles: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cba691bhbzx4aemrgvqh2e8uviz9amvs7phow7fbbwjpg66g5x8',
                    property: 'profileID'
                }
            },
            articlesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cba691bhbzx4aemrgvqh2e8uviz9amvs7phow7fbbwjpg66g5x8',
                    property: 'profileID'
                }
            },
            assets: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cag11nmzu4qzd279uxzccv6vtiajps40wsnq5f5b611irgo3tty',
                    property: 'profileID'
                }
            },
            assetsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6cag11nmzu4qzd279uxzccv6vtiajps40wsnq5f5b611irgo3tty',
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
                    model: 'kjzl6hvfrbw6c7e8vhd2cc6yklpsxb7hgk6o3g0fdrx8xgjcbcbzd1imsvd6xph',
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
                    model: 'kjzl6hvfrbw6c7e8vhd2cc6yklpsxb7hgk6o3g0fdrx8xgjcbcbzd1imsvd6xph',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c9vyeo99ruds8pkdp7in075shwlm9lhrah4l5relel1ao3q3n56',
                    property: 'articleID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9vyeo99ruds8pkdp7in075shwlm9lhrah4l5relel1ao3q3n56',
                    property: 'articleID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c6x9b590ugyyj76hw9764unhl72i5xza1tfg21eafx5ahoq40zz',
                    property: 'articleID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c6x9b590ugyyj76hw9764unhl72i5xza1tfg21eafx5ahoq40zz',
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
                    model: 'kjzl6hvfrbw6c7e8vhd2cc6yklpsxb7hgk6o3g0fdrx8xgjcbcbzd1imsvd6xph',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c9y6agg85bfpfqdgmnj8if5f80pz3kobp9mp4hjhxpxcthq8v2g',
                    property: 'postID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9y6agg85bfpfqdgmnj8if5f80pz3kobp9mp4hjhxpxcthq8v2g',
                    property: 'postID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c9b489k4sdozawhqyvy3zm20entzpu0kem5786gqxcr8ml9z4vt',
                    property: 'postID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9b489k4sdozawhqyvy3zm20entzpu0kem5786gqxcr8ml9z4vt',
                    property: 'postID'
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
                    model: 'kjzl6hvfrbw6c8j1xnrhqu79ho3uf5bz42qfyrqlyfbncp88fwg5aj5ljes9n3k',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7e8vhd2cc6yklpsxb7hgk6o3g0fdrx8xgjcbcbzd1imsvd6xph',
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
                    model: 'kjzl6hvfrbw6c8j1xnrhqu79ho3uf5bz42qfyrqlyfbncp88fwg5aj5ljes9n3k',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7e8vhd2cc6yklpsxb7hgk6o3g0fdrx8xgjcbcbzd1imsvd6xph',
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
                    model: 'kjzl6hvfrbw6cba691bhbzx4aemrgvqh2e8uviz9amvs7phow7fbbwjpg66g5x8',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7e8vhd2cc6yklpsxb7hgk6o3g0fdrx8xgjcbcbzd1imsvd6xph',
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
                    model: 'kjzl6hvfrbw6cba691bhbzx4aemrgvqh2e8uviz9amvs7phow7fbbwjpg66g5x8',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c7e8vhd2cc6yklpsxb7hgk6o3g0fdrx8xgjcbcbzd1imsvd6xph',
                    property: 'profileID'
                }
            }
        }
    },
    enums: {},
    accountData: {
        profile: { type: 'node', name: 'Profile' },
        assetList: { type: 'connection', name: 'Asset' },
        articleList: { type: 'connection', name: 'Article' },
        postList: { type: 'connection', name: 'Post' },
        postCommentList: { type: 'connection', name: 'PostComment' },
        postLikeList: { type: 'connection', name: 'PostLike' },
        articleLikeList: { type: 'connection', name: 'ArticleLike' },
        articleCommentList: { type: 'connection', name: 'ArticleComment' }
    }
};
