const axios = require('axios'),
    axiosRetry = require('axios-retry')

axiosRetry(axios, {
    retries: 0,
    shouldResetTimeout: true,
    retryCondition: (_error) => true
});

const myConfig = {},
    sendRequestPost = async (url, body) => {
        myConfig["timeout"] = 10000
        myConfig["headers"] = {
            "Content-Type": "application/json"
        }


        return axios.post(url, body, myConfig)

    }

exports.sendRequestPost = sendRequestPost
