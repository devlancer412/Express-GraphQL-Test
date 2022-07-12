const Router = require("express").Router;
const router = new Router();
const g = require('graphql-request')
require("dotenv").config();

const { GraphQLClient, gql } = g;

const url = 'https://api.github.com/graphql';

// Do not have your token in a string in your code, especially if you use source control
// https://medium.com/codait/environment-variables-or-keeping-your-secrets-secret-in-a-node-js-app-99019dfff716
const TOKEN = process.env.GITHUB_TOKEN;
// Create the graphQL client
const graphQLClient = new GraphQLClient(url, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
      },
    });

router.get('/commits', async (req, res) => {
  let {after, first, before, last} = req.query

  after = after?after:null;
  before = before?before:null;
  first = first?first:10;
  last = last?last:null;
  // The query that gets profile information
  let query;
  if (before&&last != null) {
    query = before?gql`
    {
      repository(name: "react", owner: "facebook") {
        defaultBranchRef {
          target {
            ... on Commit {
              history(last: ${last}, before: "${before}") {
                edges {
                  cursor
                  node {
                    commitUrl
                    deletions
                    additions
                    author {
                      user {
                        login
                      }
                      email
                      name
                    }
                    message
                    messageBody
                    changedFiles
                    committedDate
                    oid
                    committedViaWeb
                    pushedDate
                  }
                }

                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  endCursor
                }
                totalCount
              }
            }
          }
        }
      }
    }
    `:gql`
    {
      repository(name: "react", owner: "facebook") {
        defaultBranchRef {
          target {
            ... on Commit {
              history(last: ${last}) {
                edges {
                  cursor
                  node {
                    commitUrl
                    deletions
                    additions
                    author {
                      user {
                        login
                      }
                      email
                      name
                    }
                    message
                    messageBody
                    changedFiles
                    committedDate
                    oid
                    committedViaWeb
                    pushedDate
                  }
                }

                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  endCursor
                }
                totalCount
              }
            }
          }
        }
      }
    }
    `} else {
      query = after?gql`
      repository(name: "react", owner: "facebook") {
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: ${first}, after: "${after}") {
                edges {
                  cursor
                  node {
                    commitUrl
                    deletions
                    additions
                    author {
                      user {
                        login
                      }
                      email
                      name
                    }
                    message
                    messageBody
                    changedFiles
                    committedDate
                    oid
                    committedViaWeb
                    pushedDate
                  }
                }

                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  endCursor
                }
                totalCount
              }
            }
          }
        }
      }
    }
    `:gql`
    {
      repository(name: "react", owner: "facebook") {
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: ${first}) {
                edges {
                  cursor
                  node {
                    commitUrl
                    deletions
                    additions
                    author {
                      user {
                        login
                      }
                      email
                      name
                    }
                    message
                    messageBody
                    changedFiles
                    committedDate
                    oid
                    committedViaWeb
                    pushedDate
                  }
                }

                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  endCursor
                }
                totalCount
              }
            }
          }
        }
      }
    }
    `
  };
  // Make Graphql call
  const githubRes = await graphQLClient.request(query);

  // const commits = githubRes.repository.refs.edges.reduce((a, b) => {
  //   // console.log(a, b.node.target.history.edges)
  //   return a.concat(b.node.target.history.edges)
  // }, []).map(item => item);

  const commits = githubRes.repository.defaultBranchRef.target.history.edges.map(commit => commit.node);
  const startCursor = githubRes.repository.defaultBranchRef.target.history.edges[0].cursor;

  returnValue ={
    ...githubRes.repository.defaultBranchRef.target.history.pageInfo,
    commits,
    startCursor,
  };

  // Respond with results
  res.json(returnValue);
})

module.exports = router;