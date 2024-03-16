"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
            accountRelation: { type: 'single' }
        },
        Chat: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c5cizf0c58929q6p46isu6ojvubsxisux0tqvjiuzbvozr50uwb',
            accountRelation: { type: 'list' }
        },
        ChatMessage: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6ca5oi4t1dhke6k5mnsa7tbktnm64svfo1jm0qsr4y2agzl1d8ml',
            accountRelation: { type: 'list' }
        },
        Experience: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6cb405hhtrqsyuvy15eqyrwq0rfg22iip7g3y6m77j3644ybu12n',
            accountRelation: { type: 'list' }
        },
        Education: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c7bsz17952tjw1rotx2yq7kq4g4w3pvad1zuipyv6iaojws8e3e',
            accountRelation: { type: 'list' }
        },
        Article: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c76xwkvuh26mkg32nc4o586meig0juudksvi2c8g3681kysxvdg',
            accountRelation: { type: 'list' }
        },
        Post: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c5jluvz7xh8p7muqrgnon00or743bisdcc0dkezcy3hht72b05p',
            accountRelation: { type: 'list' }
        },
        Follow: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c79t2xki7lr0rhf2qm0wnqd9a417rzseezawhwqy5jd9ehm6pws',
            accountRelation: { type: 'list' }
        },
        Asset: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c8b8e764828ah90rsz38we7egdfku8ktw7bwhmc37nevx5dhw2o',
            accountRelation: { type: 'list' }
        },
        PostComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c9yfs200lfe6vyo6u9dp09642bftml8wko4etqt0m9yknlw50jm',
            accountRelation: { type: 'list' }
        },
        PostLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c98x050hyy31up5f4eb0sc545ysjlseq7q4h3zbz2er00ukczi8',
            accountRelation: { type: 'list' }
        },
        ArticleLike: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c8gtyrtei0jz0y3kdmkfe3germjyo6vr87cxnhqbd31o2ci9pzz',
            accountRelation: { type: 'list' }
        },
        ArticleComment: {
            interface: false,
            implements: [],
            id: 'kjzl6hvfrbw6c7go4qovynjoqgz72o7qn8iy5il7jd3pe0nx92k02vejkuclpht',
            accountRelation: { type: 'list' }
        }
    },
    objects: {
        Profile: {
            age: { type: 'integer', required: false, indexed: true },
            bio: { type: 'string', required: false },
            cover: { type: 'string', required: false },
            email: { type: 'string', required: false },
            avatar: { type: 'string', required: false },
            gender: { type: 'string', required: false, indexed: true },
            skills: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false }
            },
            address: { type: 'string', required: false },
            nakamaID: { type: 'string', required: false },
            accountType: { type: 'string', required: false, indexed: true },
            displayName: { type: 'string', required: false, indexed: true },
            phoneNumber: { type: 'string', required: false },
            socialLinks: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false }
            },
            publicEncryptionDID: { type: 'did', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            chats: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c5cizf0c58929q6p46isu6ojvubsxisux0tqvjiuzbvozr50uwb',
                    property: 'profileID'
                }
            },
            chatsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c5cizf0c58929q6p46isu6ojvubsxisux0tqvjiuzbvozr50uwb',
                    property: 'profileID'
                }
            },
            receivedChats: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c5cizf0c58929q6p46isu6ojvubsxisux0tqvjiuzbvozr50uwb',
                    property: 'recipientProfileID'
                }
            },
            receivedChatsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c5cizf0c58929q6p46isu6ojvubsxisux0tqvjiuzbvozr50uwb',
                    property: 'recipientProfileID'
                }
            },
            experiences: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6cb405hhtrqsyuvy15eqyrwq0rfg22iip7g3y6m77j3644ybu12n',
                    property: 'profileID'
                }
            },
            educations: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7bsz17952tjw1rotx2yq7kq4g4w3pvad1zuipyv6iaojws8e3e',
                    property: 'profileID'
                }
            },
            followings: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c79t2xki7lr0rhf2qm0wnqd9a417rzseezawhwqy5jd9ehm6pws',
                    property: 'profileID'
                }
            },
            followingsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c79t2xki7lr0rhf2qm0wnqd9a417rzseezawhwqy5jd9ehm6pws',
                    property: 'profileID'
                }
            },
            followers: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c79t2xki7lr0rhf2qm0wnqd9a417rzseezawhwqy5jd9ehm6pws',
                    property: 'targetProfileID'
                }
            },
            followersCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c79t2xki7lr0rhf2qm0wnqd9a417rzseezawhwqy5jd9ehm6pws',
                    property: 'targetProfileID'
                }
            },
            posts: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c5jluvz7xh8p7muqrgnon00or743bisdcc0dkezcy3hht72b05p',
                    property: 'profileID'
                }
            },
            postsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c5jluvz7xh8p7muqrgnon00or743bisdcc0dkezcy3hht72b05p',
                    property: 'profileID'
                }
            },
            assets: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c8b8e764828ah90rsz38we7egdfku8ktw7bwhmc37nevx5dhw2o',
                    property: 'profileID'
                }
            },
            assetsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c8b8e764828ah90rsz38we7egdfku8ktw7bwhmc37nevx5dhw2o',
                    property: 'profileID'
                }
            },
            articles: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c76xwkvuh26mkg32nc4o586meig0juudksvi2c8g3681kysxvdg',
                    property: 'profileID'
                }
            },
            articlesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c76xwkvuh26mkg32nc4o586meig0juudksvi2c8g3681kysxvdg',
                    property: 'profileID'
                }
            }
        },
        Chat: {
            channelID: { type: 'string', required: false, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            relationID: { type: 'string', required: false },
            recipientProfileID: { type: 'streamid', required: true, indexed: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            },
            recipientProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'recipientProfileID'
                }
            },
            messages: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6ca5oi4t1dhke6k5mnsa7tbktnm64svfo1jm0qsr4y2agzl1d8ml',
                    property: 'chatID'
                }
            },
            messagesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6ca5oi4t1dhke6k5mnsa7tbktnm64svfo1jm0qsr4y2agzl1d8ml',
                    property: 'chatID'
                }
            }
        },
        ChatMessage: {
            body: { type: 'string', required: true },
            chatID: { type: 'streamid', required: true, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            messageType: { type: 'string', required: true },
            encryptedSymmetricKey: { type: 'string', required: false },
            unifiedAccessControlConditions: { type: 'string', required: false },
            chat: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5cizf0c58929q6p46isu6ojvubsxisux0tqvjiuzbvozr50uwb',
                    property: 'chatID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            }
        },
        Experience: {
            city: { type: 'string', required: true, indexed: true },
            title: { type: 'string', required: true, indexed: true },
            company: { type: 'string', required: true, indexed: true },
            endDate: { type: 'date', required: false },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            startDate: { type: 'date', required: true },
            description: { type: 'string', required: true, indexed: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            }
        },
        Education: {
            city: { type: 'string', required: true, indexed: true },
            title: { type: 'string', required: true, indexed: true },
            school: { type: 'string', required: true, indexed: true },
            endDate: { type: 'date', required: false },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            startDate: { type: 'date', required: true },
            description: { type: 'string', required: true, indexed: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
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
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7go4qovynjoqgz72o7qn8iy5il7jd3pe0nx92k02vejkuclpht',
                    property: 'articleID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c7go4qovynjoqgz72o7qn8iy5il7jd3pe0nx92k02vejkuclpht',
                    property: 'articleID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c8gtyrtei0jz0y3kdmkfe3germjyo6vr87cxnhqbd31o2ci9pzz',
                    property: 'articleID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c8gtyrtei0jz0y3kdmkfe3germjyo6vr87cxnhqbd31o2ci9pzz',
                    property: 'articleID'
                }
            }
        },
        Post: {
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
            tag10: { type: 'string', required: false, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            attachment: { type: 'string', required: false },
            externalURL: { type: 'string', required: false },
            isEncrypted: { type: 'boolean', required: true },
            encryptedSymmetricKey: { type: 'string', required: false },
            unifiedAccessControlConditions: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c9yfs200lfe6vyo6u9dp09642bftml8wko4etqt0m9yknlw50jm',
                    property: 'postID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c9yfs200lfe6vyo6u9dp09642bftml8wko4etqt0m9yknlw50jm',
                    property: 'postID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c98x050hyy31up5f4eb0sc545ysjlseq7q4h3zbz2er00ukczi8',
                    property: 'postID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c98x050hyy31up5f4eb0sc545ysjlseq7q4h3zbz2er00ukczi8',
                    property: 'postID'
                }
            }
        },
        Follow: {
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            targetProfileID: { type: 'streamid', required: true, indexed: true },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            },
            targetProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'targetProfileID'
                }
            }
        },
        Asset: {
            tags: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false }
            },
            image: { type: 'string', required: false },
            title: { type: 'string', required: true },
            isDeleted: { type: 'boolean', required: true },
            profileID: { type: 'streamid', required: true },
            description: { type: 'string', required: true },
            externalURL: { type: 'string', required: false },
            animationURL: { type: 'string', required: false },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            }
        },
        PostComment: {
            postID: { type: 'streamid', required: true, indexed: true },
            content: { type: 'string', required: true, indexed: true },
            createdAt: { type: 'datetime', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            replyingToID: { type: 'streamid', required: false, indexed: true },
            post: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5jluvz7xh8p7muqrgnon00or743bisdcc0dkezcy3hht72b05p',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            }
        },
        PostLike: {
            postID: { type: 'streamid', required: true, indexed: true },
            isDeleted: { type: 'boolean', required: true, indexed: true },
            profileID: { type: 'streamid', required: true, indexed: true },
            post: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5jluvz7xh8p7muqrgnon00or743bisdcc0dkezcy3hht72b05p',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
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
                    model: 'kjzl6hvfrbw6c76xwkvuh26mkg32nc4o586meig0juudksvi2c8g3681kysxvdg',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
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
                    model: 'kjzl6hvfrbw6c76xwkvuh26mkg32nc4o586meig0juudksvi2c8g3681kysxvdg',
                    property: 'articleID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c5ngupbx13ojeqsqn1mhuwfk9y4963cyamyds15ycw7zin0yqk9',
                    property: 'profileID'
                }
            }
        }
    },
    enums: {},
    accountData: {
        profile: { type: 'node', name: 'Profile' },
        chatList: { type: 'connection', name: 'Chat' },
        chatMessageList: { type: 'connection', name: 'ChatMessage' },
        experienceList: { type: 'connection', name: 'Experience' },
        educationList: { type: 'connection', name: 'Education' },
        articleList: { type: 'connection', name: 'Article' },
        postList: { type: 'connection', name: 'Post' },
        followList: { type: 'connection', name: 'Follow' },
        assetList: { type: 'connection', name: 'Asset' },
        postCommentList: { type: 'connection', name: 'PostComment' },
        postLikeList: { type: 'connection', name: 'PostLike' },
        articleLikeList: { type: 'connection', name: 'ArticleLike' },
        articleCommentList: { type: 'connection', name: 'ArticleComment' }
    }
};
