// src/api/api.js http://chat.ed.asmer.org.ua/graphql
// src/api/api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";

export const api = createApi({
  baseQuery: graphqlRequestBaseQuery({
    url: "http://chat.ed.asmer.org.ua/graphql",
    prepareHeaders(headers, { getState }) {
      const { token } = getState().auth;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
      query: ({ query }) => ({
       
          document: `
              query oneUser {
                UserFindOne(query: "[{\"_id\": \"66881c5cadf3bd0ee7be9879\" }]") {
                    _id
                    login
                    nick
                    avatar {
                        url
                    }
         }
}   
            `
          
        }
      ),
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUserFindQuery,
  useUserFindOneQuery,
  useUserUpsertMutation,
} = api;

  