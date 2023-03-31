import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@trifork/styles/Home.module.css'
import { useState, useEffect } from 'react';
import { getRepositoryCount, getBiggestRepository, getOrgNames } from '@trifork/lib/functions.js';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  
  const [orgName, setOrgName] = useState('');
  const [numOfRepos, setNumOfRepos] = useState(null);
  const [biggestRepo, setBiggestRepo] = useState([]);
  const [numOfOrgs, setNumOfOrgs] = useState(null);
  const [orgList, setOrgList] = useState([]);

  useEffect(() => {
    // Get the number of organizations in GitHub
    fetch('https://api.github.com/organizations')
      .then(response => response.json())
      .then(data => setNumOfOrgs(data.length))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    // Get all the names of organization in GitHub
    async function fetchOrgList() {
      const orgNames = await getOrgNames();
      setOrgList(orgNames);
    }
    fetchOrgList();
  }, []);

  const handleOrgNameChange = (event) => {
    // Changes the organization name for posible search
    setOrgName(event.target.value);
  }

  const handleGetDataClick = () => {
    // Call of the functions getRepositoryCount and getBiggestRepository
    // to see the number of repos the organization has and the largest in size
    getRepositoryCount(orgName)
      .then(data => setNumOfRepos(data))
      .catch(error => console.error(error));

    getBiggestRepository(orgName)
      .then(data => setBiggestRepo(data))
      .catch(error => console.error(error));
  }

  return (
    <>
      <Head>
        <title>Trifork Assignment</title>
        <meta name="description" content="The solution to the assignment given by Trifork for the interview" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1>Trifork Assignment</h1>
          <pre>
            <div>
              <label htmlFor="orgNameInput">Organization name:</label>
              <input type="text" id="orgNameInput" value={orgName} onChange={handleOrgNameChange} />
              <button onClick={handleGetDataClick}>Get data</button>
            </div>
            <div>
              <p>Number of repositories: <span style={{color: 'green', backgroundColor: 'yellow'}}>{numOfRepos}</span></p>
              <p>Biggest repository: <span style={{color: 'green', backgroundColor: 'yellow'}}>{biggestRepo[0]}</span> with
              <span style={{color: 'green', backgroundColor: 'yellow'}}>{biggestRepo[1]}</span> kilobytes</p>
            </div>
            <p>Number of Github organizations: <span style={{color: 'green', backgroundColor: 'yellow'}}>{numOfOrgs}</span></p>
          </pre>
          <div>  
            <h2>Organizations:</h2>
            <pre>
              <ul>
                {orgList.map((orgName, index) => (
                  <li key={index}>{orgName}</li>
                ))}
              </ul>
            </pre>
          </div>
        </div>
      </main>
    </>
  )
}
