import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, ImageBackground, TouchableOpacity, Image, FlatList, Modal, TouchableHighlight, Alert } from 'react-native';
import { StatusBar, Loader } from '../components/GeneralComponents';
import { img_url, api_url, service, logo, get_distance, denied } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Title, Button, Icon, CardItem, Card, Col, Row } from 'native-base';
import axios from 'axios';
import { connect } from 'react-redux';
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/HomeActions';
import { productListReset } from '../actions/ProductActions';
import Slideshow from 'react-native-image-slider-show';
import GridView from 'react-native-gridview';
import { Button as Btn } from 'react-native-elements';
class Home extends Component<Props>{

  constructor(props) {
      super(props)
      
      this.state = {
        position: 1,
        interval: null, 
        dataSource:[],
        access_area:1,
        modalVisible:false
      }; 
      
  }

  async componentDidFocus(){
    await this.get_distance();
  }

  async componentDidMount() {
    if(global.banner_option == 1){
      this.setState({ modalVisible:true });
    }
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentWillMount() {
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
        });
      }, 3000)
    });
  }
 
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  product = async (data) => {
    await this.props.navigation.navigate('Product',{ data:data });
  }

  category = async (data,key) => {
    await this.props.navigation.navigate('Category',{ data:data, key:key });
  }

  change_location = async () =>{
    await this.props.navigation.navigate('Location');
  }

  Service = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'get', 
      url: api_url + service
    })
    .then(async response => {
        await this.props.serviceActionSuccess(response.data)
        await this.setState({ dataSource: this.props.home_sliders })
    })
    .catch(error => {
        this.props.serviceActionError(error);
    });
  }

  get_distance = async () => {
    await axios({
      method: 'post', 
      url: api_url + get_distance,
      data:{ customer_id : global.id, location : global.location, address:global.address }
    })
    .then(async response => {
        if(response.data.access_area == 1){
          this.Service();
          this.setState({ access_area : 1 })
        }else{
          this.setState({ access_area : 0 })
        }
    })
    .catch(error => {
        //alert('Something went wrong');
        alert(JSON.stringify(error));
    });
  }

  render() {
    
    const { isLoding, error, data, home_sliders, offer_sliders, message, status } = this.props

    const service_list = data.map((row) => {
      if(row.service_type == 1){
        return (
          <View>
            <View style={{ padding:10 }} />
            <Text style={styles.offers} >{row.service_name}</Text>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} >
            
              <FlatList data={row.category} 
                renderItem={({item}) =>
                <View style={{ width:200 }} >
                <TouchableOpacity activeOpacity={1} onPress={() => this.product(item)}>
                  <Card>
                    <CardItem cardBody>
                      <Image source={{uri : img_url + item.image }} style={{height: 100, width: 100, flex: 1}}/>
                    </CardItem>
                    <CardItem>
                      <Text style={{color:colors.theme_fg_two,fontSize:12}} >{item.category_name}</Text>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
                </View>
                }
                numColumns={3} 
              />
            
            </ScrollView>
          </View>
        )
      }
    })

    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Col style={{ width:'80%' }} >
            <Text style={{ fontSize:10, color:colors.theme_fg_three }} >Your Location</Text>
            <Text onPress={() => this.change_location()}  numberOfLines={1} style={{ fontSize:14, color:colors.theme_fg_three, fontWeight:'bold' }} >{global.address}</Text>
          </Col>
          <Col>
            <Icon onPress={() => this.change_location()}  style={{ fontSize:18, color:colors.theme_fg_three, fontWeight:'bold', marginTop:15, marginLeft:5 }} name='ios-arrow-down' />
          </Col>
        </Header>
        <Content>
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <View>
                <View style={{ alignItems:'flex-end', padding:5 }} >
                  <TouchableHighlight
                      onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}>
                      <Icon style={{ color:'#FFFFFF' }} name='close-circle-outline' />
                  </TouchableHighlight>
                </View>
                <View style={styles.model_image}>
                  <Image style= {{flex:1 , width: undefined, height: undefined}} source={{uri : img_url + global.banner_image }} />
                </View>
              </View>
            </Modal>
          </View>
          { this.state.access_area === 1 &&
          <Slideshow 
            dataSource={home_sliders}
            position={this.state.position}
            onPositionChanged={position => this.setState({ position })} 
            arrowSize={0}
            height={150}
          /> }
          { this.state.access_area === 1 ?
          <View style={{ padding:10 }} >
            <View style={{ padding:10 }} />
            <Text style={styles.offers} >Our Services</Text>
            <FlatList data={data} 
              renderItem={({item, index}) =>
             <View style={{ width:'33%', padding:10 }}>
              <TouchableOpacity style={{ alignItems:'center' }} activeOpacity={1} onPress={() => this.category(item, index)} >
              <Image  style={{width: 50, height: 50}} source={{uri : img_url + item.image }} />
              <Text style={{color:colors.theme_fg_two,fontSize:10,fontWeight:'bold'}} >{item.service_name}</Text>
              </TouchableOpacity>
             </View>
            }
               numColumns={3} 
            />
            <View style={{ padding:10 }} />
            <Text style={styles.offers} >Festive Offers</Text>
            <View>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} >
              {offer_sliders.map((row, index) => (
                  <View style={styles.offer_view} >
                    <Image style={{ width:250, height:130, padding:20 }}  source={{ uri : img_url + row.image }} />
                  </View>
              ))}
              </ScrollView>
            </View>
            <View style={{ padding:10 }} />
            {service_list}
          </View>
          : <View style={{ alignItems:'center', marginTop:'30%' }}>
              <Image  style={{width: 150, height: 150}} source={denied} />
              <Text style={{color:colors.theme_fg_two,fontSize:15,fontWeight:'bold', margin:15 }} >Sorry, for this location our service was not available.</Text>
              <Btn
                title="Change My Location"
                type="outline"
                onPress={() => this.change_location()}
              />
            </View>
          }
        </Content>
        <Loader visible={false} />
      </Container>
    )
  }
}

function mapStateToProps(state){
  return{
    isLoding : state.home.isLoding,
    error : state.home.error,
    data : state.home.data,
    home_sliders : state.home.home_sliders,
    offer_sliders : state.home.offer_sliders,
    message : state.home.message,
    status : state.home.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
    productListReset: () => dispatch(productListReset())
});


export default connect(mapStateToProps,mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
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
  offers:{
    fontSize:18, 
    fontWeight:'bold', 
    color:colors.theme_fg_two
  },
  offer_view:{
    height:150, 
    width:210
  },
  model_image:{
    height:'100%', 
    width:'100%'
  }
});
