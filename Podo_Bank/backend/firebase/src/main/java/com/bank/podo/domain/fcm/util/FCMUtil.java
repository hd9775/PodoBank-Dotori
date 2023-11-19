package com.bank.podo.domain.fcm.util;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class FCMUtil {

    @Value("${firebase.uri}")
    String uri;

    @Value("${firebase.sender_id}")
    String project_id;

    @Value("${firebase.server_key}")
    String server_key;

    public void requestAlert(String token, String title, String body) {
        URL url = null;
        StringBuilder buffer = null;
        OutputStream outputStream = null;
        BufferedWriter bufferedWriter = null;
        HttpURLConnection urlConnection = null;

        int connTimeout = 5000;
        int readTimeout = 3000;

        try {
            url = new URL(uri);
            urlConnection = (HttpURLConnection)url.openConnection();
            urlConnection.setRequestMethod("POST");
            urlConnection.setConnectTimeout(connTimeout);
            urlConnection.setReadTimeout(readTimeout);
            urlConnection.setRequestProperty("Content-Type", "application/json");
            urlConnection.setRequestProperty("Authorization", "key=" + server_key);
            urlConnection.setDoOutput(true);
            urlConnection.setDoInput(true);

            JSONObject json = new JSONObject();
            JSONObject info = new JSONObject();
            info.put("title", title);
            info.put("body", body);
            json.put("notification", info);
            json.put("to", token);
            json.put("project_id", project_id);

            outputStream = urlConnection.getOutputStream();
            bufferedWriter = new BufferedWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8));
            bufferedWriter.write(json.toString());
            bufferedWriter.flush();

            buffer = new StringBuilder();
            if(urlConnection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                log.info("FCM Notification is sent");
            } else {
                buffer.append("code : ");
                buffer.append(urlConnection.getResponseCode()).append("\n");
                buffer.append("message : ");
                buffer.append(urlConnection.getResponseMessage()).append("\n");
            }
        }
        catch(Exception ex) {
            ex.printStackTrace();
        } finally {
            try {
                if (bufferedWriter != null) { bufferedWriter.close(); }
            }
            catch(Exception ex) {
                ex.printStackTrace();
            }
        }
        System.out.println("결과 : " + buffer.toString());
    }
}
