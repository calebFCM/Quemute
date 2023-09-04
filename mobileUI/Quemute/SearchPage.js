'use strict';

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, TouchableOpacity, StatusBar, ScrollView, Alert, SafeAreaView, Dimensions, Platform,
KeyboardAvoidingView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationArrow, faMap, faRoute, faWifi, faMagnifyingGlass, faArrowRight, faCircleDot, faEllipsisVertical, faLocationDot, faEllipsisV, faCoins, faClock} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import checkConnectivity from './CheckConnectivity';

//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
//import {useNetInfo} from '@react-native-community/netinfo';

type Props = {};
const { width, height } = Dimensions.get("window");
const halfScreen = height / 3;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

//navigator.geolocation = require('react-native-geolocation-service');

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
      		//console.log("You can use the location")
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

/*function requestLocationPermission(){
	LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, 
        and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    }).then(function(success) {
    	console.log("Location on.");
        // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: false }
        );
        }.bind(this)
    ).catch((error) => {
        console.log(error.message);
    });
}*/
var componentUpdated = true;

export default class SearchPage extends React.Component{

	//_isMounted = false;

	constructor(props){
		super(props);
		this.scrollView = null;
		//this._isMounted = false;
	}

	/*static navigationOptions = {
    	headerShown: false,
  	};*/

	
	state = {
		start_location : null,
		end_location : null,
		current_location: null,
		from_set: false,
		to_set: false,
		loading: false,
		connected: true,
		marginBottom: 0,
	}

	openMap = (mode) => {
		componentUpdated = true;
		this.props.navigation.navigate('Map', {
        	mode: mode
        });
	}

	setFromTo = (mode, latitude, longitude) => {
		if(mode == "from"){
            this.state.start_location = {latitude: latitude, longitude: longitude};
            this.state.from_set = true;
            this.fromplacesRef && this.fromplacesRef.setAddressText(latitude + ", " + longitude);
        }

        if(mode == "to"){
            this.state.end_location = {latitude: latitude, longitude: longitude};
            this.state.to_set = true;
            this.toplacesRef && this.toplacesRef.setAddressText(latitude + ", " + longitude);
        }
	}

	getCurrentLocation = (mode) => {
		Geolocation.getCurrentPosition(
            (position) => {
            	var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                this.setFromTo(mode, latitude, longitude);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, showLocationDialog: true }
        );
	}

	search = () => {

		if(this.state.from_set && this.state.to_set){
			var fromLatitude = this.state.start_location.latitude;
			var fromLongitude = this.state.start_location.longitude;
			var toLatitude = this.state.end_location.latitude;
			var toLongitude = this.state.end_location.longitude;

			this.props.navigation.navigate('Results', {
        		//data: responseJson,
        		fromLatitude: fromLatitude,
        		fromLongitude: fromLongitude,
        		toLatitude: toLatitude,
        		toLongitude: toLongitude,
        		//from: this.fromplacesRef.getAddressText(),
        		//to: this.toplacesRef.getAddressText()
        	});

			/*var url = "https://www.quemute.com/quemutemobile?x1_lng=" + fromLongitude + "&y1_lat=" + fromLatitude + "&x2_lng=" + toLongitude +
			"&y2_lat=" + toLatitude + "&request_type=MOBILE";
			console.log(url);
			//this.setState({loading: true});
			//var url = "https://www.quemute.com/quemutemobile?x1_lng=27.8326081&y1_lat=-26.2714724&x2_lng=27.8117332&y2_lat=-26.2757141&request_type=MOBILE"

			fetch(url)
			.then((response) => response.json())
			.then(responseJson => {
				this.setState({loading: false});
				if(responseJson.length > 0){
					this.props.navigation.navigate('Results', {
        				data: responseJson,
        				fromLatitude: fromLatitude,
        				fromLongitude: fromLongitude,
        				toLatitude: toLatitude,
        				toLongitude: toLongitude,
        				//from: this.fromplacesRef.getAddressText(),
        				//to: this.toplacesRef.getAddressText()
        			});
				}else{
					this.props.navigation.navigate('NoResults');
				}
			})
			.catch(function(error) {
				console.log('There has been a problem with your fetch operation: ' + error.message);
 				// ADD THIS THROW error
  				throw error;
			});*/
		}else{
			Alert.alert(
				'Error',
        		'Please select enter valid location.',
        		[
          			{
            			text: "Okay",
            			onPress: () => {
              
            			},
            		style: 'cancel'
          			},
          			
        		],
        		{ cancelable: false } // no cancel button
      		);
		}
		
	}

	livetrack = () => {
    	AsyncStorage.getItem('@user_id').then(value => {
      		this.props.navigation.navigate(value === null ? 'Login' : 'Livetrack');
    	})	
	}

	//setting coordinates

	setCoordinates(data, details, coordsFor){
		if(details){
			if(coordsFor == "start_location"){
				this.setState({
					start_location : {
						latitude: details.geometry.location.lat,
          				longitude: details.geometry.location.lng,
					},
					from_set: true
				});
				//return;
			}

			if(coordsFor == "end_location"){
				this.setState({
					end_location : {
						latitude: details.geometry.location.lat,
          				longitude: details.geometry.location.lng,
					},
					to_set: true
				});
			}
		}
	}

	checkConnectivity = async () => {
		await NetInfo.fetch().then(connectionInfo => {
			var isConnected = connectionInfo.isConnected;
			this.setState({connected: isConnected});
		})	
	}

	

	handleConnectivityChange = (isConnected) => {
		NetInfo.removeEventListener("connectionChange", this.handleConnectivityChange);

		if(isConnected === false){
			this.setState({connected: false});
		}else{
			this.setState({connected: true});
			requestLocationPermission();
		}
	}

	componentDidMount(){
		
		requestLocationPermission();
    	/*this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      		this.setState({loading: false});
    	} )*/
		/*Geolocation.getCurrentPosition(
            (position) => {
                
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, showLocationDialog: true }
        );*/
        this.checkConnectivity();
        //componentUpdated = true;
        /*NetInfo.addEventListener(state => {
        	var isConnected = state.isConnected;
        	//this.setState({connected: isConnected});
        	this.state.connected = isConnected;
        })*/
	}

    /*componentWillUnmount() {
    	this._isMounted = false;
        //this.willFocusSubscription.remove();
    }

	/*componentDidUpdate(){
		//var mapClicked = this.props.navigation.getParam('mapClicked');
		//var mapClicked = this.props.route.params.mapClicked;
        //if(/*mapClicked && componentUpdated* this.props.route.params){
        	//const latlng = this.props.navigation.getParam('coordinates');
        	//const mode = this.props.navigation.getParam('mode');
        	const latlng = this.props.route.params.coordinates;
        	const mode = this.props.route.params.mode;
        	componentUpdated = false;
        	this.setFromTo(mode, latlng.latitude, latlng.longitude);
        }

        /*this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            this.setState({loading: false});
        } )*
        console.log(this.props);
	}*/
	componentDidUpdate(){
		console.log("Updated");
	}
	
	render(){

		return (
			
			
			<SafeAreaView
				keyboardDismissMode="none"
                keyboardShouldPersistTaps="always">
				<StatusBar backgroundColor="#841A1D" barStyle="light-content"/>
				
				{this.state.connected &&
				<View>
				{!this.state.loading &&
					<View>

						{/* Quemute Logo */}
						<View style={styles.logoCont}>
							<Image style={{
								height: 52,
								width: 53}} 
							source={require('./logo.png')} />
						</View>

						{/* Search Bar */}
						<View style={styles.container}>
							<View style={{flex: 1, marginBottom: 0, width: '100%'}}>
								<View style={{flex: 1, flexDirection: 'row', alignItems: 'center', width: '100%', position: 'absolute', zIndex: 500}}>
									<View style={{width: '100%'}}>
										<GooglePlacesAutocomplete 
												placeholder='Search for a route'
												minLength={5}
												disableScroll={false}
												autoFocus={false}
												returnKeyType={'default'}
												keyboardAppearance={'light'} 
												listViewDisplayed={false}    // true/false/undefined
												fetchDetails={true}
												//renderDescription={row => row.description} // custom description render*
												onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
													this.setCoordinates(data, details, "start_location")
												//console.log(details);
												}}
												query={{
												// available options: https://developers.google.com/places/web-service/autocomplete
												key: 'AIzaSyBJCKet5GBjRl37I15QMBGrAP1qGV-s0v8',
												language: 'en', // language of the results
												//types: '(cities)' // default: 'geocode'
												components: 'country:za'
												}} 
												styles={{
												textInputContainer: {
													width: '100%',
												},
													textInput: {
													height: 45,
													width: '100%',
													marginLeft: 40,
													marginRight: 0,
													direction: 'rtl',
													backgroundColor: '#fff',
													color: '#999999',
													//backgroundColor: 'black',
													borderTopRightRadius: 4,
													borderBottomRightRadius: 4,
													marginTop: 0,
													marginBottom: 5,
													//position: 'absolute',
													zIndex: 200,
													borderWidth:  1,
													borderLeftWidth: 0,  
													borderColor:  '#dddddd',
												},
												description: {
														fontWeight: 'bold',
												},
												predefinedPlacesDescription: {
														color: '#1faadb'
												},
												listView: {
														//position: 'absolute',
														//height: halfScreen,
														width: '100%',
														//top: 40,
														backgroundColor: '#FFFFFF',
														//flex: 1,
														zIndex: 100
													}
												}}

												//currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
												//currentLocationLabel="Current location"
												nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
												GoogleReverseGeocodingQuery={{
												// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
												}}
												GooglePlacesSearchQuery={{
												// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
												rankby: 'distance',
												type: 'cafe'
												}}
				
												/*GooglePlacesDetailsQuery={{
												// available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
												fields: 'formatted_address',
												}}*/

												filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} 
												// filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
												//predefinedPlaces={[homePlace, workPlace]}
												ref={ref => {this.fromplacesRef = ref}}

												//nearbyPlacesAPI='GooglePlacesSearch'
												//debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
												//renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
												//renderRightButton={() => <Image source={require('./logo.png')} />}
										/>
									</View>
									<View style={{
										width: '15%', 
										height: 45, 
										padding: 2, 
										backgroundColor: '#FFFFFF', 
										flex: 1, alignContent: 'center',
										position: 'absolute', 
										left: '0%', 
										top: 0, 
										alignItems: 'center', 
										borderWidth: 1, 
										borderRightWidth: 0, 
										borderColor:  '#dddddd',
										borderTopLeftRadius: 4,
										borderBottomLeftRadius: 4,}}>
											<TouchableOpacity style={styles.buttonImmage}
												onPress={() => {
													this.getCurrentLocation('from');
												}}>
												<Text style={{fontFamily: 'fontawesome', fontSize: 20}}>
													<FontAwesomeIcon icon={faMagnifyingGlass} size={20} color={'#5DBDE3'} />
												</Text>
											</TouchableOpacity>
									</View>
								</View>
							</View>
							
    					</View>
						
						{/* Previous Routes */}
					 	<View style={styles.history}>
							<Text style={{color: '#777777', fontWeight: '400'}}>
								Previous Routes...
							</Text>
						</View>

					{/* Previouly Selected Routes */}
						<TouchableOpacity style={styles.routeCont}>

							<View style={styles.taxiImg}>
								<Image style={{
										height: 27,
										width: 45}} 
									source={require('./assets/images/quantum.png')} />
							</View>

							<View style={styles.routeTit}>
								<Text style={{ color: '#2f2e41', fontSize: 13, fontWeight: '700', textTransform: 'uppercase' }}> Bara</Text> 
								<Text style={{top: -18, fontSize: 13, marginLeft: 43}}>(Bara Taxi Rank <FontAwesomeIcon icon={faArrowRight} size={11} color={'#2D2E32'} /> Protea Glen) </Text>
							</View>

							<View style={{marginLeft: 40, top: -13}}>
								<Text style={{top: -4}}>
									<FontAwesomeIcon icon={faCircleDot} size={15} color={'#5DBDE3'}/>
								</Text>

								<Text style={{top: 7}}>
									<FontAwesomeIcon icon={faEllipsisVertical} size={15} color={'#999999'}/>
								</Text>
								
								<Text style={{top: 20}}>
									<FontAwesomeIcon icon={faLocationDot} size={15} color={'#841A1D'}/>
								</Text>
							</View>

							<View style={{top: -13}}>
								<View style={{ left: 75}}>
									<Text style={{ top: -50, color: '#acb7ca', fontWeight: '400', fontSize: 10  }}>Start</Text>
									<Text style={{ top: -20, color: '#acb7ca', fontWeight: '400', fontSize: 10 }}>End</Text>
								</View>

								<View style={styles.hairline} />
								
								<View style={{ left: 75}}>
									<Text style={{ top: -67, color: '#2f2e41', fontSize: 13, fontWeight: '400' }}>Bara Taxi Rank</Text>
									<Text style={{ top: -41, color: '#2f2e41', fontSize: 13, fontWeight: '400' }}>Protea Glen Ext 28</Text>
								</View>

							</View>

							<View style={styles.divider} />

							<View style={{marginLeft: 10, top: -20}}>
								<Text>
									<FontAwesomeIcon icon={faCoins} size={15} color={'#acb7ca'}/>
								</Text>

								<Text style={{top: 12}}>
									<FontAwesomeIcon icon={faClock} size={15} color={'#acb7ca'}/>
								</Text>
							</View>

							<View style={{left: 40, top: -49}}>
								<Text style={{color: '#2f2e41', fontSize: 12, fontWeight: '700',textTransform: 'uppercase' }}>Trip Cost</Text>
								<Text style={{ top: 10, color: '#2f2e41', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>Travel Time</Text>
							</View>

							<View style={{top: -81}}>
								<Text style={{textAlign: 'right', right: 10, color: '#5DBDE3', fontSize: 12, fontWeight: '500', textTransform: 'uppercase'}}>R 20.00</Text>
								<Text style={{textAlign: 'right', right: 10, marginTop: 10, color: '#5DBDE3', fontSize: 12, fontWeight: '500', textTransform: 'uppercase'}}>~15 min</Text>
							</View>

						</TouchableOpacity>

						<TouchableOpacity style={styles.routeCont}>

							<View style={styles.taxiImg}>
								<Image style={{
										height: 27,
										width: 45}} 
									source={require('./assets/images/quantum.png')} />
							</View>

							<View style={styles.routeTit}>
								<Text style={{ color: '#2f2e41', fontSize: 13, fontWeight: '700', textTransform: 'uppercase' }}> Bara</Text> 
								<Text style={{top: -18, fontSize: 13, marginLeft: 43}}>(Bara Taxi Rank <FontAwesomeIcon icon={faArrowRight} size={11} color={'#2D2E32'} /> Protea Glen) </Text>
							</View>
							
							<View style={{marginLeft: 40, top: -13}}>
								<Text style={{top: -4}}>
									<FontAwesomeIcon icon={faCircleDot} size={15} color={'#5DBDE3'}/>
								</Text>

								<Text style={{top: 7}}>
									<FontAwesomeIcon icon={faEllipsisVertical} size={15} color={'#999999'}/>
								</Text>
								
								<Text style={{top: 20}}>
									<FontAwesomeIcon icon={faLocationDot} size={15} color={'#841A1D'}/>
								</Text>
							</View>

							<View style={{top: -13}}>
								<View style={{ left: 75}}>
									<Text style={{ top: -50, color: '#acb7ca', fontWeight: '400', fontSize: 10  }}>Start</Text>
									<Text style={{ top: -20, color: '#acb7ca', fontWeight: '400', fontSize: 10 }}>End</Text>
								</View>

								<View style={styles.hairline} />
								
								<View style={{ left: 75}}>
									<Text style={{ top: -67, color: '#2f2e41', fontSize: 13, fontWeight: '400' }}>Bara Taxi Rank</Text>
									<Text style={{ top: -41, color: '#2f2e41', fontSize: 13, fontWeight: '400' }}>Protea Glen Ext 28</Text>
								</View>

							</View>
							
							<View style={styles.divider} />
							
							<View style={{marginLeft: 10, top: -20}}>
								<Text>
									<FontAwesomeIcon icon={faCoins} size={15} color={'#acb7ca'}/>
								</Text>

								<Text style={{top: 12}}>
									<FontAwesomeIcon icon={faClock} size={15} color={'#acb7ca'}/>
								</Text>
							</View>

							<View style={{left: 40, top: -49}}>
								<Text style={{color: '#2f2e41', fontSize: 12, fontWeight: '700',textTransform: 'uppercase' }}>Trip Cost</Text>
								<Text style={{ top: 10, color: '#2f2e41', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>Travel Time</Text>
							</View>

							<View style={{top: -81}}>
								<Text style={{textAlign: 'right', right: 10, color: '#5DBDE3', fontSize: 12, fontWeight: '500', textTransform: 'uppercase'}}>R 20.00</Text>
								<Text style={{textAlign: 'right', right: 10, marginTop: 10, color: '#5DBDE3', fontSize: 12, fontWeight: '500', textTransform: 'uppercase'}}>~15 min</Text>
							</View>

						</TouchableOpacity>

    				</View>
    			}</View>
				}
				{!this.state.connected &&
					<View style={styles.noConnectionCont} >
						<View style={styles.noConnIconCont}>
							<Text><FontAwesomeIcon icon={faWifi} size={200} /></Text>
							<Text>You are currently offline. Please check your connection and try again.</Text>
							<TouchableOpacity style={styles.searchButton}
								onPress={() => {
									this.checkConnectivity();
								}}>
								<Text style={styles.buttonText}>Retry</Text>
							</TouchableOpacity>
						</View>
					</View>
				}
					{
					this.state.loading &&
						<View style={{height: height}}>
                		<View style={styles.loaderCont}>
                    		<ActivityIndicator size='large' color='#971C1F' style={styles.loader}/>
                		</View>
                	</View>
            	}
         </SafeAreaView>
				
		);
	}
	
}

const styles = StyleSheet.create({
	container: {
  		//width: '100%',
  		width: '70%',
      left: '15%',
      right: '15%',
  		//height: 100,
  		//height: 400,
    	marginTop: 30,
    	//marginBottom: 40,
    	alignItems: 'center',
    	//justifyContent: 'flex-end',
    	flex: 1,
    	flexDirection: 'column',
    	//backgroundColor: '#FFFFFF'
    	//zIndex: 10
  	},
  	livetrackBut: {
  		alignItems: 'flex-end',
  		justifyContent: 'flex-end',
  		//padding: 10,
  	},
    lvtrck: {
      padding: 10,
    },
  	inputFlexA: {
		borderRadius: 4,
  		//height: 50,
  		//top: 20,
  		backgroundColor: '#FFFFFF',
  		//flex: 1,
  		flexDirection: 'row',
  		//position: 'absolute',
  		zIndex: 20
  	},
  	history: {
		left: '5%',
  		marginTop: 80,

  	},
	routeCont: {
		left: '5%',
		right: '5%',
		width: '90%',
		marginTop: 20,
		height: 222,
		backgroundColor: '#f0f0f0',
		borderColor: '#ddd',
	},
	routeTit:{
		top: -22,
		marginLeft: 70,
	},
	hairline: {
		backgroundColor: '#ddd',
  		height: 1,
  		width: '40%',
		top: -41,
		left: 75,
	},
	divider: {
		backgroundColor: '#ddd',
  		height: 2,
  		width: '100%',
		top: -35,
	},
  	buttonImmage: {
  		/*paddingLeft: 4,
  		paddingRight: 4,*/
  		height: '100%',
  		padding: 10,
  		alignSelf: 'center'
  	},
  	loaderCont: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        zIndex: 500,
        width: width,
        height: height,
        backgroundColor: /*'#FFFFFF'*/'rgba(52, 52, 52, 0.8)'
       
    },
    loader: {
    	//position: 'absolute',
    	zIndex: 300,
    	/*top: 0,
        bottom: 0,
        left: 0,
        right: 0,*/
        justifyContent: 'center',
    },
  	compContainer: {
		backgroundColor: '#fafafa',
	},
	logoCont: {
		marginTop: 50,
		alignItems: 'center',
		
	},

	searchCont: {
		alignItems: 'center',
	},
	taxiImg: {
		marginTop: 10,
		marginLeft: 10,
	},
	// searchButton: {
	// 	width: 100,
	// 	height: 40,
	// 	/*position: 'absolute',
	// 	bottom: 20,*/
	// 	alignSelf: 'center',
	// 	alignItems: 'center',
	// 	paddingTop:10,
   //  	paddingBottom:10,
	// 	backgroundColor: '#971C1F',
	// 	borderRadius: 8,
	// 	marginTop: 200,
	// 	/*zIndex: 200*/
	// },
	buttonText: {
		color: '#FFF'
	},
	noConnectionCont: {
		width: '100%',
		height: height,
		alignItems: 'center'
	},
	imageStyle: {
		width: 250,
		height: 250
	},
	noConnIconCont: {
		width: '100%',
		marginTop: 100,
		alignItems: 'center',
		justifyContent: 'center',
	}
});
