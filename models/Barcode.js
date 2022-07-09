const {mongoose} = require('mongoose'),
docsSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true
    },
    storeBrc:  {
        type: [Object]
    }
})
module.exports = mongoose.model('Barcode', docsSchema)
