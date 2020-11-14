const http = require('http')
const fetch = require('node-fetch')

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-08-15/logs`
const host = '0.0.0.0'
const port = 4243
const url = `http://${host}:${port}`

const requestListener = function(req, res) {
  let data = []
  req
    .on("data", d => {
      data.push(d)
    })
    .on("end", () => {
      data = Buffer.concat(data).toString()
      res.statusCode = 201
      res.end()
    })
  console.log(`logListener`, data)
}

const startLogServer = () => {
  const server = http.createServer(requestListener)
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
  })
  return url
}

const registerLogServer = async (extensionId) => {
  console.log(`logs api baseUrl`, baseUrl)
  const res = await fetch(baseUrl, {
    method: 'put',
    body: JSON.stringify({
      'types': [
        'platform',
        'function'
      ],
      'buffering': {
        'maxItems': 10000,
        'maxBytes': 262144,
        'timeoutMs': 1000
      },
      'destination': {
        'protocol': 'HTTP',
        'URI': `http://sandbox:${port}`
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      'Lambda-Extension-Identifier': extensionId
    }
  })

  if (!res.ok) {
    console.error('register failed', res.status, res.statusText, await res.text())
  }

  return res.headers.get('lambda-extension-identifier')
}

module.exports = {
  registerLogServer,
  startLogServer
}
