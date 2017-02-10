var admin = require("firebase-admin"),
// Fetch the service account key JSON file contents
serviceAccount = require("../serviceAccountKey.json"),
single_connection;

module.exports = function() {

  if(!single_connection){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://dabandanews-eb64d.firebaseio.com"
    });

    single_connection = admin.database();
  }

  return single_connection;
};

//GestionEtudiantWebAPI
