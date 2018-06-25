import 'babel-polyfill'
import 'colors'
import fs from 'fs'
import request from 'request'

const username = configs.USERNAME
const apiKey = configs.API_KEY 

const filename = "KMSDirectory_2_2.6.apk"
var basicAuth = "Basic " + new Buffer(username + ":" + apiKey).toString("base64");

main()

function main() {
  generateUrl(function (url) {
  UploadToS3(url)
  createAppVer()
  })
}

function generateUrl(callback) {
  const inputBody = {
    "filename": filename,
    "appId": 3148
  };
  const headers = {
    "Authorization": `${basicAuth}`,
    'Content-Type':'application/json',
    'Accept':'application/json'
  };
  
  var presignedUrl = ""
  var result = ''

  request({
    url: 'https://api-test.kobiton.com/v1/apps/uploadUrl',
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
  var stats = fs.statSync(`/Users/lilydo/Downloads/${filename}`);
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
  fs.createReadStream(`/Users/lilydo/Downloads/${filename}`).pipe(request(option
    , function (err, res) {
    if (err) {
      console.log('error:',err)
    }
    console.log('result: ', res.statusCode)
  }));
}

function createAppVer() {
  const request = require('request');
  const inputBody = {
    "filename": filename,
    "appPath": "users/10331/apps/KMSDirectory_2_2.6-75085930-7823-11e8-b694-21deefd115a4.apk"
  };
  const headers = {
    'Authorization': basicAuth,
    'Content-Type':'application/json'
  };

  request({
    url: 'https://api-test.kobiton.com/v1/apps',
    json: true,
    method: 'POST',
    body: inputBody,
    headers: headers
  }, function (err, response, body) {
    if (err) return console.error('Error:', err);

    // console.log('Response:', response);
    console.log('Response body:', body);
  });
}

