const {Router} = require('express'),
    {getBarcodes} = require('../controllers/barcode'),
    router = Router()


router.route('/:id').get(getBarcodes)

module.exports = router
