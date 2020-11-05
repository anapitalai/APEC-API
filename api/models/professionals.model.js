const mongoose = require('mongoose');

const professionalSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{type:String,required:true},
    description:{type:String,required:true},
    images:{type:Array,required:false},
    createdAt:Date,
    updatedAt:Date

});

professionalSchema.pre('save', function(next) {
    
    var currentDate = new Date();
    
    this.createdAt = currentDate;
    
    if (!this.updatedAt)
    this.updatedAt = currentDate;

    next();
    });
    

module.exports = mongoose.model('Professional',professionalSchema);