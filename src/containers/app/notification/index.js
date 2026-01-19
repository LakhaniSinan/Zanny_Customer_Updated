import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Touchable,
} from 'react-native';
import { width, height } from 'react-native-dimension';
import AppHeader from '../../../components/headerComponent';
import { icons } from '../../../assets';
import { colors } from '../../../constants';
import { getNotifcations, markAsReadNotification } from '../../../services/notifications';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OverLayLoader from '../../../components/loader';
import moment from 'moment';

// Notification Card
const NotificationCard = ({ item, markAsRead }) => {
  return (
    <TouchableOpacity
      onPress={() => { !item.isRead ? markAsRead(item._id) : null }}
      style={styles.cardWrap}>
      <View style={styles.cardInner}>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.body ? (
            <Text style={styles.cardSubtitle}>{item.body}</Text>
          ) : null}

          {item.createdAt ? (
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
              <Text style={styles.ctaText}>{moment(item.createdAt).format("DD-MMM-YYYY hh:mm a")}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {!item.isRead ? <View style={styles.unreadDot} /> : null}
      </View>
    </TouchableOpacity>
  );
};



// Main Notifications Component
const Notifications = () => {

  const markAsRead = (id) => {
    markAsReadNotification(id)
      .then(response => {
        if (response.status == 200) {
          fetchAllNotifications()
        }
      }).catch(err => {

      })
  }

  const [notifications, setNotifications] = useState({
    today: [],
    yesterday: [],
    earlier: [],
  });

  const [loader, setLoader] = useState(false)

  // Fetch user ID from AsyncStorage
  const getUserData = async () => {
    const data = await AsyncStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  };

  // Group notifications by date
  const groupNotifications = (notifs) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    const grouped = { today: [], yesterday: [], earlier: [] };

    notifs.forEach((notif) => {
      const notifDate = formatDate(new Date(notif.createdAt));
      if (notifDate === todayStr) grouped.today.push(notif);
      else if (notifDate === yesterdayStr) grouped.yesterday.push(notif);
      else grouped.earlier.push(notif);
    });

    // Optional: sort newest first
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });

    return grouped;
  };

  // Fetch all notifications
  const fetchAllNotifications = async () => {
    setLoader(true)
    try {
      const user = await getUserData();
      if (!user) return;

      const response = await getNotifcations(user._id);
      if (response?.data?.data) {
        const grouped = groupNotifications(response.data.data);
        setNotifications(grouped);
        setLoader(false)
      }
    } catch (err) {
      console.log('Error fetching notifications:', err);
      setLoader(false)
    }
  };

  // Run when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchAllNotifications();
    }, [])
  );

  // Sections for rendering
  const sections = [
    { title: 'Today', data: notifications.today },
    { title: 'Yesterday', data: notifications.yesterday },
    { title: 'Earlier', data: notifications.earlier },
  ];

  return (
    <>
      <OverLayLoader isloading={loader} />
      <SafeAreaView style={styles.safe}>
        <AppHeader goBack text={'Notifications'} />

        <ScrollView contentContainerStyle={styles.container}>
          {sections.map(
            (section) =>
              section.data.length > 0 && (
                <View key={section.title} style={{ marginBottom: 20 }}>
                  <View style={styles.headerRow}>
                    <Text style={styles.sectionLabel}>{section.title}</Text>
                    <TouchableOpacity>
                      <Text style={styles.markAll}>Mark all as read</Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={section.data}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <NotificationCard markAsRead={markAsRead} item={item} />}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    scrollEnabled={false}
                  />
                </View>
              )
          )}
        </ScrollView>
      </SafeAreaView>
    </>

  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: { fontSize: 16, color: '#777' },
  markAll: { color: colors?.red || '#6b0f13', fontWeight: '600' },

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
  leftIconWrap: { width: 56, alignItems: 'center', justifyContent: 'center' },
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
  iconImg: { width: 24, height: 24 },
  cardBody: { flex: 1, paddingLeft: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardSubtitle: { fontSize: 14, color: '#444', marginTop: 6, lineHeight: 20 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors?.red || '#6b0f13' },

  ctaButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors?.red || '#6b0f13',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  ctaText: { color: '#fff', fontWeight: '600' },
});

export default Notifications;
