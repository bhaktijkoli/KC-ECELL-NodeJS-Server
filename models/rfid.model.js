const mongoose = require('mongoose')

let RFIDSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rfid: {
        type: String,
        required: true
    },
    date_activated: {
        type: String,
        default: Date.now(),
        required: true
    }
},
{timestamps: true})

RFIDSchema.methods.toWeb = function(){
    let json = this.toJSON()
    json.id = this._id
    return json
}

module.exports = mongoose.model('RFID_TAG', RFIDSchema)