const md5 = require("crypto-js/md5")
const moment = require("moment")
const config = require('config')
const {sendRequestGet} = require("../serverFunc");


const getStock = async () => {

    class ResponseServer {
        constructor(file) {
            this.file = file
        }


       async result() {
            let response,
                result = {}
            const sign = md5(moment().format("YYYY-MM-DD") +  config.get("sign_Stock")).toString()
            response = await sendRequestGet(`https://viplinza.ru/export/${this.file}?sign=${sign}`)
           console.log(`https://viplinza.ru/export/${this.file}?sign=${sign}`)

           result = response.data

           return result
        }

    }

    const stockSpb = new ResponseServer("price.php" )




    console.log("end getStock")
    return await stockSpb.result()



}

exports.getStock = getStock