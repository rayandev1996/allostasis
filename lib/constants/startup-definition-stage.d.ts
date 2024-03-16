export declare const definition: {
    models: {
        Profile: {
            interface: boolean;
            implements: any[];
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Post: {
            interface: boolean;
            implements: any[];
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Asset: {
            interface: boolean;
            implements: any[];
            id: string;
            accountRelation: {
                type: string;
            };
        };
        Article: {
            interface: boolean;
            implements: any[];
            id: string;
            accountRelation: {
                type: string;
            };
        };
        PostComment: {
            interface: boolean;
            implements: any[];
            id: string;
            accountRelation: {
                type: string;
            };
        };
        PostLike: {
            interface: boolean;
            implements: any[];
            id: string;
            accountRelation: {
                type: string;
            };
        };
        ArticleLike: {
            interface: boolean;
            implements: any[];
            id: string;
            accountRelation: {
                type: string;
            };
        };
        ArticleComment: {
            interface: boolean;
            implements: any[];
            id: string;
            accountRelation: {
                type: string;
            };
        };
    };
    objects: {
        Profile: {
            logo: {
                type: string;
                required: boolean;
            };
            name: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            cover: {
                type: string;
                required: boolean;
            };
            email: {
                type: string;
                required: boolean;
            };
            slogan: {
                type: string;
                required: boolean;
            };
            address: {
                type: string;
                required: boolean;
            };
            nakamaID: {
                type: string;
                required: boolean;
            };
            platformID: {
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
            projectVision: {
                type: string;
                required: boolean;
            };
            requestedFund: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            projectHistory: {
                type: string;
                required: boolean;
            };
            projectMission: {
                type: string;
                required: boolean;
            };
            fundingStartDate: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            publicEncryptionDID: {
                type: string;
                required: boolean;
            };
            projectCompellingVideo: {
                type: string;
                required: boolean;
            };
            creator: {
                type: string;
                viewType: string;
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
        Asset: {
            tag1: {
                type: string;
                required: boolean;
            };
            tag2: {
                type: string;
                required: boolean;
            };
            tag3: {
                type: string;
                required: boolean;
            };
            tag4: {
                type: string;
                required: boolean;
            };
            tag5: {
                type: string;
                required: boolean;
            };
            tag6: {
                type: string;
                required: boolean;
            };
            tag7: {
                type: string;
                required: boolean;
            };
            tag8: {
                type: string;
                required: boolean;
            };
            tag9: {
                type: string;
                required: boolean;
            };
            image: {
                type: string;
                required: boolean;
            };
            tag10: {
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
        Article: {
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
            price: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            tag10: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            abstract: {
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
                indexed: boolean;
            };
            externalURL: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            isEncrypted: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            visualAbstract: {
                type: string;
                required: boolean;
                indexed: boolean;
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
            status: {
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
        ArticleLike: {
            articleID: {
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
        ArticleComment: {
            content: {
                type: string;
                required: boolean;
                indexed: boolean;
            };
            articleID: {
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
    };
    enums: {};
    accountData: {
        profile: {
            type: string;
            name: string;
        };
        postList: {
            type: string;
            name: string;
        };
        assetList: {
            type: string;
            name: string;
        };
        articleList: {
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
        articleLikeList: {
            type: string;
            name: string;
        };
        articleCommentList: {
            type: string;
            name: string;
        };
    };
};
