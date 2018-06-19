import requests
import json

def uploadToS3():
    url = "presignedUrl"
    filepath = "filePath"

    headers = {
    'Content-Type': 'application/octet-stream',
    'x-amz-tagging': 'unsaved=true'
    }

    # do either this block of code (doesn't work yet must fix to read til end of file)
    # fin = open(filepath, 'rb')
    # fileContent = fin.read(get the file size and put here)
    # response = requests.put(url,data=fileContent, headers=headers, params=params)
    # fin.close

    # or this one
    with open(filepath) as file:
        fileContent = file.read()
        response = requests.put(url,data=fileContent, headers=headers)

    print(response)

def generateUrl():
    headers = {
    'Authorization': 'base64 string',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    }
    r = requests.post('https://api.kobiton.com/v1/apps/uploadUrl', params={

    }, headers = headers)

    print(r.json())

# generateUrl()
uploadToS3()
