import java.util.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLConnection;

public class api-request {

    public static void main(String[] args) {
        uploadToS3();
        // generateUrl();
    }

    public static void uploadToS3() {
        // creates an instance which will then be used to read from and write to the resource referenced by the URL
        URLConnection urlconnection = null;
        try {
            File appFile = new File("/Users/lilydo/Downloads/KMSDirectory_0_2.5.apk");
            boolean fileExist = appFile.exists();

            URL presignedUrl = new URL("https://kobiton-us-east.s3.amazonaws.com/users/24452/apps/KMSDirectory_0_2.5-6db83320-6f82-11e8-947e-a9a712a50590.apk?AWSAccessKeyId=AKIAJ7BONOZUJZMWR4WQ&Content-Type=application%2Foctet-stream&Expires=1528989861&Signature=%2Fhib%2BlIyiv1k2RWfdla2PfxqwCo%3D&x-amz-acl=private&x-amz-meta-appid=0&x-amz-meta-createdby=24452&x-amz-meta-organizationid=47&x-amz-meta-privateaccess=false&x-amz-tagging=unsaved%3Dtrue");
            // open a connection to the presigned url
            urlconnection = presignedUrl.openConnection();
            // qu'est-ce que c'est ca?
            urlconnection.setDoOutput(true);
            urlconnection.setDoInput(true);

            // connect and interact with the presigned url resource
            if (urlconnection instanceof HttpURLConnection) {
                ((HttpURLConnection) urlconnection).setRequestMethod("PUT");
                ((HttpURLConnection) urlconnection).setRequestProperty("Content-type", "application/octet-stream");
                ((HttpURLConnection) urlconnection).connect();
            }

            // creates a path from the local file to the url ??
            BufferedOutputStream bos = new BufferedOutputStream(urlconnection.getOutputStream());

            // reads the bytes of the file
            FileInputStream bis = new FileInputStream(appFile);

            int i;

            // read byte by byte until end of stream
            while ((i = bis.read()) != -1) {
                bos.write(i);                           // writes everything read in the file to bos
            }
            bis.close();

            System.out.println(((HttpURLConnection) urlconnection).getResponseMessage());

        } catch (Exception ex) {
            System.out.println(ex);
        }

        try {

            InputStream inputStream;
            int responseCode = ((HttpURLConnection) urlconnection).getResponseCode();
            if ((responseCode >= 200) && (responseCode <= 202)) {
                inputStream = ((HttpURLConnection) urlconnection).getInputStream();
                int j;
                while ((j = inputStream.read()) > 0) {
                    System.out.println(j);
                }

            } else {
                inputStream = ((HttpURLConnection) urlconnection).getErrorStream();
            }
            ((HttpURLConnection) urlconnection).disconnect();

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public static void generateUrl() {
        // String encodedString = Base64.getEncoder().encodeToString(userApi.getBytes());
        String basicAuth = "Basic bGlseWRvOjc2Y2M1NDk2LTFhZWQtNGM0Yi04NzQxLTIzNDMxYTE4M2VjZg==";

        // idk what body is but here it is? body data
        String query = "data={" +
                "\"filename\": \"KMSDirectory_0_2.5.apk\", " +
                "\"appId\": \"1\", " +
                "}";

        try {
            URL obj = new URL("https://api.kobiton.com/v1/apps/uploadUrl");
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setDoOutput(true);
            con.setRequestMethod("POST");
            con.setRequestProperty ("Authorization", basicAuth);
            con.addRequestProperty("Content-Type", "application/" + "POST");
            
            if (query != null) {
                con.setRequestProperty("Content-Length", Integer.toString(query.length()));
                con.getOutputStream().write(query.getBytes("UTF8"));
            }
            int responseCode = con.getResponseCode(); 
            BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            System.out.println(response.toString());
        } catch (Exception ex) {
            Logger logger = Logger.getAnonymousLogger();
            logger.log(Level.SEVERE, "an exception was thrown", ex);
        }
    }
}
