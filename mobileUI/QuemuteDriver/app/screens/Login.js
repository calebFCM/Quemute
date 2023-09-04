'use strict';

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, TouchableOpacity, Text, StatusBar, TextInput, Image,
Header} from 'react-native';
import {Button,  Input, FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons'

export default class Login extends React.Component{

	static navigationOptions = {
        headerShown: false,
    };

    register = () => {
    	this.props.navigation.navigate("Registration");
    }

    login = () => {
    	this.props.navigation.navigate('Routes')
    }

	render() {
		return(
			<ScrollView keyboardDismissMode='none' 
				keyboardShouldPersistTaps='handled'>
				<StatusBar backgroundColor="#971C1F" barStyle="light-content"/>
				<View>
					<View style={styles.fgtPswd}>
						<TouchableOpacity style={{}} onPress={() => {this.register()}}>
							<Text style={{fontWeight: 'bold', color: '#971C1F'}}>SIGN UP</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.logoCont}>
						<Image source={require('../resources/logo.png')} style={styles.logo} />
					</View>
					<View style={styles.labelCont}>
						<Text style={styles.label}>LOGIN</Text>
					</View>
					<View style={styles.flexCont}>
						<Input leftIcon={<FontAwesomeIcon icon={faEnvelope} color={'#CCC'} size={20}
							style={{marginLeft: -15}} />}
						label={"Email"} />
						<Input leftIcon={<FontAwesomeIcon icon={faLock} color={'#CCC'} size={20}
							style={{marginLeft: -15}} />}
						label={"Password"} />
					</View>
					<View style={styles.fgtPswd}>
						<TouchableOpacity>
							<Text style={{color: "#008ECC"}}>Forgot Password?</Text>
						</TouchableOpacity>
					</View>
					<Button title="Login"
						buttonStyle={{width: 100, alignSelf: 'center', backgroundColor: '#971C1F'}}
						onPress={() => {this.login()}}
					/>
					
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	logoCont: {
		marginTop: 20,
		backgroundColor: '#F0F0F0',
		alignItems: 'center'
	},
	logo: {
		width: 60,
		height: 60,
	},
	labelCont: {
		alignItems: 'center'
	},
	label: {
		fontSize: 20,
		marginTop: 35,
		fontWeight: 'bold'
	},
	flexCont: {
		marginTop: 20,
		alignItems: 'center',
		alignSelf: 'center',
		width: "90%"
	},
	fgtPswd: {
		alignItems: 'flex-end',
		padding: 15,
	}
})