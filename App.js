import React, {Fragment} from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { fromRight } from 'react-navigation-transitions';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from 'react-native-vector-icons/Ionicons';

/* Screens */
import Splash from './src/views/Splash';
import Home from './src/views/Home';
import Product from './src/views/Product';
import Promo from './src/views/Promo';
import MyOrders from './src/views/MyOrders';
import OrderDetails from './src/views/OrderDetails';
import Cart from './src/views/Cart';
import Profile from './src/views/Profile';
import More from './src/views/More';
import Address from './src/views/Address';
import AddressList from './src/views/AddressList';
import Payment from './src/views/Payment';
import Login from './src/views/Login';
import Register from './src/views/Register';
import Faq from './src/views/Faq';
import FaqDetails from './src/views/FaqDetails';
import PrivacyPolicy from './src/views/PrivacyPolicy';
import Forgot from './src/views/Forgot';
import Otp from './src/views/Otp';
import Reset from './src/views/Reset';
import Refer from './src/views/Refer';
import Logout from './src/views/Logout';
import Notification from './src/views/Notification';
import Category from './src/views/Category';
import Location from './src/views/Location';
import LocationSearch from './src/views/LocationSearch';
import Wallet from './src/views/Wallet';
const TabNavigator = createMaterialBottomTabNavigator({
  Home: { 
    screen: Home,
    navigationOptions:{
      tabBarLabel:'Home',
      tabBarIcon:({tintColor}) => (
        <Icon name='ios-home' color={tintColor} size={24} />
      )
    } },
  MyOrders: { 
    screen: MyOrders,
    navigationOptions:{
      tabBarLabel:'My Orders',
      tabBarIcon:({tintColor}) => (
        <Icon name='ios-shirt' color={tintColor} size={24} />
      )
    } },
  Wallet: { 
  screen: Wallet,
  navigationOptions:{
    tabBarLabel:'Wallet',
    tabBarIcon:({tintColor}) => (
      <Icon name='ios-wallet' color={tintColor} size={24} />
    )
  } },
  More: { 
  screen: More,
  navigationOptions:{
    tabBarLabel:'More',
    tabBarIcon:({tintColor}) => (
      <Icon name='ios-more' color={tintColor} size={24} />
    )
  } }
}, {
  initialRouteName: 'Home',
  //activeColor: '#FFFFFF',
  //inactiveTintColor: '#FFFFFF',
  //inactiveColor: '#3e2465',
  shifting: false,
  barStyle: { backgroundColor: '#1a1818' },
});

const AppNavigator = createStackNavigator({

  Splash: { screen: Splash },
  Home: { screen: TabNavigator, navigationOptions: {
        header: null
      } },
  Product: { screen: Product },
  Cart: { screen: Cart },
  Address: { screen: Address },
  AddressList: { screen: AddressList },
  Payment: { screen: Payment },
  Promo: { screen: Promo },
  OrderDetails: { screen: OrderDetails },
  Login: { screen: Login },
  Register: { screen: Register },
  Faq: { screen: Faq },
  FaqDetails: { screen: FaqDetails },
  PrivacyPolicy: { screen: PrivacyPolicy },
  Forgot: { screen: Forgot },
  Otp: { screen: Otp },
  Reset: { screen: Reset },
  Refer: { screen: Refer },
  Logout: { screen: Logout },
  Notification: { screen: Notification },
  Category: { screen: Category },
  Location: { screen: Location },
  LocationSearch: { screen: LocationSearch },
  Profile: { screen: Profile }
  },{
  initialRouteName:'Splash',
  headerMode: 'none',
  navigationOptions: {
      headerVisible: false,
  },
  transitionConfig: () => fromRight(500)
});

export default createAppContainer(AppNavigator);

