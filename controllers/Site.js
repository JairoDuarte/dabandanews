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
    },
    updateItems:function(req, res){
      var refdata = db.ref('feed-noticias/date_AddAll');
     
      refdata.limitToLast(1).once("child_added", function(snapshot) {
        console.log(snapshot.key);
        var date = snapshot.val().date, h = date.substring(11, 13),m= date.substring(14,16), j=date.substring(0,2);
        var today = new Date();
        var newH;
        newH = today.getHours();
        if(newH>12) newH-=12;
        if (j == today.getDate()) {
          var dif =(newH*60+today.getMinutes())-(h*60 +m*1);
          console.log("dif = "+dif);console.log();
          if (dif >=120) {
            app.models.ChargerItems.deleteItems();
            console.log("updateItems 1");
            return res.status(200).send("em actualização")
          } else {
            console.log("actualizado");
            return res.status(200).send("actualizado");
          }
        } else {
          var difj = today.getDay() - j;
          if (difj ==1) {
            var dif = (24*60 + newH*60 +today.getMinutes()) -(m *24);  
            if (dif >=180) {
              app.models.ChargerItems.deleteItems();
              return res.status(200).send("em actualização")
            } else {
              console.log("actualizado");
              return res.status(200).send("actualizado");
            } 
          } else {
            app.models.ChargerItems.deleteItems();
            console.log("updateItems 2");
            return res.status(200).send("em actualização");
          }
        }
      });
    }
  };
  return SiteController;
};
