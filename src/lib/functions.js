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
    // Obtener los nombres de los repositorios de la organización
    const repoQuery = `
      query {
        organization(login: "${orgName}") {
          repositories(first: 100) {
            nodes {
              name
              diskUsage
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
  
    const repos = repoResult.data.organization.repositories.nodes;
  
    // Buscar en el JSON el atributo size
    let biggestRepo = '';
    let biggestSize;
    biggestSize = 0;
    for (const repo of repos) {
      const size = repo.diskUsage;
      // Guardar el nombre del repositorio y el atributo size
      if (size > biggestSize) {
        
        biggestRepo = repo.name;
        biggestSize = size;
      }
    }
  
    return biggestSize;
  }

  export const getOrgNames = async () => {
    const response = await fetch('https://api.github.com/organizations');
    const orgs = await response.json();
    return orgs.map(org => org.login);
  }
