import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	ActivityIndicator,
	Image,
	TouchableOpacity,
	StatusBar, 
	ScrollView,
	Alert,
	Dimensions
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShuttleVan, faEllipsisH, faBus, faTrain, faArrowsAltH } from '@fortawesome/free-solid-svg-icons';
import Dinero from 'dinero.js'

var icon = "";
var iconType = "";
var typeName = "";
var iconColor = "";
var transType = "";
var numberOfTaxis = 0;
var numberOfBuses = 0;
var numberOfTrains = 0;
var price = "";
//var minTransportFare = 0.0;
//var maxTransportFare = 0.0;
var minTransportFare = null;//Dinero({amount: 0, currency: 'ZAR', precision: 2});
var maxTransportFare = null;//Dinero({amount: 0, currency: 'ZAR', precision: 2});
var transportFare = "";

var hmtlElementIcon = "";
var routeNames = [];
	
var ids = "";

var routeInfo = {};
var results = [];

export function setResults(routes, startLatitude, startLongitude, endLatitude, endLongitude){

	var routesFound = routes.length;
	routeNames = [];

	numberOfTaxis = 0;
	numberOfBuses = 0;
	numberOfTrains = 0;
	minTransportFare = Dinero({amount: 0, currency: 'ZAR', precision: 2});
	maxTransportFare = Dinero({amount: 0, currency: 'ZAR', precision: 2});
	var stops = [];
	var idAndCoordinates = "";
	var routeStops = [];
	var boardStops = [];
	var dropStops = []

	var typesOfTransport = [];
	for(var i = 0; i < routesFound; i++){
		var route = routes[i];

		var routeId = route['route_id'];
		console.log(routeId);
		ids += routeId + "-";

		//var boardAndDrop = {board_stop: route['board_stop'], drop_stop: route['drop_stop'], };
		//stops.push(boardAndDrop)
		boardStops.push(route.board_stop);
		dropStops.push(route.drop_stop);

		idAndCoordinates += "/" + routeId + "@" + route['board_stop'][1] + "," + route['board_stop'][0] + "_" + routeId + "@" + route['drop_stop'][1] + 
		"," + route['drop_stop'][0];
		var url = "https://www.quemute.com/qmroute" + idAndCoordinates + "/" + startLatitude + "," + startLongitude + "@" + endLatitude + "," + endLongitude;

		var tsType = route['type'];
		typesOfTransport[i] = tsType;

		routeStops = routeStops.concat(route.route.coordinates);

		setTransportTypes(tsType);
		setRouteNames(route, i);
		setRouteFare(route);
	}

	return {
		route_name: routeNames,
		route_id: routeId,
		num_of_taxis: numberOfTaxis,
		num_of_buses: numberOfBuses,
		num_of_trains: numberOfTrains,
		cost: transportFare,
		url: url,
		board_stops: boardStops,
		drop_stops: dropStops,
		route_stops: routeStops
	}
}

function setTransportTypes(transportType){

	switch(transportType){
		case "TAXI":
			icon = faShuttleVan;
            iconColor = "#971C1F";
            typeName = "Taxi(s)";
			numberOfTaxis++;
		break;
		case "BUS":
			icon = faBus;
            iconColor = "#008ECC";
            typeName = "Buses";
			numberOfBuses++;
		break;
		case "TRAIN":
			icon = faTrain;
            iconColor = "#D4Af37";
            typeName = "Train(s)";
			numberOfTrains++;
		break;
	}
}

export function determineTransportModes(routes){
	var typesOfTransport = [];

	var taxi = 0;
	var bus = 0;
	var train = 0;
	var modeOfTransport;

	for(var i = 0; i < routes.length; i++){
		var route = routes[i];
		var tsType = route["type"];
		typesOfTransport[i] = tsType;
	}

	var numberOfTypes = typesOfTransport.length;
	for(var i = 0; i < numberOfTypes; i++){
		var type = typesOfTransport[i];

		if(type == "TAXI"){
			taxi++;
		}else if(type == "BUS"){
			bus++;
		}else if(type == "TRAIN"){
			train++;
		}
	}

	if(taxi == numberOfTypes){
		modeOfTransport = "TAXI";
	}else if(bus == numberOfTypes){
		modeOfTransport = "BUS";
	}else if(train == numberOfTypes){
		modeOfTransport = "TRAIN";
	}else{
		modeOfTransport = "MIXED";
	}

	return modeOfTransport;
}

function setRouteNames(route, key){
	var routeName = route["route_name"];
	let rName = (<View key={key} style={styles.routeNames}>
					<Text>
						<Text ><FontAwesomeIcon icon={icon} color={iconColor}/>  </Text>
						<Text style={styles.routeLabel}>  {routeName}</Text>  
                    </Text>
                </View>);
	routeNames.push(rName);
}

function setRouteFare(route){
	var prices = route["price_range"];
	//console.log(prices);

	var minPriceDinero = getMoneyInDinero(parseFloat(prices[0]));
	var maxPriceDinero = getMoneyInDinero(parseFloat(prices[1]));
	//console.log(minPriceDinero);

	minTransportFare = minTransportFare.add(minPriceDinero); //+=  /*parseFloat(parseFloat(prices[0]).toString());/*/parseFloat(prices[0]);
	maxTransportFare = maxTransportFare.add(maxPriceDinero); //+=  /*parseFloat(parseFloat(prices[1]).toString());/*/parseFloat(prices[1]);
	console.log(minTransportFare);
	transportFare = minTransportFare.setLocale('en-ZA').toFormat('$0,0.00') + " - " + maxTransportFare.setLocale('en-ZA').toFormat('$0,0.00');
}

function getMoneyInDinero(amountInFloat){
	let amountInCents = parseInt(amountInFloat * 100);
	console.log(amountInCents)
	let dineroObject = Dinero({amount: amountInCents, currency: "ZAR", precision: 2});
	return dineroObject;
}

const styles = StyleSheet.create({
	routeLabel: {
        color: '#008ECC',
        fontSize: 13,
        paddingRight: 8,
        paddingRight: 8,
    },

    routeNames: {
    	width: '100%',
    	padding: 8
    }
})
