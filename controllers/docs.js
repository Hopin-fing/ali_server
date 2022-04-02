const Docs = require('../models/Docs'),
    asyncHandler = require("../middleware/asinc")

// @desc  Check existing  num  order
// @route POST /api/v1/docs/checkOrder
exports.checkOrder = asyncHandler(async (req, res, next) => {
    let bodyReq = []

    for (let item of req.body["data"]) {

        const orders = await Docs.find({orders: item}).exec()
        if (orders.length === 0) bodyReq.push(item)
    }

    res.status(200).json({success: true, data: bodyReq})
})


// @desc  Check existing num transfer list
// @route POST /api/v1/docs/checkList
exports.checkList = asyncHandler(async (req, res, next) => {
    let bodyReq = []
    for (let item of req.body["data"]) {

        const transferList = await Docs.findOne({transfer_list: item}).exec()

        if (!transferList) bodyReq.push(item)
    }
    res.status(200).json({success: true, data: bodyReq})
})


// @desc  Add new docs
// @route GET /api/v1/docs/sendInfo
exports.sendInfo = asyncHandler(async (req, res, next) => {
    const docs = await Docs.create(req.body)

    res.status(201).json({
        success: true,
        data: docs
    })

})