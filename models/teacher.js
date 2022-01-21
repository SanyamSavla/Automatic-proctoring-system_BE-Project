var mongoose = require('mongoose');
const Test = require('./Test');
const bcrypt = require("bcrypt");

const teacherSchema = new mongoose.Schema({
  
	contactNum: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique:true
	},
	password: {
		type: String,
		required: true,
	},
	users:[],
	orgName: String,
	test:{type: [{
		type:mongoose.Schema.Types.ObjectId,
		ref: 'Test'
	}],
	default: []
	},
});

const teacher = mongoose.model('teacher',teacherSchema);
module.exports= teacher;
