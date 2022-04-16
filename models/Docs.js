const {mongoose} = require('mongoose'),
    docsSchema = new mongoose.Schema({
        transfer_list: {
            type: String,
            unique: true
        },
        numOrder: String
    })

module.exports = mongoose.model('Docs', docsSchema)