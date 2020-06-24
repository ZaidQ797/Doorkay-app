import React, {Component} from 'react';
import { StyleSheet, Text, View, FlatList, Linking } from 'react-native';
import { Container, Header, Title, Content, Left, Body, Right, Icon, List, ListItem, Button, Col, Image } from 'native-base';
import * as colors from '../assets/css/Colors';
import { Divider } from '../components/GeneralComponents';
import { menus, greeting } from '../config/Constants';
import Dialog from "react-native-dialog";
import { Button as Btn} from 'react-native-elements';
import { NavigationActions, StackActions } from 'react-navigation';

export default class More extends Component<Props> {

  constructor(props) {
      super(props)
      this.state = {
        dialogVisible:false
      }
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

  showDialog = () => {
    this.setState({ dialogVisible: true });
  }

  closeDialog = () => {
    this.setState({ dialogVisible: false });
  }

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  }
 
  handleLogout = async() => {
    await this.closeDialog();
    await this.props.navigation.navigate('Logout');
  }

  profile = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: 'Profile'
    });
    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return (
      <Container style={styles.container} >
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={styles.header_body} >
            <Title style={styles.title} >{global.customer_name}</Title>
            <Text style={styles.contact} >{global.phone_number} | {global.email}</Text>
          </Left>
          <Right>
            <Icon onPress={() => this.profile()} style={styles.edit} name='create' />
          </Right>
        </Header>
        <Content style={styles.content} >
        <Divider />
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Description>
            Do you want to logout?.
          </Dialog.Description>
          <Dialog.Button label="Yes" onPress={this.handleLogout} />
          <Dialog.Button label="No" onPress={this.handleCancel} />
        </Dialog.Container>
        <List>
          <FlatList
            data={menus}
            renderItem={({ item,index }) => (
              <ListItem icon onPress={() => this.navigate(item.route)}>
                <Left>
                  <Icon active name={item.icon} />
                </Left>
                <Body>
                  <Text style={styles.menu_name} >{item.menu_name}</Text>
                </Body>
                <Right>
                  <Icon style={styles.icon} name="ios-arrow-forward" />
                </Right>
              </ListItem>
            )}
            keyExtractor={item => item.menu_name}
          />
        </List>
          <View style={{ padding:10 }} />
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
  container:{
    backgroundColor: colors.theme_bg_two
  },
  header:{
    backgroundColor:colors.theme_bg_three, 
    padding:20
  },
  profile_name: {
    fontSize:16, 
    color:colors.theme_fg_two, 
    fontWeight:'bold'
  },
  content:{
    backgroundColor:colors.theme_bg_three
  },
  icon_button:{
    backgroundColor: colors.theme_bg
  },
  menu_name:{
    fontSize:16, 
    color:colors.theme_fg_two
  },
   header:{
    backgroundColor:colors.theme_bg_three
  },
  icon:{
    color:colors.theme_fg_two
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
    marginLeft:5
  },
  title:{
    color:colors.theme_fg_two,
    fontSize:14, 
    fontWeight:'bold',
    marginLeft:1
  },
  contact:{
    fontSize:12
  },
  edit:{
    color:colors.theme_fg_two,
    marginRight:5
  },
  profile_image:{
    width: 46,
    height: 46,
    borderRadius: 23,
    borderColor: colors.theme_bg_three,
    borderWidth: 1
  },
});

