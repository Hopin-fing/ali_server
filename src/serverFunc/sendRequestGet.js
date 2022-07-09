const axios = require('axios');
const axiosRetry = require('axios-retry');

const myConfig ={}

const sendRequestGet = async (url) => {
    // axiosRetry(axios, { retries: 200 });

    myConfig["headers"] = {
        "Content-Type":"application/json",
        "Retry-After": 2000
    }

    return await axios.get(url, myConfig)
}

exports.sendRequestGet = sendRequestGet