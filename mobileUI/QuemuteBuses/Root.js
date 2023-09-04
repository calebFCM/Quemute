'use strict';

import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

/*import Login from './app/screens/Login';
import Registration from './app/screens/Registration';
import Routes from './app/screens/Routes';*/
import BusLivetrack from './app/screens/BusLivetrack';
import LivetrackMonitor from './app/screens/LivetrackMonitor';

const RootStack = createStackNavigator({
 	
	LiveTrack: {
		screen: BusLivetrack,
	},
	LivetrackMonitor: {
		screen: LivetrackMonitor,
	}
});

export default createAppContainer(RootStack);