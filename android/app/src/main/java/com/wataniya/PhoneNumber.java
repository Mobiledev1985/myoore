package com.wataniya;

import static android.Manifest.permission.READ_PHONE_NUMBERS;
import static android.Manifest.permission.READ_PHONE_STATE;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.telephony.SubscriptionInfo;
import android.telephony.SubscriptionManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.PermissionListener;

import java.util.ArrayList;
import java.util.List;

public class PhoneNumber extends ReactContextBaseJavaModule implements PermissionListener {

    private static ReactApplicationContext rncontext;
    List<String> list = new ArrayList<>();

    PhoneNumber(ReactApplicationContext context) {
        super(context);
        rncontext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "PhoneNumber";
    }

    @ReactMethod
    public void getPhoneID(Promise response) {
        try {
            try {
                if (ActivityCompat.checkSelfPermission(rncontext,
                        READ_PHONE_NUMBERS) == PackageManager.PERMISSION_GRANTED
                        && ActivityCompat.checkSelfPermission(rncontext,
                                READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED) {
                    SubscriptionManager subManager;
                    List<SubscriptionInfo> subInfoList = null;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                        subManager = (SubscriptionManager) rncontext
                                .getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE);
                        subInfoList = subManager.getActiveSubscriptionInfoList();
                    }
                    list.clear();
                    for (int i = 0; i < subInfoList.size(); i++) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                            int defaultDataId = 0;
                            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                                defaultDataId = SubscriptionManager.getDefaultDataSubscriptionId();
                            }
                            defaultDataId = defaultDataId - 1;
                            list.add("{\"phoneNumber\" : " + "\"" + subInfoList.get(i).getNumber() + "\"" +
                                    ", \"carrierName\" : " + "\"" + (String) subInfoList.get(i).getCarrierName() + "\""
                                    +
                                    ", \"dataEnabled\" : " + "\"" + ((defaultDataId == i) ? true : false) + "\"" +
                                    ", \"simSlotIndex\" : " + "\"" + subInfoList.get(i).getSimSlotIndex() + "\"}" +
                                    ((i == 0 && subInfoList.size() > 1) ? "&" : ""));
                        }
                    }
                    response.resolve(list.toString());
                    return;
                } else {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        Activity currentActivity = getCurrentActivity();
                        ActivityCompat.requestPermissions(currentActivity,
                                new String[] { READ_PHONE_NUMBERS, READ_PHONE_STATE }, 100);
                        response.resolve(list.toString());
                    }
                }

            } catch (Exception e) {
                Log.e("Exceptioncaught", "Exceptioncatch : " + e);
            }
        } catch (Exception e) {
            response.reject("Error", e);
        }
    }

    @ReactMethod
    public void getPhoneName(Promise response) {
        try {
            try {
                String PhoneName, phoneName;
                String manufacturer = Build.MANUFACTURER;
                String model = Build.MODEL;
                String deviceName = Build.DEVICE;
                if (model.startsWith(manufacturer)) {
                    PhoneName = model;
                } else {
                    PhoneName = manufacturer + " " + model;
                }
                phoneName = "{\"PhoneName\" : " + "\"" + (String) PhoneName + "\"" +
                        ", \"deviceName\" : " + "\"" + (String) deviceName + "\"}";
                response.resolve(phoneName);
                return;
            } catch (Exception e) {
                Log.e("Exceptioncaught", "Exceptioncatch : " + e);
            }
        } catch (Exception e) {
            response.reject("Error", e);
        }
    }

    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        try {
            switch (requestCode) {
                case 100:
                    SubscriptionManager subManager;
                    List<SubscriptionInfo> subInfoList = null;
                    WritableMap map = Arguments.createMap();
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                        subManager = (SubscriptionManager) rncontext
                                .getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE);
                        if (ActivityCompat.checkSelfPermission(rncontext,
                                Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                            return false;
                        }
                        subInfoList = subManager.getActiveSubscriptionInfoList();
                    }
                    list.clear();
                    for (int i = 0; i < subInfoList.size(); i++) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                            int defaultDataId = 0;
                            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                                defaultDataId = SubscriptionManager.getDefaultDataSubscriptionId();
                            }
                            defaultDataId = defaultDataId - 1;
                            list.add("{\"phoneNumber\" : " + "\"" + subInfoList.get(i).getNumber() + "\""
                                    + ", \"carrierName\" : " + "\"" + (String) subInfoList.get(i)
                                            .getCarrierName()
                                    + "\"" + ", \"dataEnabled\" : " + "\"" + ((defaultDataId == i) ? true : false)
                                    + "\"}" + ((i == 0) ? "&" : ""));
                        }
                    }
                    break;
                default:
                    throw new IllegalStateException("Unexpected value: " + requestCode);
            }
            return true;
        } catch (Exception E) {
            Log.e("Exception second", "enter : " + E);
        }
        return false;
    }

}