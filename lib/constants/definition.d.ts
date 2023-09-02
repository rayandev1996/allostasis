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
        GreeniaProfile: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaArticle: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaArticleComment: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaArticleLike: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaArticlePermissionRequest: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaArticlePermissionRequestStatus: {
            id: string;
            accountRelation: {
                type: string;
            };
        };
        GreeniaFollow: {
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
        };
        GreeniaArticle: {
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
            createdAt: {
                type: string;
                required: boolean;
            };
            isDeleted: {
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
            greeniaProfileID: {
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
            greeniaProfile: {
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
        GreeniaArticleComment: {
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
            replyingToID: {
                type: string;
                required: boolean;
            };
            greeniaProfileID: {
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
        GreeniaArticleLike: {
            articleID: {
                type: string;
                required: boolean;
            };
            isDeleted: {
                type: string;
                required: boolean;
            };
            greeniaProfileID: {
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
        GreeniaArticlePermissionRequest: {
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
            greeniaProfileID: {
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
            greeniaProfile: {
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
        GreeniaArticlePermissionRequestStatus: {
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
        GreeniaFollow: {
            isDeleted: {
                type: string;
                required: boolean;
            };
            greeniaProfileID: {
                type: string;
                required: boolean;
            };
            targetGreeniaProfileID: {
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
            targetGreeniaProfile: {
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
        greeniaProfile: {
            type: string;
            name: string;
        };
        greeniaArticleList: {
            type: string;
            name: string;
        };
        greeniaArticleCommentList: {
            type: string;
            name: string;
        };
        greeniaArticleLikeList: {
            type: string;
            name: string;
        };
        greeniaArticlePermissionRequestList: {
            type: string;
            name: string;
        };
        greeniaArticlePermissionRequestStatusList: {
            type: string;
            name: string;
        };
        greeniaFollowList: {
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
    };
};
