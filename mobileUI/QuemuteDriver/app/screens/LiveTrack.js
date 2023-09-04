'use strict';

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, TouchableOpacity, Text, StatusBar, TextInput, Image,
Header, Dimensions, PermissionsAndroid, YellowBox} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import SocketIOClient from 'socket.io-client/dist/socket.io';
import MapView, { Marker, Callout } from 'react-native-maps';

console.ignoredYellowBox = ['Unrecognized WebSocket connection option(s) `agent`,`perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'];

const google_api_key = 'AIzaSyBJCKet5GBjRl37I15QMBGrAP1qGV-s0v8';
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = -26.202227;
const LONGITUDE = 28.043663;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 5000,
    transports: ['websocket']/// you need to explicitly tell it to use websockets
};

async function requestLocationPermission(){
	try {
    	const granted = await PermissionsAndroid.request(
      		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      		{
        		'title': 'Example App',
        		'message': 'Example App access to your location '
      		}
    	)
   		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      		console.log("You can use the location")
      		//alert("You can use the location");
    	} else {
      		console.log("location permission denied")
      		alert("Location permission denied");
      		return;
    	}
  	} catch (err) {
    	console.warn(err);
    	return;
  	}
}

export default class LiveTrack extends React.Component{
	constructor(props){
		super(props)

		/*this.socket = SocketIOClient('http://192.168.8.177:3000', connectionConfig);
		this.socket.on("joinroute", (users) => this.createMarkers(users));
		this.socket.connect();
		this.getUsersInRoute();
		this.user = this.props.navigation.getParam('user');
		this.navigation = this.props.navigation.getParam('route_name');
		console.log(this.user + " " + this.user);*/
	}

	state = {
  		region: {
			latitude: LATITUDE,
  			longitude: LONGITUDE,
  			latitudeDelta: LATITUDE_DELTA,
  			longitudeDelta: LONGITUDE_DELTA
		},
		user: null,
		route_name: null,
		markers: null
	}

	static navigationOptions = {
		headerShown: false
	}

	getUsersInRoute(){
		this.socket.emit('joinroute', this.state.user, this.state.routeName);
	}

	joinRoute = (users) => {
		//console.log(users);
		var markers = []
		for(var index in users){
			var userType = users[index].user_type;
			var position = users[index].position;
			console.log(userType);
			if(userType === "DRIVER"){
				console.log(position);
				//markers[] = {coordinates: position, pinColor: "#008ECC", title: "Driver"};
				markers.push({coordinates: position, pinColor: "#008ECC", title: "Driver"});
			}else if(userType === "COMMUTER"){
				//markers[] = {coordinates: users[index].position, pinColor: "#971C1F", title: "Commuter"}
				markers.push({coordinates: position, pinColor: "#971C1F", title: "Commuter"});
			}
		}
		//console.log(markers);
		this.setState({
			markers: markers,
		})
	}

	userJoined = (user) => {
		console.log(user);
		var userType = user.user_type;
		var position = user.position;
		console.log(userType);
		var markers = this.state.markers;
		console.log(markers);
		if(userType == "DRIVER"){
			console.log("something I like");
			markers.push({coordinates: position, pinColor: "#008ECC", title: "Driver"});
		}else if(userType == "COMMUTER"){
			console.log("what goes mate");
			markers.push({coordinates: position, pinColor: "#971C1F", title: "Commuter"});
		}
		console.log(markers);

		this.setState({markers: markers});
	}

	setMapRegion = (lat, lon) => {
        this.setState({
            region: {
                latitude: lat,
                longitude: lon,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
        })   
    }

	componentDidMount(){
		//open socket connection to server.
		//this.socket = SocketIOClient('http://192.168.8.177:3000', connectionConfig);
		requestLocationPermission();
    	this.state.user = this.props.navigation.getParam('user');
		this.state.routeName = this.props.navigation.getParam('route_name');
		Geolocation.getCurrentPosition(
            (position) => {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                this.setMapRegion(latitude, longitude);
                this.state.user.position = {latitude: latitude, longitude: longitude}
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true }
        );

        /*this.watchID = Geolocation.watchPosition(
        	(position) => {
        		var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
        		this.state.user.position = {latitude: latitude, longitude: longitude}
        	},
        	(error) => {
        		console.log(error.code, error.message);
        	},
        	{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true }
        )*/
        this.socket = SocketIOClient('http://192.168.8.177:3000', connectionConfig);
		this.socket.on("joinroute", (users) => this.joinRoute(users));
		this.socket.on("userjoined", (user) => this.userJoined(user))
		this.socket.connect();
		this.getUsersInRoute();
	}


	render() {
		return(
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
        			{this.state.markers && this.state.markers.map(marker => (
    					<MapView.Marker 
      						coordinate={marker.coordinates}
      						title={marker.title}
      						pinColor={marker.pinColor}
    					/>
  					))}
        		</MapView>
  			</View>
		)
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