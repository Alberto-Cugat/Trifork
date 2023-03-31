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
  
    const repos = repoResult.data.organization.repositories.nodes.map(node => node.name);
  
    // Buscar en el JSON el atributo size
    let biggestRepo = '';
    let biggestSize;
    biggestSize = 0;
    for (const repo of repos) {
      const url = `https://api.github.com/repos/${orgName}/${repo}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer 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`,
        },
      });
      const json = await response.json();
      const size = json.size;
  
      // Guardar el nombre del repositorio y el atributo size
      if (size > biggestSize) {
        biggestRepo = repo;
        biggestSize = size;
      }
    }
  
    return biggestSize;
  }
  

