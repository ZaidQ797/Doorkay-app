import React, {Component} from 'react';
import { StyleSheet, Text, FlatList } from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Title, Button, Icon } from 'native-base';
import { api_url, faq } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { Loader } from '../components/GeneralComponents';
import { fb } from '../config/firebaseConfig';
import axios from 'axios';
import { connect } from 'react-redux'; 
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/FaqActions';

export default class Notification extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        notification : '',
        isLoding:true
      }
     
  }

  componentDidMount() {  
    var notifications = [];  
    fb.ref('/notifications').on('value', snapshot => {
      snapshot.forEach((child) => {
        notifications.push(child.val());
        this.setState({ notification : notifications});
      });
      this.setState({ isLoding : false});
    });
  }
  
  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  
  render() {

    const { isLoding, error, data, message, status } = this.props

    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <Left style={{ flex: 1 }} >
            <Button onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </Button>
          </Left>
          <Body style={styles.header_body} >
            <Title style={styles.title} >Notifications</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <List>
            <FlatList
              data={this.state.notification}
              renderItem={({ item,index }) => (
                <ListItem >
                  <Left>
                    <Text style={styles.notification_title} >{item.message}</Text>
                  </Left>
                </ListItem>
              )}
              keyExtractor={item => item.question}
            />
          </List>
        </Content>
        <Loader visible={this.state.isLoding} />
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
  notification_title:{
    color:colors.theme_fg_two,
    fontSize:15
  },
  notification_description:{
    color:colors.theme_fg_two,
    fontSize:12
  }
});
