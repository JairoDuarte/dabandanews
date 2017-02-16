module.exports = function(app) {
  var db = require('../libs/db_connect')(),
  request = require('request'),
  schedule = require('node-schedule'),
  to_json = require('xmljson').to_json;

  var SiteController = {
    getAll: function (req,res) {
      var refdata = db.ref('feed-noticias/sites');
      console.log('getAll');
      refdata.on("value", function(snapshot) {
        res.render('site/index', { title:'DabandaNews Server', userp:{}, listsite:snapshot.val() });

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        return res.status(500).send("Echec dans la base données ");
      });
    },
    add:function (req,res) {
        var site = req.body.site, _site={},
        refdata = db.ref('feed-noticias/sites');//.push();
        if (site.url==undefined)
            return res.status(500).send('url in required');
        try {
          request(site.url, function (error, response, body) {
            //console.log(body);
              if (!error && response.statusCode == 200) {
                to_json(body, function (error, data) {
                // Module returns a JS object
                  if (!error) {
                    var channel =  data.rss.channel;

                    _site.name = site.name || channel.title;
                    _site.url = channel.link;
                    _site.description = channel.description;
                    _site.urlfeed = site.url;
                    _site.country = site.country;
                    _site.language = channel.language;
                    refdata.push(_site);

                    res.redirect('/site');
                  }else
                    res.status(500).send("to_json error");
                });
              }else
                res.status(500).send("request error");
            });

        } catch (e) {
          console.log(e);
            return res.status(500).send("Add failled  ");
        }
    },
    getItems:function (req,res) {
      app.models.ChargerItems.getItems();
      res.redirect('/');
    },
    deleteItems:function (req,res) {
      app.models.ChargerItems.deleteItems();
      res.redirect('/');
    }
  };
  return SiteController;
};
