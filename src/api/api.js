// src/api/api.js http://chat.ed.asmer.org.ua/graphql
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
    }),

    userFindOne: builder.query({
      query: ({ _id }) => ({
        document: `query oneUser($query: String){
              UserFindOne(query: $query){
                _id
                login
                nick
                createdAt
                avatar {
                  url
                }

              }
          }`,
        variables: { query: JSON.stringify([{ _id }]) },
      }),
      providesTags: (result, error, { _id }) => {
        return [{ type: "User", id: _id }];
      },
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
    }),

    setUserNick: builder.mutation({
      query: ({ _id, nick }) => ({
        document: `
          mutation setNick($_id: String, $nick: String) {
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
      providesTags: (result, error, { _id }) => {
        return [{ type: "User", id: _id }];
      },
    }),

    chatUpsert: builder.mutation({
      query: ({ title, ownerId }) => ({
        document: `
          mutation createChat($title: String, $ownerId: ID) {
            ChatUpsert(chat: { title: $title, members: [{ _id: $ownerId }] }) {
              _id
              title
            }
          }
        `,
        variables: { title, ownerId },
      }),
      invalidatesTags: ["Chat"],
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
  useChatUpsertMutation
} = api;
