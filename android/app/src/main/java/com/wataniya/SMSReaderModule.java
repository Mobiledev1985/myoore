package com.wataniya;

import android.content.Context;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.wataniya.sms.SMSCallback;
import com.wataniya.sms.SMSReceiver;

public class SMSReaderModule extends ReactContextBaseJavaModule implements SMSCallback {
    private SMSReceiver smsReceiver;
    private Context mContext;
    private String otp="";
    SMSReaderModule(ReactApplicationContext context) {
        super(context);
        mContext=context;
    }

    @NonNull
    @Override
    public String getName() {
        return "SMSReader";
    }
    @ReactMethod
    public void readSMS() {

        smsReceiver = new SMSReceiver(mContext, this);

        smsReceiver.registerBroadcastForOTP(4);


    }

    @Override
    public void OnMessageReceived(String otpReceived) {
        if (otpReceived.trim().length() > 0) {
            otp=otpReceived;

          sendEvent(getReactApplicationContext(),"onOTPReceived",otpReceived);

        }
    }



    private void sendEvent(ReactContext reactContext,String eventName, String params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


}
