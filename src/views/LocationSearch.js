import React, {Component} from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Header, Content, Card, CardItem, Left, Body, Right, Title, Button, Icon } from 'native-base';
import { GOOGLE_KEY } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { updateLocation } from '../actions/LocationSearchActions';
import { connect } from 'react-redux';

class LocationSearch extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        address:''
      }
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  selectLocation(data,details){
    this.props.updateLocation(details.geometry.location.lat+','+details.geometry.location.lng);
    this.props.navigation.goBack();
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
            <Title style={styles.title} >Search Your Location</Title>
          </Body>
          <Right />
        </Header>
        <Content>
            <GooglePlacesAutocomplete
              placeholder='Search'
              minLength={2} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed='auto'    // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                this.selectLocation(data, details);
              }}
              
              getDefaultValue={() => ''}
              
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: GOOGLE_KEY,
                language: 'en', // language of the results
              }}

              styles={{
                textInputContainer: {
                  width: '100%',
                  backgroundColor: colors.theme_fg_four,
                },
                textInput: {
                  borderColor:colors.theme_fg,
                  borderRadius:5,
                  color: colors.theme_fg_four,
                },
                description: {
                  fontWeight: 'bold'
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                }

              }}

              currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
              currentLocationLabel="Current location"
              nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }}
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: 'distance',
                types: 'food'
              }}
         
              filterReverseGeocodingByTypes={['locality', 'neighborhood','postal_code','colloquial_area','administrative_area_level_3','administrative_area_level_4','administrative_area_level_5']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
             
              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.


            />
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
    updateLocation: (data) => dispatch(updateLocation(data))
});


export default connect(null,mapDispatchToProps)(LocationSearch);

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
});
