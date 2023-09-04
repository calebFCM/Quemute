/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
 'use strict';

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import Root from './Root';

export default class App extends React.Component{
    render(){
        SplashScreen.hide();
        return(
            <Root />
        );
    }
}
