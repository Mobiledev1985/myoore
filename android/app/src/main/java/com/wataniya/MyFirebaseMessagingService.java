package com.wataniya;

import android.app.NotificationManager;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationManagerCompat;

import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.pushnotification.NotificationInfo;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;


public class MyFirebaseMessagingService extends FirebaseMessagingService  {

    private NotificationManagerCompat mNotificationManager;
    NotificationManager notificationManager = null;
    int reamdamNuber = 0;

    @Override
    public void onNewToken(@NonNull String aToken) {
        super.onNewToken(aToken);


    }



    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        try {

            String fromId = remoteMessage.getFrom();

         //   if (fromId != null && fromId.equalsIgnoreCase("855845452411")) {

                if (handleCleverTapPush(remoteMessage)) return;

          //  }

        } catch (Exception e) {



        }

    }


    private boolean handleCleverTapPush(@NonNull RemoteMessage remoteMessage) {

        try {

            if (remoteMessage.getData().size() > 0) {

                Bundle extras = new Bundle();

                for (Map.Entry<String, String> entry : remoteMessage.getData().entrySet()) {

                    extras.putString(entry.getKey(), entry.getValue());

                }

                NotificationInfo info = CleverTapAPI.getNotificationInfo(extras);


                if (info.fromCleverTap) {
                    // CleverTapAPI.setDebugLevel(CleverTapAPI.LogLevel.DEBUG);
                    // CleverTapAPI.setDebugLevel(CleverTapAPI.LogLevel.VERBOSE);
                    CleverTapAPI.getDefaultInstance(this).pushNotificationViewedEvent(extras);

                    CleverTapAPI.createNotification(getApplicationContext(),extras);

                    return true;

                }

            }

        } catch (Exception e) {


        }

        return false;

    }



}