package com.wataniya;

import static io.invertase.firebase.app.ReactNativeFirebaseApp.getApplicationContext;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import androidx.annotation.Nullable;

public class SharedStorage extends ReactContextBaseJavaModule {

    private static ReactApplicationContext context;

    public SharedStorage(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    public SharedStorage() {

    }

    @Override
    public String getName() {
        return "SharedStorage";
    }

    @ReactMethod
    public void set(String message,
                    Callback successCallback, Callback errorCallback) {
        SharedPreferences.Editor editor = context.getSharedPreferences("DATA", Context.MODE_PRIVATE).edit();
        editor.putString("appData", message);
        editor.commit();
        Context context = getApplicationContext();

        //CHANGE TO THE NAME OF YOUR WIDGET
        Intent intent = new Intent(context, Widget.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);

        //CHANGE TO THE NAME OF YOUR WIDGET
        int[] ids = AppWidgetManager.getInstance(context).getAppWidgetIds(new ComponentName(context, Widget.class));
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);

        successCallback.invoke("Sushant");

    }

    @ReactMethod
    public void setCallback(
                    Callback successCallback) {
        successCallback.invoke("Sushant....");

    }

    public void sendJSEvent(Context contexts, String str) {
        Log.d("myTag", "This is my messageclick button");

        Intent launchIntent = contexts.getPackageManager().getLaunchIntentForPackage(contexts.getPackageName());
        Log.d("myTag", String.valueOf(launchIntent));
        if (launchIntent != null) {
            contexts.startActivity(launchIntent);//null pointer check in case package name was not found

            Log.i("myTag", String.valueOf(context));

            if(String.valueOf(context) != "null") {
                WritableMap params = Arguments.createMap();
                params.putString("pageName", str);
                sendEvent(context, "EventReminder", params);
            }else {
                new android.os.Handler().postDelayed(
                        new Runnable() {
                            public void run() {
                                Log.i("myTag","A Kiss after 5 seconds");
                                Log.i("myTag", String.valueOf(context));
                                WritableMap params = Arguments.createMap();
                                params.putString("pageName", str);
                                sendEvent(context, "EventReminder", params);
                            }
                        }, 15000);
            }

//        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("appwidget", params);
        }
    }


    private void sendEvent(ReactContext reactContext,
                          String eventName,
                          @Nullable WritableMap params) {

        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}