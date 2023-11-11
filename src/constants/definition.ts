// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    Profile: {
      id: "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
      accountRelation: { type: "single" },
    },
    Chat: {
      id: "kjzl6hvfrbw6c5w5ov3a5s0prf0s6o075j9ioichqzjtteoq8g6a5p5l9dbhvoq",
      accountRelation: { type: "list" },
    },
    ChatMessage: {
      id: "kjzl6hvfrbw6c54q61x0sohb3rjjydbk8r6gews8h8adczizxvnlaylx91gopcy",
      accountRelation: { type: "list" },
    },
    Experience: {
      id: "kjzl6hvfrbw6cbad3v6gbe4zqjur4w9225dfk0w7m5goxag0azvhtn375z18h8s",
      accountRelation: { type: "list" },
    },
    Follow: {
      id: "kjzl6hvfrbw6c5xzjusc07y5iwed7vq28jfchveishrllni4nm963oqzmpl4fac",
      accountRelation: { type: "list" },
    },
    Education: {
      id: "kjzl6hvfrbw6cafzur1jlgvr5u0qr77mx3nyhccywklcryjnwu8s7uny1u98e7e",
      accountRelation: { type: "list" },
    },
    Post: {
      id: "kjzl6hvfrbw6c9qmyrl88swv4m4efrwtdwz694bg0rjjk8mhokk0sdytif0vyts",
      accountRelation: { type: "list" },
    },
    Asset: {
      id: "kjzl6hvfrbw6c54odeb51k8ttc0mcff2pglrgc0e1kfn0fxy6pcz8sij6t4c0af",
      accountRelation: { type: "list" },
    },
    PostComment: {
      id: "kjzl6hvfrbw6c57muiv5w2swvrl6evjl4ztwnya3kuqe5l716q4yuqpuoe19cqt",
      accountRelation: { type: "list" },
    },
    PostLike: {
      id: "kjzl6hvfrbw6c53qf5fcxilz13jx30khbl6q4xvcqypkccnih88v3ej7khuxdym",
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
      gender: {
        type: "reference",
        refType: "enum",
        refName: "ProfileGender",
        required: false,
        indexed: true,
      },
      skills: {
        type: "list",
        required: false,
        item: { type: "string", required: false },
        indexed: true,
      },
      address: { type: "string", required: false },
      accountType: {
        type: "reference",
        refType: "enum",
        refName: "ProfileAccountType",
        required: false,
        indexed: true,
      },
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
          model:
            "kjzl6hvfrbw6c5w5ov3a5s0prf0s6o075j9ioichqzjtteoq8g6a5p5l9dbhvoq",
          property: "profileID",
        },
      },
      chatsCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c5w5ov3a5s0prf0s6o075j9ioichqzjtteoq8g6a5p5l9dbhvoq",
          property: "profileID",
        },
      },
      receivedChats: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c5w5ov3a5s0prf0s6o075j9ioichqzjtteoq8g6a5p5l9dbhvoq",
          property: "recipientProfileID",
        },
      },
      receivedChatsCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c5w5ov3a5s0prf0s6o075j9ioichqzjtteoq8g6a5p5l9dbhvoq",
          property: "recipientProfileID",
        },
      },
      experiences: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6cbad3v6gbe4zqjur4w9225dfk0w7m5goxag0azvhtn375z18h8s",
          property: "profileID",
        },
      },
      educations: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6cafzur1jlgvr5u0qr77mx3nyhccywklcryjnwu8s7uny1u98e7e",
          property: "profileID",
        },
      },
      followings: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c5xzjusc07y5iwed7vq28jfchveishrllni4nm963oqzmpl4fac",
          property: "profileID",
        },
      },
      followingsCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c5xzjusc07y5iwed7vq28jfchveishrllni4nm963oqzmpl4fac",
          property: "profileID",
        },
      },
      followers: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c5xzjusc07y5iwed7vq28jfchveishrllni4nm963oqzmpl4fac",
          property: "targetProfileID",
        },
      },
      followersCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c5xzjusc07y5iwed7vq28jfchveishrllni4nm963oqzmpl4fac",
          property: "targetProfileID",
        },
      },
      posts: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c9qmyrl88swv4m4efrwtdwz694bg0rjjk8mhokk0sdytif0vyts",
          property: "profileID",
        },
      },
      postsCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c9qmyrl88swv4m4efrwtdwz694bg0rjjk8mhokk0sdytif0vyts",
          property: "profileID",
        },
      },
      assets: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c54odeb51k8ttc0mcff2pglrgc0e1kfn0fxy6pcz8sij6t4c0af",
          property: "profileID",
        },
      },
      assetsCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c54odeb51k8ttc0mcff2pglrgc0e1kfn0fxy6pcz8sij6t4c0af",
          property: "profileID",
        },
      },
    },
    Chat: {
      createdAt: { type: "datetime", required: true },
      isDeleted: { type: "boolean", required: true },
      profileID: { type: "streamid", required: true },
      relationID: { type: "string", required: false },
      recipientProfileID: { type: "streamid", required: true },
      creator: { type: "view", viewType: "documentAccount" },
      profile: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
          property: "profileID",
        },
      },
      recipientProfile: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
          property: "recipientProfileID",
        },
      },
      messages: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c54q61x0sohb3rjjydbk8r6gews8h8adczizxvnlaylx91gopcy",
          property: "chatID",
        },
      },
      messagesCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c54q61x0sohb3rjjydbk8r6gews8h8adczizxvnlaylx91gopcy",
          property: "chatID",
        },
      },
    },
    ChatMessage: {
      body: { type: "string", required: true },
      chatID: { type: "streamid", required: true },
      createdAt: { type: "datetime", required: true },
      profileID: { type: "streamid", required: true },
      messageType: { type: "string", required: true },
      encryptedSymmetricKey: { type: "string", required: true },
      unifiedAccessControlConditions: { type: "string", required: true },
      chat: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c5w5ov3a5s0prf0s6o075j9ioichqzjtteoq8g6a5p5l9dbhvoq",
          property: "chatID",
        },
      },
      creator: { type: "view", viewType: "documentAccount" },
      profile: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
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
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
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
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
          property: "profileID",
        },
      },
      targetProfile: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
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
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
          property: "profileID",
        },
      },
    },
    Post: {
      body: { type: "string", required: true, indexed: true },
      tags: {
        type: "list",
        required: false,
        item: { type: "string", required: false },
        indexed: true,
      },
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
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
          property: "profileID",
        },
      },
      comments: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c57muiv5w2swvrl6evjl4ztwnya3kuqe5l716q4yuqpuoe19cqt",
          property: "postID",
        },
      },
      commentsCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c57muiv5w2swvrl6evjl4ztwnya3kuqe5l716q4yuqpuoe19cqt",
          property: "postID",
        },
      },
      likes: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c53qf5fcxilz13jx30khbl6q4xvcqypkccnih88v3ej7khuxdym",
          property: "postID",
        },
      },
      likesCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c53qf5fcxilz13jx30khbl6q4xvcqypkccnih88v3ej7khuxdym",
          property: "postID",
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
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
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
          model:
            "kjzl6hvfrbw6c9qmyrl88swv4m4efrwtdwz694bg0rjjk8mhokk0sdytif0vyts",
          property: "postID",
        },
      },
      creator: { type: "view", viewType: "documentAccount" },
      profile: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
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
          model:
            "kjzl6hvfrbw6c9qmyrl88swv4m4efrwtdwz694bg0rjjk8mhokk0sdytif0vyts",
          property: "postID",
        },
      },
      creator: { type: "view", viewType: "documentAccount" },
      profile: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c771ktevcpei7r6e7f2eob33rpb6z1fkwjj76muptaw2t76ah20",
          property: "profileID",
        },
      },
    },
  },
  enums: {
    ProfileGender: ["MALE", "FEMALE", "OTHER"],
    ProfileAccountType: ["PERSONAL", "ENTERPRISE"],
  },
  accountData: {
    profile: { type: "node", name: "Profile" },
    chatList: { type: "connection", name: "Chat" },
    chatMessageList: { type: "connection", name: "ChatMessage" },
    experienceList: { type: "connection", name: "Experience" },
    followList: { type: "connection", name: "Follow" },
    educationList: { type: "connection", name: "Education" },
    postList: { type: "connection", name: "Post" },
    assetList: { type: "connection", name: "Asset" },
    postCommentList: { type: "connection", name: "PostComment" },
    postLikeList: { type: "connection", name: "PostLike" },
  },
};
