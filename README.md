This is a simple solution for the assignment given by Trifork.This app was made using Typescript and Javascript and implemented with the React framework Next.js. Shows a web page that lets you get information about a GitHub organization, such as the number of repositories, the largest one and the number of organizations currently registered in GitHub.

# Requirements
    Node.js (version 14 or higher)

# How to run the app
    Clone this repository to your local machine using Git.
    Open the functions.js file (should be in Trifork\src\lib) and paste your access token where it says 
    (line 4) in order to make the app functional. If you don't have one, follow the instructions in this 
    page https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token. 
    The token must have repo and read:org checked.
    Make sure the folders node_modules and .next are not in the root directory (delete them).
    Open a terminal and navigate to the root directory of the project.
    Run 'npm install' to install all the necesary dependencies.
    Run 'npx next build' to build the app.
    Run 'npm start' to start the app.

# How to use the app
    Go to the URL http://localhost:3000/
    Enter the name of the GitHub organization in the text field and press the "Get data" button.
    Organization information will be displayed.
    A name list of organizations currently registered on GitHub will be displayed at the bottom.
