import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import {width} from 'react-native-dimension';

import {fontFamily, icons, images} from '../../../assets';
import BackButton from '../../../components/backIcon';
import AppHeader from '../../../components/headerComponent';
import CommonModal from '../../../components/modal';
import PrimaryButton from '../../../components/primaryButton';
import {colors, Colors} from '../../../constants';

const DUMMY_PACKAGES = [
  {
    id: '1',
    title: '3-Course Dinner',
    subTitle: 'Starter  Dessert  Main Course',
    price: '£50',
    unit: '/per person',
  },
  {
    id: '2',
    title: 'Private Cooking',
    subTitle: 'Menu Planning',
    price: '£200',
    unit: '/per hour',
  },
];

const DUMMY_STARTERS = [
  {
    id: 'starter-1',
    name: 'Grilled chicken lavash\nonion greens',
    time: '20mins',
  },
  {id: 'starter-2', name: 'Grilled chicken steak\nvegetables', time: '20mins'},
];

const DUMMY_DESSERTS = [
  {
    id: 'dessert-1',
    name: 'Cake topped with\ncaramel ice cream',
    time: '20mins',
  },
];

const DUMMY_MAIN = [
  {id: 'main-1', name: 'Grilled beef steak\nwith sauce', time: '30mins'},
];

const AVAILABILITY = [
  {id: 'w', label: 'Water Supply'},
  {id: 'k', label: 'Working Kitchen'},
  {id: 'h', label: 'Chef can arrive an hour before'},
  {id: 'i', label: 'Ingredients available on site'},
];

const MealItem = ({item, checked, onPress, onDetailsPress}) => (
  <View
    style={{
      flexDirection: 'row',
      paddingVertical: width(3),
      borderBottomWidth: 0.5,
      borderColor: colors.border,
    }}>
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        height: width(5),
        width: width(5),
        borderRadius: 6,
        borderColor: colors.redish,
        backgroundColor: checked ? colors.redish : colors.white,
        borderWidth: 1,
        marginTop: width(3),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {checked && (
        <Image
          source={icons.checkIcon}
          resizeMode="contain"
          style={{height: '80%', width: '80%'}}
        />
      )}
    </TouchableOpacity>

    <Image
      source={images.foodimage1}
      style={{
        height: 70,
        width: 70,
        borderRadius: 10,
        marginHorizontal: width(3),
      }}
    />

    <View style={{flex: 1}}>
      <Text style={{fontFamily: fontFamily.poppinSemiBold, fontSize: 14}}>
        {item.name}
      </Text>
      <Text style={{fontSize: 12, color: colors.gray, marginVertical: 4}}>
        ⏱ {item.time}
      </Text>
      <TouchableOpacity
        onPress={onDetailsPress}
        style={{
          backgroundColor: colors.black,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 20,
          alignSelf: 'flex-start',
        }}>
        <Text style={{color: colors.white, fontSize: 11}}>View Details</Text>
      </TouchableOpacity>
    </View>

    <View style={{marginLeft: 8, gap: 6}}>
      <BackButton icon={icons.heartBrown} border={1} />
      <BackButton icon={icons.share} border={1} />
    </View>
  </View>
);

const NutritionRow = ({icon, label, value, percent}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: width(4),
    }}>
    <View
      style={{
        height: width(10),
        width: width(10),
        borderRadius: width(2),
        backgroundColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: width(3),
      }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{height: '50%', width: '50%'}}
      />
    </View>
    <View style={{width: '85%'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: fontFamily.poppinRegular,
            color: colors.gray,
          }}>
          {label}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontFamily: fontFamily.poppinRegular,
            color: colors.gray,
          }}>
          {value}
        </Text>
      </View>
      <View
        style={{
          height: 10,
          backgroundColor: colors.border,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <View
          style={{
            height: '100%',
            width: `${percent}%`,
            backgroundColor: colors.grayplus,
            borderRadius: 10,
          }}
        />
      </View>
    </View>
  </View>
);

const MealDetailModal = ({item, onClose}) => {
  if (!item) {
    return null;
  }
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: width(5),
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: width(4),
        }}>
        <Text style={{fontFamily: fontFamily.poppinSemiBold, fontSize: 18}}>
          Meal Details
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={{
            height: 30,
            width: 30,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.border,
          }}>
          <Image
            source={icons.closeBtnIcon}
            style={{height: 10, width: 10}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row'}}>
        <Image
          source={images.foodimage1}
          style={{
            height: width(28),
            width: width(28),
            borderRadius: 14,
            marginRight: width(4),
          }}
        />
        <View style={{flex: 1}}>
          <Text style={{fontFamily: fontFamily.poppinSemiBold, fontSize: 16}}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.gray,
              marginVertical: 6,
            }}>
            ⏱ {item.time}
          </Text>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.clayLite,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20,
            }}>
            <Text style={{fontSize: 12}}>Starters</Text>
          </View>
        </View>
      </View>

      <Text
        style={{
          fontSize: 13,
          color: colors.gray,
          lineHeight: 20,
          marginVertical: width(4),
        }}>
        A hearty blend of sautéed Mediterranean vegetables in a rich tomato-herb
        sauce, served warm with crusty bread.
      </Text>

      <Text
        style={{
          fontFamily: fontFamily.poppinSemiBold,
          fontSize: 16,
          marginBottom: width(3),
        }}>
        Nutrition
      </Text>
      <NutritionRow icon={icons.carbs} label="Carbs" value="65g" percent={65} />
      <NutritionRow
        icon={icons.protein}
        label="Protein"
        value="27g"
        percent={27}
      />
      <NutritionRow icon={icons.fats} label="Fats" value="91g" percent={91} />
      <NutritionRow icon={icons.kcal} label="Kcal" value="120" percent={60} />
    </View>
  );
};

const Section = ({
  title,
  data,
  sectionKey,
  selectedMeals,
  onToggle,
  onViewDetailPress,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <View style={{borderBottomWidth: 1, borderColor: colors.border}}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: width(4),
        }}>
        <Text
          style={{
            fontFamily: fontFamily.poppinSemiBold,
            fontSize: 16,
            color: colors.redish,
          }}>
          {title}
        </Text>
        <Image
          source={icons.arrowDown}
          resizeMode="contain"
          style={{
            height: 10,
            width: 10,
            transform: [{rotate: open ? '180deg' : '0deg'}],
          }}
        />
      </TouchableOpacity>
      {open &&
        data.map(item => (
          <MealItem
            key={item.id}
            item={item}
            checked={selectedMeals.some(m => m.id === item.id)}
            onPress={() => onToggle(item, sectionKey)}
            onDetailsPress={() => onViewDetailPress(item)}
          />
        ))}
    </View>
  );
};

const SubscribeChefDay = ({navigation, route}) => {
  const {
    chefData = {},
    dayIndex = 1,
    dateString,
    plan = 'daily',
    subscriptionDates = [],
  } = route.params || {};

  const [selectedPackage, setSelectedPackage] = useState('1');
  const [ampm, setAmpm] = useState('AM');
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [availability, setAvailability] = useState({w: true});
  const [specialNote, setSpecialNote] = useState('');
  const [promo, setPromo] = useState('');
  const modalRef = useRef(null);

  const formattedDate = dateString
    ? moment(dateString).format('ddd DD/MM/YY')
    : '—';

  const cuisineTags = String(chefData?.foodType || 'British, American')
    .split(/[,/&]/)
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 2);

  const toggleMeal = (meal, section) => {
    setSelectedMeals(prev => {
      const exists = prev.find(i => i.id === meal.id);
      if (exists) {
        return prev.filter(i => i.id !== meal.id);
      }
      return [...prev, {...meal, section}];
    });
  };

  const onDetailsPress = item => {
    setSelectedMeal(item);
    modalRef.current?.isVisible();
  };

  const toggleAvail = id => {
    setAvailability(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleProceed = () => {
    navigation.navigate('OrderSummry', {
      items: selectedMeals,
      chefData,
      plan,
      dayIndex,
      dateString,
      subscriptionDates,
      date: formattedDate,
      flow: 'subscribe',
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader text={`Day ${dayIndex}`} goBack />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: width(4), paddingTop: width(2)}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Text style={{fontSize: 16}}>🗓</Text>
            <Text
              style={{
                fontFamily: fontFamily.poppinSemiBold,
                color: colors.redish,
                fontSize: 15,
              }}>
              {formattedDate}
            </Text>
          </View>

          <View
            style={{
              marginTop: width(4),
              flexDirection: 'row',
              padding: width(3),
              borderRadius: 16,
              borderWidth: 1,
              backgroundColor: colors.white,
              borderColor: colors.border,
              gap: width(3),
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}>
            <Image
              source={
                chefData?.merchantImage
                  ? {uri: chefData.merchantImage}
                  : icons.User
              }
              style={{
                width: width(16),
                height: width(16),
                borderRadius: width(8),
                backgroundColor: colors.clay,
              }}
            />
            <View style={{flex: 1}}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                <Text style={{fontFamily: fontFamily.poppinBold, fontSize: 15}}>
                  {chefData?.name || 'Leanne Wayne'}
                </Text>
                <View
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: colors.red,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: '#fff', fontSize: 9, fontWeight: '700'}}>
                    ✓
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 6,
                }}>
                {cuisineTags.map((t, i) => (
                  <View
                    key={`${t}-${i}`}
                    style={{
                      backgroundColor: '#FAF1EC',
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      borderRadius: 999,
                    }}>
                    <Text style={{fontSize: 10, color: '#50555C'}}>{t}</Text>
                  </View>
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 6,
                }}>
                <Image
                  source={icons.yellowStar}
                  style={{width: 14, height: 14, marginRight: 4}}
                />
                <Text style={{fontSize: 12, color: Colors.grayyy}}>
                  4.8 (120+) · 2.8 km away
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              marginTop: width(5),
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 15,
              color: Colors.black,
            }}>
            Select Time Meal is needed
          </Text>
          <View
            style={{
              marginTop: width(2),
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 999,
              paddingVertical: width(2.5),
              paddingHorizontal: width(4),
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Image source={icons.clock} style={{width: 18, height: 18}} />
              <Text
                style={{fontFamily: fontFamily.poppinSemiBold, fontSize: 15}}>
                12 : 30
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 8}}>
              {['AM', 'PM'].map(v => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setAmpm(v)}
                  style={{
                    paddingHorizontal: width(3),
                    paddingVertical: width(1.5),
                    borderRadius: 999,
                    backgroundColor: ampm === v ? colors.redish : colors.clay,
                  }}>
                  <Text
                    style={{
                      color: ampm === v ? '#fff' : Colors.black,
                      fontFamily: fontFamily.poppinSemiBold,
                      fontSize: 12,
                    }}>
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text
            style={{
              marginTop: width(5),
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 15,
            }}>
            Select Package
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: width(2),
              gap: width(2),
            }}>
            {DUMMY_PACKAGES.map(pkg => (
              <TouchableOpacity
                key={pkg.id}
                onPress={() => setSelectedPackage(pkg.id)}
                style={{
                  flex: 1,
                  borderRadius: 16,
                  padding: width(2),
                  borderWidth: selectedPackage === pkg.id ? 0 : 1,
                  borderColor: colors.border,
                  backgroundColor:
                    selectedPackage === pkg.id ? colors.yellow : Colors.white,
                }}>
                <Text
                  style={{fontFamily: fontFamily.poppinSemiBold, fontSize: 13}}>
                  {pkg.title}
                </Text>
                <Text
                  style={{fontSize: 11, marginTop: 4, color: Colors.grayyy}}>
                  {pkg.subTitle}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.red,
                    marginTop: width(2),
                    fontFamily: fontFamily.poppinBold,
                  }}>
                  {pkg.price}
                  <Text style={{fontSize: 12, color: Colors.black}}>
                    {pkg.unit}
                  </Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedPackage == '2' && (
            <>
              <Text
                style={{
                  marginTop: width(5),
                  fontFamily: fontFamily.poppinRegular,
                  fontSize: 13,
                  color: Colors.grayyy,
                  lineHeight: 20,
                }}>
                Please update the availability of the items listed below to hire
                chef for a private cooking.
              </Text>
              {AVAILABILITY.map(row => (
                <TouchableOpacity
                  key={row.id}
                  onPress={() => toggleAvail(row.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: width(2.5),
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: colors.redish,
                      marginRight: width(3),
                      backgroundColor: availability[row.id]
                        ? colors.redish
                        : '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {availability[row.id] && (
                      <Text style={{color: '#fff', fontSize: 12}}>✓</Text>
                    )}
                  </View>
                  <Text
                    style={{fontFamily: fontFamily.poppinMedium, fontSize: 14}}>
                    {row.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          <Text
            style={{
              marginTop: width(5),
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 16,
            }}>
            Menu
          </Text>
          <Text style={{fontSize: 12, color: Colors.grayyy, marginTop: 4}}>
            A 3 course meal prepared from the chef&apos;s expertise.
          </Text>

          <View style={{marginTop: width(2)}}>
            <Section
              title="Starter"
              sectionKey="starter"
              data={DUMMY_STARTERS}
              selectedMeals={selectedMeals}
              onToggle={toggleMeal}
              onViewDetailPress={onDetailsPress}
            />
            <Section
              title="Dessert"
              sectionKey="dessert"
              data={DUMMY_DESSERTS}
              selectedMeals={selectedMeals}
              onToggle={toggleMeal}
              onViewDetailPress={onDetailsPress}
            />
            <Section
              title="Main Course"
              sectionKey="main"
              data={DUMMY_MAIN}
              selectedMeals={selectedMeals}
              onToggle={toggleMeal}
              onViewDetailPress={onDetailsPress}
            />
          </View>

          <Text
            style={{
              marginTop: width(5),
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 15,
            }}>
            Special Order
          </Text>
          <Text style={{fontSize: 12, color: Colors.grayyy, marginTop: 4}}>
            Add any special instructions for this day.
          </Text>
          <TextInput
            value={specialNote}
            onChangeText={setSpecialNote}
            multiline
            placeholder="Type here..."
            placeholderTextColor={Colors.grayyy}
            style={{
              marginTop: width(2),
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 16,
              padding: width(3),
              minHeight: width(24),
              textAlignVertical: 'top',
              fontFamily: fontFamily.poppinRegular,
            }}
          />

          <Text
            style={{
              marginTop: width(5),
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 15,
            }}>
            Promo
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: width(2),
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 999,
              paddingLeft: width(4),
            }}>
            <TextInput
              value={promo}
              onChangeText={setPromo}
              placeholder="Enter Promo Code"
              placeholderTextColor={Colors.grayyy}
              style={{flex: 1, paddingVertical: width(3), fontSize: 14}}
            />
            <TouchableOpacity
              style={{
                paddingHorizontal: width(4),
                paddingVertical: width(2.5),
                backgroundColor: colors.softgray,
                borderRadius: 999,
                margin: 4,
              }}>
              <Text style={{fontFamily: fontFamily.poppinMedium}}>
                Apply Code
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              marginTop: width(5),
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 16,
            }}>
            Payment Summary
          </Text>
          <View
            style={{
              marginTop: width(2),
              marginBottom: width(6),
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: width(4),
              gap: width(2),
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: Colors.grayyy}}>Sub Total</Text>
              <Text style={{fontFamily: fontFamily.poppinSemiBold}}>
                £28.12
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: Colors.grayyy}}>Traveling Cost</Text>
              <Text style={{fontFamily: fontFamily.poppinSemiBold}}>£20</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderTopColor: colors.border,
                paddingTop: width(2),
              }}>
              <Text style={{fontFamily: fontFamily.poppinBold}}>
                Total Price
              </Text>
              <Text style={{fontFamily: fontFamily.poppinBold}}>£48.12</Text>
            </View>
          </View>
        </View>

        <View style={{height: width(14), marginHorizontal: width(4)}}>
          <PrimaryButton name="Proceed to Check out" onPress={handleProceed} />
        </View>
        <View style={{height: width(8)}} />
      </ScrollView>

      <CommonModal ref={modalRef}>
        <MealDetailModal
          item={selectedMeal}
          onClose={() => modalRef.current?.hide?.()}
        />
      </CommonModal>
    </View>
  );
};

export default SubscribeChefDay;
