const md5 = require("md5");
const db = require("../db/model")

const githubMiddleWare = async (req, res, next) => {
  // get api key from query
  const {api_key} = req.query;

  if (api_key == undefined || api_key == null) {
    return res.json({status: "failed", data: "you need api key to get data"});
  }
  // get hash from api key
  const hashed = md5(api_key);
  console.log(api_key, hashed);

  // read database
  await db.models.apiKeys.sync();
  const keyItem = await db.models.apiKeys.findOne({
    where: {
      apikeyHash: hashed
    }
  });

  if (!keyItem) {
    return res.json({status: "failed", data: "can't find such key"});
  }
  // expried time calculate
  currentTime = (new Date()).getTime();
  if (keyItem.expiredTime < currentTime) {
    return res.json({status: "failed", data: "time was expired"});
  }

  next();
}

module.exports = githubMiddleWare;