#!/usr/bin/env node
const { register, next } = require('./extensions-api')
const { startLogServer, registerLogServer } = require('./logs-api')

const EventType = {
  INVOKE: 'INVOKE',
  SHUTDOWN: 'SHUTDOWN'
}

const handleShutdown = event => {
  console.log('shutdown', { event })
  process.exit(0)
}

const handleInvoke = event => {
  console.log('invoke')
}

(async function main() {
  process.on('SIGINT', () => handleShutdown('SIGINT'))
  process.on('SIGTERM', () => handleShutdown('SIGTERM'))

  console.log('hello from extension')

  console.log('register')
  const extensionId = await register()
  console.log('extensionId', extensionId)

  try {
    const logsUrl = startLogServer()
    console.log(`logsUrl`, logsUrl)
    await registerLogServer()
    console.log(`logServer registered`)
  } catch (e) {
    console.err(e)
  }

  // execute extensions logic
  while (true) {
    console.log('next')
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
