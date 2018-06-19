import 'babel-polyfill'
import 'colors'
import wd from 'wd'
import {assert} from 'chai'
import * as configs from './config';

const username = configs.USERNAME
const apiKey = configs.API_KEY

const kobitonServerConfig = {
  protocol: 'https',
  host: 'api-test.kobiton.com',
  auth: `${username}:${apiKey}`
}

const desiredCaps = {
  sessionName:        'Automation test session',
  sessionDescription: 'This is an example for Android web', 
  deviceOrientation:  'portrait',  
  captureScreenshots: true, 
  browserName:        'chrome', 
  deviceGroup:        'KOBITON', 
  deviceName:         `${configs.DEVICE_NAME}`,
  platformName:       `${configs.PLATFORM_NAME}`
}

let driver

describe('Android Web sample', () => {

  before(async () => {
    driver = wd.promiseChainRemote(kobitonServerConfig)

    driver.on('status', (info) => {
      console.log(info.cyan)
    })
    driver.on('command', (meth, path, data) => {
      console.log(' > ' + meth.yellow, path.grey, data || '')
    })
    driver.on('http', (meth, path, data) => {
      console.log(' > ' + meth.magenta, path, (data || '').grey)
    })

    try {
      await driver.init(desiredCaps)
    }
    catch (err) {
      if (err.data) {
        console.error(`init driver: ${err.data}`)
      }
    throw err
    }
  })

  it('should log in to Wordpress', async () => {
    await driver.get('https://wordpress.com/')
    .waitForElementById('navbar-login-link')
    .click()
    .waitForElementById('usernameOrEmail')
    .sendKeys('username/email')
    
    const elements = await driver
        .elementByXPath("//*[@id='primary']/div/main/div/div[1]/div/form/div[1]/div[2]/button")
    console.log(JSON.stringify(elements))
    await elements.click()

    .waitForElementById("password")
    .sendKeys('password')
    
    const login = await driver
        .elementByXPath('//*[@id="primary"]/div/main/div/div[1]/div/form/div[1]/div[2]/button')
    console.log(JSON.stringify(login))
    await login.click()

    const mysite = await driver
        .elementByXPath('//*[@id="header"]/a[1]')
    console.log(JSON.stringify(mysite))
    await mysite.click()

    const posts = await driver
        .elementByXPath('//*[@id="secondary"]/div/ul/div/div[2]/li[2]/ul/li[2]/a[1]/span')
    console.log(JSON.stringify(posts))
    await posts.click()

    const starbucks = await driver
        .elementByXPath('//*[@id="primary"]/main/div/div[2]/div[1]/div/div[1]/h1/a')
    console.log(JSON.stringify(starbucks))
    await starbucks.click()

    .sleep(3000)
  })

  after(async () => {
    if (driver != null) {
    try {
      await driver.quit()
    }
    catch (err) {
      console.error(`quit driver: ${err}`)
    }
  }
  })
})
