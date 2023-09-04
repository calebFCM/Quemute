'use strict'

import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {WebView} from 'react-native-webview';

const { width, height } = Dimensions.get("window");
/*const SignUpWebview = () => {
	return (
		<ScrollView keyboardDismissMode='none'
    			keyboardShouldPersistTaps='handled'>
			<View style={styles.container}>
				<WebView source={{uri: "https://www.quemute.com/signup"}} />
			</View>
		</ScrollView>
	)
}*/
export default class SignUpWebview extends React.Component{

	static navigationOptions = ({navigation}) => ({
        headerTitle: 'Sign Up',
        headerStyle: {
            backgroundColor: '#971C1F'
        },
        headerTitleStyle: {
            color: '#FFF'
        }
    });

	render() {
		return(
			<ScrollView keyboardDismissMode='none'
    			keyboardShouldPersistTaps='handled'>
				<View style={styles.container}>
					<WebView source={{uri: "http://192.168.8.115/signup"}} />
				</View>
			</ScrollView>
		)
	}
}

//export default SignUpWebview;

const styles = StyleSheet.create({
	container: {
		height: height,
		width: '100%'
	}
})