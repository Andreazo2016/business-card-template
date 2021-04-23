const data = require('./../resources/data.json')
const cp = require('child_process')
const modulePath = `${__dirname}/worker.js`

  ;
(async function main() {
  for (const item of data) {
    const worker = cp.fork(modulePath, [])
    worker.on('message', msg => console.log('message caught on parent', msg))
    worker.on('error', msg => console.log('error caught on parent', msg))
    worker.send(item)
  }
})()