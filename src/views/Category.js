import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, ImageBackground, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { img_url } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Title, Button, Icon, CardItem, Card } from 'native-base';
import axios from 'axios';
import { connect } from 'react-redux';
import GridView from 'react-native-gridview';
import HTML from 'react-native-render-html';

class Category extends Component<Props>{

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        data:this.props.navigation.getParam('data'),
        key:this.props.navigation.getParam('key')
      }
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  product = async (data) => {
    await this.props.navigation.navigate('Product',{ data:data });
  }

  render() {
    
    const { data } = this.state

    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={{ flex: 1 }} >
            <Button onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Button>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title}>{data.service_name}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={{ width:'100%', height:150}} >
            <Image
              style= {{flex:1 , width: undefined, height: undefined}}
              source={{uri : img_url + data.banner_image }}
            />
          </View>
          <View style={{ padding:10 }} >
          <Text style={styles.heading} >Categories</Text>
          <View style={{ padding:10 }} />
          <FlatList data={data.category} 
            renderItem={({item, index}) =>
           <View style={{ width:'33%', padding:10 }}>
            <TouchableOpacity style={{ alignItems:'center' }} activeOpacity={1} onPress={() => this.product(item)} >
            <Image  style={{width: '100%', height: 70, borderRadius:5 }} source={{uri : img_url + item.image }} />
            <Text style={{color:colors.theme_fg_two,fontSize:10, marginTop:5}} >{item.category_name}</Text>
            </TouchableOpacity>
           </View>
          }
             numColumns={3} 
          />
          <View style={{ padding:10 }} />
          <Text style={styles.heading} >Why Choose Us?</Text>
          <View style={{ padding:10 }} />
          <HTML html={data.choose_us} imagesMaxWidth={Dimensions.get('window').width} />
          <View style={{ padding:10 }} />
          </View>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state){
  return{
    data : state.home.data,
  };
}


export default connect(mapStateToProps,null)(Category);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.theme_fg_three
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg_three,
    alignSelf:'center', 
    fontSize:16, 
    fontWeight:'bold'
  },
  heading:{
    fontSize:18, 
    fontWeight:'bold', 
    color:colors.theme_fg_two
  },
});
