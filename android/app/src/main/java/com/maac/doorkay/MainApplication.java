package com.maac.doorkay;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.razorpay.rn.RazorpayPackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
import com.airbnb.android.react.maps.MapsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RazorpayPackage(),
            new RNAndroidLocationEnablerPackage(),
            new RNFirebasePackage(),
            new AsyncStoragePackage(),
            new SnackbarPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new MapsPackage(),
            new RNFirebaseMessagingPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
