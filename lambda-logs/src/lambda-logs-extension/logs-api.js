const http = require('http')
const fetch = require('node-fetch')

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-01-01/extension`
const host = '0.0.0.0'
const port = 4243
const url = `http://sandbox:${port}`

const requestListener = function(req, res) {
  console.log(`logListener`, req)
}

const startLogServer = () => {
  const server = http.createServer(requestListener)
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
  })
  return url
}

const registerLogServer = async () => {
  const res = await fetch(`http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-08-15/logs/subscribe`, {
    method: 'post',
    body: JSON.stringify({
      'types': [
        'platform',
        'function'
      ],
      'buffering': {
        'maxItems': 1000,
        'maxBytes': 10240,
        'timeoutMs': 100
      },
      'destination': {
        'protocol': 'HTTP',
        'URI': 'url'
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    console.error('register failed', await res.text())
  }

  return res.headers.get('lambda-extension-identifier')
}

module.exports = {
  registerLogServer,
  startLogServer
}
