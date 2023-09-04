'use strict';

import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, TouchableOpacity, StatusBar, ScrollView, Alert, SafeAreaView, Dimensions,
	Keyboard, BackHandler} from 'react-native';

const { width, height } = Dimensions.get("window");

export default class BusLivetrack extends React.Component{

	static navigationOptions = {
   		headerShown: false
   	}

   	state = {
   		routesListView: null,
   		routesList: null,
   		startElement: null,
   		selectStart: false,
   		selectedRouteList: null
   	}

   	componentDidMount(){
   		this.getRoutes();
   	}

   	getRoutes = () => {
   		var url = "https://www.quemute.com/gtlvtroutes/taxi";

   		fetch(url)
		.then((response) => response.json())
		.then(routes => {
			var routesList = {}
			for(var i = 0; i < routes.length; i++){
				var key = routes[i]._id;
				routesList[key] = routes[i];
			}
			this.state.routesList = routesList;

			this.drawRouteContent(routes);
		}).catch(function(error){
			console.log('There has been a problem with your fetch operation: ' + error.message);
            throw error;
		})
   	}

   	drawRouteContent = (routes) => {
   		var routesList = [];

   		routesList = routes.map((route) => 

   			<View key={route._id} style={styles.routeName}>
   				<TouchableOpacity
   					onPress = {() => { this.selectStart(route._id) }}>
   					<View>
   						<Text style={styles.routeTitle}>{route._id}</Text>
   					</View>
   				</TouchableOpacity>
   			</View>
   		);

   		this.setState({routesListView: routesList});
   	}

   	selectStart = (routeId) => {
   		
   		var routeInfo = this.state.routesList[routeId].records;
   		var startElements = [];
   		var routeList = [];


   		//for(var i = 0; i < routeInfo.length; i++){
   			//var route = null
   			var routeA = routeInfo[0];
   			routeList[0] = routeA;

   			var view = (<View key={0}>
   							<View>
   								<TouchableOpacity style={styles.selButton}
   									onPress = {() => {this.startLivetrack(routeA, 0)}}>
   									<Text style={styles.startTittle}>{routeA.route_name}</Text>
   									<Text style={styles.startTittle}>{routeA.end_a_name}</Text>
   								</TouchableOpacity>
   							</View>
   				   		</View>);
   			startElements.push(view);

   			var routeB = routeInfo[1];
   			routeList[1] = routeB;

   			view = (<View key={1}>
   						<View>
   							<TouchableOpacity style={styles.selButton}
   								onPress = {() => {this.startLivetrack(routeB, 1)}}>
   								<Text style={styles.startTittle}>{routeB.route_name}</Text>
   								<Text style={styles.startTittle}>{routeB.end_a_name}</Text>
   							</TouchableOpacity>
   						</View>
   				   	</View>);
   			startElements.push(view);

   		//}
   		this.setState({selectStart: true, startElement: startElements, selectedRouteList: routeList});
   	}

   	startLivetrack = (routeInfo, routeIndex) => {
   		var args = {route_info: routeInfo, route_list: this.state.selectedRouteList, route_index: routeIndex};
   		this.props.navigation.navigate('LivetrackMonitor', args);
   	} 

   	render(){
   		return(

   			<View style={styles.container}>
   				<StatusBar backgroundColor="#971C1F" barStyle="light-content"/>
   				<View style={styles.header}>
   					<Text style={styles.headerText}>Select Route...</Text>
   				</View>
   				<ScrollView keyboarddimissMode='true'>
   					{this.state.routesListView}
   				</ScrollView>
   				{this.state.selectStart &&
   				<TouchableOpacity style={styles.startelemCont}
   					onPress = {() => {this.setState({selectStart: false})}}>
   					<View style={styles.startElem}>
   						<Text style={styles.seldepTitle}>Select point of departure...</Text>
   						{this.state.startElement}
   					</View>
   				</TouchableOpacity>
   				}
   			</View>
   		)
   	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		//backgroundColor: '#101D25',
		backgroundColor: '#FFFFFF'
	},
	header: {
		paddingTop: 15,
		paddingBottom: 15,
		//backgroundColor: '#1F2C34',
		backgroundColor: '#CCCCCC',
	},
	headerText: {
		fontSize: 18,
		color: '#777'
	},
	routeName: {
		width: '100%',
		paddingTop: 15,
		paddingBottom: 15,
		borderBottomWidth: 0.5,
		borderBottomColor: '#CCC',
		//borderTopWidth: 0.3,
		//borderTopColor: '#CCC',
	},
	routeTitle: {
		fontSize: 16,
		color: '#303030',
		fontWeight: 'bold',
	},
	startelemCont: {
		width: '100%',
		height: height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
		position: 'absolute',
    	top: 0,
    	left: 0,
    	right: 0,
    	bottom: 0,
	},
	startElem: {
		width: '95%',
		//marginTop: 100,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
		paddingTop: 8,
		paddingBottom: 8,

	},
	seldepTitle: {
		fontSize: 16,
		color: '#303030',
		fontWeight: 'bold',
	},
	selButton: {
		paddingTop: 15,
		paddingBottom: 15,
		paddingLeft: 5,
		paddingRight: 5,
		borderColor: '#3A3A3A',
		borderWidth: 1,
		alignItems: 'center',
		marginTop: 2,
		marginBottom: 2,
		marginLeft: 2,
		marginRight: 2,
	},
	startTittle: {
		color: '#008ECC',
		//fontSize: 15,
		fontWeight: 'bold',
	}
})