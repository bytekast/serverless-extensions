const axios = require('axios')
const https = require("https")
const httpsAgent = new https.Agent({
  maxVersion: "TLSv1.2",
  minVersion: "TLSv1.2"
})

const logsCollectorUrl = 'https://1luu9174xh.execute-api.us-east-1.amazonaws.com/dev/logs'


const send = (body) => {
  axios.post(logsCollectorUrl, body,  { httpsAgent })
    .then(response => console.log(`Log send status: ${response.status}`))
    .catch(error => console.log(JSON.stringify(body), error))
}

module.exports = {
  send
}
