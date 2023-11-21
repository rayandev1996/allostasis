export declare const definition: {
    models: {
        Profile: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Chat: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        ChatMessage: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Experience: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Post: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Follow: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Education: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Asset: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        PostComment: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        PostLike: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
    };
    objects: {
        Profile: {
            age: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            bio: {
                type: string;
                required: boolean;
            };
            cover: {
                type: string;
                required: boolean;
            };
            email: {
                type: string;
                required: boolean;
            };
            avatar: {
                type: string;
                required: boolean;
            };
            gender: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            skills: {
                type: string;
                required: boolean;
                item: {
                    type: string;
                    required: boolean;
                };
                indexed: boolean;
            };
            address: {
                type: string;
                required: boolean;
            };
            nakamaID: {
                type: string;
                required: boolean;
            };
            accountType: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            displayName: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            phoneNumber: {
                type: string;
                required: boolean;
            };
            socialLinks: {
                type: string;
                required: boolean;
                item: {
                    type: string;
                    required: boolean;
                };
            };
            creator: {
                type: string;
                viewType: string;
            };
            chats: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            chatsCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            receivedChats: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            receivedChatsCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            experiences: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            educations: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            followings: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            followingsCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            followers: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            followersCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            posts: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            postsCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            assets: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            assetsCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        Chat: {
            channelID: {
                type: string;
                required: boolean;
            };
            createdAt: {
                type: string;
                required: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
            };
            relationID: {
                type: string;
                required: boolean;
            };
            recipientProfileID: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            recipientProfile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            messages: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            messagesCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        ChatMessage: {
            body: {
                type: string;
                required: boolean;
            };
            chatID: {
                type: string;
                required: boolean;
            };
            createdAt: {
                type: string;
                required: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
            };
            messageType: {
                type: string;
                required: boolean;
            };
            encryptedSymmetricKey: {
                type: string;
                required: boolean;
            };
            unifiedAccessControlConditions: {
                type: string;
                required: boolean;
            };
            chat: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        Experience: {
            city: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            title: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            company: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            endDate: {
                type: string;
                required: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            startDate: {
                type: string;
                required: boolean;
            };
            description: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        Post: {
            body: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag1: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag2: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag3: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag4: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag5: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag6: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag7: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag8: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag9: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag10: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            createdAt: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            attachment: {
                type: string;
                required: boolean;
            };
            externalURL: {
                type: string;
                required: boolean;
            };
            isEncrypted: {
                type: string;
                required: boolean;
            };
            encryptedSymmetricKey: {
                type: string;
                required: boolean;
            };
            unifiedAccessControlConditions: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            comments: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            commentsCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            likes: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            likesCount: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        Follow: {
            isDeleted: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            targetProfileID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            targetProfile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        Education: {
            city: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            title: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            school: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            endDate: {
                type: string;
                required: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            startDate: {
                type: string;
                required: boolean;
            };
            description: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        Asset: {
            tags: {
                type: string;
                required: boolean;
                item: {
                    type: string;
                    required: boolean;
                };
            };
            image: {
                type: string;
                required: boolean;
            };
            title: {
                type: string;
                required: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
            };
            description: {
                type: string;
                required: boolean;
            };
            externalURL: {
                type: string;
                required: boolean;
            };
            animationURL: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        PostComment: {
            postID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            content: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            createdAt: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            replyingToID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            post: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        PostLike: {
            postID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            profileID: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            post: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            creator: {
                type: string;
                viewType: string;
            };
            profile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
    };
    enums: {};
    accountData: {
        profile: {
            type: string;
            name: string;
        };
        chatList: {
            type: string;
            name: string;
        };
        chatMessageList: {
            type: string;
            name: string;
        };
        experienceList: {
            type: string;
            name: string;
        };
        postList: {
            type: string;
            name: string;
        };
        followList: {
            type: string;
            name: string;
        };
        educationList: {
            type: string;
            name: string;
        };
        assetList: {
            type: string;
            name: string;
        };
        postCommentList: {
            type: string;
            name: string;
        };
        postLikeList: {
            type: string;
            name: string;
        };
    };
};
