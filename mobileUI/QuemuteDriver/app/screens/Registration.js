'use strict';

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, TouchableOpacity, Text, StatusBar, TextInput, Image,
Header} from 'react-native';
import {Button,  Input, FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faUserCircle, faMapPin, faPhone} from '@fortawesome/free-solid-svg-icons'

export default class Registration extends React.Component{

	static navigationOptions = {
		headerShown: false
	};

	render() {
		return(
			<ScrollView keyboardDismissMode='none'
				keyboardShouldPersistTaps='handled'>
				<StatusBar backgroundColor="#971C1F" barStyle="light-content"/>
				<View>
					<View style={styles.logoCont}>
						<Image source={require('../resources/logo.png')} style={styles.logo} />
					</View>
				</View>
				<View style={styles.labelCont}>
					<Text style={styles.label}>Create Account</Text>
				</View>
				<View style={{alignSelf: 'center', width: '90%'}}>
					<Text style={styles.label}>Personal</Text>
				</View>
				<View style={styles.flexCont}>
					<Input leftIcon={<FontAwesomeIcon icon={faUserCircle} color={'#008ECC'} size={20}
						style={{marginLeft: -15}} />}
					label={"Name"} on />
					<Input leftIcon={<FontAwesomeIcon icon={faUserCircle} color={'#008ECC'} size={20}
						style={{marginLeft: -15}} />}
					label={"Surname"} />
					<Input leftIcon={<FontAwesomeIcon icon={faMapPin} color={'#008ECC'} size={20}
						style={{marginLeft: -15}} />}
					label={"City"} />
					<Input leftIcon={<FontAwesomeIcon icon={faEnvelope} color={'#008ECC'} size={20}
						style={{marginLeft: -15}} />}
					label={"Email"} />
					<Input leftIcon={<FontAwesomeIcon icon={faPhone} color={'#008ECC'} size={20}
						style={{marginLeft: -15}} />}
					label={"Phone Number"} />
					<Input leftIcon={<FontAwesomeIcon icon={faLock} color={'#008ECC'} size={20}
						style={{marginLeft: -15}} />}
					label={"Password"} />
					<Input leftIcon={<FontAwesomeIcon icon={faLock} color={'#008ECC'} size={20}
						style={{marginLeft: -15}} />}
					label={"Confirm Password"} />
					<Button title="Sign Up"
						buttonStyle={{minWidth: 100, marginTop: 20, marginBottom: 20, alignSelf: 'center',
						backgroundColor: '#971C1F'}}
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
		fontSize: 15,
		marginTop: 30,
		fontWeight: 'bold'
	},
	flexCont: {
		marginTop: 20,
		alignItems: 'center',
		alignSelf: 'center',
		width: '90%'
	}
})