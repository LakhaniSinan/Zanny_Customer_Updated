import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import {PERMISSIONS, request} from 'react-native-permissions';
import {fontFamily, icons, images} from '../../assets';
import {colors} from '../../constants';
import {helper} from '../../helper';

const GooglePlacesInput = ({selectedLocation, setSelectedLocation}) => {
  const googleAPIKey = 'AIzaSyAvPVhgFVY2qv4c6kvukvIP2krPJe9dZGA';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const extractStreetCity = components => {
    let streetNumber = '';
    let route = '';
    let city = '';

    components?.forEach(c => {
      if (c.types.includes('street_number')) {
        streetNumber = c.long_name;
      }
      if (c.types.includes('route')) {
        route = c.long_name;
      }
      if (c.types.includes('locality')) {
        city = c.long_name;
      }
      // fallback (some countries)
      if (!city && c.types.includes('administrative_area_level_2')) {
        city = c.long_name;
      }
    });

    return {
      street: `${streetNumber} ${route}`.trim(),
      city,
    };
  };

  useEffect(() => {
    if (selectedLocation?.userAddress) {
      setQuery(selectedLocation.userAddress);
    }
  }, [selectedLocation?.userAddress]);

  const fetchPlaces = async text => {
    if (!text || text.length < 1) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          text,
        )}&key=${googleAPIKey}&language=en`,
      );
      const json = await res.json();
      console.log('Places API result:', json);
      if (Array.isArray(json?.predictions)) {
        setResults(json.predictions.slice(0, 5));
      } else {
        setResults([]);
      }
    } catch (err) {
      console.log('Fetch places error:', err);
    }
  };

  const fetchPlaceDetails = async placeId => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${googleAPIKey}`,
      );
      const json = await res.json();
      return json?.result;
    } catch (err) {
      console.log('Fetch details error:', err);
      return null;
    }
  };

  const selectPlace = async item => {
    try {
      const details = await fetchPlaceDetails(item.place_id);
      if (!details?.geometry?.location) return;

      const {lat, lng} = details.geometry.location;

      const {street, city} = extractStreetCity(details.address_components);

      setSelectedLocation({
        userAddress: item.description,
        latLng: {lat, lng},
        street,
        city,
      });

      setQuery(item.description);
      setResults([]);
      Keyboard.dismiss();

      console.log('Selected Coordinates:', lat, lng);
    } catch (error) {
      console.log('Select place error:', error);
    }
  };

  const getUserLocationAcces = async () => {
    let locationCheck = await helper.checkLocation();
    if (locationCheck === 'granted') {
      getLocation();
    } else {
      let result =
        Platform.OS === 'android'
          ? await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          : await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (result === 'granted') {
        getLocation();
      } else if (result === 'denied' && Platform.OS === 'ios') {
        Linking.openSettings();
      } else if (result === 'blocked') {
        Linking.openSettings();
      }
    }
  };

  const getLocation = async () => {
    try {
      const location = await helper.getCurrentLocation();
      const latitude = location?.coords.latitude;
      const longitude = location?.coords.longitude;

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleAPIKey}`,
      );
      const json = await res.json();
      const details = json?.results?.[0];

      if (details) {
        const {street, city} = extractStreetCity(details.address_components);

        setSelectedLocation({
          userAddress: details.formatted_address,
          latLng: {lat: latitude, lng: longitude},
          street,
          city,
        });

        setQuery(details.formatted_address);
        setResults([]);
      }
    } catch (error) {
      console.log('getLocation error', error);
    }
  };

  return (
    <>
      <View
        style={{
          height: width(18),
          width: '100%',
          borderRadius: 100,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.clay,
          flexDirection: 'row',
          paddingHorizontal: width(2),
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={getUserLocationAcces}
          style={{
            height: width(13),
            width: width(13),
            borderRadius: 100,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.location}
            resizeMode="contain"
            style={{height: 15, width: 15}}
          />
        </TouchableOpacity>
        <View style={{marginLeft: width(2), width: '70%'}}>
          <Text
            style={{
              marginTop: width(2),
              fontSize: 12,
              color: colors.black,
              fontFamily: fontFamily.poppinBold,
            }}>
            Delivery Address
          </Text>
          <View style={{height: width(10)}}>
            <TextInput
              style={{
                flex: 1,
                fontSize: 12,
                fontFamily: fontFamily.poppinRegular,
                color: colors.graydark,
              }}
              placeholder="Select your delivery location"
              placeholderTextColor={colors.graydark}
              value={query}
              onChangeText={text => {
                setQuery(text);
                fetchPlaces(text);
              }}
            />
          </View>
        </View>
        <View style={{height: width(9), width: width(9)}}>
          <Image
            style={{height: '100%', width: '100%'}}
            resizeMode="contain"
            source={images.mapImage}
          />
        </View>
      </View>
      <View style={{maxHeight: width(60), marginBottom: width(2)}}>
        {results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={item => item.place_id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  padding: 13,
                  borderBottomWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.white,
                }}
                onPress={() => selectPlace(item)}>
                <Text
                  style={{
                    color: colors.black,
                    fontFamily: fontFamily.poppinRegular,
                    fontSize: 13,
                  }}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
            style={{
              backgroundColor: colors.textLight,
              borderRadius: 10,
              marginVertical: width(3),
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
        )}
      </View>
    </>
  );
};

export default GooglePlacesInput;
