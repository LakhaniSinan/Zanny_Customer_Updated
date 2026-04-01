import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../../constants';
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';
import axios from 'axios';

const getDateKey = date => new Date(date).toISOString().split('T')[0];

const formatDate = dateString => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

const getUserId = user =>
  user?._id || user?.id || user?.customerId || user?.merchantId || '';

const buildChatId = (orderId, customerId, merchantId) => {
  if (orderId) return `order_${orderId}`;
  const sorted = [String(customerId || ''), String(merchantId || '')].sort();
  return `dm_${sorted.join('_')}`;
};

const formatDuration = seconds => {
  const mins = Math.floor(Number(seconds || 0) / 60)
    .toString()
    .padStart(2, '0');
  const secs = (Number(seconds || 0) % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const uploadVoiceNote = async audioUri => {
  const normalizedUri =
    Platform.OS === 'android' && !String(audioUri).startsWith('file://')
      ? `file://${audioUri}`
      : audioUri;
  const form = new FormData();
  form.append('file', {
    uri: normalizedUri,
    type: 'audio/wav',
    name: `voice_${Date.now()}.wav`,
  });
  form.append('upload_preset', 'znuys2j4');
  form.append('cloud_name', 'dcmawlfn2');

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/dcmawlfn2/auto/upload',
    form,
    {headers: {'Content-Type': 'multipart/form-data'}},
  );
  return response?.data?.secure_url || '';
};

const ChatScreen = ({navigation, route}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const flatListRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const soundRef = useRef(null);
  const seenTimeoutRef = useRef(null);
  const user = useSelector(state => state?.LoginSlice?.user);

  const currentUserId = useMemo(() => getUserId(user), [user]);
  const participantName = route?.params?.participantName || 'Message';
  const orderId = route?.params?.orderId;
  const customerId = route?.params?.customerId;
  const merchantId = route?.params?.merchantId;
  const senderType = route?.params?.senderType || 'customer';
  const senderName =
    user?.name || user?.fullName || user?.customerName || 'Customer';
  const senderImage =
    user?.profileImage || user?.customerImage || user?.merchantImage || '';

  const chatId = useMemo(
    () => buildChatId(orderId, customerId, merchantId),
    [orderId, customerId, merchantId],
  );

  useEffect(() => {
    Sound.setCategory('Playback');
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
      }
      if (seenTimeoutRef.current) clearTimeout(seenTimeoutRef.current);
      AudioRecord.stop().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!chatId || !currentUserId) return;

    const chatRef = firestore().collection('chats').doc(chatId);

    chatRef.set(
      {
        chatId,
        orderId: orderId || null,
        customerId: customerId || null,
        merchantId: merchantId || null,
        customerName: route?.params?.customerName || senderName,
        merchantName: route?.params?.merchantName || route?.params?.participantName || null,
        participants: [customerId, merchantId].filter(Boolean),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {merge: true},
    );

    const unsubscribe = chatRef
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const markDeliveredRefs = [];
        const markSeenRefs = [];

        const next = snapshot.docs.map(doc => {
          const data = doc.data() || {};
          const createdAtDate =
            data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now());
          const isSent = String(data.senderId) === String(currentUserId);

          if (!isSent) {
            if (!data.deliveredAt) markDeliveredRefs.push(doc.ref);
            if (!data.seenAt) markSeenRefs.push(doc.ref);
          }

          return {
            id: doc.id,
            messageType: data.type || 'text',
            text: data.text || '',
            audioUri: data.audioUri || '',
            senderImage: data.senderImage || '',
            durationSec: Number(data.durationSec || 0),
            messageStatus: data.seenAt
              ? 'seen'
              : data.deliveredAt
              ? 'delivered'
              : 'sent',
            time: createdAtDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            date: getDateKey(createdAtDate),
            type: isSent ? 'sent' : 'received',
          };
        });
        setMessages(next);

        if (markDeliveredRefs.length) {
          Promise.allSettled(
            markDeliveredRefs.map(ref =>
              ref.set(
                {deliveredAt: firestore.FieldValue.serverTimestamp()},
                {merge: true},
              ),
            ),
          );
        }

        if (markSeenRefs.length) {
          if (seenTimeoutRef.current) clearTimeout(seenTimeoutRef.current);
          seenTimeoutRef.current = setTimeout(() => {
            Promise.allSettled(
              markSeenRefs.map(ref =>
                ref.set({seenAt: firestore.FieldValue.serverTimestamp()}, {merge: true}),
              ),
            );
          }, 700);
        }
      });

    return () => unsubscribe();
  }, [
    chatId,
    currentUserId,
    orderId,
    customerId,
    merchantId,
    route?.params?.customerName,
    route?.params?.merchantName,
    route?.params?.participantName,
    senderName,
  ]);

  const sendTextMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !chatId || !currentUserId) return;

    const chatRef = firestore().collection('chats').doc(chatId);
    const now = firestore.FieldValue.serverTimestamp();

    await chatRef.collection('messages').add({
      text: trimmed,
      type: 'text',
      senderId: currentUserId,
      senderType,
      senderName,
      senderImage,
      createdAt: now,
    });

    await chatRef.set(
      {
        lastMessage: trimmed,
        lastMessageSenderId: currentUserId,
        lastMessageSenderType: senderType,
        updatedAt: now,
      },
      {merge: true},
    );

    setMessage('');
  };

  const requestAudioPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const startRecording = async () => {
    try {
      if (isRecording || !chatId || !currentUserId) return;
      const allowed = await requestAudioPermission();
      if (!allowed) {
        Alert.alert('Permission required', 'Please allow microphone permission.');
        return;
      }
      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: `voice-${Date.now()}.wav`,
      });
      setRecordingSeconds(0);
      await AudioRecord.start();
      setIsRecording(true);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (error) {
      Alert.alert('Recording error', 'Voice note start nahi ho saka.');
    }
  };

  const stopRecording = async shouldSend => {
    try {
      if (!isRecording) return;
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      const audioUri = await AudioRecord.stop();
      setIsRecording(false);
      if (!shouldSend || !audioUri) {
        setRecordingSeconds(0);
        return;
      }

      const uploadedUrl = await uploadVoiceNote(audioUri);
      if (!uploadedUrl) {
        Alert.alert('Upload error', 'Voice note upload nahi ho saka.');
        setRecordingSeconds(0);
        return;
      }

      const chatRef = firestore().collection('chats').doc(chatId);
      const now = firestore.FieldValue.serverTimestamp();
      await chatRef.collection('messages').add({
        type: 'voice',
        audioUri: uploadedUrl,
        durationSec: recordingSeconds,
        senderId: currentUserId,
        senderType,
        senderName,
        senderImage,
        createdAt: now,
      });
      await chatRef.set(
        {
          lastMessage: 'Voice note',
          lastMessageSenderId: currentUserId,
          lastMessageSenderType: senderType,
          updatedAt: now,
        },
        {merge: true},
      );
      setRecordingSeconds(0);
    } catch (error) {
      Alert.alert('Voice note error', 'Voice note send nahi ho saka.');
      setRecordingSeconds(0);
      setIsRecording(false);
    }
  };

  const playVoiceNote = item => {
    if (!item?.audioUri) return;
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
    const nextSound = new Sound(item.audioUri, null, error => {
      if (error) {
        Alert.alert('Playback error', 'Voice note play nahi ho saka.');
        setPlayingMessageId(null);
        return;
      }
      setPlayingMessageId(item.id);
      nextSound.play(() => {
        setPlayingMessageId(null);
        nextSound.release();
        soundRef.current = null;
      });
    });
    soundRef.current = nextSound;
  };

  const groupedMessages = useMemo(() => {
    const grouped = [];
    let currentDate = null;

    messages.forEach(msg => {
      if (msg.date !== currentDate) {
        grouped.push({
          id: `date-${msg.date}`,
          type: 'date',
          date: msg.date,
          formattedDate: formatDate(msg.date),
        });
        currentDate = msg.date;
      }
      grouped.push(msg);
    });

    return grouped;
  }, [messages]);

  const renderMessage = ({item}) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.formattedDate}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          item.type === 'sent' ? styles.sentMessage : styles.receivedMessage,
        ]}>
        <View
          style={[
            styles.messageBubble,
            item.type === 'sent' ? styles.sentBubble : styles.receivedBubble,
          ]}>
          {item.messageType === 'voice' ? (
            <TouchableOpacity
              style={[
                styles.voiceContainer,
                item.type === 'sent'
                  ? styles.voiceContainerSent
                  : styles.voiceContainerReceived,
              ]}
              onPress={() => playVoiceNote(item)}>
              <View
                style={[
                  styles.voiceAvatar,
                  item.type === 'sent' && styles.voiceAvatarSent,
                ]}>
                {item?.senderImage ? (
                  <Image source={{uri: item.senderImage}} style={styles.voiceAvatarImage} />
                ) : (
                  <Icon name="person" size={15} color="#fff" />
                )}
              </View>
              <View style={styles.voiceMain}>
                <View style={styles.voiceTopRow}>
                  <View style={styles.voicePlayButton}>
                    <Icon
                      name={playingMessageId === item.id ? 'pause' : 'play-arrow'}
                      size={20}
                      color={item.type === 'sent' ? '#fff' : '#222'}
                    />
                  </View>
                  <View style={styles.waveWrap}>
                    {Array.from({length: 34}).map((_, index) => (
                      <View
                        key={`wave-${item.id}-${index}`}
                        style={[
                          styles.waveBar,
                          {
                            backgroundColor:
                              item.type === 'sent'
                                ? 'rgba(255,255,255,0.85)'
                                : 'rgba(0,0,0,0.5)',
                          },
                          {height: 6 + ((index * 5) % 16)},
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.voiceBottomRow}>
                  <Text style={styles.voiceDuration}>
                    {formatDuration(item.durationSec)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <Text style={styles.messageText}>{item.text}</Text>
          )}
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>{item.time}</Text>
            {item.type === 'sent' && (
              <Icon
                style={styles.tickIcon}
                name={item.messageStatus === 'sent' ? 'done' : 'done-all'}
                size={16}
                color={item.messageStatus === 'seen' ? '#34B7F1' : '#8696a0'}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerProfile}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>Message</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.participantName}>
              {participantName}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
        />

        <View style={styles.inputBar}>
          {!isRecording ? (
            <>
              <TouchableOpacity style={styles.attachButton} disabled>
                <Icon name="attach-file" size={24} color="#d0d0d0" />
              </TouchableOpacity>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Message"
                  placeholderTextColor="#8696a0"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                />
              </View>
            </>
          ) : (
            <View style={styles.recordingWrap}>
              <TouchableOpacity onPress={() => stopRecording(false)}>
                <Icon name="delete-outline" size={24} color="#ff3b30" />
              </TouchableOpacity>
              <View style={styles.recordingCenter}>
                <View style={styles.recordDot} />
                <Text style={styles.recordingText}>
                  Recording... {formatDuration(recordingSeconds)}
                </Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              if (message.trim()) {
                sendTextMessage();
                return;
              }
              if (isRecording) {
                stopRecording(true);
              } else {
                startRecording();
              }
            }}>
            <Icon
              name={message.trim() ? 'send' : isRecording ? 'check' : 'mic'}
              size={24}
              color={message.trim() || isRecording ? '#0084ff' : '#8696a0'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerButton: {
    padding: 8,
  },
  headerProfile: {
    flex: 1,
    marginLeft: 6,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: '#e1f5fe',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    color: '#000',
    overflow: 'hidden',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  sentBubble: {
    backgroundColor: '#FDDDDD',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#FCE4BE',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#8696a0',
  },
  tickIcon: {
    marginLeft: 4,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 13,
    backgroundColor: Colors.white,
    elevation: 7,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  attachButton: {
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'lightgray',
    borderRadius: 24,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    minHeight: 46,
  },
  input: {
    color: '#000',
    fontSize: 16,
    paddingVertical: 12,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
  recordingWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 28,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    minHeight: 46,
  },
  recordingCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  recordDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff3b30',
    marginRight: 8,
  },
  recordingText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '500',
  },
  voiceContainer: {flexDirection: 'row', alignItems: 'center', minWidth: 240},
  voiceContainerSent: {flexDirection: 'row-reverse'},
  voiceContainerReceived: {flexDirection: 'row'},
  voiceAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  voiceAvatarSent: {
    marginRight: 0,
    marginLeft: 8,
  },
  voiceAvatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  voiceMain: {flex: 1},
  voiceTopRow: {flexDirection: 'row', alignItems: 'center'},
  voicePlayButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  waveWrap: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  waveBar: {
    width: 2,
    borderRadius: 2,
    marginRight: 2,
  },
  voiceBottomRow: {marginTop: 4, flexDirection: 'row', justifyContent: 'space-between'},
  voiceDuration: {fontSize: 12, color: '#222', fontWeight: '500'},
  participantName: {
    color: '#333',
    fontSize: 13,
  },
});
export default ChatScreen;