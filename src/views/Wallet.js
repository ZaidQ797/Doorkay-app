import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Image, Keyboard, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import { Icon, Row, Left, Body, Right, Container, Tab, Tabs, Col, List, ListItem, Content  } from 'native-base';
import Snackbar from 'react-native-snackbar';
import { api_url, height_70, height_20, forgot, wallet, get_wallet, add_wallet } from '../config/Constants';
import { StatusBar, Loader } from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/ForgotActions';
import * as colors from '../assets/css/Colors';
import DialogInput from 'react-native-dialog-input';
import RazorpayCheckout from 'react-native-razorpay';

export default class Wallet extends Component<Props>{

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        isDialogVisible : false,
        wallet_history : [],
      }
      
  }

  async componentDidFocus(){
    this.get_wallet();
  }
  
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  async componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
  }
  
  get_wallet = async () => {
    await axios({
      method: 'post', 
      url: api_url+get_wallet,
      data:{ customer_id: global.id}
    })
    .then(async response => {
      this.setState({ wallet:response.data.data, wallet_history:response.data.wallet_history });
      global.wallet = response.data.data;
      try {
        AsyncStorage.setItem('wallet', response.data.data);
      } catch (e) {
        
      }
    })
    .catch(error => {
    });
  }

  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }

  open_popup = () => {
    this.setState({ isDialogVisible:true });
  }

  close_popup = () => {
    this.setState({ isDialogVisible:false });
  }

  add_amount = (add_amount) => {
    if(isNaN(add_amount)){
      alert('Please enter valid amount');
    }else{
      let amount = parseFloat(add_amount) * 100;
      this.setState({ isDialogVisible:false });
      var options = {
        description: '',
        image: 'http://mriron.rithlaundry.com/public/uploads/images/logo.jpeg',
        currency: 'INR',
        key: global.razorpay_key,
        amount: amount,
        name: 'Doorkay',
        prefill: {
          email: global.email,
          contact: global.phone_number,
          name: global.customer_name
        },
        theme: {color: colors.theme_bg}
      }
      RazorpayCheckout.open(options).then((data) => {
        this.update_coins(parseFloat(add_amount),data.razorpay_payment_id);
      }).catch((error) => {
        //alert(JSON.stringify(error));
        alert('Sorry, your payment was failed');
      });
    }
    
  }

  update_coins = async (amount,payment_id) => {
    await axios({
      method: 'post', 
      url: api_url+add_wallet,
      data:{ customer_id: global.id, amount:amount }
    })
    .then(async response => {
      //alert(JSON.stringify(response.data));
      if(response.data.status == 1){
        this.setState({ wallet:response.data.wallet, wallet_history:response.data.wallet_history });
        global.wallet = response.data.wallet;
        try {
          AsyncStorage.setItem('wallet', response.data.wallet);
        } catch (e) {
          
        }
      }else{
        alert('Sorry something went wrong!');
      }
      
    })
    .catch(error => {
      //alert(JSON.stringify(error));
    });
  }


  render() {

    return (
        <Container>
          <Tabs tabBarUnderlineStyle={{ backgroundColor:colors.theme_bg_three }}>
            <Tab heading="My Wallet" tabStyle={{backgroundColor: colors.theme_bg }} activeTabStyle={{backgroundColor: colors.theme_bg}} activeTextStyle={{color: colors.theme_bg_three, fontWeight: 'bold'}}>
              <View style={styles.block_one} >
                <View style={styles.refer_image} >
                  <Image
                    style= {{flex:1 , width: undefined, height: undefined}}
                    source={wallet}
                  />
                </View>
                <View style={styles.description_content} >
                  <Text style={styles.description} >Ayushunooru Coins</Text>
                </View>
                <View>
                  <Text style={styles.refer_title} >{global.currency}{this.state.wallet}</Text>
                </View>
                <DialogInput isDialogVisible={this.state.isDialogVisible}
                  title={"Add Coins"}
                  message={"Enter the coins on below"}
                  hintInput ={"ADD COINS"}
                  submitInput={ (inputText) => {this.add_amount(inputText)} }
                  closeDialog={ () => {this.close_popup(false)}}>
                </DialogInput>
              </View>
              <View style={styles.footer} >
                <View style={styles.footer_content}>
                  <Button
                    onPress={this.open_popup}
                    title="Add Coins"
                    buttonStyle={styles.add_coins}
                  />
                </View>
              </View>
            </Tab>
            <Tab heading="Reward Histories" tabStyle={{backgroundColor: colors.theme_bg }} activeTabStyle={{backgroundColor: colors.theme_bg}} activeTextStyle={{color: colors.theme_bg_three, fontWeight: 'bold'}} >
              <Content>
              <List>
                {this.state.wallet_history.map((row, index) => (
                <ListItem>
                  <Row>
                    <Col style={{ width:'65%' }}>
                      <Text style={{ color:colors.theme_fg_two, fontSize:16, fontWeight:'bold' }} >{row.type}</Text>
                      <Text>{row.content}</Text>
                    </Col>
                    <Col>
                        <Text style={{ color:colors.theme_fg_two, fontSize:14 }}>{row.date}</Text>
                        <Text style={{ color:colors.theme_fg_two, fontSize:14, fontWeight:'bold' }}>{global.currency}{row.amount}</Text>
                    </Col>
                  </Row>
                </ListItem>
                ))}
              </List>
              </Content>
            </Tab>
          </Tabs>
        </Container>
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
    height:175, 
    width:175
  },
  refer_title:{
    color:colors.theme_fg, 
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
    marginBottom:10
  },
  send_otp:{
    backgroundColor:colors.theme_bg
  },
  add_coins:{
    backgroundColor:colors.theme_bg
  }
});
