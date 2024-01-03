"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            id: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
            accountRelation: { type: "single" },
        },
        Chat: {
            id: "kjzl6hvfrbw6c6tl4kf80cubp52vom8d577wus7vn65tq3m81vye37fzwj63nxd",
            accountRelation: { type: "list" },
        },
        ChatMessage: {
            id: "kjzl6hvfrbw6c5s8i33o6mzl2wzz5pa9ceq8opp57mzs2okkko68auvemtbidpf",
            accountRelation: { type: "list" },
        },
        Post: {
            id: "kjzl6hvfrbw6c7fpztqw008g6or3z7ys740k8u8n5uz3mbvzssofrvq3lsz6zsv",
            accountRelation: { type: "list" },
        },
        Experience: {
            id: "kjzl6hvfrbw6c68di6r9dlueav2mceh860s6ah0zzixx6ny7efy6q3cb3w7mfbw",
            accountRelation: { type: "list" },
        },
        Education: {
            id: "kjzl6hvfrbw6c8a11ae2ydekm324muff0uqo9l9k1dxjkhsltxj1o1uu2u24ykl",
            accountRelation: { type: "list" },
        },
        Follow: {
            id: "kjzl6hvfrbw6c5jllzjzqfor1ns0uhgmvrzes32c2pv3x8kr5wvtr7f2peimgaq",
            accountRelation: { type: "list" },
        },
        Asset: {
            id: "kjzl6hvfrbw6c8lwy2do4vg15ub141b49iirxh3hoeq036a5m2xodwy556vxn8b",
            accountRelation: { type: "list" },
        },
        PostComment: {
            id: "kjzl6hvfrbw6c7pujjiknnq41k8gv8fp2gzdl3mmrda21yndrd6szywa26j5wz7",
            accountRelation: { type: "list" },
        },
        PostLike: {
            id: "kjzl6hvfrbw6ca13ntqavf4hufmqsxa7m2vym6asso4vwhr22xir18efqlzfcba",
            accountRelation: { type: "list" },
        },
    },
    objects: {
        Profile: {
            age: { type: "integer", required: false, indexed: true },
            bio: { type: "string", required: false },
            cover: { type: "string", required: false },
            email: { type: "string", required: false },
            avatar: { type: "string", required: false },
            gender: { type: "string", required: false, indexed: true },
            skills: {
                type: "list",
                required: false,
                item: { type: "string", required: false },
                indexed: true,
            },
            address: { type: "string", required: false },
            nakamaID: { type: "string", required: false },
            accountType: { type: "string", required: false, indexed: true },
            displayName: { type: "string", required: false, indexed: true },
            phoneNumber: { type: "string", required: false },
            socialLinks: {
                type: "list",
                required: false,
                item: { type: "string", required: false },
            },
            publicEncryptionDID: { type: "did", required: false },
            creator: { type: "view", viewType: "documentAccount" },
            chats: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c6tl4kf80cubp52vom8d577wus7vn65tq3m81vye37fzwj63nxd",
                    property: "profileID",
                },
            },
            chatsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c6tl4kf80cubp52vom8d577wus7vn65tq3m81vye37fzwj63nxd",
                    property: "profileID",
                },
            },
            receivedChats: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c6tl4kf80cubp52vom8d577wus7vn65tq3m81vye37fzwj63nxd",
                    property: "recipientProfileID",
                },
            },
            receivedChatsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c6tl4kf80cubp52vom8d577wus7vn65tq3m81vye37fzwj63nxd",
                    property: "recipientProfileID",
                },
            },
            experiences: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c68di6r9dlueav2mceh860s6ah0zzixx6ny7efy6q3cb3w7mfbw",
                    property: "profileID",
                },
            },
            educations: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c8a11ae2ydekm324muff0uqo9l9k1dxjkhsltxj1o1uu2u24ykl",
                    property: "profileID",
                },
            },
            followings: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c5jllzjzqfor1ns0uhgmvrzes32c2pv3x8kr5wvtr7f2peimgaq",
                    property: "profileID",
                },
            },
            followingsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c5jllzjzqfor1ns0uhgmvrzes32c2pv3x8kr5wvtr7f2peimgaq",
                    property: "profileID",
                },
            },
            followers: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c5jllzjzqfor1ns0uhgmvrzes32c2pv3x8kr5wvtr7f2peimgaq",
                    property: "targetProfileID",
                },
            },
            followersCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c5jllzjzqfor1ns0uhgmvrzes32c2pv3x8kr5wvtr7f2peimgaq",
                    property: "targetProfileID",
                },
            },
            posts: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c7fpztqw008g6or3z7ys740k8u8n5uz3mbvzssofrvq3lsz6zsv",
                    property: "profileID",
                },
            },
            postsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c7fpztqw008g6or3z7ys740k8u8n5uz3mbvzssofrvq3lsz6zsv",
                    property: "profileID",
                },
            },
            assets: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c8lwy2do4vg15ub141b49iirxh3hoeq036a5m2xodwy556vxn8b",
                    property: "profileID",
                },
            },
            assetsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c8lwy2do4vg15ub141b49iirxh3hoeq036a5m2xodwy556vxn8b",
                    property: "profileID",
                },
            },
        },
        Chat: {
            channelID: { type: "string", required: false, indexed: true },
            createdAt: { type: "datetime", required: true, indexed: true },
            isDeleted: { type: "boolean", required: true, indexed: true },
            profileID: { type: "streamid", required: true, indexed: true },
            relationID: { type: "string", required: false },
            recipientProfileID: { type: "streamid", required: true, indexed: true },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
            recipientProfile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "recipientProfileID",
                },
            },
            messages: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c5s8i33o6mzl2wzz5pa9ceq8opp57mzs2okkko68auvemtbidpf",
                    property: "chatID",
                },
            },
            messagesCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c5s8i33o6mzl2wzz5pa9ceq8opp57mzs2okkko68auvemtbidpf",
                    property: "chatID",
                },
            },
        },
        ChatMessage: {
            body: { type: "string", required: true },
            chatID: { type: "streamid", required: true, indexed: true },
            createdAt: { type: "datetime", required: true, indexed: true },
            profileID: { type: "streamid", required: true, indexed: true },
            messageType: { type: "string", required: true },
            encryptedSymmetricKey: { type: "string", required: false },
            unifiedAccessControlConditions: { type: "string", required: false },
            chat: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c6tl4kf80cubp52vom8d577wus7vn65tq3m81vye37fzwj63nxd",
                    property: "chatID",
                },
            },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
        },
        Post: {
            body: { type: "string", required: true, indexed: true },
            tag1: { type: "string", required: false, indexed: true },
            tag2: { type: "string", required: false, indexed: true },
            tag3: { type: "string", required: false, indexed: true },
            tag4: { type: "string", required: false, indexed: true },
            tag5: { type: "string", required: false, indexed: true },
            tag6: { type: "string", required: false, indexed: true },
            tag7: { type: "string", required: false, indexed: true },
            tag8: { type: "string", required: false, indexed: true },
            tag9: { type: "string", required: false, indexed: true },
            tag10: { type: "string", required: false, indexed: true },
            createdAt: { type: "datetime", required: true, indexed: true },
            isDeleted: { type: "boolean", required: true, indexed: true },
            profileID: { type: "streamid", required: true, indexed: true },
            attachment: { type: "string", required: false },
            externalURL: { type: "string", required: false },
            isEncrypted: { type: "boolean", required: true },
            encryptedSymmetricKey: { type: "string", required: false },
            unifiedAccessControlConditions: { type: "string", required: false },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
            comments: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c7pujjiknnq41k8gv8fp2gzdl3mmrda21yndrd6szywa26j5wz7",
                    property: "postID",
                },
            },
            commentsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c7pujjiknnq41k8gv8fp2gzdl3mmrda21yndrd6szywa26j5wz7",
                    property: "postID",
                },
            },
            likes: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6ca13ntqavf4hufmqsxa7m2vym6asso4vwhr22xir18efqlzfcba",
                    property: "postID",
                },
            },
            likesCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6ca13ntqavf4hufmqsxa7m2vym6asso4vwhr22xir18efqlzfcba",
                    property: "postID",
                },
            },
        },
        Experience: {
            city: { type: "string", required: true, indexed: true },
            title: { type: "string", required: true, indexed: true },
            company: { type: "string", required: true, indexed: true },
            endDate: { type: "date", required: false },
            isDeleted: { type: "boolean", required: true, indexed: true },
            profileID: { type: "streamid", required: true, indexed: true },
            startDate: { type: "date", required: true },
            description: { type: "string", required: true, indexed: true },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
        },
        Education: {
            city: { type: "string", required: true, indexed: true },
            title: { type: "string", required: true, indexed: true },
            school: { type: "string", required: true, indexed: true },
            endDate: { type: "date", required: false },
            isDeleted: { type: "boolean", required: true, indexed: true },
            profileID: { type: "streamid", required: true, indexed: true },
            startDate: { type: "date", required: true },
            description: { type: "string", required: true, indexed: true },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
        },
        Follow: {
            isDeleted: { type: "boolean", required: true, indexed: true },
            profileID: { type: "streamid", required: true, indexed: true },
            targetProfileID: { type: "streamid", required: true, indexed: true },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
            targetProfile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "targetProfileID",
                },
            },
        },
        Asset: {
            tags: {
                type: "list",
                required: false,
                item: { type: "string", required: false },
            },
            image: { type: "string", required: false },
            title: { type: "string", required: true },
            isDeleted: { type: "boolean", required: true },
            profileID: { type: "streamid", required: true },
            description: { type: "string", required: true },
            externalURL: { type: "string", required: false },
            animationURL: { type: "string", required: false },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
        },
        PostComment: {
            postID: { type: "streamid", required: true, indexed: true },
            content: { type: "string", required: true, indexed: true },
            createdAt: { type: "datetime", required: true, indexed: true },
            isDeleted: { type: "boolean", required: true, indexed: true },
            profileID: { type: "streamid", required: true, indexed: true },
            replyingToID: { type: "streamid", required: false, indexed: true },
            post: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c7fpztqw008g6or3z7ys740k8u8n5uz3mbvzssofrvq3lsz6zsv",
                    property: "postID",
                },
            },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
        },
        PostLike: {
            postID: { type: "streamid", required: true, indexed: true },
            isDeleted: { type: "boolean", required: true, indexed: true },
            profileID: { type: "streamid", required: true, indexed: true },
            post: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c7fpztqw008g6or3z7ys740k8u8n5uz3mbvzssofrvq3lsz6zsv",
                    property: "postID",
                },
            },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c8u49qgtlpzw0hxy4rc0fbtis2cohgi64ei2xx3u5m2waubjzvh",
                    property: "profileID",
                },
            },
        },
    },
    enums: {},
    accountData: {
        profile: { type: "node", name: "Profile" },
        chatList: { type: "connection", name: "Chat" },
        chatMessageList: { type: "connection", name: "ChatMessage" },
        postList: { type: "connection", name: "Post" },
        experienceList: { type: "connection", name: "Experience" },
        educationList: { type: "connection", name: "Education" },
        followList: { type: "connection", name: "Follow" },
        assetList: { type: "connection", name: "Asset" },
        postCommentList: { type: "connection", name: "PostComment" },
        postLikeList: { type: "connection", name: "PostLike" },
    },
};
