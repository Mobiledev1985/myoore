package com.wataniya;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.location.Location;
import android.os.Bundle;

import androidx.annotation.NonNull;

// import com.clevertap.android.geofence.CTGeofenceAPI;
// import com.clevertap.android.geofence.CTGeofenceSettings;
// import com.clevertap.android.geofence.interfaces.CTGeofenceEventsListener;
// import com.clevertap.android.geofence.interfaces.CTLocationUpdatesListener;
import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.Logger;
import com.clevertap.android.sdk.interfaces.NotificationHandler;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.clevertap.react.CleverTapModule;
import com.wataniya.splash.SplashScreen;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import android.Manifest;
import android.app.AlertDialog;
// import android.content.DialogInterface;
// import android.content.SharedPreferences;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

// import org.json.JSONObject;

public class MainActivity extends ReactActivity {

    // int LOCATION_PERMISSION_CODE = 1;
    // int BACKGROUND_LOCATION_PERMISSION_CODE = 2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this); // here
        // int REQUEST_LOCATION_PERMISSION = 1;
        super.onCreate(null);
        CleverTapModule.setInitialUri(getIntent().getData());
        // CleverTapAPI.setDebugLevel(CleverTapAPI.LogLevel.DEBUG);
        // CleverTapAPI.setDebugLevel(CleverTapAPI.LogLevel.VERBOSE);
        CleverTapAPI.getDefaultInstance(getApplicationContext());
        // CTGeofenceAPI.getInstance(getApplicationContext());

        // try {
        // SharedPreferences sh = getSharedPreferences("MyPrefs", MODE_PRIVATE);
        // String valuePref = sh.getString("permissionCalled", "");

        // if (!"true".equals(valuePref)) {
        // checkPermission();
        // SharedPreferences.Editor editor = sh.edit();
        // editor.putString("permissionCalled", "true");
        // editor.apply();
        // }
        // } catch (IllegalStateException e) {
        // Log.d("eeeeeee geofence", "e");
        // }
    }

    // private void checkPermission() {
    // if (ContextCompat.checkSelfPermission(MainActivity.this,
    // Manifest.permission.ACCESS_FINE_LOCATION) ==
    // PackageManager.PERMISSION_GRANTED) {
    // // Fine Location permission is granted
    // // Check if current android version >= 11, if >= 11 check for Background
    // // Location permission
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
    // if (ContextCompat.checkSelfPermission(MainActivity.this,
    // Manifest.permission.ACCESS_BACKGROUND_LOCATION) ==
    // PackageManager.PERMISSION_GRANTED) {
    // // Background Location Permission is granted so do your work here
    // geofence();
    // } else {
    // // Ask for Background Location Permission
    // // askPermissionForBackgroundUsage();
    // }
    // }
    // } else {
    // // Fine Location Permission is not granted so ask for permission
    // askForLocationPermission();
    // }
    // }

    // private void askForLocationPermission() {
    // if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this,
    // Manifest.permission.ACCESS_FINE_LOCATION)) {
    // new AlertDialog.Builder(this)
    // .setTitle("Permission Needed!")
    // .setMessage("Location Permission Needed!")
    // .setPositiveButton("OK", new DialogInterface.OnClickListener() {
    // @Override
    // public void onClick(DialogInterface dialog, int which) {
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
    // ActivityCompat.requestPermissions(MainActivity.this,
    // new String[] { Manifest.permission.ACCESS_FINE_LOCATION },
    // LOCATION_PERMISSION_CODE);
    // } else {
    // ActivityCompat.requestPermissions(MainActivity.this,
    // new String[] { Manifest.permission.ACCESS_FINE_LOCATION,
    // Manifest.permission.ACCESS_BACKGROUND_LOCATION },
    // LOCATION_PERMISSION_CODE);
    // }
    // }
    // })
    // .setNegativeButton("CANCEL", new DialogInterface.OnClickListener() {
    // @Override
    // public void onClick(DialogInterface dialog, int which) {
    // // Permission is denied by the user
    // }
    // })
    // .create().show();
    // } else {
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
    // ActivityCompat.requestPermissions(this,
    // new String[] { Manifest.permission.ACCESS_FINE_LOCATION },
    // LOCATION_PERMISSION_CODE);
    // } else {
    // ActivityCompat.requestPermissions(MainActivity.this,
    // new String[] { Manifest.permission.ACCESS_FINE_LOCATION,
    // Manifest.permission.ACCESS_BACKGROUND_LOCATION },
    // LOCATION_PERMISSION_CODE);
    // }
    // }
    // }

    // private void askPermissionForBackgroundUsage() {
    // if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this,
    // Manifest.permission.ACCESS_BACKGROUND_LOCATION)) {
    // new AlertDialog.Builder(this)
    // .setTitle("Permission Needed!")
    // .setMessage("Background Location Permission Needed!, tap \"Allow all time in
    // the next screen\"")
    // .setPositiveButton("OK", new DialogInterface.OnClickListener() {
    // @Override
    // public void onClick(DialogInterface dialog, int which) {
    // ActivityCompat.requestPermissions(MainActivity.this,
    // new String[] { Manifest.permission.ACCESS_BACKGROUND_LOCATION },
    // BACKGROUND_LOCATION_PERMISSION_CODE);
    // }
    // })
    // .setNegativeButton("CANCEL", new DialogInterface.OnClickListener() {
    // @Override
    // public void onClick(DialogInterface dialog, int which) {
    // // User declined for Background Location Permission.
    // }
    // })
    // .create().show();
    // } else {
    // ActivityCompat.requestPermissions(this,
    // new String[] { Manifest.permission.ACCESS_BACKGROUND_LOCATION },
    // BACKGROUND_LOCATION_PERMISSION_CODE);
    // }
    // }

    // @Override
    // public void onRequestPermissionsResult(int requestCode, @NonNull String[]
    // permissions,
    // @NonNull int[] grantResults) {
    // super.onRequestPermissionsResult(requestCode, permissions, grantResults);

    // if (requestCode == LOCATION_PERMISSION_CODE) {
    // if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
    // // User granted location permission
    // // Now check if android version >= 11, if >= 11 check for Background Location
    // // Permission
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
    // if (ContextCompat.checkSelfPermission(MainActivity.this,
    // Manifest.permission.ACCESS_BACKGROUND_LOCATION) ==
    // PackageManager.PERMISSION_GRANTED) {
    // // Background Location Permission is granted so do your work here
    // geofence();
    // } else {
    // // Ask for Background Location Permission
    // askPermissionForBackgroundUsage();
    // }
    // } else {
    // if (ContextCompat.checkSelfPermission(MainActivity.this,
    // Manifest.permission.ACCESS_BACKGROUND_LOCATION) ==
    // PackageManager.PERMISSION_GRANTED) {
    // geofence();
    // } else {
    // // ActivityCompat
    // // .requestPermissions(this,
    // // new String[] { Manifest.permission.ACCESS_FINE_LOCATION,
    // // Manifest.permission.ACCESS_BACKGROUND_LOCATION },
    // // LOCATION_PERMISSION_CODE);
    // }
    // }
    // } else {
    // // User denied location permission
    // }
    // } else if (requestCode == BACKGROUND_LOCATION_PERMISSION_CODE) {
    // if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
    // // User granted for Background Location Permission.
    // geofence();
    // } else {
    // // User declined for Background Location Permission.
    // }
    // }

    // }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            CleverTapAPI.getDefaultInstance(getApplicationContext()).pushNotificationClickedEvent(intent.getExtras());
        }
    }

    // public void geofence() {
    // CTGeofenceSettings ctGeofenceSettings = new CTGeofenceSettings.Builder()
    // .enableBackgroundLocationUpdates(true)// boolean to enable background
    // location updates
    // .setLogLevel(23)// Log Level
    // .setLocationAccuracy(CTGeofenceSettings.ACCURACY_HIGH)// byte value for
    // Location Accuracy
    // .setLocationFetchMode(CTGeofenceSettings.FETCH_LAST_LOCATION_PERIODIC)// byte
    // value for Fetch Mode
    // .setGeofenceMonitoringCount(50)// int value for number of Geofences CleverTap
    // can monitor
    // .setInterval(1600000)// long value for interval in milliseconds
    // .setFastestInterval(1800000)// long value for fastest interval in
    // milliseconds
    // .setSmallestDisplacement(200F)// float value for smallest Displacement in
    // meters
    // .setGeofenceNotificationResponsiveness(0)// int value for geofence
    // notification responsiveness in
    // // milliseconds
    // .build();

    // CTGeofenceAPI.getInstance(getApplicationContext()).init(ctGeofenceSettings,
    // CleverTapAPI.getDefaultInstance(getApplicationContext()));

    // try {
    // CTGeofenceAPI.getInstance(getApplicationContext()).triggerLocation();
    // } catch (IllegalStateException e) {
    // Log.d("eeeeeee geofence", "eeeeeeeeeeeeeeeeeeeeeeeeeeee");
    // // thrown when this method is called before geofence SDK initialization
    // }

    // CTGeofenceAPI.getInstance(getApplicationContext())
    // .setOnGeofenceApiInitializedListener(new
    // CTGeofenceAPI.OnGeofenceApiInitializedListener() {
    // @Override
    // public void OnGeofenceApiInitialized() {
    // // App is notified on the main thread that CTGeofenceAPI is initialized
    // Log.d("celevertap geofence", "genfeince intialize calling");
    // }
    // });

    // CTGeofenceAPI.getInstance(getApplicationContext())
    // .setCtGeofenceEventsListener(new CTGeofenceEventsListener() {
    // @Override
    // public void onGeofenceEnteredEvent(JSONObject jsonObject) {
    // // Callback on the main thread when the user enters Geofence with info in
    // // jsonObject
    // Log.d("kkkkk", "onGeofenceEnteredEvent calling");
    // Log.d("kkkkk11111 geofence", jsonObject.toString());
    // }

    // @Override
    // public void onGeofenceExitedEvent(JSONObject jsonObject) {
    // // Callback on the main thread when user exits Geofence with info in
    // jsonObject
    // Log.d("doneeee geofence", "onGeofenceExitedEvent called");

    // }
    // });

    // CTGeofenceAPI.getInstance(getApplicationContext())
    // .setCtLocationUpdatesListener(new CTLocationUpdatesListener() {
    // @Override
    // public void onLocationUpdates(Location location) {

    // Log.d("update geofence", " update geofence called");
    // // New location on the main thread as provided by the Android OS
    // }
    // });

    // // CTGeofenceAPI.getInstance(getApplicationContext()).deactivate();

    // }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "selfcarern";
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util
     * class {@link
     * DefaultReactActivityDelegate} which allows you to easily enable Fabric and
     * Concurrent React
     * (aka React 18) with two boolean flags.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
                this,
                getMainComponentName(),
                // If you opted-in for the New Architecture, we enable the Fabric Renderer.
                DefaultNewArchitectureEntryPoint.getFabricEnabled());
    }
}
