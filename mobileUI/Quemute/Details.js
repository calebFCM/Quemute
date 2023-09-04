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
import { faShuttleVan, faEllipsisH, faBus, faTrain, faCompass, faCircle, faWalking, faMapMarkerAlt, faMapMarkedAlt, faWindowMaximize,
faRoute} 
from '@fortawesome/free-solid-svg-icons'

const google_api_key = 'AIzaSyBJCKet5GBjRl37I15QMBGrAP1qGV-s0v8';
const { width, height } = Dimensions.get("window");
const qaurterHeight = height / 4;

const ASPECT_RATIO = width / height;
const LATITUDE = -26.202227;
const LONGITUDE = 28.043663;
const LATITUDE_DELTA = 0.18;//0.09225;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Details extends React.Component{
   static navigationOptions = ({navigation}) => ({
        headerTitle: 'Details',
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
        userPosition: null,
        startLatitude: null,
        startLongitude: null,
        endLatitude: null,
        endLongitude: null,
        marker: null,
        mapView: true,
        routeView: true,
        enlargeImage: false,
        watcher: null
    }

    constructor(props){
        super(props);
        var {navigation} = this.props;
        var routeInfo = navigation.getParam("route_info");
        this.state.startLatitude = navigation.getParam('start_latitude');
        this.state.startLongitude = navigation.getParam('start_longitude');
        this.state.userPosition = {latitude: navigation.getParam('start_latitude'), longitude: navigation.getParam('start_longitude')};
        this.sortStopsByDistance = this.sortStopsByDistance.bind(this);
        this.setMapRegion(routeInfo.route_stops.sort(this.sortStopsByDistance));
        //console.log(this.state.region);
    }

    componentDidMount(){
        /*var {navigation} = this.props;
        var routeInfo = navigation.getParam("route_info");
        var region = this.setMapRegion(routeInfo.board_stops);
        //this.setState();
        //this.setMapRegion(navigation.getParam('start_latitude'), navigation.getParam('start_longitude'));*/
        /*setTimeout(function(){
            Geolocation.getCurrentPosition(
                (position) => {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    //this.changeUserPosition = this.changeUserPosition.bind(this);
                    this.changeUserPosition(this.state.startLatitude, this.state.startLongitude)
                    //this.setFromTo(mode, latitude, longitude);
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, showLocationDialog: true }
            );
            //this.setState();
        }.bind(this), 3000)*/
        /*this.state.watcher = Geolocation.watchPosition((position) => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            this.changeUserPosition(latitude, longitude);
        });*/
    }

    changeUserPosition = (lat, lon) => {

        /*this.state.region = {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.004757,
            longitudeDelta: 0.004757 * ASPECT_RATIO,
        }*/
        console.log("changing state...");
        this.setState({region: {latitude: lat, longitude: lon, latitudeDelta: 0.004757, longitudeDelta: 0.004757 * ASPECT_RATIO}, userPosition: {
            latitude: lat, longitude: lon}});
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
        //return this.state.region;
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

    getDropOff = (dropPoints, latitude, longitude, distanceUnit) => {
        var closestStop = dropPoints.slice(1).reduce(function(min, p){
            if(distance(latitude, longitude, p[1], p[0], distanceUnit) < min.d) min.point = p;
                return min;
        }, {point: dropPoints[0], d:distance(latitude, longitude, dropPoints[0][1], dropPoints[0][0], distanceUnit)}).point;
        return {
            latitude: closestStop[1],
            longitude: closestStop[0]
        }
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

    viewSign = (signUrl) => {
        this.props.navigation.navigate('ViewSign', {
            sign_url: signUrl
        })
    }

    createInstruction = (stop, routeCount, totalRoutes, type) => {
        var tsType = stop['ts_type'];
        var tsTypeLowercase = tsType.toLowerCase();
        var icon;
        var iconColor;

        if(tsType === "TAXI"){
            icon = faShuttleVan;
            iconColor = "#971C1F";
        }else if(tsType === "BUS"){
            icon = faBus;
            iconColor = "#008ECC";
        }else if(tsType == "TRAIN"){
            icon = faTrain;
            iconColor = "#D4AF37";
        }

        var instruction;
        switch(type){
            case "BOARD":
            	var key = "BOARD" + routeCount;
                instruction = (<View key={key} style={styles.flexCont}>
                        <View style={styles.flexContVert}>
                            <View style={styles.sideCircle}><FontAwesomeIcon icon={faCircle} color={'#D4AF37'} size={10}/></View>
                            
                        </View>
                        <View style={styles.instructions}>
                            <View style={{width: '100%', flex: 0, flexDirection: 'row'}}>
                                <FontAwesomeIcon icon={faWalking} />
                                <View>
                                    <Text>
                                        <Text>Walk To {stop.street_name} (</Text>
                                        <Text>{stop.landmark} )</Text>
                                    </Text>
                                </View>
                                
                            </View>
                        </View>
                    </View>);
                    //
            break;
            case "DROP":
                var signUrl1 = "https://www.quemute.com/signs/" + stop.sign + ".png";
                var signUrl2 = "https://www.quemute.com/signs/" + stop.sign_1 + ".png";
                var isDropOff = false;
                var key = "DROP" + routeCount;
                
                instruction = (<View key={key} style={styles.flexCont}>
                        <View style={styles.flexContVert}>
                            <View style={styles.sideIcon, styles.sideCircle}><FontAwesomeIcon icon={faCircle} color={'#D4AF37'} size={10} /></View>
                        </View>
                        <View style={styles.instructions}>
                            <View style={{width: '100%', flex: 0, flexDirection: 'row'}}>
                                <FontAwesomeIcon icon={icon} color={iconColor} size={15} />
                                <View>
                                    <Text>
                                        
                                        <Text style={{fontSize: 15}}> Board {tsTypeLowercase} to </Text>
                                        <Text>
                                            <Text>{stop.suburb} </Text>
                                            - <Text>{stop.route_name} </Text>
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                            <View style={{width: '100%', flex: 0, flexDirection: 'row'}}>
                                <TouchableOpacity style={{padding: 10}} onPress = {() => {
                                    this.viewSign(signUrl1);
                                }}>
                                    <Image source={{uri: signUrl1}} style={{width: 75, height: 60}} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{padding: 10}} onPress = {() => {
                                    this.viewSign(signUrl2);
                                }}>
                                    <Image source={{uri: signUrl2}} style={{width: 75, height: 60}} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{color: "#777", fontSize: 12}}>
                                - Get off at {stop.landmark}, {stop.street_name}, {stop.suburb}
                            </Text>
                        </View>
                    </View>
                    );
                    //<//
        }
        return instruction;
    }

    dropOffInstruction = (stop, count) => {
        var dropInstruct = (<View key={count} style={styles.flexCont}>
                        <View style={styles.flexContVert}>
                            <View style={styles.sideIcon}><FontAwesomeIcon icon={faMapMarkerAlt} color={'#008ecc'} size={18}/></View> 
                        </View>
                        <View style={styles.instructions}>
                            <View style={{width: '100%', flex: 0, flexDirection: 'row'}}>
                                <FontAwesomeIcon icon={faWalking} />
                                <View>
                                    <Text style={{fontSize: 15}}>
                                        - Get off at {stop.landmark}, {stop.street_name}, {stop.suburb}
                                    </Text>
                                </View> 
                            </View>
                        </View>
                    </View>);
        return dropInstruct;
    }//

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
    }//

    /*componentDidMount(){
        /*var {navigation} = this.props;
        var routeInfo = navigation.getParam("route_info");
        var region = this.setMapRegion(routeInfo.board_stops);
        //this.setState();
        //this.setMapRegion(navigation.getParam('start_latitude'), navigation.getParam('start_longitude'));*
        setTimeout(function(){
            Geolocation.getCurrentPosition(
                (position) => {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    this.changeUserPosition(latitude, longitude)
                    //this.setFromTo(mode, latitude, longitude);
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000, showLocationDialog: true }
            );
        })
    }*/


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

    render() {
        const {navigation} = this.props;
        const stops = navigation.getParam("stops");
        var instructions = [];
        var numberOfRoutes = stops.length;
        for(var i = 0; i < numberOfRoutes; i++){
            var bdStops = stops[i]
            var boardStop = bdStops[0];
            var dropStop = bdStops[1];
            instructions.push(this.createInstruction(boardStop, i, numberOfRoutes, "BOARD"));
            instructions.push(this.createInstruction(dropStop, i, numberOfRoutes, "DROP"));

            if(i + 1 == numberOfRoutes){
                instructions.push(this.dropOffInstruction(dropStop, i));
            }
        }
        var routeInfo = navigation.getParam("route_info");
        var stopPoints = routeInfo.stops
        //var boardStopLat = stopPoints[0].board_stop[0];
        //var boardStopLng = stopPoints[0].board_stop[1];

        var routeStopsMarkers = this.markRouteStops(routeInfo.route_stops);
        var boardStopMarkers = this.markBoardStops(routeInfo.board_stops);
        var dropStopMarkers = this.markDropStops(routeInfo.drop_stops);

        //var region = this.setMapRegion(routeInfo.board_stops[0][1], routeInfo.board_stops[0][0]);
        //var region = this.setMapRegion(routeInfo.route_stops);
        var startPoint = {latitude: navigation.getParam('start_latitude'), longitude: navigation.getParam('start_longitude')};
        var endPoint = {latitude: navigation.getParam('end_latitude'), longitude: navigation.getParam('end_longitude')}

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
                        defaultZoom={16}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        customMapStyle={mapStyle}     
                    >
                        {routeStopsMarkers}
                        {boardStopMarkers}
                        {dropStopMarkers}
                        <Marker
                            coordinate={this.state.userPosition}
                            image={require('./assets/images/commuter.png')}
                        >
                            <Callout>
                                <Text>This is you</Text>
                            </Callout>
                        </Marker>
                         <Marker
                            coordinate={endPoint}
                            pinColor="#008ECC"
                        >
                            <Callout>
                                <Text>Your destination.</Text>
                            </Callout>
                        </Marker>
                    </MapView>
                </View>
            }
            {this.state.routeView &&
                <View style={!this.state.mapView ? [styles.routeInfoCont] : [styles.infoCont]}>
                    <View style={styles.flexCont}>
                        <View style={styles.flexContVert}>
                            <View style={styles.sideIcon}><FontAwesomeIcon icon={faCompass} color={'#008ecc'} size={18}/></View>
                        </View>
                        <View style={{width: '90%', padding: 10}}>
                            <Text>Where You're At</Text>
                        </View>
                    </View>
                   {instructions}
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
                    <TouchableOpacity style={!this.state.mapView ? [styles.activeNavButt]:[styles.navButtons]} onPress={() => {
                        this.changeView("ROUTE");
                    }}>
                        <FontAwesomeIcon icon={faRoute} color={!this.state.mapView ? '#008ECC':'#777'}/>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
            
           
        );
    }
}
//

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
        width: '98%', 
        alignSelf: 'center',
        marginBottom: 20
    },
    routeInfoCont: {
        marginTop: 20,
        width: '98%', 
        alignSelf: 'center',
        marginBottom: 20
    },
    flexCont: {
       flex: 0,
       flexDirection: 'row',
       width: '100%',
       marginBottom: 10,
      
      
    },
    flexContVert: {
        flex: 0,
        flexDirection: 'column',
        padding: 12,
         borderLeftWidth: 2,
       borderLeftColor: '#CCC',
        marginLeft: 7,
    },
    verticalLine: {
        borderLeftWidth: 2,
        borderLeftColor: '#CCC',
        height: 25,
        marginTop: 20
    },
    sideIcon: {
        marginLeft: -9.5,
        position: 'absolute',
        width: 10,
        backgroundColor: '#F0F0F0',
        height: 35,
        paddingTop: 10,
        paddingBottom: 10,
    },

    sideCircle: {
        marginLeft: -6,
        position: 'absolute',
        width: 10,
        backgroundColor: '#F0F0F0',
        height: 30,
        paddingTop: 10,
        paddingBottom: 10,
    },
    instructions: {
        backgroundColor: '#FFFFFF',
        color: '#303030',
        width: '90%',
        padding: 5,
        marginTop: 10,
        marginLeft: -5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2, 
        elevation: 5,
    },
    nav: {
        flex: 1,
        flexDirection: 'row',
        width: '95%',
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        //padding: 15,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2, 
        elevation: 5,
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
        elevation: 5,
    }
})