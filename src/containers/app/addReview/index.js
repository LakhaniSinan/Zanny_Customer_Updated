import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {images} from '../../../assets';
import {useSelector} from 'react-redux';
import {addReviews} from '../../../services/reviews';
import OverLayLoader from '../../../components/loader';
import CommonModal from '../../../components/modal';

const LeaveReviewScreen = ({route, navigation}) => {
  const data = route.params;
  const modalRef = useRef(null);
  const {user} = useSelector(state => state.LoginSlice);
  const [rating, setRating] = useState(3);
  const [isLoading, setIsloding] = useState(false);
  const [feedback, setFeedBack] = useState(20);

  const handleAddReview = async () => {
    try {
      let payload = {
        customerName: user?.name,
        orderId: data?.orderId,
        merchantId: data?.merchantId,
        feedback: feedback,
        rating: rating,
      };
      setIsloding(true);
      const response = await addReviews(payload);
      if (response.status === 200 || response.status === 201) {
        navigation.reset({
          index: 0,
          routes: [{name: 'History'}], // yahan apni screen ka name do
        });
      } else {
        Alert.alert('Error', response.data?.message);
      }
      console.log(response, 'responseresponseresponseresponse122');
    } catch (error) {
      console.log(error, 'errorerrorerrorerrorerror');
    } finally {
      setIsloding(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <OverLayLoader isloading={isLoading} />
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Review</Text>
      </View>

      <View style={styles.iconContainer}>
        <Image source={images.reviewIcon} style={styles.icon} />
      </View>

      <Text style={styles.title}>How was your Order?</Text>
      <Text style={styles.subTitle}>Your overall rating</Text>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(item => (
          <TouchableOpacity key={item} onPress={() => setRating(item)}>
            <Text
              style={[
                styles.star,
                {color: item <= rating ? '#F5A623' : '#E0E0E0'},
              ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Add Detailed review</Text>
      <TextInput
        placeholder="Enter here"
        placeholderTextColor="#BDBDBD"
        style={styles.input}
        multiline
        onChangeText={setFeedBack}
        value={feedback}
      />
      {/* <TouchableOpacity style={styles.photoRow}>
        <Text style={styles.photoIcon}>🖼️</Text>
        <Text style={styles.photoText}>Add Photo</Text>
      </TouchableOpacity>

      <Text style={styles.tipLabel}>
        Tip <Text style={{color: '#999'}}>(Select who is getting a tip)</Text>
      </Text>

      <View style={styles.tipPersonRow}>
        {['Chef', 'Driver'].map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedTipTo(item)}
            style={[
              styles.tipPersonBtn,
              selectedTipTo === item && styles.tipPersonBtnActive,
            ]}>
            <Text
              style={[
                styles.tipPersonText,
                selectedTipTo === item && styles.tipPersonTextActive,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tipAmountRow}>
        {tips.map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedTip(item)}
            style={[
              styles.tipAmountBtn,
              selectedTip === item && styles.tipAmountBtnActive,
            ]}>
            <Text
              style={[
                styles.tipAmountText,
                selectedTip === item && styles.tipAmountTextActive,
              ]}>
              £{item}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAddReview} style={styles.submitBtn}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LeaveReviewScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backArrow: {fontSize: 28, color: '#4A0000', marginRight: 10},
  headerTitle: {fontSize: 20, fontWeight: '600', color: '#4A0000'},

  iconContainer: {alignItems: 'center', marginTop: 20},
  icon: {width: 120, height: 120, resizeMode: 'contain'},

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#4A0000',
    marginTop: 10,
  },
  subTitle: {
    textAlign: 'center',
    color: '#9E9E9E',
    marginTop: 5,
  },

  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  star: {fontSize: 32, marginHorizontal: 3},

  label: {
    marginLeft: 20,
    marginTop: 25,
    fontSize: 16,
    fontWeight: '500',
  },

  input: {
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 12,
    height: 100,
    padding: 10,
    textAlignVertical: 'top',
  },

  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 15,
  },
  photoIcon: {fontSize: 20},
  photoText: {marginLeft: 8, color: '#4A0000', fontWeight: '500'},

  tipLabel: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 15,
    fontWeight: '500',
  },

  tipPersonRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 20,
  },
  tipPersonBtn: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: '#EEE',
    marginRight: 10,
  },
  tipPersonBtnActive: {
    backgroundColor: '#4A0000',
  },
  tipPersonText: {color: '#555'},
  tipPersonTextActive: {color: '#FFF'},

  tipAmountRow: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 20,
  },
  tipAmountBtn: {
    borderWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  tipAmountBtnActive: {
    backgroundColor: '#4A0000',
    borderColor: '#4A0000',
  },
  tipAmountText: {color: '#777'},
  tipAmountTextActive: {color: '#FFF'},

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#EEE',
    padding: 15,
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {color: '#555', fontWeight: '600'},

  submitBtn: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: 'center',
  },
  submitText: {color: '#FFF', fontWeight: '600'},
});
