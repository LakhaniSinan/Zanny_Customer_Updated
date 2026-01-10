import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import {width, height} from 'react-native-dimension';
import AppHeader from '../../../components/headerComponent';
import {icons} from '../../../assets';
import {colors} from '../../../constants';

const DATA = [
  {
    section: 'Today',
    data: [
      {
        id: '1',
        title: 'Congratulations',
        subtitle: 'Chef Leanne has accepted your offer',
        icon: icons.congrats || icons.notificationIcon || icons.mobileIcon,
        unread: true,
      },
      {
        id: '2',
        title: 'Payment of £50 Confirmed',
        subtitle: 'Payment complete for your order',
        icon: icons.payment || icons.notificationIcon || icons.messagIcon,
        unread: true,
      },
      {
        id: '3',
        title: 'Your order has been delivered',
        subtitle: '15mins ago',
        icon: icons.delivered || icons.notificationIcon,
        unread: false,
      },
      {
        id: '4',
        title: 'Your request has been cancelled',
        subtitle: '',
        icon: icons.cancel || icons.notificationIcon,
        unread: false,
      },
    ],
  },
  {
    section: 'Yesterday',
    data: [
      {
        id: '5',
        title: 'New Feature Alert!',
        subtitle:
          "We're pleased to introduce the latest enhancements in our templating experience",
        icon: icons.mail || icons.notificationIcon,
        cta: 'Try Now!',
        unread: false,
      },
    ],
  },
];

const NotificationCard = ({item}) => {
  return (
    <View style={styles.cardWrap}>
      <View style={styles.cardInner}>
        <View style={styles.leftIconWrap}>
          <View style={styles.iconCircle}>
            {item.icon ? (
              <Image source={item.icon} style={styles.iconImg} resizeMode="contain" />
            ) : (
              <View style={{width: 18, height: 18}} />
            )}
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.subtitle ? (
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          ) : null}

          {item.cta ? (
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
              <Text style={styles.ctaText}>{item.cta}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {item.unread ? <View style={styles.unreadDot} /> : null}
      </View>
    </View>
  );
};

const Notifications = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader goBack text={'Notifications'} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionLabel}>Today</Text>
          <TouchableOpacity>
            <Text style={styles.markAll}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={DATA[0].data}
          keyExtractor={(i) => i.id}
          renderItem={({item}) => <NotificationCard item={item} />}
          ItemSeparatorComponent={() => <View style={{height: 12}} />}
          scrollEnabled={false}
        />

        <Text style={[styles.sectionLabel, {marginTop: 22}]}>Yesterday</Text>

        <FlatList
          data={DATA[1].data}
          keyExtractor={(i) => i.id}
          renderItem={({item}) => <NotificationCard item={item} />}
          ItemSeparatorComponent={() => <View style={{height: 12}} />}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#fff'},
  container: {padding: 16, paddingBottom: 40},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {fontSize: 16, color: '#777'},
  markAll: {color: colors?.red || '#6b0f13', fontWeight: '600'},

  cardWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2cfcf',
    backgroundColor: '#fff6f6',
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftIconWrap: {width: 56, alignItems: 'center', justifyContent: 'center'},
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fdecec',
  },
  iconImg: {width: 24, height: 24},
  cardBody: {flex: 1, paddingLeft: 8},
  cardTitle: {fontSize: 16, fontWeight: '700', color: '#111'},
  cardSubtitle: {fontSize: 14, color: '#444', marginTop: 6, lineHeight: 20},
  unreadDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors?.red || '#6b0f13'},

  ctaButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors?.red || '#6b0f13',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  ctaText: {color: '#fff', fontWeight: '600'},
});

export default Notifications;
