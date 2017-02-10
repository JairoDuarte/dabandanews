module.exports= function(app) {

    var site =app.controllers.Site;

    //app.get('/site/add/',site.add);
    app.get('/site/',site.getAll);
    app.get('/site/task/',site.getItems);
    app.post('/site/add',site.add);
  }
