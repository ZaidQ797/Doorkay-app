import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Image, Keyboard  } from 'react-native';
import { Button } from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import { api_url, login, height_40, login_image, logo } from '../config/Constants';
import { StatusBar, Loader } from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/LoginActions';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';
import * as colors from '../assets/css/Colors';

class Login extends Component<Props>{

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        phone_number: '',
        validation:true,
        fcm_token : global.fcm_token
      }
  }
 
  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }

  login = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if(this.state.validation){
        this.props.serviceActionPending();
        await axios({
          method: 'post', 
          url: api_url + login,
          data:{ phone_number: this.state.phone_number, password: this.state.password, fcm_token : this.state.fcm_token }
        })
        .then(async response => {
          
            await this.props.serviceActionSuccess(response.data);
            await this.saveData();
        })
        .catch(error => {
            this.props.serviceActionError(error);
        });
    }
  }

  checkValidate(){
    if(this.state.phone_number == '' || this.state.password == '' ){
      this.state.validation = false;
      this.showSnackbar("Please fill all the fields.");
      return true;
    }else{
      this.state.validation = true;
      return true;
    }
  }

  saveData = async () =>{
    if(this.props.status == 1){
     try {
        if(this.props.data.default_location != null){
          await AsyncStorage.setItem('location', this.props.data.default_location.toString());
          await AsyncStorage.setItem('address', this.props.data.address.toString());
          global.location = await this.props.data.default_location;
          global.address = await this.props.data.address;
        }
        await AsyncStorage.setItem('user_id', this.props.data.id.toString());
        await AsyncStorage.setItem('customer_name', this.props.data.customer_name.toString());
        await AsyncStorage.setItem('email', this.props.data.email.toString());
        await AsyncStorage.setItem('phone_number', this.props.data.phone_number.toString());
        if(this.props.data.wallet != null){
          await AsyncStorage.setItem('wallet', this.props.data.wallet.toString());
        }
        if(this.props.data.referral_code != null){
          await AsyncStorage.setItem('referral_code', this.props.data.referral_code.toString());
        }
        global.id = await this.props.data.id;
        global.customer_name = await this.props.data.customer_name;
        global.email = await this.props.data.email;
        global.phone_number = await this.props.data.phone_number;
        global.wallet = await this.props.data.wallet;
        global.referral_code = await this.props.data.referral_code;
        await this.home();
      } catch (e) {
        alert(JSON.stringify(e));
      }
    }else{
      alert(this.props.message);
    }
  }

  register = () => {
    this.props.navigation.navigate('Register');
  }

  forgot = () => {
    this.props.navigation.navigate('Forgot');
  }

  home = () => {
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
  }

  showSnackbar(msg){
    Snackbar.show({
      title:msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  render() {

    const { isLoding, error, data, message, status } = this.props

    return (
      <ScrollView keyboardShouldPersistTaps='always'>
        <View style={styles.container}>
          <View>
            <StatusBar/>
          </View>
          <Loader visible={isLoding} />
          <View style={styles.block_one} >
            
            <View style={styles.login_image} >
              <Image
                style= {{flex:1 , width: undefined, height: undefined}}
                source={logo}
              />
            </View>
            <View>
              <Text style={styles.login} >Login</Text>
            </View>
          </View>
          <View style={styles.block_two} >
            <View style={styles.email_container}>
              <TextInput 
                style={styles.email}
                placeholder="PHONE NUMBER"
                keyboardType="phone-pad"
                onChangeText={ TextInputValue =>
                  this.setState({phone_number : TextInputValue }) }
              />
            </View>
            <View style={{ marginTop:20 }} />
            <View style={{ width:'80%' }} >
              <TextInput 
                style={styles.password}
                placeholder="PASSWORD"
                secureTextEntry={true}
                onChangeText={ TextInputValue =>
                  this.setState({password : TextInputValue }) }
              />
            </View>
            <View style={styles.forgot_password_container} >
              <Text onPress={this.forgot} style={{ color:colors.theme_fg_four }} >Forgot your password ?</Text>
            </View>
          </View>
          <View style={styles.footer} >
            <View style={styles.footer_container} >
              <Button
                title="Login"
                onPress={this.login}
                buttonStyle={{ backgroundColor:colors.theme_bg }}
              />
            </View>
            <View style={styles.signup_container} >
              <Text style={{ color:colors.theme_fg }} onPress={this.register}  >Sign up for a new account ?</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.login.isLoding,
    error : state.login.error,
    data : state.login.data,
    message : state.login.message,
    status : state.login.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});

export default connect(mapStateToProps,mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg_three
  },
  block_one:{
    width: '100%', 
    height: height_40, 
    backgroundColor: '#339933', 
    alignItems:'center', 
    justifyContent:'center'
  },
  login_image:{
    height:190, 
    width:280 
  },
  login:{
    color:colors.theme_fg_three, 
    marginTop:20, 
    fontSize:20, 
    fontWeight:'bold'
  },
  mr_iron:{
    color:colors.theme_fg_three, 
    marginTop:20, 
    fontSize:40, 
    fontWeight:'bold'
  },
  block_two:{
    width: '100%', 
    height: height_40, 
    backgroundColor: colors.theme_bg_three, 
    alignItems:'center', 
    justifyContent:'center'
  },
  email_container:{
    height:40, 
    width:'80%'
  },
  email:{
    borderColor: colors.theme_bg, 
    borderWidth: 1, 
    padding:10, 
    borderRadius:5 
  },
  password:{
    height:40, 
    borderColor: colors.theme_bg, 
    borderWidth: 1, 
    padding:10, 
    borderRadius:5
  },
  forgot_password_container:{
    width:'80%', 
    marginTop:15, 
    alignItems:'flex-end'
  },
  footer:{
    width: '100%', 
    alignItems:'center'
  },
  footer_container:{
    width:'80%', 
    marginTop:10
  },
  signup_container:{
    width:'80%', 
    margin:10, 
    alignItems:'center'
  }
});
