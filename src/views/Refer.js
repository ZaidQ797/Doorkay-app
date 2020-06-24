import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Image, Keyboard, Linking  } from 'react-native';
import { Button } from 'react-native-elements';
import { Icon, Row, Left, Body, Right } from 'native-base';
import Snackbar from 'react-native-snackbar';
import { api_url, height_70, height_20, forgot, refer } from '../config/Constants';
import { StatusBar, Loader } from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/ForgotActions';
import * as colors from '../assets/css/Colors';

const referral_url= "http://www.rithlaundry.com/param?referrer=";

export default class Refer extends Component<Props>{

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }
 
  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }

  share = (type) => {
      let message = global.referral_message+' '+referral_url+global.referral_code;
      if(type == 'whatsapp'){
        Linking.openURL('whatsapp://send?text='+message)
      }else if(type == 'facebook'){
        Linking.openURL('fb-messenger://share?link='+message);
      }else if(type == 'message'){
        Linking.openURL('sms:?body='+message);
      }
  }

  render() {

    return (
      <ScrollView keyboardShouldPersistTaps='always'>
        <View style={styles.container}>
          <View>
            <StatusBar/>
          </View>
          <View style={styles.block_one} >
            <View style={styles.back_content} >
              <Icon onPress={this.handleBackButtonClick} style={styles.back_icon} name='arrow-back' />
            </View>
            <View style={styles.refer_image} >
              <Image
                style= {{flex:1 , width: undefined, height: undefined}}
                source={refer}
              />
            </View>
            <View>
              <Text style={styles.refer_title} >Refer your friend and get bonus</Text>
            </View>
            <View style={styles.description_content} >
              <Text style={styles.description} >You can get {global.currency}{global.referral_amount} for a every signup from your friends with using your referral code.</Text>
            </View>
            {/*<View>
              <Text style={styles.refer_code} >#{global.referral_code}</Text>
            </View>*/}
          </View>
          <View style={styles.footer} >
            <View style={styles.footer_content} >
             <Row>
                <Left>
                  <Icon onPress={this.share.bind(this, 'whatsapp')} style={styles.social_icon} name='logo-whatsapp' />
                </Left>
                <Body>
                  <Icon onPress={this.share.bind(this, 'facebook')} style={styles.social_icon} name='logo-facebook' />
                </Body>
                <Right>
                  <Icon onPress={this.share.bind(this, 'message')} style={styles.social_icon} name='text' />
                </Right>
             </Row>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg_three
  },
  back_icon:{
    color:colors.theme_bg
  },
  social_icon:{
    color:colors.theme_bg,
    fontSize:60
  },
  back_content:{
    width: '100%',  
    position:'absolute', 
    top:10, 
    left:10
  },
  block_one:{
    width: '100%', 
    height: height_70, 
    backgroundColor: colors.theme_bg_three, 
    alignItems:'center', 
    justifyContent:'center'
  },
  refer_image:{
    height:152, 
    width:152
  },
  refer_title:{
    color:colors.theme_fg, 
    marginTop:50, 
    fontSize:20, 
    fontWeight:'bold' 
  },
  refer_code:{
    color:colors.theme_fg, 
    marginTop:20, 
    fontSize:25, 
    fontWeight:'bold' 
  },
  description_content:{
    paddingLeft:20, 
    paddingRight:20
  },
  description:{
    marginTop:20, 
    fontSize:15, 
    textAlign:'center', 
    color:colors.theme_fg_four
  },
  block_two:{
    width: '100%', 
    height: height_20, 
    backgroundColor: colors.theme_bg_three, 
    alignItems:'center', 
    justifyContent:'center'
  },
  footer:{
    width: '100%',
    alignItems:'center'
  },
  footer_content:{
    width:'80%', 
    marginTop:10
  },
  send_otp:{
    backgroundColor:colors.theme_bg
  }
});
