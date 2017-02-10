module.exports = function(app) {

    var to_json = require('xmljson').to_json;

  var SiteModels = {
    getSite: function (body) {
      var _site={};
      _site.teste="teste";
      
      to_json(body, function (error, data) {
      // Module returns a JS object
      console.log(data);
      return _site;
        if (!error) {
          console.log('to_json');
          var channel = data.rss.channel;
          _site.title = channel.title;
          _site.url = channel.link;
          _site.description = channel.description;
          console.log(_site);

          return _site;
        }else
          return false;
      });
    }
  };

  return SiteModels;
}
