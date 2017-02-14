module.exports = function(app) {
  var db = require('../libs/db_connect')(),
  request = require('request'),
  cheerio = require('cheerio'),
  dateFormat = require('dateformat'),
  to_json = require('xmljson').to_json,
  date = dateFormat(new Date, "dd-mm-yyyy h:MM");

  var ChargerItems = {
    getItems: function () {
      console.log('la');
      getSite();
    },
    deleteItems:function () {
      console.log('deleteItems');
      var refdata = db.ref('feed-noticias/items');
      refdata.remove();
    }
  };

  function getSite(){
    console.log('getSite()');
    var refdata = db.ref('feed-noticias/sites');
    refdata.on("value", function(snapshot) {
      var sites = snapshot.val();
      getChannel(sites);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }
  function getChannel(sites){
    var _sites=[], site,cont=-1;
    for (var i in sites) {
      site = new Object();
      site = sites[i].name;
      _sites.push(site);
    }

    console.log('getChannel()');
    for (var i in sites) {
      console.log(sites[i].name);
      request(sites[i].urlfeed, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            to_json(body, function (error, data) {
            // Module returns a JS object
              if (!error) {
                var channel = data.rss.channel;
                cont++;
                getItems(channel,_sites, cont);
              }else
                console.log('to_json error');
            });
          }else
            console.log("request error");
        });
    }
  }
  function getItems(site,listsite, indx) {
    var itemArray =[],_item;
    console.log('getItems()');
    for (var i in site.item) {
      var item =  site.item[i];
      //console.log(item);
      _item = new Object();
      _item.site = listsite[indx];
      _item.adddate =date;
      _item.creator = item['dc:creator'] || '';
      _item.title = item.title || '';
      _item.url = item.link|| '';
      _item.pubdate = item.pubDate || '';
      _item.category=item.category || '';
      try {
        var $content = cheerio.load(item['content:encoded']);
        var $ = $content('img');
        _item.content = $content.text();
        _item.image = $['0'].attribs.src;
      } catch (e) {
        _item.content = '';
        try {
          _item.image = item.enclosure['$'].url; //['']
        } catch (e) {_item.image ='';}
      }
      try {
        _item.description = cheerio.load(item.description).text();
      } catch (e) {
        _item.description ='';
      }
      itemArray.push(_item);
    }
    addItems(itemArray);
  }
  function addItems(itemArray) {
    console.log('database');
    var refdata = db.ref('feed-noticias/items');
    for (var i = 0; i < itemArray.length; i++) {
      refdata.push(itemArray[i]);
    }
  }

  return ChargerItems;
}
