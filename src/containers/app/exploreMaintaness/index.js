import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

const MaintenanceScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/5641/5641845.png',
        }}
        style={styles.image}
      />

      <Text style={styles.title}>We're Working on </Text>

      <Text style={styles.subtitle}>
        This feature will enable soon. We’re working hard to improve the
        experience. Please check back later.
      </Text>
    </View>
  );
};

export default MaintenanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  image: {
    width: 140,
    height: 140,
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#ff6b00',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
