var nano = require('nano')('http://localhost:5984');
var dbHandle = nano.use('itirod');

var couchDBModel = require('couchdb-model');
var myModel = couchDBModel(dbHandle);

//var nodeCouchDB = require('node-couchdb');

// Connect to couch
//mongodb.connect('mongodb://localhost/chatrooms');
//var couch = new nodeCouchDB("localhost", 5984);
//
//var Schema = nodeCouchDB.Schema;
//var ObjectId = Schema.ObjectId;

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