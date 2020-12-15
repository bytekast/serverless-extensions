#!/usr/bin/env node
const file = process.argv.pop()
console.log(`intercepting runtime boostrap: ${file}`)

try {
  const handlerPath = `${process.env.LAMBDA_TASK_ROOT}/${process.env._HANDLER}`
  console.log(`instrumenting ${handlerPath}`)
  const handlerArray = handlerPath.split('.')
  const functionName = handlerArray.pop()
  const handlerFile = handlerArray.join('')
  const handler = require(handlerFile)

  const originalFunction = handler[functionName]
  const wrappedHandler = async (...args) => {
    try {
      console.log('wrapped input', ...args)
      const result = await originalFunction(...args)
      console.log('wrapped result', result)
      return result
    } catch (e) {
      console.log('wrapper error', e)
      throw e
    }
  }
  handler[functionName] = wrappedHandler
} catch (error) {
  console.log('unable to instrument handler', error)
}
module.exports = require(file)
