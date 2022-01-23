var mongoose = require('mongoose');
const testSchema = new mongoose.Schema({
	teacher:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'user',
	},
	testName:String,
	testcode:String,
	settings:{
		testDuration :String,
		disableTabChange : Boolean,
		enableFullScreen : Boolean,
		severity:String,
		totalScore:Number
	},
	questions: [{
		questionText:String,
		score:Number,
		options:[{
			type: String,
		}],
		correctOptions:[{
			type: String,
		}],
		qType:String
	}],
	responses: [{
		userId:{
			type: mongoose.Schema.Types.ObjectId,
			ref:'User',
		},
		logs:{},
		answers:[],
		testStartedAt:Date,
		testCompletedAt:Date,
		flagged:Boolean,
		reason:String
	}],
});


const Test= mongoose.model('Test',testSchema);
module.exports=Test;
