'use strict';

import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, TouchableOpacity, StatusBar, ScrollView, Alert, Dimensions}
from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import MapView, { Marker, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { regionFrom, getLatLonDiffInMeters, distance} from './app/lib/location';
import { faMapSigns, faMapMarkerAlt, faMapMarkedAlt, faWindowMaximize,
faRoute}
from '@fortawesome/free-solid-svg-icons';

const google_api_key = 'AIzaSyBJCKet5GBjRl37I15QMBGrAP1qGV-s0v8';
const { width, height } = Dimensions.get("window");
const qaurterHeight = height / 4;

const ASPECT_RATIO = width / height;
const LATITUDE = -26.202227;
const LONGITUDE = 28.043663;
const LATITUDE_DELTA = 0.18;//0.09225;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Nodetails extends React.Component{
	static navigationOptions = {
        headerShown: false,
    };

    state = {
    	region: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        },
        mapView: true,
        routeView: true,
    }

    constructor(props){
        super(props);
        var {navigation} = this.props;
        var routeInfo = navigation.getParam("route_info");
        this.state.startLatitude = navigation.getParam('start_latitude');
        this.state.startLongitude = navigation.getParam('start_longitude');
        //this.state.userPosition = {latitude: navigation.getParam('start_latitude'), longitude: navigation.getParam('start_longitude')};
        this.sortStopsByDistance = this.sortStopsByDistance.bind(this);
        this.setMapRegion(routeInfo.route_stops.sort(this.sortStopsByDistance));
        //console.log(this.state.region);
    }

    setMapRegion = (routeStops) => {
        
        var midCoordsIndex = parseInt(routeStops.length / 2);
        var midCoords = routeStops[midCoordsIndex];
        var lat = midCoords[1]; 
        var lon = midCoords[0];
        
        this.state.region = {
            latitude: lat,
            longitude: lon,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }
    }

    sortStopsByDistance(stopA, stopB){
        var stopALat = stopA[1];
        var stopALng = stopA[0];
        var stopBLat = stopB[1];
        var stopBLng = stopB[0];

        if(distance(this.state.startLatitude, this.state.startLongitude, stopALat, stopALng, "K") > 
            distance(this.state.startLatitude, this.state.startLongitude, stopBLat, stopBLng, "K")){
            return -1;
        }
        return 1;
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


    changeView = (mode) => {
        if(mode === "MAP"){
            this.setState({
                mapView: true,
                routeView: false
            })
        }else if(mode === "ROUTE"){
            this.setState({
                mapView: false,
                routeView: true
            })
        }else if(mode === "MAIN"){
            this.setState({
                mapView: true,
                routeView: true
            })
        }
    }

    drawRoute = (navigation) => {
        var coordinates = navigation.getParam('route_info').route_coords;
        var coordinatesObjects = [];
        var previousKey = 0;
        var next = 1;
        for(var i = 0; i < coordinates.length; i++){
            if((next + 1) < coordinates.length){
                next = i + 1;
            }
            var latlng = {
                origin: {
                    latitude: coordinates[previousKey][1],
                    longitude: coordinates[previousKey][0]
                },
                destination: {
                    latitude: coordinates[next][1],
                    longitude: coordinates[next][0]
                },
                key: i
            }
            coordinatesObjects[i] = latlng;
            previousKey = i + 1;
        }
        var markers = [];
        markers = coordinatesObjects.map((coordArr) => 
            <MapViewDirections
                key={coordArr.key}
                origin={{
                    'latitude': coordArr.origin.latitude,
                    'longitude': coordArr.origin.longitude
                }}
                destination={{
                    'latitude': coordArr.destination.latitude,
                    'longitude': coordArr.destination.longitude
                }}
                strokeWidth={5}
                strokeColor={"#971C1F"}
                apikey={google_api_key}
            >
            </MapViewDirections>
        );
        return markers;
    }

    markRouteStops = (routeStops) => {
       
        var coordinatesObjects = this.setCoordinatesObjects(routeStops);
        var markers = [];
        markers = coordinatesObjects.map((coordArr) => 
            <Marker key={coordArr.key} 
                coordinate={coordArr.coords}
                image={require('./assets/images/bluemarker.png')}
            > 
            </Marker>
        );
        return markers;
    }

    markRouteStops = (routeStops) => {
       
        var coordinatesObjects = this.setCoordinatesObjects(routeStops);
        var markers = [];
        markers = coordinatesObjects.map((coordArr) => 
            <Marker key={coordArr.key} 
                coordinate={coordArr.coords}
                image={require('./assets/images/bluemarker.png')}
            > 
            </Marker>
        );
        return markers;
    }

    markDropStops = (dropStops) => {

        var coordinatesObjects = this.setCoordinatesObjects(dropStops);
        var markers = [];
        markers = coordinatesObjects.map((coordArr) => 
            <Marker key={coordArr.key} 
                coordinate={coordArr.coords} 
                pinColor={"#BB1E10"}
            >
                <Callout>
                    <Text>You drop off here.</Text>
                </Callout>
                
            </Marker>
        );
        return markers;
    }

    markBoardStops = (boardStops) => {
       
        var coordinatesObjects = this.setCoordinatesObjects(boardStops);
        var markers = [];
        markers = coordinatesObjects.map((coordArr) => 
            <Marker key={coordArr.key} 
                coordinate={coordArr.coords} 
                pinColor={"#008000"}
            >
                <Callout>
                    <Text>You board here.</Text>
                </Callout>
                
            </Marker>
        );
        return markers;
    }

    render() {
        var routeInfo = this.props.navigation.getParam("route_info");
        var routeStopsMarkers = this.markRouteStops(routeInfo.route_stops);
        var boardStopMarkers = this.markBoardStops(routeInfo.board_stops);
        var dropStopMarkers = this.markDropStops(routeInfo.drop_stops);

        return(
            <View>
            <ScrollView ScrollView keyboardDismissMode="none"
                keyboardShouldPersistTaps="handled">
            <View style={{minHeight: height, marginBottom: 50}}>
            {this.state.mapView &&
                <View style={!this.state.routeView ? [styles.mapViewCont]:[styles.mapContainer]}>
                    <MapView
                        style={styles.map}
                        region={this.state.region}
                        zoomEnabled={true}
                        zoomControlEnabled={true}         
                    >   
                        {routeStopsMarkers}
                        {boardStopMarkers}
                        {dropStopMarkers}
                    </MapView>
                </View>
            }
            {this.state.routeView &&
            	<View style={!this.state.mapView ? [styles.routeInfoCont] : [styles.infoCont]}>
            		<View style={{marginTop: 50}}>
            			<Text>
            				<Text>
            					<FontAwesomeIcon icon={faMapSigns} color={'#D0D0D0'} opacity={0.25} />
            				</Text>
            				<Text>
            					<FontAwesomeIcon icon={faMapMarkedAlt} color={'#BBB'} size={50} />
            				</Text>
            				<Text>
            					<FontAwesomeIcon icon={faMapMarkerAlt} color={'#D0D0D0'} opacity={0.25} />
            				</Text>
            			</Text>
            		</View>
            		<View style={{alignItems: 'center', color: '#292826', width: '100%'}}>
            			<Text style={{fontSize: 17, fontWeight: 'bold', alignItems: 'center'}}>
                            No details available for this route yet.
            			</Text>
            			<Text style={{color: '#777', alignSelf: 'center'}}>
            				Could not create detailed insctructions. Please refer to map for now.
            			</Text>
            		</View>
            	</View>
            }
            </View>
            </ScrollView>
            <View style={styles.nav}>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={!this.state.routeView ? [styles.activeNavButt]:[styles.navButtons]} onPress={() => {
                        this.changeView("MAP");
                    }}>
                        <FontAwesomeIcon icon={faMapMarkedAlt} color={!this.state.routeView ? '#008ECC':'#777'}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={this.state.mapView && this.state.routeView? [styles.activeNavButt]:[styles.navButtons]}
                        onPress={() => {
                            this.changeView("MAIN");
                        }}
                    >
                        <FontAwesomeIcon icon={faWindowMaximize} color={this.state.mapView && this.state.routeView ? '#008ECC':'#777'}/>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
            
           
        );
    }
}

const styles = StyleSheet.create({
	mapContainer: {
        position: 'absolute',
        height: 250,
        top: 0,
        left: 0,
        right: 0
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    mapViewCont: {
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    infoCont: {
        marginTop: 250,
        width: '100%', 
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    routeInfoCont: {
        marginTop: 20,
        width: '100%', 
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    iconContainer: {
    	marginRight: 20,
    	marginLeft: 20,
    },
    nav: {
        flex: 1,
        flexDirection: 'row',
        width: '90%',
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        //padding: 15,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    navButtons: {
        padding: 18,
        //color: '#777',
        color: '#008ECC',
        borderRadius: 50,
        marginLeft: 10,
        marginRight: 10,
    },
    activeNavButt: {
        padding: 18,
        color: '#008ECC',
        borderRadius: 50,
        top: -20,
        backgroundColor: '#FFFFFF',
        marginLeft: 10,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2, 
        elevation: 5
    }
})