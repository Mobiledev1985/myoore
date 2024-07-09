package com.wataniya;

import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;

import androidx.annotation.Nullable;

import com.clevertap.android.pushtemplates.PushTemplateNotificationHandler;
import com.clevertap.android.sdk.interfaces.NotificationHandler;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import io.tradle.reactlocalauth.LocalAuthPackage;
import com.rnfs.RNFSPackage;
import com.microsoft.codepush.react.CodePush;
import com.reactnativecommunity.webview.RNCWebViewPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
// CleverTap imports
import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.react.CleverTapPackage;
import com.wataniya.splash.SplashScreenReactPackage;
import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener;
import com.clevertap.android.sdk.CleverTapAPI;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.ReactInstanceManager;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONObject;
import android.os.Handler;
import android.os.Looper;

import org.wonday.orientation.OrientationActivityLifecycle;

public class MainApplication extends Application implements ReactApplication, CTPushNotificationListener {
  private final String TAG = "MainApplication";
  private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      packages.add(new SplashScreenReactPackage());
      packages.add(new MyAppPackage());
      packages.add(new SharedStoragePackager());
      packages.add(new PhoneNumberPackager());
      return packages;
    }

    @Nullable
    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    @Override
    protected Boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onNotificationClickedPayloadReceived(HashMap<String, Object> payload) {
    Log.e("MainApplication", "onNotificationClickedPayloadReceived called");
    final String CLEVERTAP_PUSH_NOTIFICATION_CLICKED = "CleverTapPushNotificationClicked";

    Handler handler = new Handler(Looper.getMainLooper());
    handler.post(new Runnable() {
      public void run() {

        // Construct and load our normal React JS code bundle
        final ReactInstanceManager mReactInstanceManager = ((ReactApplication) getApplicationContext())
            .getReactNativeHost().getReactInstanceManager();
        ReactContext context = mReactInstanceManager.getCurrentReactContext();
        // If it's constructed, send a notification
        if (context != null) {
          sendEvent(CLEVERTAP_PUSH_NOTIFICATION_CLICKED, getWritableMapFromMap(payload), context);
        } else {
          // Otherwise wait for construction, then send the notification
          mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            public void onReactContextInitialized(ReactContext context) {
              sendEvent(CLEVERTAP_PUSH_NOTIFICATION_CLICKED, getWritableMapFromMap(payload), context);
              mReactInstanceManager.removeReactInstanceEventListener(this);
            }
          });
          if (!mReactInstanceManager.hasStartedCreatingInitialContext()) {
            // Construct it in the background
            mReactInstanceManager.createReactContextInBackground();
          }
        }

      }
    });

  }

  private void sendEvent(String eventName, Object params, ReactContext context) {

    try {
      context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, params);
    } catch (Throwable t) {
      Log.e(TAG, t.getLocalizedMessage());
    }
  }

  private WritableMap getWritableMapFromMap(Map<String, ? extends Object> var1) {
    JSONObject extras = var1 != null ? new JSONObject(var1) : new JSONObject();
    WritableMap extrasParams = Arguments.createMap();
    Iterator extrasKeys = extras.keys();
    while (extrasKeys.hasNext()) {
      String key = null;
      String value = null;
      try {
        key = extrasKeys.next().toString();
        value = extras.get(key).toString();
      } catch (Throwable t) {
        Log.e(TAG, t.getLocalizedMessage());
      }

      if (key != null && value != null) {
        extrasParams.putString(key, value);
      }
    }
    return extrasParams;
  }

  @Override
  public void onCreate() {
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for
      // this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    // printHashKey(this);
    CleverTapAPI.changeCredentials(BuildConfig.CT_ID,
        BuildConfig.CT_TOKEN);
    ActivityLifecycleCallback.register(this);
    super.onCreate();
    CleverTapAPI.setNotificationHandler((NotificationHandler) new PushTemplateNotificationHandler());
    registerActivityLifecycleCallbacks(OrientationActivityLifecycle.getInstance());
    CleverTapAPI.getDefaultInstance(this).setCTPushNotificationListener(this);
    // CleverTapAPI.setDebugLevel(CleverTapAPI.LogLevel.DEBUG);
    // CleverTapAPI.setDebugLevel(CleverTapAPI.LogLevel.VERBOSE);
  }

  // public static void printHashKey(Context pContext) {
  //   try {
  //     PackageInfo info = pContext.getPackageManager().getPackageInfo(pContext.getPackageName(),
  //         PackageManager.GET_SIGNATURES);
  //     for (Signature signature : info.signatures) {
  //       MessageDigest md = MessageDigest.getInstance("SHA");
  //       md.update(signature.toByteArray());
  //       String hashKey = new String(Base64.encode(md.digest(), 0));
  //       Log.e("TAG", "printHashKey() Hash Key: " + hashKey);
  //     }
  //   } catch (NoSuchAlgorithmException e) {
  //     Log.e("TAG", "printHashKey()", e);
  //   } catch (Exception e) {
  //     Log.e("TAG", "printHashKey()", e);
  //   }

  // }

}
