import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActionSheetIOS,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import { Colors } from '../../../constants';

const { width } = Dimensions.get('window');

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello, I am still waiting for you',
      time: '12:59',
      date: '2024-01-15',
      type: 'received',
      status: 'read',
    },
    {
      id: '2',
      text: 'I am on my way. Had a little delay at the central station due to the weather. I am almost at the city centre.',
      time: '12:51',
      date: '2024-01-15',
      type: 'sent',
      status: 'read',
    },
    {
      id: '3',
      text: 'Great, no issues',
      time: '12:52',
      date: '2024-01-15',
      type: 'received',
      status: 'read',
    },
    {
      id: '4',
      voice: 'https://example.com/voice-message.mp3',
      time: '12:53',
      date: '2024-01-15',
      type: 'received',
      status: 'read',
    },
    {
      id: '5',
      time: '12:51',
      voice: 'https://example.com/voice-message.mp3',
      date: '2024-01-15',
      type: 'sent',
      status: 'sent',
    },
  ]);
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  const flatListRef = useRef(null);

  // Date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped = [];
    let currentDate = null;

    messages.forEach((message) => {
      if (message.date !== currentDate) {
        grouped.push({
          id: `date-${message.date}`,
          type: 'date',
          date: message.date,
          formattedDate: formatDate(message.date),
        });
        currentDate = message.date;
      }
      grouped.push(message);
    });

    return grouped;
  };

  // Image/Video picking functions
  const openMediaPicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Take Video', 'Choose from Library', 'Choose Multiple'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto();
          } else if (buttonIndex === 2) {
            takeVideo();
          } else if (buttonIndex === 3) {
            chooseFromLibrary();
          } else if (buttonIndex === 4) {
            chooseMultipleMedia();
          }
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeExif: true,
      mediaType: 'photo',
    }).then(image => {
      sendMediaMessage([{
        type: 'image',
        path: image.path,
        mime: image.mime,
        size: image.size,
      }]);
    }).catch(error => {
      console.log('Camera error: ', error);
    });
    setModalVisible(false);
  };

  const takeVideo = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
      videoQuality: 'high',
    }).then(video => {
      sendMediaMessage([{
        type: 'video',
        path: video.path,
        mime: video.mime,
        size: video.size,
        duration: video.duration,
      }]);
    }).catch(error => {
      console.log('Camera error: ', error);
    });
    setModalVisible(false);
  };

  const chooseFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeExif: true,
      mediaType: 'any',
    }).then(media => {
      const mediaType = media.mime?.startsWith('video') ? 'video' : 'image';
      sendMediaMessage([{
        type: mediaType,
        path: media.path,
        mime: media.mime,
        size: media.size,
        duration: media.duration,
      }]);
    }).catch(error => {
      console.log('Picker error: ', error);
    });
    setModalVisible(false);
  };

  const chooseMultipleMedia = () => {
    ImagePicker.openPicker({
      multiple: true,
      maxFiles: 8,
      mediaType: 'any',
    }).then(mediaItems => {
      setSelectedImages(mediaItems);
      
      const mediaMessages = mediaItems.map(item => ({
        type: item.mime?.startsWith('video') ? 'video' : 'image',
        path: item.path,
        mime: item.mime,
        size: item.size,
        duration: item.duration,
      }));
      
      sendMediaMessage(mediaMessages);
    }).catch(error => {
      console.log('Multiple picker error: ', error);
    });
    setModalVisible(false);
  };

  const sendMediaMessage = (mediaItems) => {
    const newMessage = {
      id: Date.now().toString() + Math.random(),
      media: mediaItems,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      type: 'sent',
      status: 'sent',
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setSelectedImages([]);
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate read receipt after 2 seconds
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 2000);
  };

  const sendTextMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        type: 'sent',
        status: 'sent',
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simulate read receipt after 2 seconds
      setTimeout(() => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 2000);
    }
  };

  const openMediaViewer = (mediaItems, index) => {
    setMediaList(mediaItems);
    setCurrentMediaIndex(index);
    setImageViewerVisible(true);
  };

  const renderMediaContent = (mediaItems) => {
    if (!mediaItems || mediaItems.length === 0) return null;
    
    const mediaCount = mediaItems.length;
    
    if (mediaCount === 1) {
      const item = mediaItems[0];
      return (
        <TouchableOpacity 
          onPress={() => openMediaViewer(mediaItems, 0)}
          activeOpacity={0.9}
        >
          {item.type === 'video' ? (
            <View style={styles.singleMediaContainer}>
              <Image 
                source={{ uri: item.path }} 
                style={styles.singleMediaImage} 
                resizeMode="cover"
              />
              <View style={styles.videoPlayButton}>
                <Icon name="play-arrow" size={30} color="#fff" />
              </View>
            </View>
          ) : (
            <Image 
              source={{ uri: item.path }} 
              style={styles.singleMediaImage} 
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      );
    } else {
      // Show grid for multiple media (max 4 visible)
      const visibleMedia = mediaItems.slice(0, 4);
      const remainingCount = mediaCount - 4;
      
      return (
        <TouchableOpacity 
          onPress={() => openMediaViewer(mediaItems, 0)}
          activeOpacity={0.9}
          style={styles.mediaGridContainer}
        >
          <View style={styles.mediaGrid}>
            {visibleMedia.map((item, index) => (
              <View key={index} style={styles.gridItem}>
                {item.type === 'video' ? (
                  <>
                    <Image 
                      source={{ uri: item.path }} 
                      style={styles.gridImage} 
                      resizeMode="cover"
                    />
                    <View style={styles.gridVideoIcon}>
                      <Icon name="play-arrow" size={16} color="#fff" />
                    </View>
                  </>
                ) : (
                  <Image 
                    source={{ uri: item.path }} 
                    style={styles.gridImage} 
                    resizeMode="cover"
                  />
                )}
                
                {index === 3 && remainingCount > 0 && (
                  <View style={styles.mediaOverlay}>
                    <Text style={styles.mediaOverlayText}>+{remainingCount}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderMessage = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.formattedDate}</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        item.type === 'sent' ? styles.sentMessage : styles.receivedMessage
      ]}>
       
        <View style={[
          styles.messageBubble,
          item.type === 'sent' ? styles.sentBubble : styles.receivedBubble
        ]}>
          {item.media && renderMediaContent(item.media)}
          
          {item.voice && (
            <View style={styles.voiceContainer}>
              <Icon name="play-arrow" size={24} color="#000" />
              <View style={styles.voiceWave}>
                <View style={[styles.wave, { height: 10, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 15, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 8, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 12, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 6, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 15, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 15, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 6, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 8, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 10, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 10, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 15, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 8, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 12, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 6, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 15, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 15, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 6, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 8, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 10, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 15, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 8, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 12, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 6, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 6, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 8, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 10, backgroundColor: '#666' }]} />
                <View style={[styles.wave, { height: 15, backgroundColor: '#666' }]} />
              </View>
              <Text style={styles.voiceDuration}>0:12</Text>
            </View>
          )}
          
          {item.text && (
            <Text style={[
              styles.messageText,
              item.type === 'sent' ? styles.sentMessageText : styles.receivedMessageText
            ]}>
              {item.text}
            </Text>
          )}
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              item.type === 'sent' ? styles.sentTime : styles.receivedTime
            ]}>
              {item.time}
            </Text>
            {item.type === 'sent' && (
              <Icon 
                name={item.status === 'read' ? 'done-all' : 'done'} 
                size={16} 
                color={item.status === 'read' ? '#34B7F1' : '#8696a0'} 
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <View style={styles.headerProfile}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Message</Text>
        </View>
      </View>

      <View style={styles.headerProfile}>
        <View style={styles.headerInfo}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerName}>
            Donatus Williams
          </Text>
        </View>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>D</Text>
        </View>
      </View>
    </View>
  );

  const renderInputBar = () => (
    <View style={styles.inputBar}>
      <TouchableOpacity 
        style={styles.attachButton}
        onPress={openMediaPicker}
      >
        <Icon name="attach-file" size={24} color="#8696a0" />
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
        {selectedImages.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedImagesContainer}>
            {selectedImages.map((img, index) => (
              <Image 
                key={index} 
                source={{ uri: img.path }} 
                style={styles.selectedImageThumb} 
              />
            ))}
          </ScrollView>
        )}
      </View>

      <TouchableOpacity 
        style={styles.sendButton}
        onPress={message.trim() ? sendTextMessage : null}
      >
        <Icon 
          name={message.trim() ? "send" : "mic"} 
          size={24} 
          color={message.trim() ? "#0084ff" : "#8696a0"} 
        />
      </TouchableOpacity>
    </View>
  );

  // Android media picker modal
  const renderMediaPickerModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
            <Icon name="camera-alt" size={24} color="#000" />
            <Text style={styles.modalOptionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={takeVideo}>
            <Icon name="videocam" size={24} color="#000" />
            <Text style={styles.modalOptionText}>Take Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={chooseFromLibrary}>
            <Icon name="photo-library" size={24} color="#000" />
            <Text style={styles.modalOptionText}>Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={chooseMultipleMedia}>
            <Icon name="collections" size={24} color="#000" />
            <Text style={styles.modalOptionText}>Choose Multiple</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modalOption, styles.modalCancel]} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Image/Video viewer modal
  const renderMediaViewer = () => (
    <Modal
      visible={imageViewerVisible}
      transparent={true}
      onRequestClose={() => setImageViewerVisible(false)}
    >
      <View style={styles.viewerContainer}>
        <View style={styles.viewerHeader}>
          <TouchableOpacity 
            style={styles.viewerCloseButton}
            onPress={() => setImageViewerVisible(false)}
          >
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.viewerCounter}>
            {currentMediaIndex + 1} / {mediaList.length}
          </Text>
        </View>
        
        <FlatList
          data={mediaList}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentMediaIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentMediaIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={[styles.viewerPage, { width }]}>
              {item.type === 'video' ? (
                <Video
                  source={{ uri: item.path }}
                  style={styles.viewerMedia}
                  resizeMode="contain"
                  controls={true}
                  paused={false}
                  repeat={false}
                />
              ) : (
                <Image 
                  source={{ uri: item.path }} 
                  style={styles.viewerMedia} 
                  resizeMode="contain"
                />
              )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </Modal>
  );

  const groupedMessages = groupMessagesByDate();

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor="#075E54" barStyle="dark-content" /> */}
      
      {renderHeader()}

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {renderInputBar()}
      </KeyboardAvoidingView>

      {renderMediaPickerModal()}
      {renderMediaViewer()}
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
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00a884',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  sentMessageText: {
    color: '#000',
  },
  receivedMessageText: {
    color: '#000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    marginRight: 4,
  },
  sentTime: {
    color: '#8696a0',
  },
  receivedTime: {
    color: '#8696a0',
  },
  // Media styles
  singleMediaContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  singleMediaImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  mediaGridContainer: {
    marginBottom: 4,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridItem: {
    width: '50%',
    height: '50%',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridVideoIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  mediaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaOverlayText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 5,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  voiceWave: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  wave: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  voiceDuration: {
    color: '#666',
    fontSize: 11,
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
  selectedImagesContainer: {
    flexDirection: 'row',
    maxHeight: 60,
    marginBottom: 5,
  },
  selectedImageThumb: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 5,
  },
  sendButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#000',
  },
  modalCancel: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    marginTop: 10,
  },
  modalCancelText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  // Viewer styles
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewerHeader: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  viewerCloseButton: {
    padding: 8,
  },
  viewerCounter: {
    color: '#fff',
    fontSize: 16,
  },
  viewerPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerMedia: {
    width: '100%',
    height: '100%',
  },
});

export default ChatScreen;