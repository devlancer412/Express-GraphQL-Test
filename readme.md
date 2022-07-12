# Express + Graphql + SQLite Test

## Endpoints

### get /

Return "Hello world"

### get /apikey/new

Generate new key and return new key. (apikey is 10 charset of uppercase, lowercase and digit)

### get /apikey/

Get all apikey hash list. (database don't save key. save hash of key for secret)

### get /github/commits

Return commit list.(must add api_key=<YOUR_KEY> to query parameter)

```
hasNextPage: true, // if has next commits
hasPreviousPage: false, // if has prev commits
startCursor: 'e225fa43ada4f4cf3d3ba4982cdd81bb093eaa46 0', // first commit cursor
endCursor: 'e225fa43ada4f4cf3d3ba4982cdd81bb093eaa46 9',   // last commit cursor
commits: [Object] // commit list
```

How to use query parameter for

```
/github/commits?api_key=<YOUR_KEY>: returns first 10 commit (10 is default limit)
/github/commits?first=40&api_key=<YOUR_KEY>: returns first 50 commit (first means limit)
/github/commits?after=<START_CURSOR>&first=10&api_key=<YOUR_KEY>: returns 10 commit after START_CURSOR item(after means offset)
/github/commits?before=<END_CURSOR>&last=10&api_key=<YOUR_KEY>: returns 10 commit before END_CURSOR item(after means offset)
```
