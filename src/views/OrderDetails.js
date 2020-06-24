import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Linking } from 'react-native';
import { Container, Header, Content, Left, Body, Right, Title, Button, Icon, Row, Col, List, ListItem } from 'native-base';
import * as colors from '../assets/css/Colors';
import ProgressCircle from 'react-native-progress-circle';
import { Divider } from 'react-native-elements';
import Moment from 'moment';
import { washing_machine, greeting } from '../config/Constants';
import { Button as Btn} from 'react-native-elements';
import StepIndicator from 'react-native-step-indicator';

const labels = ["Order Placed","On the way to pickup","In Progress","On the way to deliver","Delivered"];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#1a1818',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#1a1818',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#1a1818',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#1a1818',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#1a1818',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#1a1818'
}

export default class OrderDetails extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data : this.props.navigation.getParam('data'),
        currentPosition: this.props.navigation.getParam('position')
      }
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  navigate = (route) => {
    if(route == 'Logout'){
      this.showDialog();
    }else if(route == 'Call'){
      Linking.openURL(`tel:${global.contact_number}`)
    }else if(route == 'Whatsapp'){
      Linking.openURL('whatsapp://send?text='+greeting+'&phone='+global.whatsapp_number)
    }else{
      this.props.navigation.navigate(route);
    }
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={{ flex: 1 }} >
            <Button transparent onPress={this.handleBackButtonClick}>
              <Icon style={styles.icon} name='arrow-back' />
            </Button>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Order Details</Title>
          </Body>
          <Right />
        </Header>
        <Content>
            <View style={{ marginTop:10 }} />
            <StepIndicator
                 customStyles={customStyles}
                 currentPosition={this.state.currentPosition}
                 labels={labels}
            />
            <Row style={styles.row}>
                <Left>
                  <Text style={styles.order_id}>Order Id - {this.state.data.order_id}</Text>
                </Left>
                <Right>
                  <Text style={styles.created_at}>{Moment(this.state.data.created_at).format('DD MMM-YYYY hh:mm A')}</Text>
                </Right>
            </Row>
            <Row style={styles.row}>
              <Left>
                <Text style={styles.address_label}>Delivery Address</Text>
                <Text style={styles.address}>{this.state.data.address}</Text>
              </Left>
            </Row>
            <Row style={styles.row}>
              <Left>
                <Text style={styles.delivery_date_label}>Delivery Date</Text>
                <Text style={styles.delivery_date}>{Moment(this.state.data.expected_delivery_date).format('DD MMM-YYYY')}</Text>
              </Left>
            </Row>
            <Row style={styles.row}>
              <Left>
                <Text style={styles.delivery_date_label}>Payment Informations for this order</Text>
                <Text style={styles.delivery_date}>Wallet : {global.currency}{this.state.data.wallet_amount}</Text>
                <Text style={styles.delivery_date}>Cash : {global.currency}{this.state.data.cash}</Text>
                <Text style={styles.delivery_date}>Online : {global.currency}{this.state.data.online}</Text>
              </Left>
            </Row>
            <View style={{ marginTop:10 }} />
            <Divider style={styles.order_divider} />
            <Row style={styles.row}>
              <Left>
                <Text style={styles.your_cloths}>Order Details</Text>
              </Left>
            </Row>
            <List>
              {JSON.parse(this.state.data.items).map((row, index) => (
                <ListItem>
                  <Row>
                    <Col style={{ width:40 }} >
                      <Text style={styles.qty} >{row.qty}x</Text>
                    </Col>
                    <Col>
                      <Text>{row.product_name}</Text>
                    </Col>
                    <Col style={{ width:50 }} >
                      <Text>{global.currency}{row.price}</Text>
                    </Col>
                  </Row>
                </ListItem>
              ))}
            </List>
            <Row style={styles.row} >
              <Col>
                <Text>Subtotal</Text>
              </Col>
              <Col style={{ width:50 }} >
                <Text style={{ fontWeight:'bold' }} >{global.currency}{this.state.data.sub_total}</Text>
              </Col>
            </Row>
            <Row style={styles.row} >
              <Col>
                <Text>Shipping Cost</Text>
              </Col>
              <Col style={{ width:50 }} >
                <Text style={{ fontWeight:'bold' }} >{global.currency}{global.shipping_cost}</Text>
              </Col>
            </Row>
            <Row style={styles.row} >
              <Col>
                <Text>Discount</Text>
              </Col>
              <Col style={{ width:50 }} >
                <Text style={{ fontWeight:'bold' }} >{global.currency}{this.state.data.discount}</Text>
              </Col>
            </Row>
            <View style={{ marginBottom:20 }} />
            <Divider style={styles.order_divider} />
            <Row style={styles.row} >
              <Col>
                <Text style={styles.total_label}>Total</Text>
              </Col>
              <Col style={{ width:50 }} >
                <Text style={styles.total} >{global.currency}{this.state.data.total}</Text>
              </Col>
            </Row>
            <Row style={styles.row}>
              <Left>
                <Text style={styles.your_cloths}>Any complaints above order</Text>
              </Left>
            </Row>
            <View style={{ padding:10 }}>
              <Btn
                 icon={
                  <Icon
                    name="call"
                    style={{ color:colors.theme_fg_three, marginRight:10 }}
                  />
                }
                title="Call us"
                onPress={() => this.navigate('Call')}
                buttonStyle={{ backgroundColor:colors.theme_bg }}
              />
            </View>
            <View style={{ padding:10 }}>
              <Btn
                 icon={
                  <Icon
                    name="logo-whatsapp"
                    style={{ color:colors.theme_fg_three, marginRight:10 }}
                  />
                }
                title="Message us"
                onPress={() => this.navigate('Whatsapp')}
                buttonStyle={{ backgroundColor:colors.theme_bg }}
              />
            </View>
          </Content>
      </Container>
    );
  }
}

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
  order_id:{
    marginTop:10, 
    fontSize:15, 
    color:colors.theme_fg_two, 
    fontWeight:'bold'
  },
  created_at:{
    marginTop:5, 
    fontSize:12
  },
  status:{
    marginTop:10, 
    fontSize:13, 
    color:colors.theme_fg, 
    fontWeight:'bold'
  },
  order_divider:{
    backgroundColor: colors.theme_fg_two, 
    width:'90%', 
    alignSelf:'center'
  },
  row:{
    marginLeft:20, 
    marginRight:20, 
    marginTop:10
  },
  address_label:{
    marginTop:10, 
    fontSize:13, 
    color:colors.theme_fg_two, 
    fontWeight:'bold'
  },
  address:{
    marginTop:5, 
    fontSize:13
  },
  delivery_date_label:{
    marginTop:10, 
    fontSize:13, 
    color:colors.theme_fg_two,
    fontWeight:'bold'
  },
  delivery_date:{
    marginTop:5, 
    fontSize:13
  },
  your_cloths:{
    marginTop:10, 
    fontSize:13, 
    color:colors.theme_fg_two, 
    fontWeight:'bold'
  },
  qty:{
    fontSize:15, 
    color:colors.theme_fg, 
    fontWeight:'bold'
  },
  total_label:{
    fontWeight:'bold', 
    color:colors.theme_fg_two
  },
  total:{
    fontWeight:'bold', 
    color:colors.theme_fg_two
  }
});
