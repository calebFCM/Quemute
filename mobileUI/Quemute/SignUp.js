'use strict';

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, TouchableOpacity, Text, StatusBar, TextInput, Image, Dimensions,
Header, ActivityIndicator} from 'react-native';
import {Button,  Input, FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faEye, faArrowRight, faAngleLeft, faPhone} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

export default class Login extends React.Component{

	static navigationOptions = {
        headerShown: false,
    };

    state = {
        passwordNotVisible: true,
        email: null,
        password: null,
        credentialsSet: true,
        loading: true
    }

    componentDidMount(){
    	this.setState({loading: false});
  	}

    login = () => {
    	this.props.navigation.navigate("Login");
    }

    showPassword = () => {
    	//currentShowPassValue = this.state.showPassword;

    	if(this.state.passwordNotVisible){
    		this.setState({passwordNotVisible: false});
    	}else{
    		this.setState({passwordNotVisible: true});
    	}
    	
    }

    render() {
    	return(
    		<ScrollView keyboardDismissMode='none'
    			keyboardShouldPersistTaps='handled'>
    			<StatusBar backgroundColor="#841A1D" barStyle="light-content" />
    			<View style={styles.container}>
    				{this.state.loading &&
                	<View style={styles.loaderCont}>
                    	<ActivityIndicator size='large' color='#841A1D' style={styles.loader}/>
                	</View>
            		}

					<View style={styles.backCont}>
						<TouchableOpacity style={styles.backButton}
							onPress={() => {
								this.login();
							}}
						>
							<Text style={styles.backArrow}><FontAwesomeIcon icon={faAngleLeft} color={'#2D2E32'} size={30} /></Text>
						</TouchableOpacity>
					</View>

					<View>
						<Text style={styles.label}>Sign Up</Text>
					</View>

					<View>
						<Text style={{left: '5%', color:"#aaaaaa", fontWeight: '400' }}>Please Sign up to continue</Text>
					</View>

					<View style={styles.fields}>
						<View style={this.state.credentialsSet ? [styles.inputFields] : [styles.inputFieldsErr]}>
							<Text style={styles.inputLabel}>Email</Text>
							<Text style={styles.iconCont}><FontAwesomeIcon icon={faEnvelope} color={'#999999'} size={20} /></Text>
							<TextInput style={styles.loginInput}
								onChangeText={(text) => {
									this.state.email = text;
								}}
							/>
						</View>

						<View style={this.state.credentialsSet ? [styles.inputFields] : [styles.inputFieldsErr]}>
							<Text style={styles.inputLabel}>Phone</Text>
							<Text style={styles.iconCont}><FontAwesomeIcon icon={faPhone} color={'#999999'} size={20} /></Text>
							<TextInput style={styles.loginInput}
								onChangeText={(text) => {
									this.state.email = text;
								}}
							/>
						</View>
						
						<View style={this.state.credentialsSet ? [styles.inputFields] : [styles.inputFieldsErr]}>
							<Text style={styles.inputLabel}>Password</Text>
							<Text style={styles.iconCont}><FontAwesomeIcon icon={faLock} color={'#999999'} size={20} /></Text>
							<TextInput style={styles.loginInputPass}
								secureTextEntry={this.state.passwordNotVisible}
								onChangeText={(text) =>{
									this.state.password = text;
								}}
							/>
							<TouchableOpacity style={styles.showPass}
								onPress={() => this.showPassword()}
							>
								<FontAwesomeIcon icon={faEye} color={'#999999'} size={20} />
							</TouchableOpacity>
						</View>
						
						<View style={this.state.credentialsSet ? [styles.inputFields] : [styles.inputFieldsErr]}>
							<Text style={styles.inputLabel}>Confirm Password</Text>
							<Text style={styles.iconCont}><FontAwesomeIcon icon={faLock} color={'#999999'} size={20} /></Text>
							<TextInput style={styles.loginInputPass}
								secureTextEntry={this.state.passwordNotVisible}
								onChangeText={(text) =>{
									this.state.password = text;
								}}
							/>
							<TouchableOpacity style={styles.showPass}
								onPress={() => this.showPassword()}
							>
								<FontAwesomeIcon icon={faEye} color={'#999999'} size={20} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.buttonCont}>
						<TouchableOpacity style={styles.signUpButton}
							onPress={() => {
								this.login();
							}}
						>
							<Text style={styles.buttonText}>SIGN UP</Text>
							<Text style={styles.logArrow}><FontAwesomeIcon icon={faArrowRight} color={'#ffffff'} size={20} /></Text>
						</TouchableOpacity>
					</View>
					
					<View style={styles.fgtPswd}>
						<Text>Already have an account?</Text>
						<TouchableOpacity style={{}} onPress={() => {this.login()}}>
							<Text style={{fontWeight: 'bold', color: '#841A1D',marginLeft: 163, top: -20, alignSelf: 'flex-end'}}>SIGN IN</Text>
						</TouchableOpacity>
					</View>

    			</View>
    		</ScrollView>
    	)
    }

	/*render() {
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
						<Image source={require('./logo.png')} style={styles.logo} />
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
	}*/
}

const styles = StyleSheet.create({
	container: {
		height: height,
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
        backgroundColor: '#FFFFFF'//'rgba(52, 52, 52, 0.8)'
    },
    loader: {
    	//position: 'absolute',
    	zIndex: 21,
    	/*top: 0,
        bottom: 0,
        left: 0,
        right: 0,*/
        justifyContent: 'center',
    },
	backCont: {
		marginTop: 40,
		backgroundColor: '#F0F0F0',
		alignItems: 'center'
	},
	backButton: {
		backgroundColor: '#fff',
    left: '5%',
		borderRadius: 50,
		width: 50,
		height: 50,
		alignSelf: 'flex-start',
		shadowOffset: {
			width: 2, height: 10
		},
		shadowColor: '#000',
		shadowOpacity: 1,
		shadowRadius: 13,
		elevation: 4,
	},
	backArrow: {
    top: 10,
    alignSelf: 'center',
	},
	label: {
		fontSize: 36,
		marginTop: 35,
		left: '5%',
		fontWeight: 'bold',
		textAlign: 'left',
		color: "#343741"
	},
	flexCont: {
		marginTop: 20,
		alignItems: 'center',
		alignSelf: 'center',
		width: "90%"
	},
	fields: {
		width: '90%',
		left: '5%',
		right: '5%',
		marginTop: 20,
		alignItems: 'center',
	},
	inputFields: {
		width: '100%',
		flexDirection: 'row',
		height: 60,
		marginTop: 10,
		marginBottom: 10,
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 4,
		shadowOffset: {
			width: 2, height: 4
		},
		shadowColor: '#777',
		shadowOpacity: 0.5,
		shadowRadius: 13,
		elevation: 4,

	},
	inputFieldsErr: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#FF0000',
		marginTop: 10,
		marginBottom: 10
	},
	inputLabel: {
		marginTop: 7,
		marginLeft: '10%',
		alignSelf: 'flex-start',
		fontWeight: '500',
		color: '#343741',
	},
	loginInput: {
		width: '80%',
		position: 'absolute',
		left: '10%',
		right: '10%',
		height: 35,
		alignSelf: 'flex-end',
		//borderRadius: 8
	},
	loginInputPass: {
		width: '80%',
		position: 'absolute',
		left: '10%',
		right: '10%',
		height: 35,
		alignSelf: 'flex-end',
		//borderRadius: 8
	},
	iconCont: {
		position: 'absolute',
		top: 30,
		left: '3%', 
	},
	showPass: {
		position: 'absolute',
		top: 30,
		right: '3%', 
	},
  signUpButton: {
		backgroundColor: '#841A1D',
		padding: 10,
		borderRadius: 20,
		width: 110,
		height: 50,
		alignSelf: 'center',
		shadowOffset: {
			width: 2, height: 4
		},
		shadowColor: '#777',
		shadowOpacity: 1,
		shadowRadius: 13,
		elevation: 4,
	},
	logArrow: {
		position: 'absolute',
		top: 15,
		right: 13,
	},
	buttonCont: {
		width: '100%',
		marginTop: 40,
		alignItems: 'center',
	},
	buttonText: {
		color: '#FFFFFF',
		top: 4,
		left: 8,
		fontWeight: '500',
	},
	fgtPswd: {
		color: '#3F3D56',
		position: 'absolute',
		bottom: 0,
		alignSelf: 'center',
		padding: 15,
	}

})