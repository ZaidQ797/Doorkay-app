import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Platform, PermissionsAndroid, Linking } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { api_url, logo, settings, img_url, GOOGLE_KEY } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { Image, StatusBar, Loader } from '../components/GeneralComponents';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/SplashActions';
import firebase from 'react-native-firebase';

class Splash extends Component<Props>{

  async componentDidMount() {
    
    if(Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        if(url != null){
          let referrer = url.split('referrer=')[1];
          global.referrer = referrer;
        }else{
          global.referrer = '';
        }
      });
    }else{
        Linking.addEventListener('url', this.handleOpenURL);
    }

    if(Platform.OS === "ios"){
       await this.findType();
    }else{
       await this.requestCameraPermission();
    }
    await this.checkPermission();
    await this.settings();
    await this.home();
  }

  componentWillUnmount() { // C
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => { // D
    if(event.url != null){
      let referrer = event.url.split('referrer=')[1];
      global.referrer = referrer;
    }else{
      global.referrer = '';
    }
  }

  async requestCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'Doorkay needs to Access your location for tracking'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await this.findType();
        } else {
            //await this.handleBackButtonClick();
            global.location_permission = 0;
        }
    } catch (err) {
        //await this.handleBackButtonClick();
        global.location_permission = 0;
    }
  }

  async findType(){
    await this.getInitialLocation();
  }

  async getInitialLocation(){

    await navigator.geolocation.getCurrentPosition( async(position) => {
      global.location = position.coords.latitude+','+position.coords.longitude;
      global.location_permission = 1;
      this.get_location(global.location);
    }, error => alert('Sorry something went wrong') , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  get_location = async(value) => {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' +value+'&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              global.address = responseJson.results[0].formatted_address;
           }else{
              //alert('Sorry something went wrong');
           }
    }) 
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("before fcmToken: ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log("after fcmToken: ", fcmToken);
        try {
          AsyncStorage.setItem('fcmToken', fcmToken);
          global.fcm_token = fcmToken;
        } catch (e) {

        }
      }
    }else{
      global.fcm_token = fcmToken;
    }
  }

  async requestPermission() {
    firebase.messaging().requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  async checkPermission() {
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("Permission granted");
          this.getToken();
        } else {
          console.log("Request Permission");
          this.requestPermission();
        }
      });
  }

  settings = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'get', 
      url: api_url + settings
    })
    .then(async response => {
        await this.props.serviceActionSuccess(response.data)
        global.contact_number = await response.data.result.contact_number;
        global.whatsapp_number = await response.data.result.whatsapp_number;
        global.referral_message = await response.data.result.referral_message;
        global.referral_amount = await response.data.result.referral_amount;
        global.razorpay_key = await response.data.result.razorpay_key;
        global.minimum_order_value = await response.data.result.minimum_order_value;
        global.shipping_cost = await response.data.result.shipping_cost;
        global.purchase_reward = await response.data.result.purchase_reward;
        global.reward_points = await response.data.result.reward_points;
        global.banner_option = await response.data.result.banner_option;
        global.banner_image = await response.data.result.banner_image;
    })
    .catch(error => {
      //console.log(error);
      this.props.serviceActionError(error);
    });
  }

  home = async () => {
   const user_id = await AsyncStorage.getItem('user_id');
   const customer_name = await AsyncStorage.getItem('customer_name');
   const email = await AsyncStorage.getItem('email');
   const phone_number = await AsyncStorage.getItem('phone_number');
   const wallet = await AsyncStorage.getItem('wallet');
   const referral_code = await AsyncStorage.getItem('referral_code');
   const location = await AsyncStorage.getItem('location');
   const address = await AsyncStorage.getItem('address');
   global.currency = this.props.data.default_currency;
   if(user_id !== null){
      global.id = user_id;
      global.customer_name = customer_name;
      global.email = email;
      global.phone_number = phone_number;
      global.wallet = wallet;
      global.referral_code = referral_code;
      if(location != null && location != ''){
        global.location = location;
        global.address = address;
      }
      
      this.props
       .navigation
       .dispatch(StackActions.reset({
         index: 0,
         actions: [
           NavigationActions.navigate({
             routeName: 'Home'
           }),
         ],
      }))
   }else{
      global.id = '';
      this.props
       .navigation
       .dispatch(StackActions.reset({
         index: 0,
         actions: [
           NavigationActions.navigate({
             routeName: 'Login'
           }),
         ],
      }))
   }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <StatusBar />
        </View>
        <View style={styles.image_view} >
          <Image source={logo} />
        </View>
      </View>
    )
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.splash.isLoding,
    error : state.splash.error,
    data : state.splash.data,
    message : state.splash.message,
    status : state.splash.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(Splash);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg_three
  },
  image_view:{
    height:190, 
    width:280 
  }
});
