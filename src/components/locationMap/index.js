import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Text, View} from 'react-native';
import {height} from 'react-native-dimension';

let region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Map = ({region, coordinate}) => {
  return (
    <View>
      <MapView style={{marginTop: height(2)}} region={region ? region : null}>
        <Marker coordinate={coordinate ? coordinate : null} />
      </MapView>
    </View>
  );
};
export default Map;
