import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { width } from 'react-native-dimension';
import { Colors } from '../../../constant';
import { Images } from '../../../assets';
import PrimaryButton from '../../../components/primaryButton';

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <Image
                source={Images.women}
                style={{ height: 520, width: 360 }}
                resizeMode="cover"
            />
            <LinearGradient
                colors={[
                    Colors.linear,
                    Colors.orangelite,
                    Colors.orangelite,
                    'rgba(255, 255, 255, 0)',
                ]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={{
                    height: width(100),
                    width: width(100),
                    position: 'absolute',
                    bottom: 0,
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 100,
                    }}>
                    <Text
                        style={{
                            fontSize: 42,
                            fontWeight: 500,
                            color: Colors.white,
                            textAlign: 'center',
                        }}>
                        Discover Food You’ll Love
                    </Text>
                    <View style={{ width: 220 }}>
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: 400,
                                textAlign: 'center',
                                color: Colors.white,
                            }}>
                            Explore personalized meal options that match your taste and
                            lifestyle.
                        </Text>
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <PrimaryButton
                            name={'Get Started'}
                            onPress={() => navigation.navigate('AuthSelection')}
                        />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default WelcomeScreen;
