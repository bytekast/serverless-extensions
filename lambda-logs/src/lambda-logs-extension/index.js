#!/usr/bin/env node
const { register, next } = require('./extensions-api')
const { startLogServer, registerLogServer } = require('./logs-api')
const { send } = require('./logsCollector')

const EventType = {
  INVOKE: 'INVOKE',
  SHUTDOWN: 'SHUTDOWN'
}

const handleShutdown = event => {
  //console.log('shutdown event received', JSON.stringify(event))
  //send(event)
  process.exit(0)
}

const handleInvoke = event => {
  //console.log('invoke event received', JSON.stringify(event))
  //send(event)
}

(async function main() {
  process.on('SIGINT', () => handleShutdown('SIGINT'))
  process.on('SIGTERM', () => handleShutdown('SIGTERM'))

  const extensionId = await register()
  console.log(`Lambda Logs Extension registered. Extension Id: ${extensionId}`)

  try {
    const logsUrl = startLogServer()
    console.log(`Log Server started: ${logsUrl}`)
    await registerLogServer(extensionId)
    console.log(`Log Server registered: ${logsUrl}`)
  } catch (e) {
    console.err(e)
  }

  // execute extensions logic
  while (true) {
    const event = await next(extensionId)
    switch (event.eventType) {
      case EventType.SHUTDOWN:
        handleShutdown(event)
        break
      case EventType.INVOKE:
        handleInvoke(event)
        break
      default:
        throw new Error('unknown event: ' + event.eventType)
    }
  }
})()
