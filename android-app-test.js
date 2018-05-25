import 'babel-polyfill'
import 'colors'
import wd from 'wd'
import {assert} from 'chai'
import * as configs from './config';

const username = configs.USERNAME
const apiKey = configs.API_KEY

const kobitonServerConfig = {
  protocol: 'https',
  host: 'api.kobiton.com',
  auth: `${username}:${apiKey}`
}

const desiredCaps = {
  sessionName:        'Automation test session',
  sessionDescription: 'This is an example for Android app',
  deviceOrientation:  'portrait',
  captureScreenshots: true,
  deviceName:         `${configs.DEVICE_NAME}`,
  platformName:       `${configs.PLATFORM_NAME}`,
  // deviceGroup:        'ORGANIZATION',
  platformVersion:    '5.1.1',
  app:                'https://github.com/lilyhdo/pipeline-test/raw/master/F8_5.0.0.apk',
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
    .sleep(2000)
    .elementByXPath("//android.widget.TextView[@text='REGISTRATION - 2 HOURS']")
    .click()
    .sleep(3000)
    .back()
    .sleep(1000)
    // .elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[4]/android.widget.ImageView")
    // .click()
    // .sleep(2000)
    // .scroll(["/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.support.v4.view.ViewPager/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[6]/android.view.ViewGroup/android.widget.TextView"][10])
  })

  // await driver.get('com.facebook.f8.MainActivity')

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
