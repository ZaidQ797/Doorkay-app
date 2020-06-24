import { Dimensions } from 'react-native';

export const base_url = "https://ayushunooru.co.in/";
export const api_url = "https://ayushunooru.co.in/api/";
export const settings = "app_setting";
export const img_url = "https://ayushunooru.co.in/public/uploads/";
export const service = "service";
export const faq = "faq";
export const privacy = "privacy_policy";
export const product = "product";
export const register = "customer";
export const login = "customer/login";
export const address = "address";
export const address_list = "address/all";
export const address_delete = "address/delete";
export const my_orders = "get_orders";
export const get_wallet = "get_wallet";
export const add_wallet = "add_wallet";
export const promo_code = "promo";
export const profile = "customer";
export const profile_picture = "customer/profile_picture";
export const forgot = "customer/forgot_password";
export const reset = "customer/reset_password";
export const place_order = "order";
export const payment_methods = "payment_methods";
export const get_distance = "customer/get_distance";
export const no_data = "Sorry no data found...";
export const greeting = "Hello admin";
//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_40 = Math.round(40 / 100 * screenHeight);
export const height_50 = Math.round(50 / 100 * screenHeight);
export const height_60 = Math.round(60 / 100 * screenHeight);
export const height_70 = Math.round(70 / 100 * screenHeight);
export const height_35 = Math.round(35 / 100 * screenHeight);
export const height_20 = Math.round(20 / 100 * screenHeight);
export const height_30 = Math.round(30 / 100 * screenHeight);

//Path
export const logo = require('.././assets/img/logo.png');
export const forgot_password = require('.././assets/img/forgot_password.png');
export const refer = require('.././assets/img/refer.png');
export const wallet = require('.././assets/img/wallet.png');
export const reset_password = require('.././assets/img/reset_password.png');
export const loading = require('.././assets/img/loading.png');
export const pin = require('.././assets/img/location_pin.png');
export const login_image = require('.././assets/img/logo.png');
export const denied = require('.././assets/img/denied.png');
export const washing_machine = require('.././assets/img/washing-machine.png');

//Map
export const GOOGLE_KEY = "AIzaSyCfvG71yubdO6_zuXRwEp50-SfYFFdVWZ8";
export const LATITUDE_DELTA = 0.0150;
export const LONGITUDE_DELTA =0.0152;
//More Menu
export const menus = [
  {
    menu_name: 'Manage Addresses',
    icon: 'pin',
    route:'AddressList'
  },
  {
    menu_name: 'Faq',
    icon: 'help',
    route:'Faq'
  },
  {
    menu_name: 'Privacy Policy',
    icon: 'alert',
    route:'PrivacyPolicy'
  },
  {
    menu_name: 'Notifications',
    icon: 'notifications',
    route:'Notification'
  },
  {
    menu_name: 'Logout',
    icon: 'log-out',
    route:'Logout'
  },
]

//Image upload options
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery'
};