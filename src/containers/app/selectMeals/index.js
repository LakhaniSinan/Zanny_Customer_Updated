import React, {useRef, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {width} from 'react-native-dimension';
import {fontFamily, icons, images} from '../../../assets';
import BackButton from '../../../components/backIcon';
import AppHeader from '../../../components/headerComponent';
import CommonModal from '../../../components/modal';
import PrimaryButton from '../../../components/primaryButton';
import {colors} from '../../../constants';

/* ---------------- DUMMY DATA ---------------- */

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
  {
    id: 'starter-3',
    name: 'Grilled chicken\nlavash onion greens',
    time: '20mins',
  },
];

const DUMMY_DESSERTS = [
  {
    id: 'dessert-1',
    name: 'Cake topped with\ncaramel ice cream',
    time: '20mins',
  },
  {
    id: 'dessert-2',
    name: 'Chocolate brownie\ncake piece stack',
    time: '20mins',
  },
];
const DUMMY_MAIN_COURSE = [
  {
    id: 'main-1',
    name: 'Grilled beef steak\nwith sauce',
    time: '30mins',
  },
  {
    id: 'main-2',
    name: 'Roasted chicken\nwith vegetables',
    time: '35mins',
  },
];

const MealItem = ({item, checked, onPress, onDetailsPress}) => {
  return (
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
};

const NutritionRow = ({icon, label, value, percent}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: width(4),
      }}>
      {/* LEFT CIRCLE ICON */}
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

        {/* PROGRESS BAR */}
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
};

const MealDetailModal = ({item, onClose}) => {
  if (!item) return null;

  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: width(5),
      }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: width(4),
        }}>
        <View
          style={{
            height: width(10),
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 18,
            }}>
            Meal Details
          </Text>
          <TouchableOpacity
            onPress={() => onClose()}
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

        <TouchableOpacity onPress={onClose}>
          <Image source={icons.close} style={{height: 18, width: 18}} />
        </TouchableOpacity>
      </View>

      {/* TOP INFO */}
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
          <Text
            style={{
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 16,
            }}>
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

          {/* CATEGORY */}
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.lightGray,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20,
            }}>
            <Text style={{fontSize: 12}}>Starters</Text>
          </View>
        </View>
      </View>

      {/* DESCRIPTION */}
      <Text
        style={{
          fontSize: 13,
          color: colors.gray,
          lineHeight: 20,
          marginVertical: width(4),
        }}>
        A hearty and colourful blend of sautéed Mediterranean vegetables in a
        rich tomato-herb sauce, served warm with crusty whole-grain bread and a
        glass of red wine perfect for a cozy evening meal.
      </Text>

      {/* NUTRITION */}
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
            onDetailsPress={() => onViewDetailPress(item)}
            item={item}
            checked={selectedMeals.some(m => m.id === item.id)}
            onPress={() => onToggle(item, sectionKey)}
          />
        ))}
    </View>
  );
};

/* ---------------- MAIN SCREEN ---------------- */

const SelectMeals = ({navigation, route}) => {
  const data = route.params;

  const [selectedPackage, setSelectedPackage] = useState('1');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const modalRef = useRef(null);

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
    modalRef.current.isVisible();
  };

  const handleProceed = () => {
    console.log(selectedMeals, 'selectedMealselectedMeal');
    let params = {
      items: selectedMeals,
      ...data,
    };
    navigation.navigate('OrderSummry', params);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <AppHeader text="Select Meals" goBack cartIcon />

      <ScrollView>
        {/* PACKAGES */}
        <Text style={styles.title}>Select Package</Text>

        <View style={styles.packageRow}>
          {DUMMY_PACKAGES.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedPackage(item.id)}
              style={[
                styles.packageCard,
                {
                  backgroundColor:
                    selectedPackage === item.id ? colors.yellow : colors.white,
                },
              ]}>
              <Text style={styles.packageTitle}>{item.title}</Text>
              <Text style={styles.packageSub}>{item.subTitle}</Text>
              <Text style={styles.packagePrice}>
                {item.price}
                <Text style={styles.packageUnit}>{item.unit}</Text>
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* MENU */}
        <Text style={styles.title}>Menu</Text>

        <View style={{paddingHorizontal: width(4)}}>
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
            data={DUMMY_MAIN_COURSE}
            selectedMeals={selectedMeals}
            onToggle={toggleMeal}
            onViewDetailPress={onDetailsPress}
          />
        </View>
      </ScrollView>
      <View style={{height: width(13), margin: width(3)}}>
        <PrimaryButton name={'Proceed'} fontSize={15} onPress={handleProceed} />
      </View>
      <CommonModal ref={modalRef}>
        <MealDetailModal
          item={selectedMeal}
          onClose={() => modalRef.current.hide()}
        />
      </CommonModal>
    </View>
  );
};

export default SelectMeals;

const styles = {
  title: {
    fontFamily: fontFamily.poppinRegular,
    fontSize: 18,
    paddingHorizontal: width(4),
    paddingTop: width(4),
  },
  packageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width(4),
    marginTop: width(3),
  },
  packageCard: {
    width: width(44),
    borderRadius: 16,
    padding: width(2),
    elevation: 2,
  },
  packageTitle: {
    fontFamily: fontFamily.poppinSemiBold,
    fontSize: 13,
  },
  packageSub: {
    fontSize: 11,
    marginTop: 4,
  },
  packagePrice: {
    fontSize: 20,
    color: colors.red,
    marginTop: width(3),
    fontFamily: fontFamily.poppinBold,
  },
  packageUnit: {
    fontSize: 12,
    color: colors.black,
  },
  proceedBtn: {
    backgroundColor: colors.black,
    paddingVertical: width(4),
    margin: width(4),
    borderRadius: 30,
    alignItems: 'center',
  },
  proceedText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fontFamily.poppinSemiBold,
  },
};
