'use strict';

//import { createAppContainer, createSwitchNavigator } from 'react-navigation'
//import { createStackNavigator } from 'react-navigation-stack';

import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchPage from './SearchPage';
import Livetrack from './Livetrack';
import ResultsPage from './ResultsPage';
import MapScreen from './MapPage';
import Details from './Details';
import Nodetails from './Nodetails';
import ViewSign from './ViewSign';
import Login from './Login';
import SignUp from './SignUp';
import SignUpWebview from './SignUpWebview';
import NoResults from './NoResults';

/*const Home = HomePage;
const Auth = createSwitchNavigator({
	
	Login: {
		screen: Login,
		navigationOptions: {
        	headerShown: false,
    	}
	},
	SignUpWebview: {
		screen: SignUpWebview,
		navigationOptions: {
			headerShown: true,
		}
	}
	/*RootStack: {
		screen: RootStack
	}*
})

const RootStack = createStackNavigator({
	Home : {
		screen: HomePage,
	},
	Map: {
		screen: MapPage,
	},
	Results: {
		screen: ResultsPage,
	},
	NoResults: {
		screen: NoResults
	},
	Details: {
		screen: Details,
	},
	Nodetails: {
		screen: Nodetails,
	},
	ViewSign: {
		screen: ViewSign,
	},
	Livetrack: {
		screen: Livetrack,
	},
	Auth: {
		screen: Auth,
		navigationOptions: {
        	headerShown: false,
    	}
	}
});

/*const Auth = createSwitchNavigator({
	Home: {
		screen: Home
	},
	Login: {
		screen: Login,
		navigationOptions: {
        	headerShown: false,
    	}
	},
	RootStack: {
		screen: RootStack
	}
})*

export default createAppContainer(RootStack);*/
//const searchSCreen = 'Search';

function HomeActivity(){
	return(
		<SearchPage />
	);
}

function LivetrackActivity(){
	return(
		<Livetrack />
	);
}

function LoginActivity(){
	return(
		<Login />
	);
}
function RegisterActivity(){
	return(
		<SignUp />
	);
}

const Tab = createBottomTabNavigator(); 
const Stack = createStackNavigator();

export default function Root(){
	//SplashScreen.hide();

	return(
		<NavigationContainer>
			<Stack.Navigator intialRouteName="Login"
				screenOptions={{
					headerShown: false,
					gestureEnable: true,
					gestureDirection: "horizontal",
					/*cardStyleInterolator: CardStyleInterpolators.forHorizontalIOS,*/
					/*transitionSpec: {
						open: config,
						close: closeConfig
					},*/
				}}
				animation="fade"
			>
			<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="SignUp" component={SignUp} />
				{/* <Stack.Screen name="Home" component={HomeActivity} />
				<Stack.Screen name="Livetrack" component={LivetrackActivity} /> */}
				{/* <Stack.Screen name="Map" component={MapScreen} /> */}
				{/* <Stack.Screen name="Details" component={Details} />
				<Stack.Screen name="Nodetails" component={Nodetails} />
				<Stack.Screen name="Sign" component={ViewSign} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="SignUp" component={SignUpWebview} />
				<Stack.Screen name="NoResults" component={NoResults} /> */}
			</Stack.Navigator>
		</NavigationContainer>
	)
}