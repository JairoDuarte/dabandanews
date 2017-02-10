module.exports = function(app) {

  var HomeController = {
    index: function(req, res) {
      console.log('la');
      res.render('index', { img: '/images/find_user1.jpg', title:'DabandaNews Server', Admin:'Jairo' });
    },
    login: function(req, res) {
      res.render('Home/login',{repnom:"" });
    }

  };

  return HomeController;
};
