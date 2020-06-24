import React, {Component} from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Container, Header, Content, Left, Body, Right, Title, Button as Btn, Icon, Footer, ListItem, List, Col } from 'native-base';
import { api_url, place_order, payment_methods, img_url } from '../config/Constants';
import { NavigationActions } from 'react-navigation';
import * as colors from '../assets/css/Colors';
import { Loader } from '../components/GeneralComponents';
import { Button } from 'react-native-elements';
import axios from 'axios';
import { connect } from 'react-redux';
import { orderServicePending, orderServiceError, orderServiceSuccess, paymentServicePending, paymentServiceError, paymentServiceSuccess } from '../actions/PaymentActions';
import { reset } from '../actions/CartActions';
import { productReset } from '../actions/ProductActions';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-community/async-storage';

class Payment extends Component<Props> { 

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.select_payment_method = this.select_payment_method.bind(this);
      this.PaymentMethod();
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  place_order = async (payment_mode, wallet_amount, paid_amount, payment_response) => {
    //alert(JSON.stringify({ customer_id: global.id, payment_mode: this.state.payment_mode, address_id:this.props.address, expected_delivery_date:this.props.delivery_date, total:this.props.total, discount:this.props.discount, sub_total:this.props.sub_total, promo_id:this.props.promo_id,wallet_amount:wallet_amount,paid_amount:paid_amount,payment_response:payment_response, items: JSON.stringify(Object.values(this.props.items)) }))
    this.props.orderServicePending();
    await axios({
      method: 'post', 
      url: api_url + place_order,
      data:{ customer_id: global.id, payment_mode: payment_mode, address_id:this.props.address, expected_delivery_date:this.props.delivery_date, total:this.props.total, discount:this.props.discount, sub_total:this.props.sub_total, promo_id:this.props.promo_id,wallet_amount:wallet_amount,paid_amount:paid_amount,payment_response:payment_response, items: JSON.stringify(Object.values(this.props.items)) }
    })
    .then(async response => {
      await this.props.orderServiceSuccess(response.data);
      await this.update_wallet(wallet_amount);
      await this.move_orders();
    })
    .catch(error => {
      this.props.orderServiceError(error);
    });
  }

  PaymentMethod = async () => {
    this.props.paymentServicePending();
    await axios({
      method: 'get', 
      url: api_url + payment_methods
    })
    .then(async response => {
        await this.props.paymentServiceSuccess(response.data)
    })
    .catch(error => {
        this.props.paymentServiceError(error);
    });
  }

  async move_orders(){
    await this.props.reset();
    await this.props.productReset();
    const navigateAction = NavigationActions.navigate({
      routeName: 'MyOrders'
    });
    this.props.navigation.dispatch(navigateAction);
  }

  select_payment_method(id){
    if(id == 1){
      if(global.wallet != 0 && parseFloat(global.wallet) <  parseFloat(this.props.total)){
          let remaining_amount = parseFloat(this.props.total) - parseFloat(global.wallet);
          this.place_order(id,global.wallet,Math.abs(remaining_amount),'Cash');
      }else{
        this.place_order(id,0,this.props.total,'Cash');
      }
    }else if(id == 2){
        if(global.wallet != 0 && parseFloat(global.wallet) <  parseFloat(this.props.total)){
          let remaining_amount = parseFloat(this.props.total) - parseFloat(global.wallet);
          var options = {
              description: '',
              currency: 'INR',
              key: global.razorpay_key,
              amount: parseFloat(Math.abs(remaining_amount)) * 100,
              name: 'Doorkay',
              prefill: {
                email: global.email,
                contact: global.phone_number,
                name: global.customer_name
              },
              theme: {color: colors.theme_bg}
            }
            RazorpayCheckout.open(options).then((data) => {
              this.place_order(id,global.wallet,Math.abs(remaining_amount),data.razorpay_payment_id);
            }).catch((error) => {
              // handle failure
              alert('Sorry, your payment was failed');
            });

        }else{
          var options = {
              description: '',
              currency: 'INR',
              key: global.razorpay_key,
              amount: parseFloat(this.props.total) * 100,
              name: 'Doorkay',
              prefill: {
                email: global.email,
                contact: global.phone_number,
                name: global.customer_name
              },
              theme: {color: colors.theme_bg}
            }
            RazorpayCheckout.open(options).then((data) => {
              this.place_order(id,0,this.props.total,data.razorpay_payment_id);
            }).catch((error) => {
              // handle failure
              alert('Sorry, your payment was failed');
            });
        
        }
    }else if(id == 10){
      if(global.wallet >= this.props.total){
        //alert(global.wallet+'-'+0+'-'+'');
        this.place_order(10,this.props.total,0,'Wallet');
      }else{
        alert('wallet has not sufficient amount choose another pay method')
      }
    }
  }

  update_wallet(wallet_amount){
    let amount = parseFloat(global.wallet) - parseFloat(wallet_amount);
    try {
      AsyncStorage.setItem('wallet', amount);
      global.wallet = amount;
    } catch (e) {

    }
  }
  render() {

    const { isLoding, error, data, message, status, payment_data } = this.props

    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={{ flex: 1 }} >
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Btn>
          </Left>
          <Body style={styles.heading} >
            <Title style={styles.title} >Payment Mode</Title>
          </Body>
          <Right />
        </Header>
        
        <Content style={{ padding:20 }} >
          {payment_data != undefined &&
            <Col>
            {payment_data.map((row, index) => (
              <Text style={styles.name}  onPress={() => this.select_payment_method(row.id)} >{row.name}</Text>
            ))}
            <Text style={styles.name}  onPress={() => this.select_payment_method(10)} >Ayushunooru Coins ({ global.wallet})</Text>
            
            </Col>
          }
        </Content>
        {/*<Footer style={styles.footer} >
          <View style={styles.footer_content}>
            <Button
              onPress={this.place_order}
              title="Place Order"
              buttonStyle={styles.place_order}
            />
          </View>
        </Footer>*/}
        <Loader visible={isLoding} /> 
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.payment.isLoding,
    error : state.payment.error,
    data : state.payment.data,
    message : state.payment.message,
    status : state.payment.status,
    payment_data : state.payment.payment_data,
    address : state.cart.address,
    delivery_date : state.cart.delivery_date,
    total : state.cart.total_amount,
    sub_total : state.cart.sub_total,
    discount : state.cart.promo_amount,
    promo_id : state.cart.promo_id,
    items : state.product.cart_items
  };
}

const mapDispatchToProps = (dispatch) => ({
    orderServicePending: () => dispatch(orderServicePending()),
    orderServiceError: (error) => dispatch(orderServiceError(error)),
    orderServiceSuccess: (data) => dispatch(orderServiceSuccess(data)),
    paymentServicePending: () => dispatch(paymentServicePending()),
    paymentServiceError: (error) => dispatch(paymentServiceError(error)),
    paymentServiceSuccess: (data) => dispatch(paymentServiceSuccess(data)),
    reset: () => dispatch(reset()),
    productReset: () => dispatch(productReset())
});


export default connect(mapStateToProps,mapDispatchToProps)(Payment);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg_three
  },
  icon:{
    color:colors.theme_fg_two
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg_two,
    alignSelf:'center', 
    fontSize:16, 
    fontWeight:'bold'
  },
  radio_style:{
    marginLeft:20, 
    fontSize: 17, 
    color: colors.theme_bg, 
    fontWeight:'bold'
  },
  footer:{
    backgroundColor:'transparent'
  },
  footer_content:{
    width:'90%'
  },
  place_order:{
    backgroundColor:colors.theme_bg
  },
  name:{
    padding:10,
    color:colors.theme_fg,
    fontSize:16, 
    fontWeight:'bold',
    borderBottomWidth:1,
    borderColor:'#a3ada6'
  },
});
