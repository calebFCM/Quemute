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
import { NavigationContainer } from '@react-navigation/native';

//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
//import {useNetInfo} from '@react-native-community/netinfo';

type Props = {};
const { width, height } = Dimensions.get("window");
const halfScreen = height / 3;
const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0


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


var componentUpdated = true;

export default function Livetrack (){
	return (
		<SafeAreaView
			keyboardDismissMode="none"
         keyboardShouldPersistTaps="always">
			<StatusBar backgroundColor="#841A1D" barStyle="light-content"/>

			<View>
				<View>
					<View style={{backgroundColor: '#ffffff', width: '100%', height: 120, borderBottomColor: '#dddddd', borderBottomWidth: 1}}>
						
						{/* Quemute Logo */}
						<View style={styles.logoCont}>
							<Image style={{
								height: 22, width: 110}} 
								source={require('./logotxt.png')} />
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
												}}/>
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
					</View> 

					{/*Routes */}
					<TouchableOpacity style={styles.routeCont}>

						<View style={styles.taxiImg}>
							<Image style={{
									height: 27,
									width: 45}} 
								source={require('./assets/images/brt.png')} />
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
    			</View>
         </SafeAreaView>
				
		);
	}

const styles = StyleSheet.create({
	container: {
  		//width: '100%',
  		width: '70%',
      left: '15%',
      right: '15%',
  		//height: 100,
  		//height: 400,
    	marginTop: 15,
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
	routeCont: {
		left: '5%',
		right: '5%',
		width: '90%',
		marginTop: 20,
		height: 222,
		backgroundColor: '#ffffff',
		borderColor: '#ddd',
		borderWidth: 1,
		shadowOffset: {width: -2, height: 4},
		shadowColor: '#777',
		shadowOpacity: 0.1,
		borderRadius: 4,
		elevation: 4,
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
		marginTop: 10,
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
