export declare const definition: {
    models: {
        Profile: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Article: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        ArticleComment: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        ArticleLike: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        ArticlePermissionRequest: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        ArticlePermissionRequestStatus: {
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
        Chat: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaProfile: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaProfileEducation: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaProfileExperience: {
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
    };
    objects: {
        Profile: {
            name: {
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
            avatiaProfileID: {
                type: string;
                required: boolean;
            };
            weariaProfileID: {
                type: string;
                required: boolean;
            };
            embodiaProfileID: {
                type: string;
                required: boolean;
            };
            greeniaProfileID: {
                type: string;
                required: boolean;
            };
            centeriaProfileID: {
                type: string;
                required: boolean;
            };
            incarniaProfileID: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            articles: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
            articlesCount: {
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
        };
        Article: {
            body: {
                type: string;
                required: boolean;
            };
            tags: {
                type: string;
                required: boolean;
                item: {
                    type: string;
                    required: boolean;
                };
            };
            price: {
                type: string;
                required: boolean;
            };
            title: {
                type: string;
                required: boolean;
            };
            community: {
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
            thumbnail: {
                type: string;
                required: boolean;
            };
            isEncrypted: {
                type: string;
                required: boolean;
            };
            shortDescription: {
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
            permissionRequests: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        ArticleComment: {
            content: {
                type: string;
                required: boolean;
            };
            articleID: {
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
            replyingToID: {
                type: string;
                required: boolean;
            };
            article: {
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
        ArticleLike: {
            articleID: {
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
            article: {
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
        ArticlePermissionRequest: {
            content: {
                type: string;
                required: boolean;
            };
            articleID: {
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
            article: {
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
            status: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        ArticlePermissionRequestStatus: {
            status: {
                type: string;
                required: boolean;
            };
            articlePermissionRequestID: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            articlePermissionRequest: {
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
            };
            profileID: {
                type: string;
                required: boolean;
            };
            targetProfileID: {
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
        Chat: {
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
        GreeniaProfile: {
            bio: {
                type: string;
                required: boolean;
            };
            cover: {
                type: string;
                required: boolean;
            };
            skills: {
                type: string;
                required: boolean;
                item: {
                    type: string;
                    required: boolean;
                };
            };
            profileID: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
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
        };
        GreeniaProfileEducation: {
            city: {
                type: string;
                required: boolean;
            };
            title: {
                type: string;
                required: boolean;
            };
            school: {
                type: string;
                required: boolean;
            };
            endDate: {
                type: string;
                required: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
            };
            startDate: {
                type: string;
                required: boolean;
            };
            description: {
                type: string;
                required: boolean;
            };
            greeniaProfileID: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            greeniaProfile: {
                type: string;
                viewType: string;
                relation: {
                    source: string;
                    model: string;
                    property: string;
                };
            };
        };
        GreeniaProfileExperience: {
            city: {
                type: string;
                required: boolean;
            };
            title: {
                type: string;
                required: boolean;
            };
            company: {
                type: string;
                required: boolean;
            };
            endDate: {
                type: string;
                required: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
            };
            startDate: {
                type: string;
                required: boolean;
            };
            description: {
                type: string;
                required: boolean;
            };
            greeniaProfileID: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
            };
            greeniaProfile: {
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
    };
    enums: {};
    accountData: {
        profile: {
            type: string;
            name: string;
        };
        articleList: {
            type: string;
            name: string;
        };
        articleCommentList: {
            type: string;
            name: string;
        };
        articleLikeList: {
            type: string;
            name: string;
        };
        articlePermissionRequestList: {
            type: string;
            name: string;
        };
        articlePermissionRequestStatusList: {
            type: string;
            name: string;
        };
        followList: {
            type: string;
            name: string;
        };
        chatList: {
            type: string;
            name: string;
        };
        greeniaProfile: {
            type: string;
            name: string;
        };
        greeniaProfileEducationList: {
            type: string;
            name: string;
        };
        greeniaProfileExperienceList: {
            type: string;
            name: string;
        };
        chatMessageList: {
            type: string;
            name: string;
        };
    };
};
