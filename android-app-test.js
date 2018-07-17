import 'babel-polyfill'
import 'colors'
import wd from 'wd'
import * as configs from './config'

const username = configs.USERNAME
const apiKey = configs.API_KEY

const kobitonServerConfig = {
  protocol: 'https',
  host: 'api.kobiton.com',
  auth: `${username}:${apiKey}`
}

var desiredCaps = {
  sessionName:        'Automation test session',
  sessionDescription: '', 
  deviceOrientation:  'portrait',  
  captureScreenshots: true,  
  browserName:        'chrome', 
  deviceGroup:        'KOBITON', 
  deviceName:         `${configs.DEVICE_NAME}`,
  platformVersion:    '5.0.2',
  platformName:       `${configs.PLATFORM_NAME}`,
  app:                'kobiton-store:9701', 
  appPackage:         'com.facebook.f8',
  appActivity:        'com.facebook.f8.MainActivity',
  waitAppPackage:     'com.facebook.f8'
}

let driver

describe('Android App sample', () => {

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
        .source()
        .sleep(2000)
    }
    catch (err) {
      if (err.data) {
        console.error(`init driver: ${err.data}`)
        console.log(" ")
        console.log("RESULT: Failed")
        console.log("MORE INFO")
        console.log("If the error was that 'the environment you requested was unavailable' make sure all current sessions on Kobiton are completed, wait a few moments for the device to become available, or try running the test on a different device.")
        console.log("Else, contact Kobiton support for more help with troubleshooting.")
        console.log(" ")
        console.log(" ")
      }
      throw err
    }
  })

  it('should do things in the app', async () => {
    await driver
      .elementByXPath("//android.widget.TextView[@text='SKIP FOR NOW']")
      .click()
      .sleep(1000)
      .elementByXPath("//android.widget.TextView[@text='DAY 2']")
      .click()
      .sleep(1000)
      .elementByXPath("//android.widget.TextView[@text='REGISTRATION - 2 HOURS']")
      .click()
      // .sleep(3000)
      // .back()
      // .sleep(1000)
    // .elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[4]/android.widget.ImageView")
    // .click()
    // .sleep(2000)
    // .scroll(["/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.support.v4.view.ViewPager/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[6]/android.view.ViewGroup/android.widget.TextView"][10])
  })

  after(async () => {
    if (driver != null) {
      try {
        const sessionCapabilities = await driver.sessionCapabilities()
        var sessionId = sessionCapabilities.kobitonSessionId
        console.log(" ")
        console.log(" ")
        console.log("SESSION INFORMATION")
        // console.log(sessionCapabilities)
        console.log("sessionName: " + sessionCapabilities.sessionName)
        console.log("sessionDescription: " + sessionCapabilities.sessionDescription)
        console.log("deviceOrientation: " + sessionCapabilities.deviceOrientation)
        console.log("deviceName: " + sessionCapabilities.desired.deviceName)
        console.log("platformName: " + sessionCapabilities.platformName)
        console.log("app: " + sessionCapabilities.app)
        // console.log("kobitonSessionId: " + sessionId)
        console.log(" ")

        // console.log("TEST OUTPUT")
        // var basicAuth = "Basic " + new Buffer(username + ":" + apiKey).toString("base64");
        // var response = await fetch(`https://api-test.kobiton.com/v1/sessions/${sessionId}`, {
        //   headers: { 'Authorization': basicAuth }
        // })
        // const body = await response.json()

        // // console.log('body: ', body)
        // // console.log(" ")
        // console.log(" ")

        // console.log("App Version:")
        // var appVersionId = body.executionData.desired.appVersionId
        // var appVersionResponse = await fetch(`https://api-test.kobiton.com/v1/app/versions/${appVersionId}`, {
        //   headers: { 'Authorization': basicAuth }
        // })
        // var appVersionBody = await appVersionResponse.json()
        // console.log(appVersionBody)

        // console.log(" ")
        // console.log("Commands:")
        // var commandsResponse = await fetch(`https://api-test.kobiton.com/v1/sessions/${sessionId}/commands?page=2`, {
        //   headers: { 'Authorization': basicAuth }
        // })
        // console.log(commandsResponse)
        // const commandsBody = await commandsResponse.json()
        // console.log(commandsBody)

        // console.log(" ")
        // console.log("RESULT: Succeed")

        await driver.quit()
      }
      catch (err) {
        console.error(`quit driver: ${err}`)
      }
    }
  })
})
