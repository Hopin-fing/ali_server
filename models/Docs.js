const {mongoose} = require('mongoose'),
    docsSchema = new mongoose.Schema({
        transfer_list: {
            type: String,
            unique: true
        },
        orders: [String]
    })

module.exports = mongoose.model('Docs', docsSchema)