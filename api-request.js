import 'babel-polyfill'
import 'colors'
import fs from 'fs'
import request from 'request'
import {USERNAME, API_KEY} from './config'

const ROOT_DIR = '/Users/thangvo/Downloads'
const FILE_NAME = "KMSDirectory_2_2.6.apk"
const APK_DIR = `${ROOT_DIR}/${FILE_NAME}`
const username = USERNAME
const apiKey = API_KEY 

var basicAuth = "Basic " + new Buffer(username + ":" + apiKey).toString("base64");
console.log(`Params: ${username} - ${apiKey}`)
main()

function main() {
  generateUrl(function (url, path) {
  UploadToS3(url, path)
  })
}

function generateUrl(callback) {
  const inputBody = {
    //Uncomment the line below if you want to upload app instead of creating a new one
    //"addId": ???,
    "filename": FILE_NAME
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
    console.log('GENERATE URL DONE')
    callback(body.url, body.appPath) //<---- Have to get the appPath here
  })
}

function UploadToS3(url, appPath) {
  console.log('Flow can come here')
  var stats = fs.statSync(APK_DIR);
  const option = {
    method: 'PUT',
    url: url,
    headers: {
      'Content-Length': stats['size'],
      'Content-Type': 'application/octet-stream',
      "x-amz-tagging": "unsaved=true"
    }
  }

  fs.createReadStream(APK_DIR).pipe(request(option
    , function (err, res) {
    if (err) {
      console.log('error:',err)
    }
    console.log('UPLOAD TO S3 DONE')
    createAppVer(appPath) //<---- Create app versioin on Kobiton after uploading to S3
  }));
}

function createAppVer(appPath) {
  const request = require('request');
  const inputBody = {
    "filename": FILE_NAME,
    "appPath": appPath
  };
  const headers = {
    'Authorization': basicAuth,
    'Content-Type':'application/json'
  };

  request({
    url: 'https://api.kobiton.com/v1/apps',
    json: true,
    method: 'POST',
    body: inputBody,
    headers: headers
  }, function (err, response, body) {
    if (err) return console.error('Error:', err);

    console.log('App has successfully uploaded to Kobiton')
    console.log('Response body:', body);
  });
}

