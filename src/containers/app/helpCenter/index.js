import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {width} from 'react-native-dimension';
import {colors} from '../../../constants';
import AppHeader from '../../../components/headerComponent';
import {icons} from '../../../assets';

const HelpCenter = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader goBack={true} text={'Help Center'} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.contactCard}>
          <View style={styles.leftIconWrap}>
            <View style={styles.iconBox}>
              <Image
                source={icons.mobileIcon}
                resizeMode="contain"
                style={{width: 25, height: 25}}
              />
            </View>
          </View>
          <View style={styles.contactBody}>
            <Text style={styles.contactLine}>+44 049 84774</Text>
            <Text style={[styles.contactLine, {marginTop: 6}]}>
              +234810 056 3038
            </Text>
          </View>
        </View>

        <View style={[styles.contactCard, {marginTop: 14}]}>
          <View style={styles.leftIconWrap}>
            <View style={styles.iconBox}>
              <Image
                source={icons.messagIcon}
                resizeMode="contain"
                style={{width: 25, height: 25}}
              />
            </View>
          </View>
          <View style={styles.contactBodyEmail}>
            <Text style={styles.contactLine}>help@zannysfood.co</Text>
          </View>
          <TouchableOpacity style={styles.copyButton}>
            <Image
              source={icons.copyIcon}
              resizeMode="contain"
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Image
              source={icons.instra}
              resizeMode="contain"
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image
              source={icons.facebook}
              resizeMode="contain"
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image
              source={icons.Xicon}
              resizeMode="contain"
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#fff'},
  headerRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  backButton: {padding: 6},
  backIcon: {fontSize: 30, color: '#222'},
  title: {
    flex: 1,
    fontSize: 20,
    color: colors?.red || '#6b0f13',
    fontWeight: '600',
    marginLeft: 6,
  },
  headerRight: {width: 40, alignItems: 'flex-end'},
  notify: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#eee',
  },

  content: {padding: 16, paddingTop: 22},
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
    padding: 14,
  },
  leftIconWrap: {width: 50, alignItems: 'center', justifyContent: 'center'},
  iconBox: {
    width: 25,
    height: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {fontSize: 18},
  contactBody: {flex: 1, paddingLeft: 8},
  contactBodyEmail: {flex: 1, paddingLeft: 8, justifyContent: 'center'},
  contactLine: {fontSize: 16, color: '#111'},
  copyButton: {width: 44, alignItems: 'center', justifyContent: 'center'},
  copyBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },

  socialRow: {flexDirection: 'row', justifyContent: 'center', marginTop: 26},
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0f0f0f',
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialTxt: {color: '#fff', fontWeight: '700'},
});

export default HelpCenter;
