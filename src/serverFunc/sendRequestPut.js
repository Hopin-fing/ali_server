const axios = require('axios');
const axiosRetry = require('axios-retry');


const myConfig ={}

const sendRequestPut = async (url, body) => {
    // axiosRetry(axios, { retries: 1 });


    myConfig["headers"] = {
        "Content-Type":"application/json",
        "Retry-After": 2000
    }
    try {
        return await axios.put(url,  JSON.stringify(body), myConfig)

    } catch (e) {
        console.log("Error: " , e.message)
    }
}

exports.sendRequestPut = sendRequestPut