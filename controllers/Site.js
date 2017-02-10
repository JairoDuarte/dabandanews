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
        refdata = db.ref('feed-noticias/sites').push(),
        ref=db.ref('feed-noticias/sites');
        if ( site.url==undefined)
            return res.status(500).send('url in required');
        try {
          request(site.url, function (error, response, body) {
            //console.log(body);
              if (!error && response.statusCode == 200) {
                to_json(body, function (error, data) {
                // Module returns a JS object
                  if (!error) {
                    var channel = data.rss.channel;

                    _site.name = channel.title;
                    _site.url = channel.link;
                    _site.description = channel.description;
                    _site.urlfeed = site.url;
                    _site.country = site.country;
                    _site.language = channel.language;
                        refdata.set(_site);
                    res.redirect('/site');
                  }else
                    return res.status(500).send("to_json error");
                });
              }else
                return res.status(500).send("request error");
            });

          //return res.status(200).send('site add');
        } catch (e) {
          console.log(e);
            return res.status(500).send("Add failled  ");
        }
    },
    update:function (req,res) {
      console.log(req.body);
      console.log(req.params.id);
      try {
            return res.json(result.rows);

      } catch (e) {
          return res.status(500).send("Echec dans la base données ");
      }
      return res.json(req.body);
    },
    getItems:function (req,res) {
    var taskSchedule = new schedule.RecurrenceRule();
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0,3];
    rule.hour = 23;
    rule.minute = 30;
    //rule.second = 30;
    taskSchedule.hour=23;
    taskSchedule.minute = 30;
    taskSchedule.second = 1;
    schedule.scheduleJob(rule,app.models.ChargerItems.deleteItems);
    schedule.scheduleJob(taskSchedule, app.models.ChargerItems.getItems);
    res.redirect('/site');
    }
  };
  function testT(req,res){
    console.log('testT()');
    //res.redirect('/site');
  }
  return SiteController;
};
