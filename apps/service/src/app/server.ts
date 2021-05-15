import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import * as express from 'express';
import admin from 'firebase-admin';

import { AuthIdentity, RequestContext } from './auth-identity';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

// import { AuthIdentity, RequestContext } from './auth-identity';

const verifyToken = async ({ authorization, schoolid }) => {
  const newToken = authorization.replace('Bearer ', '');
  // TODO: disable for local env and set admin true
  const header = await admin
    .auth()
    .verifyIdToken(newToken)
    .then((decodedToken) => {
      return {
        ...decodedToken,
      } as AuthIdentity;
    })
    .catch(function (error) {
      // Handle error
      throw new AuthenticationError('No Access: Invalid id token');
    });
  return header;
};

export function gqlServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      if (!req.headers.authorization) {
        return {
          req,
          res,
        } as RequestContext;
      }

      const auth = await verifyToken(req.headers as any);

      return {
        auth: auth || {},
        req,
        res,
      } as RequestContext;
    },
    // Enable graphiql gui
    introspection: true,
    playground: {
      endpoint: 'api',
    },
    persistedQueries: {
      ttl: 900, // 15 minutes
    },
    // cacheControl: {
    //   defaultMaxAge: 30, // seconds
    // },
    plugins: [
      responseCachePlugin({
        sessionId: (requestContext) =>
          requestContext.request.http.headers.get('authorization') || null,
      }),
    ],
  });

  apolloServer.applyMiddleware({ app, path: '/', cors: true });

  return app;
}
