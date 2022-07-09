const Barcode  = require('../models/Barcode'),
    asyncHandler = require("../middleware/asinc"),
    {ErrorResponse} = require('../utils/errorResponse')

// @desc  Get single barcodes arr
// @route GET /api/v1/barcode/:id
exports.getBarcodes = asyncHandler(async (req, res, next) => {


    const arrBrc = await Barcode.findOne({name:req.params.id})

    if(!arrBrc) {
        return next(new ErrorResponse(`No barcodes with cabinet of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: arrBrc.storeBrc
    })

})
