'use strict'

const hello = async event => {
  console.log('HELLO THERE!!!!')
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event
      },
      null,
      2
    )
  }
}

const logs = async event => {
  console.log(`Received ${event.body}`)
  return {
    statusCode: 201,
    body: JSON.stringify(
      {
        message: 'Ok'
      }
    )
  }
}

module.exports = {
  hello,
  logs
}
