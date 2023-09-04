'use strict';

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, TouchableOpacity, Text, StatusBar, TextInput, Image,
Header, Dimensions, PermissionsAndroid, YellowBox} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import SocketIOClient from 'socket.io-client/dist/socket.io';
import {Button,  Input, FormValidationMessage } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faHistory, faRoad, faArrowRight, faArrowLeft, faArrowsAltH} from '@fortawesome/free-solid-svg-icons'

const { width, height } = Dimensions.get("window");
const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 5000,
    transports: ['websocket']/// you need to explicitly tell it to use websockets
};
console.ignoredYellowBox = ['Remote debugger'];
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

//const io = require('socket.io-client/socket.io');
/*const socket = SocketIOClient('wss://192.168.8.177:3000', {transports: ['websockets'], upgrade: false});
socket.connect();*/

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

export default class Routes extends React.Component{
	/*constructor(props){
		super(props);

		this.socket = SocketIOClient('http://192.168.9.102:3000', connectionConfig);
		this.socket.on("joinroute", (users) => console.log(users));
		this.socket.connect();
	}*/

	static navigationOptions = {
		headerShown : false
	}

	state = {
		view_recent: true,
		view_all: false,
		user: {user_type: "DRIVER", position: null}
	}

	viewRoute = (user, routeName) =>{
		this.props.navigation.navigate("LiveTrack", {
			user: user,
			route_name: routeName
		});
		//this.socket.emit('joinroute', user, routeName);
	}

	changeView = (FILTER_FLAG) => {
		if(FILTER_FLAG === 0){
			this.setState({
				view_recent: true,
				view_all: false,
			})
		}else if(FILTER_FLAG === 1){
			this.setState({
				view_recent: false,
				view_all: true,
			})
		}
	}

	componentDidMount(){
		
		requestLocationPermission();
    	/*this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
     	 this.setState({loading: false});
    	} )*/
		Geolocation.getCurrentPosition(
            (position) => {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                this.state.user.position = {latitude: latitude, longitude: longitude}
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true }
        );
        //componentUpdated = true;
        /*const socket = SocketIOClient('wss://192.168.8.177:3000', {transports: ['websockets'], upgrade: false});
		socket.connect();*/
	}

	render() {
		return(
			<View>
				<StatusBar backgroundColor="#971C1F" barStyle="light-content"/>
				<View style={styles.logoCont}>
					<Input leftIcon={<FontAwesomeIcon icon={faSearch} color={'#008ECC'} size={18}
						style={{marginLeft: -15}} />}
						placeholder="Search for route"
						inputContainerStyle={{borderWidth: 1, borderColor: '#CCC', paddingLeft: 10,
						paddingRight: 10, borderRadius: 6, height: 40}}
					/>
				</View>
				<ScrollView keboardDismissMode='none'
					keyboardShouldPersistTaps='handled'>
					<View style={{minHeight: height, marginBottom: 50}}>
						<View style={{marginTop: 25}}>
						{this.state.view_recent &&
							<View style={styles.flexCont}>
								<TouchableOpacity style={styles.searchCont}
									onPress={() => {this.viewRoute(this.state.user, "Bara To Glen")}}>
									<View style={styles.startEndCont}>
										<Text style={{color: '#008ECC'}}>Start</Text>
										<Text style={{color: '#971C1F'}}>End</Text>
									</View>
									<View style={styles.startEndCont}>
										<Text style={{fontWeight: 'bold', fontSize: 20}}>BAR</Text>
										<TouchableOpacity style={{alignItems: 'center'}}>
											<FontAwesomeIcon icon={faArrowsAltH}
												style={{color: '#971C1F'}} />
										</TouchableOpacity>
										<Text style={{fontWeight: 'bold', fontSize: 20}}>PGN</Text>
									</View>
									<View style={styles.startEndCont}>
										<Text style={{color: '#777'}}>Bara Taxi Rank</Text>
										<Text style={{color: '#777'}}>Protea Glen</Text>
									</View>
								</TouchableOpacity>
							</View>
						}
						{this.state.view_all &&
							<View style={styles.flexCont}>
								<TouchableOpacity style={styles.searchCont}>
									<View style={styles.startEndCont}>
										<Text style={{color: '#008ECC'}}>From/To</Text>
										<Text style={{color: '#971C1F'}}>From/To</Text>
									</View>
									<View style={styles.startEndCont}>
										<Text style={{fontWeight: 'bold', fontSize: 20}}>BAR</Text>
										<TouchableOpacity style={{alignItems: 'center'}}>
											<FontAwesomeIcon icon={faArrowsAltH}
												style={{color: '#971C1F'}} />
										</TouchableOpacity>
										<Text style={{fontWeight: 'bold', fontSize: 20}}>PGN</Text>
									</View>
									<View style={styles.startEndCont}>
										<Text style={{color: '#777', textAlign: 'left', width: '50%'}}>Thokoza Park Bus Station Sub Station Nation</Text>
										<Text style={{color: '#777', textAlign: 'right', width: '50%'}}>Protea Glen Ext 13</Text>
									</View>
								</TouchableOpacity>
							</View>
						}
						</View>
					</View>	
				</ScrollView>

				<View style={styles.flexContHor}>
					<TouchableOpacity 
						style={styles.filter}
						onPress={() => {this.changeView(0)}}
					>
						<Text style={this.state.view_recent ? [styles.activeButt] : [styles.inactiveButt]}>
							<FontAwesomeIcon icon={faHistory} 
							style={this.state.view_recent ? styles.activeButt : styles.inactiveButt} />
							<Text>Recent Routes</Text>
						</Text>	
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.filter}
						onPress={() => {this.changeView(1)}}
					>
						<Text style={this.state.view_all ? [styles.activeButt] : [styles.inactiveButt]}>
							<FontAwesomeIcon icon={faRoad}
							style={this.state.view_all ? styles.activeButt: styles.inactiveButt} />
							<Text>All Routes</Text>
						</Text>	
					</TouchableOpacity>
				</View>
			</View>	
			
		)
	}
}

const styles = StyleSheet.create({
	logoCont: {
		//marginTop: 20,
		backgroundColor: '#F0F0F0',
		alignItems: 'center',
		position: 'absolute',
		zIndex: 1001,
		top: 0,
		left: 0,
		right: 0,
		borderBottomWidth: 1,
		borderBottomColor: '#CCC',
		padding: 6
	},
	logo: {
		width: 30,
		height: 30,
	},
	searchCont: {
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: '#CCC',
		/*paddingLeft: 6,
		paddingRight: 6*/
	},
	flexCont: {
		marginTop: 25,
		alignItems: 'center',
		alignSelf: 'center',
		width: "100%",
	},
	flexContHor: {
		flex: 1,
		flexDirection: 'row',
		height: 50,
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		borderTopWidth: 1,
		borderTopColor: '#CCC'
	},
	filter: {
		margin: 8,
		//width: 150,
		color: '#777',
		/*padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#CCC'*/
	},
	startEndCont: {
		width: '100%',
		flex: 1,
		flexDirection: 'row',
		paddingTop: 6,
		paddingBottom: 6,
		paddingLeft: 15,
		paddingRight: 15,
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	activeButt: {
		color: '#008ECC',
		fontWeight: 'bold'
	},
	inactiveButt: {
		color: '#777'
	}
})