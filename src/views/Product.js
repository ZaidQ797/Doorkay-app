import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Icon, Row, Footer, Tab, Tabs, Col, List, ListItem, Content } from 'native-base';
import UIStepper from 'react-native-ui-stepper';
import { img_url, api_url, product, height_30, no_data } from '../config/Constants';
import { Loader } from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess, addToCart, changeServiceId, productReset } from '../actions/ProductActions';
import {  subTotal } from '../actions/CartActions';
import Tooltip from 'rn-tooltip';
class Product extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        category:this.props.navigation.getParam('data'),
        toolTipVisible:false
      }
  }

  componentDidMount() {
    if(this.props.service_id == undefined || this.props.service_id == this.state.category.service_id){
      this.setState({ diff_cat : 0 });
    }else{
      this.setState({ diff_cat : 1 });
    }

  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  tooltip_showing = async () =>{
    await this.setState({ toolTipVisible:true });
  }
  add_to_cart = async (qty,product_id,product_name,price) => {
    //alert(this.props.service_id);
     if(this.props.service_id == undefined || this.props.service_id == this.state.category.service_id){
       let cart_items = this.props.cart_items;
       let old_product_details = cart_items[this.state.category.service_id + '-' + product_id];
       let sub_total = this.props.sub_total;
       let total_price = qty * price;
       
       if(old_product_details != undefined && total_price > 0){
         let final_price = total_price - old_product_details.price;
         sub_total = sub_total + final_price;
       }else if(total_price > 0){
         let final_price = price;
         sub_total = sub_total + final_price;
       }
      
       if(qty > 0){
          let product_data = {
            service_id: this.state.category.service_id,
            service_name: '',
            product_id: product_id,
            product_name: product_name,
            qty: qty,
            price: qty * price
          }
          cart_items[this.state.category.service_id + '-' + product_id] = product_data;
          await this.props.changeServiceId(this.state.category.service_id);
          await this.props.addToCart(cart_items);
          await this.props.subTotal(sub_total);
       }else{
          delete cart_items[this.state.category.service_id + '-' + product_id];
          await this.props.addToCart(cart_items);
          await this.props.subTotal(sub_total - price);
       }
     }else{
      Alert.alert(
        'Clear',
        "You can place orders from only one service at the time. Do you want to cancel the cart items which already you're saved?",
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => this.add_to_cart_force(qty,product_id,product_name,price) },
        ],
        {cancelable: false},
      );
     }
  }

add_to_cart_force = async (qty,product_id,product_name,price) => {

   await this.props.productReset();
   let cart_items = this.props.cart_items;
   let old_product_details = cart_items[this.state.category.service_id + '-' + product_id];
   //let sub_total = this.props.sub_total;
   let sub_total = 0;
   let total_price = qty * price;
   
   if(old_product_details != undefined && total_price > 0){
     let final_price = total_price - old_product_details.price;
     sub_total = sub_total + final_price;
   }else if(total_price > 0){
     let final_price = price;
     sub_total = sub_total + final_price;
   }
  
   if(qty > 0){
      let product_data = {
        service_id: this.state.category.service_id,
        service_name: '',
        product_id: product_id,
        product_name: product_name,
        qty: qty,
        price: qty * price
      }
      cart_items[this.state.category.service_id + '-' + product_id] = product_data;
      await this.props.changeServiceId(this.state.category.service_id);
      await this.props.addToCart(cart_items);
      await this.props.subTotal(sub_total);
      this.setState({ diff_cat : 0 });
   }
}

  cart = () => {
    this.props.navigation.navigate('Cart');
  }

  render() {

    const { data, cart_items, cart_count } = this.props
    const { category, diff_cat } = this.state
    
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={{ flex: 1 }} >
            <Icon onPress={this.handleBackButtonClick} style={styles.icon} name='arrow-back' />
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >{category.category_name}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
        <View style={{ width:'100%', height:150}} >
          <Image
            style= {{flex:1 , width: undefined, height: undefined}}
            source={{uri : img_url + category.image }}
          />
        </View>
        { category.products.length != 0 && diff_cat == 1 &&
          <List>
            <FlatList
              data={category.products}
              renderItem={({ item,index }) => (
                <ListItem>
                  <Row style={{ padding:10 }} >
                    <Col style={{ width:100 }} >
                      <View style={styles.image_container} >
                        <Image
                          style= {{flex:1 , width: undefined, height: undefined}}
                          source={{uri : img_url + item.image }}
                        />
                      </View>
                    </Col>
                    <Col>
                      <Text style={styles.product_name} >{item.product_name}</Text>
                      <View style={{ marginTop:10 }} >
                        <UIStepper
                          displayValue={true}
                          innerRef={stepper => {
                            this.stepper = stepper;
                          }}
                          onMaximumReached={(value) => { 
                            this.add_to_cart(1,item.id,item.product_name,item.price) 
                            //alert(this.state.diff_cat);
                          }}
                          maximumValue={0}
                          initialValue={cart_items[this.state.category.service_id + '-' + item.id] ? cart_items[this.state.category.service_id + '-' + item.id].qty : 0 }
                          borderColor="#1a1818"
                          textColor="#1a1818"
                          tintColor="#1a1818"
                        />
                      </View>
                    </Col>
                    <Col style={{ width:100 }}>
                      <Text style={styles.price} >{global.currency}{item.price}</Text>
                      {item.help_text &&
                          <Tooltip backgroundColor="#e6e6e6" overlayColor="rgba(230, 230, 230, 0.90)" popover={<Text>{item.help_text}</Text>}>
                            <Icon style={{ fontSize:30, marginTop:10, marginLeft:40 }} name='information-circle-outline' />
                          </Tooltip>
                      }
                    </Col>
                  </Row>
                </ListItem>
              )}
              keyExtractor={item => item.product_name}
            />
          </List>
        }
        { category.products.length != 0 && diff_cat == 0 &&
          <List>
            <FlatList
              data={category.products}
              renderItem={({ item,index }) => (
                <ListItem>
                  <Row style={{ padding:10 }} >
                    <Col style={{ width:100 }} >
                      <View style={styles.image_container} >
                        <Image
                          style= {{flex:1 , width: undefined, height: undefined}}
                          source={{uri : img_url + item.image }}
                        />
                      </View>
                    </Col>
                    <Col>
                      <Text style={styles.product_name} >{item.product_name}</Text>
                      <View style={{ marginTop:10 }} >
                        <UIStepper
                          displayValue={true}
                          innerRef={stepper => {
                            this.stepper = stepper;
                          }}
                          onValueChange={(value) => { 
                            this.add_to_cart(value,item.id,item.product_name,item.price) 
                          }}
                          maximumValue={this.state.maximum}
                          initialValue={cart_items[this.state.category.service_id + '-' + item.id] ? cart_items[this.state.category.service_id + '-' + item.id].qty : 0 }
                          borderColor="#1a1818"
                          textColor="#1a1818"
                          tintColor="#1a1818"
                        />
                      </View>
                    </Col>
                    <Col style={{ width:100 }}>
                      <Text style={styles.price} >{global.currency}{item.price}</Text>
                      {item.help_text &&
                          <Tooltip backgroundColor="#e6e6e6" overlayColor="rgba(230, 230, 230, 0.90)" popover={<Text>{item.help_text}</Text>}>
                            <Icon style={{ fontSize:30, marginTop:10, marginLeft:40 }} name='information-circle-outline' />
                          </Tooltip>
                      }
                    </Col>
                  </Row>
                </ListItem>
              )}
              keyExtractor={item => item.product_name}
            />
          </List>
        }
        {category.products.length == 0 && <Body style={{ marginTop:height_30 }} >
            <Text>{no_data}</Text>
          </Body>}
        </Content>
        {cart_count ?
          <Footer style={styles.footer} >
            <TouchableOpacity activeOpacity={1} onPress={() => this.cart()} style={styles.footer_container}>
              <Row>
                <Col style={styles.view_cart_container} >
                  <Text style={styles.view_cart} >View cart</Text>
                </Col>
              </Row>
            </TouchableOpacity>
          </Footer> : null }
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.product.isLoding,
    error : state.product.error,
    data : state.product.data,
    message : state.product.message,
    status : state.product.status,
    cart_items : state.product.cart_items, 
    service_id : state.product.service_id, 
    cart_count : state.product.cart_count,
    sub_total : state.cart.sub_total
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
    addToCart: (data) => dispatch(addToCart(data)),
    subTotal: (data) => dispatch(subTotal(data)),
    changeServiceId: (data) => dispatch(changeServiceId(data)),
    productReset: () => dispatch(productReset())
});


export default connect(mapStateToProps,mapDispatchToProps)(Product);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.theme_bg_two,
  },
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
  image_container:{
    height:50, 
    width:50
  },
  product_name:{
    fontSize:15, 
    fontWeight:'bold', 
    color:colors.theme_fg_two
  },
  price:{
    fontSize:15, 
    color:'#339933'
  },
  piece:{
    fontSize:12, 
    color:colors.theme_fg
  },
  footer:{
    backgroundColor:'transparent'
  },
  footer_container:{
    width:'100%', 
    backgroundColor:colors.theme_bg
  },
  view_cart_container:{
    alignItems:'center',
    justifyContent:'center'
  },
  view_cart:{
    color:colors.theme_fg_three, 
    fontWeight:'bold'
  }
});

