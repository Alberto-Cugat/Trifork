//Import of ApolloClient to use GraphQL
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

  /*Initialize ApolloClient
    field uri: URL of GraphQL server
    field cache: instance of InMemoryCache
  */
  const gitQuerys = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    cache: new InMemoryCache(),
    headers: {
        Authorization: `Bearer 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`
      }
  });

  // Given an organization return the number of repositories
  export const getRepositoryCount = async (orgName) => {
    const query = gql`
      query {
        organization(login: "${orgName}") {
          repositories {
            totalCount
          }
        }
      }
    `;
    const { data } = await gitQuerys.query({ query });
    return data.organization.repositories.totalCount;
  };
  
  // Given an organization return the biggest repository (in bytes)
  export const getBiggestRepository = async (orgName) => {
    let hasNextPage = true;
    let endCursor = null;
    let repos = [];
    let reposN = [];
    // As we don't know how many repositories there is, we use endCursor to set the pagination and
    // iterate through all the repositories
    while (hasNextPage) {
      const repoQuery = `
        query {
          organization(login: "${orgName}") {
            repositories(first: 100${endCursor ? `, after: "${endCursor}"` : ''}) {
              nodes {
                name
                diskUsage
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      `;

      const repoResult = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`,
        },
        body: JSON.stringify({query: repoQuery}),
      }).then(res => res.json());

      const pageInfo = repoResult.data.organization.repositories.pageInfo;
      const nodes = repoResult.data.organization.repositories.nodes.map(node => node.diskUsage);
      const nodesN = repoResult.data.organization.repositories.nodes.map(node => node.name);
      repos = repos.concat(nodes);
      reposN = reposN.concat(nodesN);

      if (pageInfo.hasNextPage) {
        endCursor = pageInfo.endCursor;
      } else {
        hasNextPage = false;
      }
    }

    // With all the sizes, we iterate through the list to get the largest number and the name of the associated repository
    let biggestRepo = '';
    let biggestSize;
    let size = 0;
    biggestSize = 0;
    repos.forEach(function (repo, i){
      size = repo;
      if (size > biggestSize) {
        biggestRepo = reposN[i];
        biggestSize = size;
      }
    })
  
    return [biggestRepo, biggestSize];
  }

  // We list all the organizations names
  export const getOrgNames = async () => {
    const response = await fetch('https://api.github.com/organizations');
    const orgs = await response.json();
    return orgs.map(org => org.login);
  }
