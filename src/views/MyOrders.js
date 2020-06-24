import React, {Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Title, Col } from 'native-base';
import { api_url, my_orders, height_30, no_data, washing_machine } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { Loader } from '../components/GeneralComponents';
import Moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/MyOrdersActions';
import ProgressCircle from 'react-native-progress-circle';

class MyOrders extends Component<Props> {

  constructor(props) {
      super(props)
  }

  async componentDidFocus(){
    this.my_orders();
  }
  
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  async componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
  }

  myorders_details = (data) => {
    if(data.status == 5){
      this.props.navigation.navigate('OrderDetails',{ data : data, position:data.status });
    }else{
      this.props.navigation.navigate('OrderDetails',{ data : data, position: parseInt(data.status) - 1 });
    }
    
  }

  my_orders = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'post', 
      url: api_url + my_orders,
      data: { customer_id : global.id }
    })
    .then(async response => {
        await this.props.serviceActionSuccess(response.data)
    })
    .catch(error => {
        this.props.serviceActionError(error);
    });
  }


  render() {
    Moment.locale('en');
    const { isLoding, error, data, message, status } = this.props

    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={{ flex: 1 }} />
          <Body style={styles.header_body} >
            <Title style={styles.title} >My Orders</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Loader visible={isLoding} />
          <List>
            {data.map((row, index) => (
              <ListItem onPress={() => this.myorders_details(row)} >
                <Col style={{ width:'30%' }}>
                  <ProgressCircle
                    percent={row.status * 20}
                    radius={30}
                    borderWidth={3}
                    color="#115e7a"
                    shadowColor="#e6e6e6"
                    bgColor="#FFFFFF"
                  >
                    <View style={{ height:30, width:30 }} >
                      <Image
                        style= {{flex:1 , width: undefined, height: undefined}}
                        source={washing_machine}
                      />
                    </View>
                  </ProgressCircle>
                </Col>
                 <Col style={{ width:'50%' }} >
                  <Text style={styles.order_id}>Order Id : {row.order_id}</Text>
                  <View style={{ margin:1}} />
                  <Text style={{ fontSize:10}} >{Moment(row.created_at).format('DD MMM-YYYY hh:mm')}</Text>
                  <Text style={{ color:colors.theme_fg }} >{row.label_name}</Text>
                </Col>
                <Col>
                  <Text style={styles.total} >{global.currency}{row.total}</Text>
                </Col>
              </ListItem>
            ))}
          </List>
          {data.length == 0 ? <Body style={{ marginTop:height_30 }} >
            <Text>{no_data}</Text>
          </Body> : null }
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.myorders.isLoding,
    error : state.myorders.error,
    data : state.myorders.data,
    message : state.myorders.message,
    status : state.myorders.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(MyOrders);

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
    fontSize:15, 
    fontWeight:'bold', 
    color:colors.theme_fg_two
  },
  total:{
    fontSize:15, 
    fontWeight:'bold', 
    color:colors.theme_fg_two
  }
});
