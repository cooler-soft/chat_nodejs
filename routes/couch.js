var nano = require('nano')('http://localhost:5984');
var dbHandle = nano.use('itirod');

var couchDBModel = require('couchdb-model');
var myModel = couchDBModel(dbHandle);


var Users = myModel.create({
    id: String,
    firstname: String,
    lastname: String,
    email: { type: String, unique: true},
    password: String
});


//Course.findallbyview(key: @user.email)
//design: fiu


module.exports.Users = myModel;