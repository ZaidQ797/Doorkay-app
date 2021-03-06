import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Image, BackHandler, Keyboard  } from 'react-native';
import { Button } from 'react-native-elements';
import { NavigationActions, StackActions } from 'react-navigation';
import { Icon } from 'native-base';
import Snackbar from 'react-native-snackbar';
import { api_url, register, height_40, logo } from '../config/Constants';
import { StatusBar, Loader } from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/RegisterActions';
import AsyncStorage from '@react-native-community/async-storage';


class Register extends Component<Props>{

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        customer_name:'',
        phone_number:'', 
        email: '',
        password: '',
        validation:true,
        referral_code:'',
        fcm_token : global.fcm_token
      }
  }

  componentWillMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
      this.props.navigation.navigate('Login');
      return true;
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

  register = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if(this.state.validation){
        this.props.serviceActionPending();
        await axios({
          method: 'post', 
          url: api_url + register,
          data:{ customer_name: this.state.customer_name, phone_number: this.state.phone_number, email: this.state.email, password: this.state.password, fcm_token : this.state.fcm_token, referral_code : global.referrer }
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

  saveData = async () =>{
    if(this.props.status == 1){
      try {
        await AsyncStorage.setItem('user_id', this.props.data.id.toString());
        await AsyncStorage.setItem('customer_name', this.props.data.customer_name.toString());
        await AsyncStorage.setItem('email', this.props.data.email.toString());
        await AsyncStorage.setItem('phone_number', this.props.data.phone_number.toString());
        await AsyncStorage.setItem('wallet', this.props.data.wallet.toString());
        await AsyncStorage.setItem('referral_code', this.props.data.referral_code.toString());
        global.id = await this.props.data.id;
        global.customer_name = await this.props.data.customer_name;
        global.email = await this.props.data.email;
        global.phone_number = await this.props.data.phone_number;
        global.wallet = await this.props.data.wallet;
        global.referral_code = await this.props.data.referral_code;
        await this.home();
      } catch (e) {

      }
    }else{
      alert(this.props.message);
    }
  }

  checkValidate(){
    if(this.state.email == '' || this.state.phone_number == '' || this.state.password == '' || this.state.customer_name == ''){
      this.state.validation = false;
      this.showSnackbar("Please fill all the fields.");
      return true;
    }else{
      this.state.validation = true;
      return true;
    }
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
      {/*<ScrollView keyboardShouldPersistTaps='always'>
        <View style={styles.container}>
          <View>
            <StatusBar/>
          </View>
          <Loader visible={isLoding} />
          <View style={styles.header_section} >
            <View style={styles.back_content} >
              <Icon onPress={this.handleBackButtonClick} style={styles.back_icon} name='arrow-back' />
            </View>
            <View>
              <Text style={styles.mr_iron} >Doorkay</Text>
            </View>
            <View>
              <Text style={styles.register_name} >Register</Text>
            </View>
          </View>
          <View style={styles.body_section} >
            <View style={styles.input}>
              <TextInput 
                style={styles.input_text}
                placeholder="USERNAME"
                onChangeText={ TextInputValue =>
                  this.setState({customer_name : TextInputValue }) }
              />
            </View>
            <View style={styles.input}>
              <TextInput 
                style={styles.input_text}
                placeholder="PHONE"
                keyboardType="phone-pad"
                onChangeText={ TextInputValue =>
                  this.setState({phone_number : TextInputValue }) }
              />
            </View>
            <View style={styles.input}>
              <TextInput 
                style={styles.input_text}
                placeholder="EMAIL ADDRESS"
                keyboardType="email-address"
                onChangeText={ TextInputValue =>
                  this.setState({email : TextInputValue }) }
              />
            </View>
            <View style={styles.input} >
              <TextInput 
                style={styles.input_text}
                placeholder="PASSWORD"
                secureTextEntry={true}
                onChangeText={ TextInputValue =>
                  this.setState({password : TextInputValue }) }
              />
            </View>
          </View>
          <View style={styles.footer_section} >
            <View style={styles.input} >
              <Button
                title="Register"
                onPress={this.register}
                buttonStyle={styles.btn_style}
              />
            </View>
            <View style={styles.login_content} >
              <Text style={styles.login_string} onPress={this.handleBackButtonClick}  >Already i have an account</Text>
            </View>
          </View>
        </View>
      </ScrollView>*/}
      <View>
        <Text>Hi</Text>
      </View>
    )
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.register.isLoding,
    error : state.register.error,
    data : state.register.data,
    message : state.register.message,
    status : state.register.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});

export default connect(mapStateToProps,mapDispatchToProps)(Register);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg_three
  },
  header_section:{
    width: '100%', 
    height: height_40, 
    backgroundColor: colors.theme_bg, 
    alignItems:'center', 
    justifyContent:'center'
  },
  back_content:{
    width: '100%', 
    backgroundColor: colors.theme_bg, 
    position:'absolute', 
    top:10, 
    left:10
  },
  back_icon:{
    color:colors.theme_fg_three
  },
  logo_content:{
    height:75, 
    width:225
  },
  logo:{
    flex:1 , 
    width: undefined, 
    height: undefined
  },
  mr_iron:{
    color:colors.theme_fg_three, 
    marginTop:20, 
    fontSize:40, 
    fontWeight:'bold'
  },
  register_name:{
    color:colors.theme_fg_three, 
    marginTop:20, 
    fontSize:20, 
    fontWeight:'bold'
  },
  body_section:{
    width: '100%', 
    height: height_40, 
    backgroundColor: colors.theme_bg_three, 
    alignItems:'center', 
    justifyContent:'center'
  },
  input:{
    height:40, 
    width:'80%',
    marginTop:10 
  },
  input_text:{
    borderColor: colors.theme_bg, 
    borderWidth: 1, 
    padding:10, 
    borderRadius:5
  },
  footer_section:{
    width: '100%', 
    alignItems:'center'
  },
  login_content:{
    width:'80%', 
    margin:10, 
    alignItems:'center'
  },
  login_string:{
    color:colors.theme_fg
  },
  btn_style:{
    backgroundColor:colors.theme_bg
  }
});
