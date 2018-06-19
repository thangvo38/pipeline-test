import 'babel-polyfill'
import 'colors'
import fs from 'fs'
import request from 'request'

const username = configs.USERNAME
const apiKey = configs.API_KEY

var basicAuth = "Basic " + new Buffer(username + ":" + apiKey).toString("base64");

main()

function main() {
  generateUrl(function (url) {
  // UploadToS3(url)
  // console.log(basicAuth)
  })
}

function generateUrl(callback) {
  const inputBody = {
    "filename": "KMSDirectory_0_2.5.apk"
  };
  const headers = {
    "Authorization": `${basicAuth}`,
    'Content-Type':'application/json',
    'Accept':'application/json'
  };
  
  var presignedUrl = ""
  var result = ''

  request({
    url: 'https://api.kobiton.com/v1/apps/uploadUrl',
    json: true,
    method: 'POST',
    body: inputBody,
    headers: headers
  }, function (err, response, body) {
    if (err) return console.error('Error:', err);
    console.log(body.url)
    callback(body.url)
  })
}

function UploadToS3(url) {
  console.log('Flow can come here')
  var stats = fs.statSync('/Users/lilydo/Downloads/KMSDirectory_0_2.5.apk');
  const option = {
    method: 'PUT',
    url: url,
    headers: {
      'Content-Length': stats['size'],
      'Content-Type': 'application/octet-stream',
      "x-amz-tagging": "unsaved=true"
    }
  }

  console.log('check:', option)
  fs.createReadStream('/Users/lilydo/Downloads/KMSDirectory_0_2.5.apk').pipe(request(option
    , function (err, res) {
    if (err) {
      console.log('error:',err)
    }
    console.log('result: ', res.statusCode)
  }));

}

