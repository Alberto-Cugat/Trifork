//Import of ApolloClient to use GraphQL
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

/*Initialize ApolloClient
    field uri: URL of GraphQL server
    field cache: instance of InMemoryCache
*/
const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    cache: new InMemoryCache(),
    headers: {
        Authorization: `Bearer ${process.env.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}`
      }
  });