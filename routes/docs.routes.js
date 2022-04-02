const {sendInfo, checkList, checkOrder} = require("../controllers/docs"),
    {Router} = require('express'),
    router = Router()


router.route('/sendInfo').post(sendInfo)
router.route('/checkOrder').post(checkOrder)
router.route('/checkList').post(checkList)

module.exports = router
