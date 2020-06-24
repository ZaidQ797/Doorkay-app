import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Image, Keyboard, PermissionsAndroid } from 'react-native';
import { Container, Header, Content, Left, Body, Right, Title, Icon, Footer } from 'native-base';
import { Button } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { height_50, GOOGLE_KEY, LATITUDE_DELTA, LONGITUDE_DELTA, api_url, address, pin, get_distance } from '../config/Constants';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import { connect } from 'react-redux';
import { Loader, Divider } from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import AsyncStorage from '@react-native-community/async-storage';

class Location extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        mapRegion:null,
        open_map:0,
        isLoding:false,
        current_lat:0,
        current_lng:0,
        lat:0,
        lng:0,
        address:global.address
      }
  }

  async componentDidFocus(){
    await this.locationSet();
  }

  async componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
    ];
    if(Platform.OS === "ios"){
       await this.findType();
    }else{
       await this.requestCameraPermission();
    }
  }

  async locationSet() {
    if(this.props.new_location == undefined){
      let location = await global.location.split(",");
      this.setState({ open_map:1, lat:parseFloat(location[0]), lng:parseFloat(location[1]) })
    }else{
      let location = await this.props.new_location.split(",");
      this.setState({ open_map:1, lat:parseFloat(location[0]), lng:parseFloat(location[1]) })
    }
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  async requestCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'Doorkay needs to Access your location for tracking'
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await this.findType();
        } else {
            this.requestCameraPermission();
        }
    } catch (err) {
        alert('Something went wrong');
    }
  }

  async findType(){
    await this.getInitialLocation();
  }

  detectMyLocation(){
    this.setState({ lat:this.state.current_lat, lng:this.state.current_lng, open_map:1 })
  }

  async getInitialLocation(){

    await navigator.geolocation.getCurrentPosition( async(position) => {
         this.setState({ current_lat: position.coords.latitude, current_lng: position.coords.longitude });
    }, error => alert('Sorry something went wrong') , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  onRegionChange = async(value) => {
    var self = this;
    this.setState({ address : 'Please wait...' });
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
        .then((response) => response.json())
        .then(async(responseJson) => {
           if(responseJson.results[0].formatted_address != undefined){
              this.setState({ address : responseJson.results[0].formatted_address, latitude: value.latitude, longitude: value.longitude });
           }else{
              this.setState({ address : 'Sorry something went wrong' });
           }
    }) 
    await self.setState({
      lat: value.latitude,
      lng: value.longitude
    });
    
  }

  location_search = async (data) => {
    await this.props.navigation.navigate('LocationSearch');
  }

  check_area = async () => {
    await axios({
      method: 'post', 
      url: api_url + get_distance,
      data : { customer_id: global.id, location:this.state.lat+','+this.state.lng,address: this.state.address }
    })
    .then(async response => {
      if(response.data.access_area == 1){
        try {
          await AsyncStorage.setItem('location', this.state.lat+','+this.state.lng);
          await AsyncStorage.setItem('address', this.state.address);
          global.location = await this.state.lat+','+this.state.lng;
          global.address = await this.state.address;
          this.props.navigation.goBack(null);
        } catch (e) {

        }
      }else{
        alert('Sorry, for this location our service was not available.');
      }   
    })
    .catch(error => {
     
    });
  }

  render() {

     
    
    return (
      <Container keyboardShouldPersistTaps='always' style={{ backgroundColor: colors.theme_bg_three }} > 
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={{ flex: 1 }} >
            <Icon onPress={this.handleBackButtonClick} style={styles.icon} name='arrow-back' />
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >SELECT LOCATION</Title>
          </Body>
          <Right />
        </Header>
        
        {this.state.open_map == 1 && <Content keyboardShouldPersistTaps='always'>
          <View style={styles.content} >
           <MapView
               provider={PROVIDER_GOOGLE} 
               style={styles.map}
               region={{
                latitude:this.state.lat,
                longitude:this.state.lng,
                latitudeDelta:  LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA }}
               onRegionChangeComplete={this.onRegionChange}
            >
            </MapView>
            <View style={styles.location_markers}>
              <View style={styles.pin} >
                <Image
                  style= {{flex:1 , width: undefined, height: undefined}}
                  source={pin}
                />
              </View>
            </View>
          </View>
          <View style={styles.address_content} >
            <View style={{ flexDirection:'row' }} >
              <Left>
                <Text onPress={this.detectMyLocation.bind(this)} style={styles.landmark_label} ><Icon style={{ fontSize:18, color:colors.theme_fg_two, marginRight:10 }} name='locate' /> Detect my location</Text>
              </Left>
            </View> 
            <View style={{ marginTop:10 }} />
            <Divider />
            <View style={{ marginTop:10 }} />
            <View style={{ flexDirection:'row' }} >
              <Left>
                <Text onPress={() => this.location_search()} style={styles.address_label} >Address <Icon style={{ fontSize:14, color:colors.theme_fg_two, marginLeft:20 }} name='create' /></Text>
              </Left>
            </View> 
            <View style={{ flexDirection:'row' }} >
              <Left>
                <Text style={styles.address_text} >
                  {this.state.address}
                </Text>
              </Left>
            </View>
          </View>
        </Content>}
        {this.state.open_map == 1 && <Footer style={styles.footer} >
          <View style={styles.footer_content}>
            <Button
              title="DONE"
              onPress={ this.check_area}
              buttonStyle={styles.done}
            />
          </View>
        </Footer>}
        <Loader visible={this.state.isLoding} />
      </Container>

    );
  }
}

function mapStateToProps(state){
  return{
    new_location : state.location_search.new_location
  };
}

export default connect(mapStateToProps,null)(Location);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
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
  map: {
    width:'100%',
    height:height_50
  },
  location_markers: {
    position: 'absolute',
  },
  content: {
    alignItems:'center', 
    justifyContent:'center'
  },
  pin:{
    height:30, 
    width:25, 
    top:-15 
  },
  address_content:{
    width:'100%', 
    padding:20, 
    backgroundColor:colors.theme_bg_three, 
    marginBottom:10 
  },
  landmark_label:{
    fontSize:15, 
    fontWeight:'bold', 
    color:colors.theme_fg_two 
  },
  landmark_content:{
    width:'100%', 
    marginTop:5 
  },
  landmark_text:{
    borderColor: colors.theme_fg, 
    borderBottomWidth: 1, 
    padding:10, 
    borderRadius:5, 
    height:40 
  },
  address_label:{
    fontSize:15, 
    fontWeight:'bold', 
    color:colors.theme_fg_two
  },
  address_text:{
    fontSize:15, 
    marginTop:5 
  },
  footer:{
    backgroundColor:colors.theme_bg_three
  },
  footer_content:{
    width:'90%', 
    justifyContent:'center'
  },
  done:{
    backgroundColor:colors.theme_bg
  }
});

