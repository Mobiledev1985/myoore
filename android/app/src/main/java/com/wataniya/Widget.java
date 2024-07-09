package com.wataniya;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Typeface;
import android.util.Log;
import android.widget.RemoteViews;
import android.content.SharedPreferences;
import android.widget.TextView;

import androidx.core.content.res.ResourcesCompat;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Implementation of App Widget functionality.
 */
public class Widget extends AppWidgetProvider {

    private static final String MYWIDGET   = "MYWIDGET";
    private static final String LOGIN_CLICKED   = "login";
    private static final String SHOP_CLICKED    = "shop";
    private static final String HELP_CLICKED    = "needhelp";
    private static final String PAY_CLICKED    = "pay";

    private static JSONObject appData = null;
    private static JSONObject loginObj = null;

    public static JSONObject appData_ = null;
    public static JSONObject loginObj_ = null;

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {

        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"text\":'no data'}");
             appData = new JSONObject(appString);
            // Construct the RemoteViews object
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget);

//            views.setTextViewText(R.id.appwidget_currentUsg, appData.getString("currentUsg"));
//            views.setTextViewText(R.id.appwidget_msisdn, appData.getString("msisdn"));
//            views.setTextViewText(R.id.appwidget_msisdn1, appData.getString("msisdn1"));
//            views.setTextViewText(R.id.appwidget_bundle, appData.getString("bundle"));
//            views.setViewVisibility(R.id.appwidget_msisdn, appData.getBoolean("isVisible") == true ? View.VISIBLE : View.GONE );
//            views.setViewVisibility(R.id.widget_relatiview, appData.getBoolean("isVisible") == true ? View.VISIBLE : View.GONE );
//            views.setTextViewText(R.id.welcometext, appData.getString("welcomeText"));


            loginObj = appData.getJSONArray("loginMetaData").getJSONObject(0);
            Log.d(MYWIDGET, loginObj.getString("loginBtnText"));
            views.setTextViewText(R.id.hello_text, loginObj.getString("helloText"));
            views.setTextViewText(R.id.welcome_text, loginObj.getString("welcomeText"));
            views.setTextViewText(R.id.login_button, loginObj.getString("loginBtnText"));
            views.setTextViewText(R.id.shop_button, loginObj.getString("shopBtnText")+"\n\n");
            views.setTextViewText(R.id.help_button, loginObj.getString("helpText")+"\n\n");
            views.setTextViewText(R.id.pay_button, loginObj.getString("payText")+"\n\n");

            views.setInt(R.id.widget_container, "setLayoutDirection", appData.getInt("layoutDirection") );

//            TextView textView = findViewById(R.id.welcome_text);

//            Typeface typeface = ResourcesCompat.getFont(
//                    context,
//                    R.font.notokufiarabicregular);
////            textView.setTypeface(typeface);
//
//            views.setString(R.id.welcome_text, "setTypeface", String.valueOf(typeface));



//            Typeface typeface = ResourcesCompat.getFont(context, R.font.myfont);

//            views.setString(R.id.welcome_text, "setFontFamily","@font/notokufiarabicregular");
//            views.setTypeface(typeface);


            // Login
            Intent loginIntent = new Intent(context, Widget.class);
            loginIntent.setAction(LOGIN_CLICKED);
            PendingIntent loginPendingIntent = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                 loginPendingIntent = PendingIntent.getBroadcast
                        (context, 0, loginIntent, PendingIntent.FLAG_MUTABLE);
            }
            else
            {
                 loginPendingIntent = PendingIntent.getBroadcast(context, 0, loginIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT);
            }
            views.setOnClickPendingIntent(R.id.login_button, loginPendingIntent);

            //Signup
            Intent signupIntent = new Intent(context, Widget.class);
            signupIntent.setAction(SHOP_CLICKED);
            PendingIntent signupPendingIntent = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                signupPendingIntent = PendingIntent.getBroadcast
                        (context, 0, signupIntent, PendingIntent.FLAG_MUTABLE);
            }
            else
            {
                signupPendingIntent = PendingIntent.getBroadcast(context, 0, signupIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT);
            }
            views.setOnClickPendingIntent(R.id.shop_button, signupPendingIntent);

            //eShop Item
            Intent eshopIntent = new Intent(context, Widget.class);
            eshopIntent.setAction(HELP_CLICKED);
            PendingIntent eshopPendingIntent = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                eshopPendingIntent = PendingIntent.getBroadcast
                        (context, 0, eshopIntent, PendingIntent.FLAG_MUTABLE);
            }
            else
            {
                eshopPendingIntent = PendingIntent.getBroadcast(context, 0, eshopIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT);
            }
            views.setOnClickPendingIntent(R.id.help_button, eshopPendingIntent);

            //Recharge Item
            Intent rechargeIntent = new Intent(context, Widget.class);
            rechargeIntent.setAction(PAY_CLICKED);
            PendingIntent rechargePendingIntent = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                rechargePendingIntent = PendingIntent.getBroadcast
                        (context, 0, rechargeIntent, PendingIntent.FLAG_MUTABLE);
            }
            else
            {
                 rechargePendingIntent = PendingIntent.getBroadcast(context, 0, rechargeIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT);
            }
            views.setOnClickPendingIntent(R.id.pay_button, rechargePendingIntent);

            //loop

//            for (int i = 0; i < 3; i++) {


//            Log.d("length", String.valueOf(appData.getJSONArray("logindata").length()));
//            for ( int i = 0; i< appData.getJSONArray("logindata").length(); i++) {
//
//                JSONObject objectInArray = appData.getJSONArray("logindata").getJSONObject(i);
//
//                // "...and get thier component and thier value."
//                String elementNames = objectInArray.getString("name");
//
//                RemoteViews textView = new RemoteViews(context.getPackageName(), R.layout.list_entry);
//
//
//                textView.setTextViewText(R.id.stock_text, elementNames);
////                textView.setImageViewBitmap(R.id.listicon, getBitmapFromURL("https://webpreprod.ooredoo.com.kw/assets/portal/images/icons/eshop_icn.png"));
//
//                views.addView(R.id.login_container, textView);
//
//            }
            //loopend

            // Instruct the widget manager to update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views);

        }catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public static Bitmap getBitmapFromURL(String src) {
        try {
            Log.e("src",src);
            URL url = new URL(src);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            Bitmap myBitmap = BitmapFactory.decodeStream(input);
            Log.e("Bitmap","returned");
            return myBitmap;
        } catch (IOException e) {
            e.printStackTrace();
            Log.e("Exception",e.getMessage());
            return null;
        }
    }

//    protected static PendingIntent getPendingSelfIntent(Context context, String action) {
//        Log.d(MYWIDGET, "log1");
//        Intent intent = new Intent(context, Widget.class);
//        intent.setAction(SYNC_CLICKED);
////        return PendingIntent.getBroadcast(context, 0, intent, 0);
//        return PendingIntent.getBroadcast(context, 0, intent, 0);
//    }

    @Override
    public void onReceive(Context context, Intent intent) {

            try {
                super.onReceive(context, intent);

                SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
                String appString = sharedPref.getString("appData", "{\"text\":'no data'}");
                appData_ = new JSONObject(appString);
                loginObj_ = appData_.getJSONArray("loginMetaData").getJSONObject(0);

                // TODO Auto-generated method stub

                if (LOGIN_CLICKED.equals(intent.getAction())) {
                    new SharedStorage().sendJSEvent(context, loginObj_.getString("w_login_redirect"));
                } else if (SHOP_CLICKED.equals(intent.getAction())) {
                    new SharedStorage().sendJSEvent(context, loginObj_.getString("w_shop_redirect"));
                } else if (HELP_CLICKED.equals(intent.getAction())) {
                    new SharedStorage().sendJSEvent(context, loginObj_.getString("w_help_redirect"));
                } else if (PAY_CLICKED.equals(intent.getAction())) {
                    new SharedStorage().sendJSEvent(context, loginObj_.getString("w_pay_redirect"));
                }
            }catch (JSONException e) {
            }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        Log.d(MYWIDGET, "log4");
        for (int appWidgetId : appWidgetIds) {

            updateAppWidget(context, appWidgetManager, appWidgetId);
        }

//        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget);
//
//        Intent intent = new Intent(WIDGET_BUTTON);
//        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
//        views.setOnClickPendingIntent(R.id.imageButton, pendingIntent );

    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }








}