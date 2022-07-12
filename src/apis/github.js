const Router = require("express").Router;
const router = new Router();
const g = require('graphql-request')
require("dotenv").config();

const { GraphQLClient, gql } = g;
// github graphql api endpoint url
const url = 'https://api.github.com/graphql';
// github access token
const TOKEN = process.env.GITHUB_TOKEN;
// get github GraphQLClient from access token
const graphQLClient = new GraphQLClient(url, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
      },
    });

router.get('/commits', async (req, res) => {
  // getting query parameters
  let {after, first, before, last} = req.query

  after = after?after:null;
  before = before?before:null;
  first = first?first:10;
  last = last?last:null;
  // build graphql queries
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

  // filter data
  const commits = githubRes.repository.defaultBranchRef.target.history.edges.map(commit => commit.node);
  const startCursor = githubRes.repository.defaultBranchRef.target.history.edges[0].cursor;

  // return data type
  returnValue ={
    ...githubRes.repository.defaultBranchRef.target.history.pageInfo,
    commits,
    startCursor,
  };

  // Respond with results
  res.json(returnValue);
})

module.exports = router;