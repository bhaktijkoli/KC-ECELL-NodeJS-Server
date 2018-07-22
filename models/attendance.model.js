const mongoose = require('mongoose')

let AttendanceSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
},
{timestamps: true})

AttendanceSchema.methods.toWeb = function(){
    let json = this.toJSON()
    json.id = this._id
    return json
}

module.exports = mongoose.model('Attendance', AttendanceSchema)