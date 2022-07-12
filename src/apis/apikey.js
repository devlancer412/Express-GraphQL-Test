const Router = require("express").Router;
const router = new Router();
const db = require("../db/model");
const md5 = require("md5")

const generateApiKey = (length) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.get('/new', async (req, res) => {
  const newKey = generateApiKey(10);
  const hashed = md5(newKey);
  console.log(hashed);
  const cd = new Date();
  cd.setDate(cd.getDate() + 1);
  const expiredTime = cd.getTime();

  try {
    await db.models.apiKeys.sync();
    await db.models.apiKeys.create({
      apikeyHash: hashed,
      expiredTime: expiredTime,
    })
  } catch(err) {
    console.log(err)
    res.json({status: "failed", data: err});
  }

  res.json({status: "success", data: newKey});
})

router.get('/', async (req, res) => {
  let allkey;
  try {
    await db.models.apiKeys.sync();
    allkey = await db.models.apiKeys.findAll()
  } catch(err) {
    console.log(err)
    res.json({status: "failed", data: err});
  }

  res.json({status: "success", data: allkey});
})

module.exports = router;