package com.wataniya.sms;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;

import androidx.annotation.NonNull;

import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;


public class SMSReceiver {

    private Context activity;

    private SMSCallback callback;

    private int mOTPSize;

    public SMSReceiver(Context activity, SMSCallback smsCallback) {

        this.activity = activity;

        this.callback = smsCallback;

    }

    public void registerBroadcastForOTP(int aOTPSize) {
        try {

            mOTPSize = aOTPSize;

            clearSMSBroadcast();

            IntentFilter intentFilter = new IntentFilter("com.google.android.gms.auth.api.phone.SMS_RETRIEVED");

            activity.registerReceiver(smsReceiver, intentFilter);

            startReceiver();

        } catch (Exception e) {

           e.printStackTrace();

        }

    }

    public void clearSMSBroadcast() {
        try {
            activity.unregisterReceiver(smsReceiver);
        } catch (Exception ignored) {

        }
    }

    private BroadcastReceiver smsReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            try {

                if (intent == null)
                    return;

                if (SmsRetriever.SMS_RETRIEVED_ACTION.equals(intent.getAction())) {

                    Bundle extras = intent.getExtras();

                    if (extras != null) {

                        Status status = (Status) extras.get(SmsRetriever.EXTRA_STATUS);

                        if (status != null) {

                            switch (status.getStatusCode()) {

                                case CommonStatusCodes.SUCCESS:

                                    try {

                                        String strMessage = (String) extras.get(SmsRetriever.EXTRA_SMS_MESSAGE);

                                        String otp = "";

                                        if (strMessage != null && strMessage.length() > 0) {

                                            strMessage = strMessage.substring(0, strMessage.lastIndexOf(" "));

                                            for (int i = 0; i < strMessage.length(); i++) {

                                                if (Character.isDigit(strMessage.charAt(i))) {

                                                    otp = otp + strMessage.charAt(i);

                                                    if (otp.length() == mOTPSize) {

                                                        break;

                                                    }

                                                } else {

                                                    if (otp.length() == mOTPSize) {

                                                        break;

                                                    } else {

                                                        otp = "";

                                                    }

                                                }

                                            }

                                            if (otp.trim().length() > 0) {

                                                callback.OnMessageReceived(otp);

                                            }

                                        }

                                    } catch (Exception e) {

                                       e.printStackTrace();

                                    }

                                    break;

                                case CommonStatusCodes.TIMEOUT:

                                    break;

                            }

                        }

                    }

                }
            } catch (Exception e) {

                e.printStackTrace();

            }

        }
    };

    private void startReceiver() {

        SmsRetrieverClient client = SmsRetriever.getClient(activity);

        // Starts SmsRetriever, waits for ONE matching SMS message until timeout
        // (5 minutes).
        Task<Void> task = client.startSmsRetriever();

        // Listen for success/failure of the start Task.
        task.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {

            }
        });

        task.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {

            }
        });

    }

}
