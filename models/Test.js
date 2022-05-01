var mongoose = require('mongoose');
const testSchema = new mongoose.Schema({
	teacher:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'user',
	},
	testName:String,
	testcode:String,
	course:String,
	settings:{
		testDuration :String,
		disableTabChange : Boolean,
		disableNeck : Boolean,
		disableMobile : Boolean,
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
	logs:[{
		userId:{
			type: mongoose.Schema.Types.ObjectId,
			ref:'User',
		},
		logs:{},
		flag:Number,
		testStartedAt:String,
		testCompletedAt:String,
	}],
	responses: [{
		userId:{
			type: mongoose.Schema.Types.ObjectId,
			ref:'User',
		},
		answers:[],
		testStartedAt:Date,
		testCompletedAt:Date,
		flagged:Boolean,
		reason:String,
		score:{type: Number,
			unique: true}
	}] ,
});


const Test= mongoose.model('Test',testSchema);
module.exports=Test;
