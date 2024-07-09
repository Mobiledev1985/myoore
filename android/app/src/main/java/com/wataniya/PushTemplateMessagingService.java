package com.wataniya;

import static io.invertase.firebase.app.ReactNativeFirebaseApp.getApplicationContext;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class PushTemplateMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
//        CTFcmMessageHandler()
//                .createNotification(getApplicationContext(), remoteMessage);
    }
}
