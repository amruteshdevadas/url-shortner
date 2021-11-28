var Url = require("../models/Url");
var shortid = require("shortid");
exports.postShorten = async function (req, res) {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({
      error: "Url is required",
    });
  } else {
    const baseUrl = process.env.BASE_URL_NODE;
    const urlCode = shortid.generate();
    const url = new Url({
      originalUrl: longUrl,
      urlCode: urlCode,
      shortUrl: baseUrl + "/" + urlCode,
      Date: new Date(),
    });
    try {
      await url.save();
      res.json(url);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
};

exports.getShortUrl = async function(req,res){
    const {urlCode} = req.params;
    try{
        const url = await Url.findOne({urlCode: urlCode});
        if(!url){
          res.status(404).json({
                error: "Url not found"
            })
        }
     res.redirect(url.originalUrl);
    }
    catch(error){
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}

exports.getCount = async function(req,res){
    try{
        const count = await Url.find({$expr:{$eq:[{$month:"$createdAt"},11]}}).count();
        res.json({
            count: count
        })
    }
    catch(error){
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}