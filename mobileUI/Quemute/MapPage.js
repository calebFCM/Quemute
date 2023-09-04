'use strict';

import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import { regionFrom, getLatLonDiffInMeters } from './app/lib/location'

type Props = {};
const google_api_key = 'AIzaSyBJCKet5GBjRl37I15QMBGrAP1qGV-s0v8';
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;

/*const default_region = {
	latitude: -26.202227,
  	longitude: 28.043663,
  	latitudeDelta: 0.0922,
  	longitudeDelta: latitudeDelta * ASPECT_RATIO
};*/
const LATITUDE = -26.202227;
const LONGITUDE = 28.043663;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



export default class Map extends React.Component{
	static navigationOptions = ({navigation}) => ({
    	headerTitle: 'Map',
    	headerStyle: {
      		backgroundColor: '#971C1F'
    	},
    	headerTitleStyle: {
      		color: '#FFF'
    	}
  	});

  	state = {
  		region: {
			latitude: LATITUDE,
  			longitude: LONGITUDE,
  			latitudeDelta: LATITUDE_DELTA,
  			longitudeDelta: LONGITUDE_DELTA
		},
		marker: null
  	}

  	getMapRegion = (lat, lon) => {
  		return {
  			latitude: lat,
  			longitude: lon,
  			latitudeDelta: LATITUDE_DELTA,
  			longitudeDelta: LONGITUDE_DELTA
  		}
  	}

  	onMapClick = (event, mode) => {
  		this.setState({
  			marker: event.nativeEvent.coordinate
  		});

  		this.props.navigation.navigate('Home', {
        	mode: mode,
        	mapClicked: true,
        	coordinates: event.nativeEvent.coordinate
        });
  	}

  	componentDidMount(){
		
		//requestLocationPermission();
		Geolocation.getCurrentPosition(
            (position) => {
                var region = this.getMapRegion(position.coords.latitude, position.coords.longitude);
        		this.setState({
        			region: region
        		})
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true }
        );
	}

  	render() {
  		const { navigation } = this.props;
  		const mode = navigation.getParam("mode");
  		return (
  			<View style={styles.container}>
  				<MapView
          			style={styles.map}
          			region={this.state.region}
          			zoomEnabled={true}
          			zoomControlEnabled={true}
          			onPress = {(event) => {
          				this.onMapClick(event, mode);
          			}}
        		>
        			{
        				this.state.marker &&
      					<Marker coordinate={this.state.marker} />
        			}
        			
        		
        		</MapView>
  			</View>
  		);
  	}
}

const styles = StyleSheet.create({
	container: {
    	position: 'absolute',
    	top: 0,
    	left: 0,
    	right: 0,
    	bottom: 0,
    	justifyContent: 'flex-end',
    	alignItems: 'center',
  	},
	map: {
    	position: 'absolute',
    	top: 0,
    	left: 0,
    	right: 0,
    	bottom: 0,
  	},
})