var mongoose = require('mongoose');
const testSchema = new mongoose.Schema({
	orgId:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Org',
	},
	testName:String,
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
