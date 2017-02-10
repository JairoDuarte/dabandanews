module.exports= function(app) {

    var home =app.controllers.Home;

    app.get('/',home.index);
    app.get('/login',home.login);
}
