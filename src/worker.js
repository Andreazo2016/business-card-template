const queryString = require('querystring')
const { join } = require('path')
const { v1 } = require('uuid')
const puppeteer = require('puppeteer')


const BASE_URL = 'https://erickwendel.github.io/business-card-template/index.html'


async function render({ finalURI, name }) {
  const output = join(__dirname, `./../output/${name}-${v1()}.pdf`)
  const browser = await puppeteer.launch({
    // headless: false
  })
  const page = await browser.newPage()
  await page.goto(finalURI, { waitUntil: 'networkidle2' })

  await page.pdf({
    path: output,
    format: 'A4',
    landscape: true,
    printBackground: true
  })

  await browser.close()
}

function createQueryStringFromObject(data) {
  const separator = null
  const keyDelimiter = null
  const options = {
    encodeURIComponent: queryString.unescape
  }
  const qs = queryString.stringify(
    data,
    separator,
    keyDelimiter,
    options
  )
  return qs
}
async function main(message) {
  const pid = process.pid
  console.log(`${pid} git a message`, message.name)
  const qs = createQueryStringFromObject(message)
  const finalURI = `${BASE_URL}?${qs}`
  try {
    await render({ finalURI, name: 'test' })
    process.send(`${pid} has finished!`)
  } catch (error) {
    process.send(`${pid} has broken! ${error.stack}`)
  }
}

process.once('message', main)