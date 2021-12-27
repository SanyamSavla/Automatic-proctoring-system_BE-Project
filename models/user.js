var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var bcrypt = require('bcrypt-nodejs');

const userschema = new mongoose.Schema({
    created_at: {
		type: Date,
		default: Date.now
	},
    
    name: {type: String, required: true},
    class:{type: String, required: false},
    rollnumber: {type: String, required: true},
    email: {type: String, required: true},
    contact:{type: String, required:true},
    password: {type: String, required: true},
    who:{type: String, required:false},
    year:{type: String, required:true}
});

//userschema.methods.encryptPassword = function(password){
//    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)
//};

////userschema.methods.validPassword = function(password){
 //   return bcrypt.compareSync(password,this.password);
//};

userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userschema);