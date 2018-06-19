require 'rest-client'
require 'json'

headers = {
    'Content-Type' => 'application/octet-stream',
    'x-amz-tagging' => 'unsaved=true'
}

presignedUrl = 'presignedUrl'
filepath = 'filePath'

result = RestClient.put presignedUrl, File.read(filepath), headers: headers, :content_type => 'application/octet-stream'

p result
