'use strict';

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import Login from './app/screens/Login';
import Registration from './app/screens/Registration';
import Routes from './app/screens/Routes';
import LiveTrack from './app/screens/LiveTrack';

const RootStack = createStackNavigator({
	Login: {
		screen: Login
	},
	Registration: {
		screen: Registration,
	},
	Routes: {
		screen: Routes,
	},
	LiveTrack: {
		screen: LiveTrack,
	}
})

export default createAppContainer(RootStack);