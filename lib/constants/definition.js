"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.definition = void 0;
// This is an auto-generated file, do not edit manually
exports.definition = {
    models: {
        Profile: {
            id: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
            accountRelation: { type: "single" },
        },
        Chat: {
            id: "kjzl6hvfrbw6c5c31u717vuk9leanze2tvx9zzyw3otyc8bfud9ureya3jg4g36",
            accountRelation: { type: "list" },
        },
        ChatMessage: {
            id: "kjzl6hvfrbw6c93shuw1b8gxrwgynmve25m3gmzxlyt0t2u1neegzme4xlbe1bz",
            accountRelation: { type: "list" },
        },
        Experience: {
            id: "kjzl6hvfrbw6canpk7j60s0nbkfa107qx6zwi8sadwwu48ejlf0e19frdh1wmm7",
            accountRelation: { type: "list" },
        },
        Post: {
            id: "kjzl6hvfrbw6c6bj8bo0m5cp2pmk4mm1qccfsdk1zwdmdaquoqxrq3cuw5gvs9n",
            accountRelation: { type: "list" },
        },
        Follow: {
            id: "kjzl6hvfrbw6c5oqar67kzai2rrhexb727ur49e2rvqsgcb9mzw1bpdx4nrix8b",
            accountRelation: { type: "list" },
        },
        Education: {
            id: "kjzl6hvfrbw6c75txxcu51vqzcmato84uzd23uvstuzh7lv671nqg1670gtj9wj",
            accountRelation: { type: "list" },
        },
        Asset: {
            id: "kjzl6hvfrbw6c57be4ouqj3kp1jmp3x1l3z69kjuk0ilemhke5pvcsrkthukl4a",
            accountRelation: { type: "list" },
        },
        PostComment: {
            id: "kjzl6hvfrbw6c806ppwm0mhryxut55x12vi7ikts591kzhk8sevy132kpqxdtby",
            accountRelation: { type: "list" },
        },
        PostLike: {
            id: "kjzl6hvfrbw6c7snil2khwtf3y7i0o4okjdsgk0keq2saleldgq1w933d484whu",
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
            creator: { type: "view", viewType: "documentAccount" },
            chats: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c5c31u717vuk9leanze2tvx9zzyw3otyc8bfud9ureya3jg4g36",
                    property: "profileID",
                },
            },
            chatsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c5c31u717vuk9leanze2tvx9zzyw3otyc8bfud9ureya3jg4g36",
                    property: "profileID",
                },
            },
            receivedChats: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c5c31u717vuk9leanze2tvx9zzyw3otyc8bfud9ureya3jg4g36",
                    property: "recipientProfileID",
                },
            },
            receivedChatsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c5c31u717vuk9leanze2tvx9zzyw3otyc8bfud9ureya3jg4g36",
                    property: "recipientProfileID",
                },
            },
            experiences: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6canpk7j60s0nbkfa107qx6zwi8sadwwu48ejlf0e19frdh1wmm7",
                    property: "profileID",
                },
            },
            educations: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c75txxcu51vqzcmato84uzd23uvstuzh7lv671nqg1670gtj9wj",
                    property: "profileID",
                },
            },
            followings: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c5oqar67kzai2rrhexb727ur49e2rvqsgcb9mzw1bpdx4nrix8b",
                    property: "profileID",
                },
            },
            followingsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c5oqar67kzai2rrhexb727ur49e2rvqsgcb9mzw1bpdx4nrix8b",
                    property: "profileID",
                },
            },
            followers: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c5oqar67kzai2rrhexb727ur49e2rvqsgcb9mzw1bpdx4nrix8b",
                    property: "targetProfileID",
                },
            },
            followersCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c5oqar67kzai2rrhexb727ur49e2rvqsgcb9mzw1bpdx4nrix8b",
                    property: "targetProfileID",
                },
            },
            posts: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c6bj8bo0m5cp2pmk4mm1qccfsdk1zwdmdaquoqxrq3cuw5gvs9n",
                    property: "profileID",
                },
            },
            postsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c6bj8bo0m5cp2pmk4mm1qccfsdk1zwdmdaquoqxrq3cuw5gvs9n",
                    property: "profileID",
                },
            },
            assets: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c57be4ouqj3kp1jmp3x1l3z69kjuk0ilemhke5pvcsrkthukl4a",
                    property: "profileID",
                },
            },
            assetsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c57be4ouqj3kp1jmp3x1l3z69kjuk0ilemhke5pvcsrkthukl4a",
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
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
                    property: "profileID",
                },
            },
            recipientProfile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
                    property: "recipientProfileID",
                },
            },
            messages: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c93shuw1b8gxrwgynmve25m3gmzxlyt0t2u1neegzme4xlbe1bz",
                    property: "chatID",
                },
            },
            messagesCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c93shuw1b8gxrwgynmve25m3gmzxlyt0t2u1neegzme4xlbe1bz",
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
            encryptedSymmetricKey: { type: "string", required: true },
            unifiedAccessControlConditions: { type: "string", required: true },
            chat: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6c5c31u717vuk9leanze2tvx9zzyw3otyc8bfud9ureya3jg4g36",
                    property: "chatID",
                },
            },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
                    property: "profileID",
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
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
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
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
                    property: "profileID",
                },
            },
            comments: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c806ppwm0mhryxut55x12vi7ikts591kzhk8sevy132kpqxdtby",
                    property: "postID",
                },
            },
            commentsCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c806ppwm0mhryxut55x12vi7ikts591kzhk8sevy132kpqxdtby",
                    property: "postID",
                },
            },
            likes: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryConnection",
                    model: "kjzl6hvfrbw6c7snil2khwtf3y7i0o4okjdsgk0keq2saleldgq1w933d484whu",
                    property: "postID",
                },
            },
            likesCount: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "queryCount",
                    model: "kjzl6hvfrbw6c7snil2khwtf3y7i0o4okjdsgk0keq2saleldgq1w933d484whu",
                    property: "postID",
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
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
                    property: "profileID",
                },
            },
            targetProfile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
                    property: "targetProfileID",
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
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
                    property: "profileID",
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
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
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
                    model: "kjzl6hvfrbw6c6bj8bo0m5cp2pmk4mm1qccfsdk1zwdmdaquoqxrq3cuw5gvs9n",
                    property: "postID",
                },
            },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
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
                    model: "kjzl6hvfrbw6c6bj8bo0m5cp2pmk4mm1qccfsdk1zwdmdaquoqxrq3cuw5gvs9n",
                    property: "postID",
                },
            },
            creator: { type: "view", viewType: "documentAccount" },
            profile: {
                type: "view",
                viewType: "relation",
                relation: {
                    source: "document",
                    model: "kjzl6hvfrbw6ca5al7nk5x3t3130vwa1ple8wv51gim3fzvfqowx46smz5xl50m",
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
        experienceList: { type: "connection", name: "Experience" },
        postList: { type: "connection", name: "Post" },
        followList: { type: "connection", name: "Follow" },
        educationList: { type: "connection", name: "Education" },
        assetList: { type: "connection", name: "Asset" },
        postCommentList: { type: "connection", name: "PostComment" },
        postLikeList: { type: "connection", name: "PostLike" },
    },
};
