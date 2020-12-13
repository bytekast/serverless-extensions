const fetch = require('node-fetch')
const express = require('express')
const { send } = require('./logsCollector')

const baseUrl = `http://${process.env.AWS_LAMBDA_RUNTIME_API}/2020-08-15/logs`
const host = '0.0.0.0'
const port = 4243
const url = `http://${host}:${port}`

const startLogServer = () => {
  const app = express()
  app.use(express.json())

  app.post('/', (req, res) => {
    //console.log(JSON.stringify(req.body))
    //send(req.body)
    res.status(201).send({ message: 'ok' })
  })

  app.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`)
  })
  return url
}


const registerLogServer = async (extensionId) => {
  const res = await fetch(baseUrl, {
    method: 'put',
    body: JSON.stringify({
      'types': [
        'platform',
        'function'
      ],
      'buffering': {
        'maxItems': 1000,
        'maxBytes': 262144,
        'timeoutMs': 100
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
