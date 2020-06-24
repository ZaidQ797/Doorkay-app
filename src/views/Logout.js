import React, {Component} from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { loading } from '../config/Constants';
export default class Logout extends Component<Props> {

  static navigationOptions = {
    header:null
  }
  
  componentWillMount(){
    AsyncStorage.clear();
    this.resetMenu();
  }


  resetMenu() {
   this.props
     .navigation
     .dispatch(StackActions.reset({
       index: 0,
       actions: [
         NavigationActions.navigate({
           routeName: 'Login'
         }),
       ],
     }))
  }

  render () {
    return (
      <View style={styles.container} >
        <View style={{ height:122, width:122 }} >
          <Image
            style= {{flex:1 , width: undefined, height: undefined}}
            source={loading}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FFFFFF'
  }
});
