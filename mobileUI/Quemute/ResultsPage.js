import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShuttleVan, faEllipsisH, faBus, faTrain, faArrowsAltH } from '@fortawesome/free-solid-svg-icons';
import { setResults, determineTransportModes } from './app/lib/CreateRouteResults'

const { width, height } = Dimensions.get("window");
var filterCLicked = true;
var icon = null;
export default class ResultsPage extends React.Component{
    /*constructor(){

    }*/
    static navigationOptions = {
        headerShown: false,
    };

    state = {
        filter: "ALL",
        view_all: true,
        view_taxis: false,
        view_buses: false,
        view_trains: false,
        loading: true,
        searchComplete: false,
        transportList: null,
    }

    filterResults = (filter) => {
        /*this.setState({
            filter: filter
        });*/
        this.state.filter = filter;
        this.setState({loading: true, searchComplete: false});
        this.setSearchResults(this.results, this.startLatitude, this.startLongitude, this.endLatitude, this.endLongitude);
    }

    setClikcedIcon = (clickedIcon) => {
        this.state.view_all = false;
        this.state.view_taxis = false;
        this.state.view_buses = false;
        this.state.view_trains = false;

        if(clickedIcon === "ALL"){
            this.state.view_all = true;
        }else if(clickedIcon === "TAXI"){
            this.state.view_taxis = true;
        }else if(clickedIcon === "BUS"){
            this.state.view_buses = true;
        }else if(clickedIcon === "TRAIN"){
            this.state.view_trains = true;
        }
    }

    componentDidMount(){
        //this.setState({loading: false});
        /*this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
            this.setState({loading: false});
        } )*/
        this.search();
    }

    componentWillUnmount() {
        //this.willFocusSubscription.remove();
    }

    search = () => {

        /*var fromLatitude = this.state.start_location.latitude;
        var fromLongitude = this.state.start_location.longitude;
        var toLatitude = this.state.end_location.latitude;
        var toLongitude = this.state.end_location.longitude;*/

        this.startLatitude = this.props.route.params.fromLatitude;
        this.startLongitude = this.props.route.params.fromLongitude;
        this.endLatitude = this.props.route.params.toLatitude;
        this.endLongitude = this.props.route.params.toLongitude;

        var url = "https://www.quemute.com/quemutemobile?x1_lng=" + this.startLongitude + "&y1_lat=" + this.startLatitude + "&x2_lng=" + this.endLongitude +
            "&y2_lat=" + this.endLatitude + "&request_type=MOBILE";
        console.log(url);
            //this.setState({loading: true});
            //var url = "https://www.quemute.com/quemutemobile?x1_lng=27.8326081&y1_lat=-26.2714724&x2_lng=27.8117332&y2_lat=-26.2757141&request_type=MOBILE"

        fetch(url)
        .then((response) => response.json())
        .then(responseJson => {
            //this.setState({loading: false});
            if(responseJson.length > 0){
                /*this.props.navigation.navigate('Results', {
                    data: responseJson,
                    fromLatitude: fromLatitude,
                    fromLongitude: fromLongitude,
                    toLatitude: toLatitude,
                    toLongitude: toLongitude,
                    //from: this.fromplacesRef.getAddressText(),
                    //to: this.toplacesRef.getAddressText()
                });*/
                this.results = responseJson;
                this.setSearchResults(responseJson);
            }else{
                this.props.navigation.navigate('NoResults');
            }
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
             throw error;
        });  
    }

    moreDetails = (url, startLatitude, startLongitude, endLatitude, endLongitude, routeInfo) => {
        //this.setState({loading: true});

        fetch(url)
        .then((response) => response.json())
        .then(responseJson => {
            //this.state.loading = false;
            if(responseJson == null){
                this.props.navigation.navigate('Nodetails', {
                    route_info: routeInfo,
                    start_latitude: startLatitude,
                    start_longitude: startLongitude,
                })
            }else{
                this.props.navigation.navigate('Details', {
                    stops: responseJson,
                    route_info: routeInfo,
                    /*route_info: routeInfo,
                    trip_starts: start,
                    trip_ends: end,*/
                    start_latitude: startLatitude,
                    start_longitude: startLongitude,
                    end_latitude: endLatitude,
                    end_longitude: endLongitude,
                    /*stops: responseJson,
                    connect: routeInfo.connect,
                    connect_point: routeInfo.endpoint_a,
                    trans_mode: routeInfo.type*/
                })
            } 
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            // ADD THIS THROW error
            throw error;
        });
        
    }



    /*shouldComponentUpdate(){

    }*/
    setSearchResults = (results, startLatitude, startLongitude, endLatitude, endLongitude) => {
        var finalResultArr = [];
        for(var i = 0; i < results.length; i++){
            var route = results[i];
            var modeOfTransport = determineTransportModes(route);
            if(modeOfTransport == this.state.filter){
                finalResultArr[i] = setResults(route, startLatitude, startLongitude, endLatitude, endLongitude);
            }else if(this.state.filter == "ALL"){
                finalResultArr[i] = setResults(route, startLatitude, startLongitude, endLatitude, endLongitude);
            }
        }
        //console.log(finalResultArr);

        var resultsArr = [];
        resultsArr = finalResultArr.map((resultList) => 

            <View key={resultList.route_id} style={styles.contContainer}>
                <View style={styles.resBody}>
                    
                    <View style={{width: '100%'}}>
                        <View style={styles.resHeader}>
                            {resultList.route_name}
                        </View>
                        <Text style={styles.textColor}>
                            <Text>Taxis : </Text><Text> {resultList.num_of_taxis}</Text>
                        </Text>
                        <Text style={styles.textColor}>
                            <Text>Buses : </Text><Text>{resultList.num_of_buses}</Text>
                        </Text>
                        <Text style={styles.textColor}>
                            <Text>Trains : </Text><Text>{resultList.num_of_trains}</Text>
                        </Text>
                        <Text style={styles.textColor}>
                            <Text>Estimated Cost : </Text>{resultList.cost}<Text></Text>
                        </Text>
                        <View style={styles.buttCont}>
                            <TouchableOpacity style={styles.moreInf} onPress={() => {
                                this.moreDetails(resultList.url, startLatitude, startLongitude, endLatitude, endLongitude, resultList);
                            }}>
                                <Text style={styles.buttonText}>More Info</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
        console.log("What the what.")
        this.setState({loading: false, searchComplete: true, transportList: resultsArr});
    }

    render() {
        console.log(this.state.transportList);
        console.log(this.state.searchComplete);
        console.log(this.state.loading);

       /*var startLatitude = this.props.navigation.getParam('fromLatitude');
        var startLongitude = this.props.navigation.getParam('fromLongitude');
        var endLatitude = this.props.navigation.getParam('toLatitude');
        var endLongitude = this.props.navigation.getParam('toLongitude');*
        var startLatitude = this.props.route.params.fromLatitude;
        var startLongitude = this.props.route.params.fromLongitude;
        var endLatitude = this.props.route.params.toLatitude;
        var endLongitude = this.props.route.params.toLongitude;

        //const results = this.props.navigation.getParam('data');
        const results = this.props.route.params.data;
        console.log(results);
        
        var finalResultArr = [];
        for(var i = 0; i < results.length; i++){
            var route = results[i];
            var modeOfTransport = determineTransportModes(route);
            if(modeOfTransport == this.state.filter){
                finalResultArr[i] = setResults(route, startLatitude, startLongitude, endLatitude, endLongitude);
            }else if(this.state.filter == "ALL"){
                finalResultArr[i] = setResults(route, startLatitude, startLongitude, endLatitude, endLongitude);
            }
        }
        //console.log(finalResultArr);

        var resultsArr = [];
        resultsArr = finalResultArr.map((resultList) => 

            <View key={resultList.route_id} style={styles.contContainer}>
                <View style={styles.resBody}>
                    
                    <View style={{width: '100%'}}>
                        <View style={styles.resHeader}>
                            {resultList.route_name}
                        </View>
                        <Text style={styles.textColor}>
                            <Text>Taxis : </Text><Text> {resultList.num_of_taxis}</Text>
                        </Text>
                        <Text style={styles.textColor}>
                            <Text>Buses : </Text><Text>{resultList.num_of_buses}</Text>
                        </Text>
                        <Text style={styles.textColor}>
                            <Text>Trains : </Text><Text>{resultList.num_of_trains}</Text>
                        </Text>
                        <Text style={styles.textColor}>
                            <Text>Estimated Cost : </Text>{resultList.cost}<Text></Text>
                        </Text>
                        <View style={styles.buttCont}>
                            <TouchableOpacity style={styles.moreInf} onPress={() => {
                                this.moreDetails(resultList.url, startLatitude, startLongitude, endLatitude, endLongitude, resultList);
                            }}>
                                <Text style={styles.buttonText}>More Info</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );*/

        return(
            <ScrollView>
            {this.state.searchComplete &&
            <View>

                <View>
                    <StatusBar backgroundColor="#971C1F" barStyle="light-content" />
                    <View style={styles.logoCont}>
                        <Image source={require('./logo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.resFilter}>
                        <TouchableOpacity style={this.state.view_all?[styles.filtButtons, styles.allBackground]:[styles.filtButtons]}
                            onPress={() => {
                                this.setClikcedIcon("ALL");
                                this.filterResults("ALL")
                            }}
                        >
                            <FontAwesomeIcon icon={faEllipsisH} style={styles.icon} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.view_taxis?[styles.filtButtons, styles.taxiBackground]:[styles.filtButtons]}
                            onPress={() => {
                                this.setClikcedIcon("TAXI");
                                this.filterResults("TAXI");
                            }}
                        >
                            <FontAwesomeIcon icon={faShuttleVan} style={styles.icon} size={20} />
                        </TouchableOpacity>
                         <TouchableOpacity style={this.state.view_buses?[styles.filtButtons, styles.busBackground]:[styles.filtButtons]}
                            onPress={() => {
                                this.setClikcedIcon("BUS");
                                this.filterResults("BUS");
                            }}
                        >
                            <FontAwesomeIcon icon={faBus} style={styles.icon} size={20} />
                        </TouchableOpacity>
                         <TouchableOpacity style={this.state.view_trains?[styles.filtButtons, styles.trainBackground]:[styles.filtButtons]}
                            onPress={() => {
                                this.setClikcedIcon("TRAIN");
                                this.filterResults("TRAIN");
                            }}
                        >
                            <FontAwesomeIcon icon={faTrain} style={styles.icon} size={20} />
                        </TouchableOpacity>
                        
                    </View>
                    
                    <View style={styles.resultList}>
                        <ScrollView keyboardDismissMode="none"
                            keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
                            {this.state.transportList}
                        </ScrollView>
                    </View>
                    
                </View>
            </View>
            }
            {this.state.loading &&

                <View style={styles.loaderCont}>
                    <ActivityIndicator size='large' color='#971C1F' />
                </View>
            }
            
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    logoCont: {
        marginTop: 50,
        backgroundColor: '#F0F0F0',
        alignItems: 'center'
    },
    logo: {
        width: 60,
        height: 60,
    },
    resFilter: {
        marginTop: 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    loaderCont: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        zIndex: 1001,
        width: width,
        height: height,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    filtButtons: {
        borderRadius: 50,
        width: 50,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: '#DDD',
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
    },
    allBackground: {
        backgroundColor: '#292826'
    },
    taxiBackground: {
        backgroundColor: '#971C1F'
    },
    busBackground: {
        backgroundColor: '#008ECC',
    },
    trainBackground: {
        backgroundColor: '#D4Af37',
    },
    icon: {
        color: '#FFFFFF',
        alignSelf: 'center',
        fontSize: 32
    },
    resultList: {
        marginTop: 40,
        width: '100%'
    },
    contContainer: {
        backgroundColor: '#FFFFFF',
        width: '95%', 
        //minHeight: 250,
        alignSelf: 'center',
        marginBottom: 20,
        //flex: 1,
        //flexDirection: 'column'
    },
    routeLabel: {
        color: '#008ECC',
        fontSize: 13
    },
    textColor: {
        color: '#555',
        marginLeft: 35
    },
    resBody : {
        flex: 1,
        flexDirection: 'row'
    },
    transIcon: {
        padding: 10
    },
    resHeader: {
        width: '100%',
        borderBottomColor: '#CCC',
        borderBottomWidth: 0.5
    },
    moreInf: {
        width: 100,
        //height: 30,
        //alignSelf: 'center',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#008ECC',
        color: '#FFFFFF',
        borderRadius: 15
    },
    buttCont: {
        marginTop: 15,
        marginBottom: 10,
        paddingRight: 5,
        width: '100%',
        alignItems: 'flex-end'
    },
    buttonText: {
        color: '#FFFFFF'
    }
})