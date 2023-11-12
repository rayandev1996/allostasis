"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            id: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
            accountRelation: { type: 'single' }
        },
        Chat: {
            id: 'kjzl6hvfrbw6c70n8mr4oaig3v7ed9pc6g2kumfxt4ztgi5c21emkzv0oyzztvt',
            accountRelation: { type: 'list' }
        },
        ChatMessage: {
            id: 'kjzl6hvfrbw6c8gkz81y6yrdyf2qj3i4yw0cl7y961irxs254ju69b9en5g5648',
            accountRelation: { type: 'list' }
        },
        Follow: {
            id: 'kjzl6hvfrbw6c66wxudmb4fsj1p5mvj1dzfibli8pq2vjioeo5ssdhcoj9uwdd6',
            accountRelation: { type: 'list' }
        },
        Experience: {
            id: 'kjzl6hvfrbw6c6jqsrqjoabwgp12o4pwyddtde8gak02fprcu2i8a50uw01qmef',
            accountRelation: { type: 'list' }
        },
        Asset: {
            id: 'kjzl6hvfrbw6c6mxh84xftz7ulxj26piqtq2pe2j6bzx9ynzhtc8dev9bogtxr2',
            accountRelation: { type: 'list' }
        },
        Education: {
            id: 'kjzl6hvfrbw6ca7y740l2ppn2gqa3ka23cpghzwuz019frak5xu2gsiyrcv1kw0',
            accountRelation: { type: 'list' }
        },
        Post: {
            id: 'kjzl6hvfrbw6c7gawsfx6klrkhtogxuu56fy02qdr4gz9628dslq9nabr1cp30z',
            accountRelation: { type: 'list' }
        },
        PostComment: {
            id: 'kjzl6hvfrbw6c8dquh1yjxv80nh7v33t6ain69xh0nh5jgw4zh5aytpghvpgoy7',
            accountRelation: { type: 'list' }
        },
        PostLike: {
            id: 'kjzl6hvfrbw6c67kuexu6mnntpfo5oue94sjw11dhko1m314w9jk4ik4o9zxwcg',
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
                item: { type: 'string', required: false },
                indexed: true
            },
            address: { type: 'string', required: false },
            accountType: { type: 'string', required: false, indexed: true },
            displayName: { type: 'string', required: false, indexed: true },
            phoneNumber: { type: 'string', required: false },
            socialLinks: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            chats: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c70n8mr4oaig3v7ed9pc6g2kumfxt4ztgi5c21emkzv0oyzztvt',
                    property: 'profileID'
                }
            },
            chatsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c70n8mr4oaig3v7ed9pc6g2kumfxt4ztgi5c21emkzv0oyzztvt',
                    property: 'profileID'
                }
            },
            receivedChats: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c70n8mr4oaig3v7ed9pc6g2kumfxt4ztgi5c21emkzv0oyzztvt',
                    property: 'recipientProfileID'
                }
            },
            receivedChatsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c70n8mr4oaig3v7ed9pc6g2kumfxt4ztgi5c21emkzv0oyzztvt',
                    property: 'recipientProfileID'
                }
            },
            experiences: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c6jqsrqjoabwgp12o4pwyddtde8gak02fprcu2i8a50uw01qmef',
                    property: 'profileID'
                }
            },
            educations: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6ca7y740l2ppn2gqa3ka23cpghzwuz019frak5xu2gsiyrcv1kw0',
                    property: 'profileID'
                }
            },
            followings: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c66wxudmb4fsj1p5mvj1dzfibli8pq2vjioeo5ssdhcoj9uwdd6',
                    property: 'profileID'
                }
            },
            followingsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c66wxudmb4fsj1p5mvj1dzfibli8pq2vjioeo5ssdhcoj9uwdd6',
                    property: 'profileID'
                }
            },
            followers: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c66wxudmb4fsj1p5mvj1dzfibli8pq2vjioeo5ssdhcoj9uwdd6',
                    property: 'targetProfileID'
                }
            },
            followersCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c66wxudmb4fsj1p5mvj1dzfibli8pq2vjioeo5ssdhcoj9uwdd6',
                    property: 'targetProfileID'
                }
            },
            posts: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c7gawsfx6klrkhtogxuu56fy02qdr4gz9628dslq9nabr1cp30z',
                    property: 'profileID'
                }
            },
            postsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c7gawsfx6klrkhtogxuu56fy02qdr4gz9628dslq9nabr1cp30z',
                    property: 'profileID'
                }
            },
            assets: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c6mxh84xftz7ulxj26piqtq2pe2j6bzx9ynzhtc8dev9bogtxr2',
                    property: 'profileID'
                }
            },
            assetsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c6mxh84xftz7ulxj26piqtq2pe2j6bzx9ynzhtc8dev9bogtxr2',
                    property: 'profileID'
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
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
                    property: 'profileID'
                }
            },
            recipientProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
                    property: 'recipientProfileID'
                }
            },
            messages: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c8gkz81y6yrdyf2qj3i4yw0cl7y961irxs254ju69b9en5g5648',
                    property: 'chatID'
                }
            },
            messagesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c8gkz81y6yrdyf2qj3i4yw0cl7y961irxs254ju69b9en5g5648',
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
                    model: 'kjzl6hvfrbw6c70n8mr4oaig3v7ed9pc6g2kumfxt4ztgi5c21emkzv0oyzztvt',
                    property: 'chatID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
                    property: 'profileID'
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
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
                    property: 'profileID'
                }
            },
            targetProfile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
                    property: 'targetProfileID'
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
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
                    property: 'profileID'
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
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
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
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
                    property: 'profileID'
                }
            }
        },
        Post: {
            body: { type: 'string', required: true, indexed: true },
            tags: {
                type: 'list',
                required: false,
                item: { type: 'string', required: false },
                indexed: true
            },
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
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
                    property: 'profileID'
                }
            },
            comments: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c8dquh1yjxv80nh7v33t6ain69xh0nh5jgw4zh5aytpghvpgoy7',
                    property: 'postID'
                }
            },
            commentsCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c8dquh1yjxv80nh7v33t6ain69xh0nh5jgw4zh5aytpghvpgoy7',
                    property: 'postID'
                }
            },
            likes: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryConnection',
                    model: 'kjzl6hvfrbw6c67kuexu6mnntpfo5oue94sjw11dhko1m314w9jk4ik4o9zxwcg',
                    property: 'postID'
                }
            },
            likesCount: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'queryCount',
                    model: 'kjzl6hvfrbw6c67kuexu6mnntpfo5oue94sjw11dhko1m314w9jk4ik4o9zxwcg',
                    property: 'postID'
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
                    model: 'kjzl6hvfrbw6c7gawsfx6klrkhtogxuu56fy02qdr4gz9628dslq9nabr1cp30z',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
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
                    model: 'kjzl6hvfrbw6c7gawsfx6klrkhtogxuu56fy02qdr4gz9628dslq9nabr1cp30z',
                    property: 'postID'
                }
            },
            creator: { type: 'view', viewType: 'documentAccount' },
            profile: {
                type: 'view',
                viewType: 'relation',
                relation: {
                    source: 'document',
                    model: 'kjzl6hvfrbw6c91almmscleflucxa448d6o3w0vhjrlamut86clk1klt1roggh5',
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
        followList: { type: 'connection', name: 'Follow' },
        experienceList: { type: 'connection', name: 'Experience' },
        assetList: { type: 'connection', name: 'Asset' },
        educationList: { type: 'connection', name: 'Education' },
        postList: { type: 'connection', name: 'Post' },
        postCommentList: { type: 'connection', name: 'PostComment' },
        postLikeList: { type: 'connection', name: 'PostLike' }
    }
};
