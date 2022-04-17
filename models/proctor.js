var mongoose = require('mongoose');
 
var proctorSchema = new mongoose.Schema({

   user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
   tests:[{
    test:{
			type: mongoose.Schema.Types.ObjectId,
			ref:'Test',
		},
    imageUrl: {type:Array , unique:true },
   }],
    
});
 
//Image is a model which has a schema imageSchema
 
module.exports = new mongoose.model('proctor', proctorSchema);