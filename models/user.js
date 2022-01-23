var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require('bcrypt-nodejs');

const userschema = new mongoose.Schema({
    created_at: {
		type: Date,
		default: Date.now
	},
    isAdmin: {
		type: Boolean,
		default: false
	},
    name: {type: String},
    class:{type: String,},
    rollnumber: {type: String, },
    email: {type: String,},
    contact:{type: String,},
    password: {type: String, },
    who:{type: String, },
    year:{type: String, }
});

//userschema.methods.encryptPassword = function(password){
//    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)
//};

////userschema.methods.validPassword = function(password){
 //   return bcrypt.compareSync(password,this.password);
//};

userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userschema);