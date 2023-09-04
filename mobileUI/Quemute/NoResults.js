import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image, TouchableOpacity, StatusBar, ScrollView, Alert, Dimensions}
from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMapSigns, faMapMarkedAlt, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get("window");

export default class NoResults extends React.Component{

	static navigationOptions = {
        headerShown: false,
    };

	render() {
		return(
			<View style={styles.container}>
				<StatusBar backgroundColor="#971C1F" barStyle="ligh-content" />
				<View style={styles.routeInfoCont}>
            		<View style={{marginTop: 50}}>
            			<Text>
            				<Text>
            					<FontAwesomeIcon icon={faMapSigns} color={'#BBB'} opacity={0.7} />
            				</Text>
            				<Text>
            					<FontAwesomeIcon icon={faMapMarkedAlt} color={'#BBB'} size={50} />
            				</Text>
            				<Text>
            					<FontAwesomeIcon icon={faMapMarkerAlt} color={'#D0D0D0'} opacity={0.7} />
            				</Text>
            			</Text>
            		</View>
            		<View style={{alignItems: 'center', color: '#292826', width: '100%'}}>
            			<Text style={{fontSize: 17, fontWeight: 'bold', alignItems: 'center'}}>
                            No results found.
            			</Text>
            			<Text style={{color: '#777', alignSelf: 'center'}}>
            				Could not find a combination of stops with routes nearby searched locations.
            			</Text>
            		</View>
            	</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container : {
		width: '100%',
		height: height
	},
    routeInfoCont: {
        marginTop: '33.3%',
        width: '100%', 
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 20,
        paddingLeft: 15,
        paddingRight: 15,
    }
})