import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
import React from 'react';
import {StyleSheet,View,Text, SafeAreaView} from "react-native"
import Header from '../../../components/header';
import { width } from 'react-native-dimension';
import { color } from 'react-native-reanimated';
import { colors } from '../../../constants';

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:colors.white,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

const MapScreen = () => (
    <SafeAreaView style={styles.container}>
        <Header goBack text="Route"/>
        <MapView
            provider={PROVIDER_GOOGLE} 
            style={{flex:1, width:null}}
            region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }}
        >
        </MapView>
    </SafeAreaView>
);

export default MapScreen