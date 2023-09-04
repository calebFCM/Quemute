'use strict';

import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, TouchableOpacity, StatusBar, ScrollView, Alert, SafeAreaView, Dimensions,
	Keyboard, BackHandler} from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, Callout } from 'react-native-maps';


const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 5000,
    transports: ['websocket']/// you need to explicitly tell it to use websockets
};

const { width, height } = Dimensions.get("window");
const mapContHeight = height - 80;
const ASPECT_RATIO = width / mapContHeight;
const google_api_key = 'AIzaSyBJCKet5GBjRl37I15QMBGrAP1qGV-s0v8';

export default class LivetrackMonitor extends React.Component{

	static navigationOptions = {
		headerShown: false,
	}

	state = {
		position: {lat: 0.0, lng: 0.0},
		current_route: "",
		user: {
			email: "reavaya@quemute.com", user_type: "DRIVER", transport_type: "TAXI", is_nearstop: true
		},
		commuters: 0,
		buses: 0,
		routeInfo: null,
		routesLisst: null,
		joined_route: false,
		positionWatcher: null,
		started: true,
		paused: false,
		current_route_index: null,
		checkpoint: 0.01,
		routeMarkers: [],
		positionMarkers: [],
		userPositionMarker: [],
		mapRegion: null,
	}

	/*constructor(props){
		super(props);
		Geolocation.getCurrentPosition(
            (position) => {
            	var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                this.state.position = {latitude: latitude, longitude: longitude};
                this.state.user.position = {latitude: latitude, longitude: longitude};
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, showLocationDialog: true }
        );
	}*/

	componentDidMount() {
		this.socket = SocketIOClient('https://www.quemute.com:3000', connectionConfig);

		this.socket.on("joinroute", (users) => this.joinRoute(users));
		this.socket.on("userjoined", (user, socketId) => this.userJoined(user, socketId));
		this.socket.on("userleft", (socketId, userType) => this.userLeft(socketId, userType));

		this.state.routeInfo = this.props.navigation.getParam("route_info");

		var currentRouteIndex = this.props.navigation.getParam("route_index");
		
		var routeName = this.state.routeInfo['route_name'];
		var routesList = this.props.navigation.getParam("route_list");

		var stops = this.state.routeInfo['route'].coordinates;
		this.state.stops = stops;
		var markers = this.displayRoute(stops);

		Geolocation.getCurrentPosition(
            (position) => {
            	var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var position = {lat: latitude, lng: longitude};
                this.state.user.position = position;

                this.socket.emit("joinroute", this.state.user, routeName, this.state.current_route);

                this.setState({mapRegion: {latitude: latitude, longitude: longitude, latitudeDelta: 0.004757, longitudeDelta: 0.18 * ASPECT_RATIO},
                current_route: routeName, current_route_index: currentRouteIndex, position: position, routesList: routesList, routeMarkers: markers});     
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, showLocationDialog: true }
        );

		//this.socket.emit("joinroute", this.state.user, routeName, this.state.current_route);
		
		//this.setState({current_route: routeName, current_route_index: currentRouteIndex});
		this.state.positionWatcher = Geolocation.watchPosition((position) => {
			
			this.updateLocation(position);
		});

		this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.exitLivetrack);
	}

	updateLocation = (position) => {
		var distanceToEndpoint = this.checkStop(position);

		if(distanceToEndpoint < this.state.checkpoint){
			this.changeDirection();
			return;
		}

		var position = {lat: position.coords.latitude, lng: position.coords.longitude};
		this.socket.emit("updateuserlocation", this.state.user);
		this.setState({position: position});
	}

	checkStop = (position) => {
		var routesList = this.props.navigation.getParam("route_list");
		var route = routesList[this.state.current_route_index];
		var coordinates = route.sub_b_coords;
		var lat = coordinates[1];
		var lng = coordinates[0];
		var distance = this.distance(position.coords.latitude, position.coords.longitude, lat, lng);
		return distance;
	}

	changeDirection = () => {
		this.socket.emit("leaveroute", this.state.currentRoute, this.state.user); 
		Geolocation.clearWatch(this.state.positionWatcher);

		var routeName = "";
		var currentRouteName = this.state.current_route;
		var currentRouteIndex = null;
		var routeInfo = null;

		if(this.state.current_route_index === 0){
			currentRouteIndex = 1;
			routeInfo = this.state.routesList[currentRouteIndex];
			routeName = routeInfo.route_name;
		}else if(this.state.current_route_index === 1){
			currentRouteIndex = 0;
			routeInfo = this.state.routesList[currentRouteIndex];
			routeName = routeInfo.route_name;
		}

		this.setState({routeInfo: routeInfo, current_route_index, commuters: 0, buses: 0, current_route: routeName});

		this.socket.emit("joinroute", this.state.user, routeName, currentRouteName);
	}

	joinRoute = (users) => {

		for(var index in users){
			var user = users[index];
			var userType = user.user_type;

			if(userType == "COMMUTER"){
				this.state.commuters++;
			}else if(userType == "DRIVER"){
				this.state.buses++;
			}
		}

		this.setState({joined_route: true});
	}

	userJoined = (user, socketId) => {
		var userType = user.user_type;

		if(userType == "COMMUTER"){
			this.state.commuters++;
		}else if(userType == "DRIVER"){
			this.state.buses++;
		}

		this.setState({commuters: this.state.commuters, buses: this.state.buses});
	}

	userLeft = (userType, socketId) => {

		if(userType == "COMMUTER"){
			this.state.commuters--;
		}else if(userType == "DRIVER"){
			this.state.buses--;
		}

		this.setState({commuters: this.state.commuters, buses: this.state.buses});
	}

	exitLivetrack = () => {
		Geolocation.clearWatch(this.state.positionWatcher);
		this.socket.emit("leaveroute", this.state.currentRoute, this.state.user); 
		this.socket.emit("disconnect");
		this.props.navigation.navigate("BusLiveTrack");
		return true;
		//this.setState({routesView: true, mapView: false, positionMarkers: [], usersNearRouteStops: {}, commuters: 0, drivers: 0});
	}

	start = () => {
		this.setState({paused: false, started: true});
	}

	pause = () => {
		this.setState({paused: true, started: false});
	}

	displayRoute = (stops) => {
		var coordinatesObjects = this.setCoordinatesObjects(stops);
		var markers = [];
        markers = coordinatesObjects.map((coordArr) => 
            <Marker key={coordArr.key} 
                coordinate={coordArr.coords}
                image={require('../resources/bluemarker.png')}
            > 
            </Marker>
        );
        return markers;
	}

	setCoordinatesObjects = (stops) => {
        var coordinatesObjects = [];
        for(var i = 0; i < stops.length; i++){
            var latlng = {
                coords: {
                    latitude: stops[i][1],
                    longitude: stops[i][0],
                },
                key: i
            }
            coordinatesObjects[i] = latlng;
        }
        return coordinatesObjects;
    }

	distance = (lat1, lon1, lat2, lon2, unit) => {
    	var radlat1 = Math.PI * lat1/180
    	var radlat2 = Math.PI * lat2/180
    	var radlon1 = Math.PI * lon1/180
    	var radlon2 = Math.PI * lon2/180
    	var theta = lon1-lon2
    	var radtheta = Math.PI * theta/180
    	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    	dist = Math.acos(dist)
    	dist = dist * 180/Math.PI
    	dist = dist * 60 * 1.1515
    	if (unit=="K") { dist = dist * 1.609344 }
    	if (unit=="N") { dist = dist * 0.8684 } 
    	return dist;
	}

	render(){

		return(

			<View style={styles.mapContainer}>
				<MapView
					style={styles.map}
                    region={this.state.mapRegion}
                    zoomEnabled={true}
                    zoomControlEnabled={true} 
                    defaultZoom={16}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    customMapStyle={mapStyle} 
				>
					{this.state.routeMarkers}
					
				</MapView>
			</View>
		);
	}
}

var mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		//backgroundColor: '#101D25',
		backgroundColor: '#FFFFFF'
	},
	mapContainer: {
        position: 'absolute',
        zIndex: 2001,
        height: mapContHeight,
        top: 0,
        left: 0,
        right: 0
    },
	statField: {
		width: '100%',
		//height:15,
		padding: 8,
		//flex: 1,
		//flexDirection: 'row',
	},
	statInfo: {
		width: '100%',
		//color: '#FFFFFF'
		color: '#3A3A3A'
	},
	pause: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15,
		left: 0,
    	right: 0,
    	bottom: 0,
    	backgroundColor: '#FFA500',
    	borderWidth: 1,
    	borderColor: '#A3A3A3'
	},
	start: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15,
		left: 0,
    	right: 0,
    	bottom: 0,
    	backgroundColor: '#32CD32',
    	borderWidth: 1,
    	borderColor: '#A3A3A3'
	},
	map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
})