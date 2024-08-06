// src/api/api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";

// Create a wrapper around graphqlRequestBaseQuery that logs the query
const logQueryBaseQuery = (baseQuery) => async (args, api, extraOptions) => {
  // Log the query
  console.log("Query:", args.document);

  // Send the query to the API
  return await baseQuery(args, api, extraOptions);
};

export const api = createApi({
  baseQuery: logQueryBaseQuery(
    graphqlRequestBaseQuery({
      url: "http://chat.ed.asmer.org.ua/graphql",
      prepareHeaders(headers, { getState }) {
        const { token } = getState().auth;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
      },
    })
  ),
  tagTypes: ["User", "Chat", "Message"], // Define tag types for caching
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ login, password }) => ({
        document: `
          query Login($login: String, $password: String) {
            login(login: $login, password: $password)
          }
        `,
        variables: { login, password },
      }),
    }),
    register: builder.mutation({
      query: ({ login, password }) => ({
        document: `
          mutation Register($login: String, $password: String) {
            UserUpsert(user: {login: $login, password: $password}) {
              _id
              login
            }
          }
        `,
        variables: { login, password },
      }),
    }),
    userFind: builder.query({
      query: () => ({
        document: `
          query UserFind {
            UserFind(query: "[{}]") {
              _id
              login
              nick
              avatar {
                url
              }
            }
          }
        `,
      }),
      providesTags: (result) =>
        result
          ? result.UserFind.map(({ _id }) => ({ type: "User", id: _id }))
          : [],
    }),
    userFindOne: builder.query({
      query: ({ _id }) => ({
        document: `
          query oneUser {
            UserFindOne(query: "[{\\"_id\\":\\"${_id}\\"}]") {
              _id
              login
              nick
              createdAt
              avatar {
                url
              }
            }
          }
        `,
        variables: { _id },
      }),
      providesTags: (result, error, { _id }) => [{ type: "User", id: _id }],
    }),
    userUpsert: builder.mutation({
      query: (user) => ({
        document: `
          mutation UserUpsert($user: UserInput!) {
            UserUpsert(user: $user) {
              _id
              login
              nick
              avatar {
                url
              }
            }
          }
        `,
        variables: { user },
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "User", id: _id }],
    }),
    setUserNick: builder.mutation({
      query: ({ _id, nick }) => ({
        document: `
          mutation setNick($_id: ID, $nick: String) {
            UserUpsert(user: { _id: $_id, nick: $nick }) {
              _id
              nick
            }
          }
        `,
        variables: { _id, nick },
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: "User", id: _id }],
    }),
    userChats: builder.query({
      query: ({ _id }) => ({
        document: `
          query userChats($query: String) {
            UserFindOne(query: $query) {
              _id
              login
              nick
              createdAt
              avatar {
                url
              }
              chats {
                _id
                title
                lastModified
                members {
                  _id
                  nick
                }
                avatar {
                  url
                }
              }
            }
          }
        `,
        variables: { query: JSON.stringify([{ _id }]) },
      }),
      providesTags: (result, error, { _id }) =>
        result
          ? [
              { type: "User", id: _id },
              ...result.UserFindOne.chats.map((chat) => ({
                type: "Chat",
                id: chat._id,
              })),
            ]
          : [],
    }),
    chatUpsert: builder.mutation({
      query: ({ title }) => ({
        document: `
        mutation createChat($title: String) {
          ChatUpsert(chat: { title: $title }) {
            _id
            title
          }
        }
      `,
        variables: { title },
      }),
      invalidatesTags: ["Chat"],
    }),
    actionAboutMe: builder.query({
      query: ({ _id }) => ({
        document: `
        query actionAboutMe($query: String) {
          UserFindOne(query: $query) {
            _id
            login
            nick
            createdAt
            avatar {
              url
            }
            chats {
              _id
              title
              lastModified
              members {
                _id
                nick
              }
              avatar {
                url
              }
            }
          }
        }
      `,
        variables: { query: JSON.stringify([{ _id }]) },
      }),
      providesTags: (result, error, { _id }) => [{ type: "User", id: _id }],
    }),
    getMessages: builder.query({
      query: ({ chatID, offset }) => ({
        document: `
        query getMessages {
          MessageFind(
            query: "[{\\"chat._id\\": \\"${chatID}\\"}, {\\"sort\\": [{\\"_id\\": -1}]}, {\\"limit\\": 100}, {\\"offset\\": ${offset}}]"
          ) {
            _id
            createdAt
            owner {
              _id
              nick
              avatar {
                url
              }
            }
            text
            chat {
              _id
            }
            media {
              _id
              url
            }
            replies {
              _id
            }
            replyTo {
              _id
            }
            forwarded {
              _id
            }
          }
        }
      `,
        variables: {
          chatID,
          offset,
        },
      }),
      providesTags: (result, error, { chatID }) =>
        result
          ? result.MessageFind.map(({ _id }) => ({
              type: "Message",
              id: _id,
              chatID,
            }))
          : [],
    }),
    MessageUpsert: builder.mutation({
      query: ({ chatID, text }) => ({
        document: `
        mutation MessageUpsert($chatID: ID, $text: String) {
          MessageUpsert(message: { chat: { _id: $chatID }, text: $text }) {
            _id
            createdAt
            text
            owner {
              _id
              nick
              avatar {
                url
              }
            }
            chat {
              _id
            }
          }
        }
      `,
        variables: { chatID, text },
      }),
      invalidatesTags: (result, error, { chatID }) => [
        { type: "Message", chatID },
      ],
    }),
    MessageUpdate: builder.mutation({
      query: ({ messageid, text }) => ({
        document: `
        mutation MessageUpdate($text: String, $messageid: ID) {
          MessageUpsert(message: { text: $text, _id: $messageid }) {
            _id
            createdAt
            text
            owner {
              _id
              nick
              avatar {
                url
              }
            }
            chat {
              _id
            }
          }
        }
      `,
        variables: { messageid, text },
      }),
      invalidatesTags: (result, error, { messageid }) => [
        { type: "Message", id: messageid },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserFindQuery,
  useUserFindOneQuery,
  useUserUpsertMutation,
  useSetUserNickMutation,
  useUserChatsQuery,
  useChatUpsertMutation,
  useActionAboutMeQuery,
  useGetMessagesQuery,
  useMessageUpsertMutation,
  useMessageUpdateMutation,
} = api;
