'use strict';

import React, { Component } from 'react';
import {StyleSheet, View, ActivityIndicator, Image, TouchableOpacity, StatusBar, Dimensions}
from 'react-native';
const { width, height } = Dimensions.get("window");

export default class ViewSign extends React.Component{
	static navigationOptions = ({navigation}) => ({
    	headerTitle: 'Map',
    	headerStyle: {
      		backgroundColor: '#971C1F'
    	},
    	headerTitleStyle: {
      		color: '#FFF'
    	}
  	});

  	render() {
  		var signUrl = this.props.navigation.getParam("sign_url");
  		console.log(signUrl);
  		return(
  			
  				<Image source={{uri: signUrl}} resizeMode='contain' style={{flex: 1, alignSelf: 'stretch', width: width, height: height}} />
  			
  		)
  	}
}