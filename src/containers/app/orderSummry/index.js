import React, {useMemo, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {width} from 'react-native-dimension';
import moment from 'moment';

import {colors} from '../../../constants';
import {fontFamily, icons, images} from '../../../assets';
import AppHeader from '../../../components/headerComponent';
import BackButton from '../../../components/backIcon';
import CommonModal from '../../../components/modal';
import PrimaryButton from '../../../components/primaryButton';

const formatEventDate = rawDate => {
  if (!rawDate) return '12th Dec 2025';

  // Expected values in this app are usually already formatted,
  // but we keep a defensive formatter here.
  const parsed = moment(rawDate, [
    'dddd DD-MM-YYYY',
    'dddd DD MMM YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'DD/MM/YYYY',
  ]);

  return parsed.isValid() ? parsed.format('Do MMM YYYY') : String(rawDate);
};

const NutritionRow = ({icon, label, value, percent}) => {
  return (
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
      <View
        style={{
          height: width(10),
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: width(4),
        }}>
        <Text
          style={{
            fontFamily: fontFamily.poppinSemiBold,
            fontSize: 18,
          }}>
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
          <Text
            style={{
              fontFamily: fontFamily.poppinSemiBold,
              fontSize: 16,
            }}>
            {item?.name}
          </Text>
          <Text style={{fontSize: 13, color: colors.gray, marginVertical: 6}}>
            ⏱ {item?.time || '--'}
          </Text>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.lightGray,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20,
            }}>
            <Text style={{fontSize: 12}}>Selected Meal</Text>
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
        Freshly prepared meal selected for your event. You can adjust items from
        the Select Meals screen if needed.
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

const OrderSummry = ({route, navigation}) => {
  const data = route?.params ?? {};
  const modalRef = useRef(null);

  const [promoCode, setPromoCode] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [openMenu, setOpenMenu] = useState({
    starter: false,
    dessert: false,
    main: true,
  });

  const selectedMeals = useMemo(() => {
    if (!Array.isArray(data?.items)) return [];
    return data.items;
  }, [data?.items]);

  const mealsBySection = useMemo(() => {
    const starter = selectedMeals.filter(i => i?.section === 'starter');
    const dessert = selectedMeals.filter(i => i?.section === 'dessert');
    const main = selectedMeals.filter(i => i?.section === 'main');
    return {starter, dessert, main};
  }, [selectedMeals]);

  const eventTypeText = useMemo(() => {
    const type = String(data?.eventType ?? '').trim();
    if (!type) return 'Birthday party Function';

    if (/birthday/i.test(type)) return 'Birthday party Function';
    if (/wedding/i.test(type)) return 'Wedding Function';
    if (/anniversary/i.test(type)) return 'Anniversary Function';
    if (/corporate/i.test(type)) return 'Corporate Event';

    return type;
  }, [data?.eventType]);

  const guestsText = useMemo(() => {
    const guests = data?.guests ?? 20;
    return `${guests} Guests`;
  }, [data?.guests]);

  const addressText = useMemo(() => {
    return (
      data?.cookingAddress ||
      data?.address ||
      data?.deliveryAddress ||
      data?.userAddress ||
      'Kawungkarang road no 28, London'
    );
  }, [data]);

  const formattedDate = useMemo(
    () => formatEventDate(data?.date),
    [data?.date],
  );

  const selectedMain = useMemo(() => {
    const items = Array.isArray(data?.items) ? data.items : [];
    return (
      items.find(i => i?.section === 'main') || items.find(i => i?.section)
    );
  }, [data?.items]);

  // Screenshot-like chef fallback (route params currently don't include chef details,
  // so we render these placeholders unless provided by the caller).
  const chefName =
    data?.chefName ||
    data?.merchantDetails?.name ||
    data?.chefData?.name ||
    'Leanne Wayne';

  const chefImageUri =
    data?.chefImage ||
    data?.merchantDetails?.merchantImage ||
    data?.chefData?.merchantImage ||
    null;

  const ratingText = data?.rating ? `${data.rating}` : '4.8';
  const reviewCountText = data?.reviewCount ? `${data.reviewCount}` : '204';
  const distanceText = data?.distance ? `${data.distance}` : '2.8 km away';

  const subTotal = typeof data?.subTotal === 'number' ? data.subTotal : 28.12;
  const travelingCost =
    typeof data?.travelingCost === 'number' ? data.travelingCost : 20;
  const totalPrice =
    typeof data?.totalPrice === 'number'
      ? data.totalPrice
      : typeof data?.total === 'number'
      ? data.total
      : 48.12;

  const handleProceed = () => {
    if (navigation?.navigate) {
      navigation.navigate('PaymentScreen', {
        ...data,
        promoCode,
      });
    }
  };

  const handleApplyPromo = () => {
    // UI-only for now; wiring promo application comes from order/cart flow.
    // Keep this handler to match the screenshot behavior.
    // eslint-disable-next-line no-console
    console.log('Apply promo code:', promoCode);
  };

  const handleViewMealDetails = item => {
    setSelectedMeal(item);
    modalRef.current?.isVisible();
  };

  const MenuMealItem = ({item}) => {
    // In summary screen these items are already "selected",
    // so we always show the checked state to match `selectMeals` UI.
    return (
      <View style={styles.mealRow}>
        <TouchableOpacity
          onPress={() => {}}
          activeOpacity={0.7}
          style={styles.mealCheckCircleTouchable}>
          <Image
            source={icons.checkIcon}
            resizeMode="contain"
            style={styles.mealCheckIcon}
          />
        </TouchableOpacity>

        <Image
          source={images.foodimage1}
          resizeMode="cover"
          style={styles.mealImage}
        />

        <View style={{flex: 1}}>
          <Text style={styles.mealName}>{item?.name}</Text>
          {item?.time ? (
            <Text style={styles.mealTime}>⏱ {item?.time}</Text>
          ) : (
            <Text style={styles.mealTime}>{'⏱ --'}</Text>
          )}

          <TouchableOpacity
            onPress={() => handleViewMealDetails(item)}
            style={styles.viewDetailsBtn}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightIconsWrap}>
          <BackButton icon={icons.heartBrown} border={1} />
          <BackButton icon={icons.share} border={1} />
        </View>
      </View>
    );
  };

  const MenuSection = ({title, sectionKey, items}) => {
    const isOpen = Boolean(openMenu?.[sectionKey]);
    const hasItems = Boolean(items?.length);
    const showEmpty = sectionKey !== 'main';
    const shouldShowBody = hasItems || showEmpty;

    return (
      <View style={styles.sectionWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setOpenMenu(prev => ({
              ...prev,
              [sectionKey]: !prev?.[sectionKey],
            }))
          }
          style={styles.menuRow}>
          <Text style={styles.menuRowText}>{title}</Text>
          <Image
            source={icons.arrowDown}
            resizeMode="contain"
            style={[
              styles.menuArrow,
              {
                transform: [{rotate: isOpen ? '180deg' : '0deg'}],
              },
            ]}
          />
        </TouchableOpacity>

        {isOpen && shouldShowBody && (
          <View style={styles.sectionBody}>
            {hasItems
              ? items.map(item => (
                  <MenuMealItem key={item?.id || item?.name} item={item} />
                ))
              : showEmpty && (
                  <Text style={styles.emptyText}>No items selected</Text>
                )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader text="Summary" goBack cartIcon />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Date */}
          <Text style={styles.label}>Date of Event</Text>

          <View style={styles.dateCard}>
            <Text style={styles.dateText}>{formattedDate}</Text>
            <Text style={styles.dateText}>{data?.time ?? '12:30PM'}</Text>
            <Text style={[styles.dateText, {marginTop: width(1)}]}>
              {addressText}
            </Text>
          </View>

          {/* Type */}
          <Text style={[styles.label, {marginTop: width(4)}]}>
            Type of Event
          </Text>

          <View style={styles.eventPill}>
            <View style={styles.eventPillIconWrap}>
              <Image
                source={images.cheif}
                style={styles.eventPillIcon}
                resizeMode="cover"
              />
            </View>

            <View style={{flex: 1}}>
              <Text style={styles.eventPillTitle}>{eventTypeText}</Text>
              <Text style={styles.eventPillSubtitle}>{guestsText}</Text>
            </View>
          </View>

          {/* Menu */}
          <Text style={[styles.label, {marginTop: width(4)}]}>Menu</Text>

          <View style={{paddingHorizontal: width(4)}}>
            <MenuSection
              title="Starter"
              sectionKey="starter"
              items={mealsBySection.starter}
            />
            <MenuSection
              title="Dessert"
              sectionKey="dessert"
              items={mealsBySection.dessert}
            />
            <MenuSection
              title="Main Course"
              sectionKey="main"
              items={mealsBySection.main}
            />
          </View>

          {/* Chef/merchant details should not depend on "Main Course" accordion toggle */}
          <View style={styles.mainCard}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.chefAvatar}>
                {chefImageUri ? (
                  <Image
                    source={{uri: chefImageUri}}
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 999,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={images.cheif}
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 999,
                    }}
                    resizeMode="cover"
                  />
                )}
              </View>

              <View style={{flex: 1, marginLeft: width(3)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.chefName} numberOfLines={1}>
                    {chefName}
                  </Text>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                </View>

                <Text style={styles.cuisineTags}>British / American</Text>

                <View style={styles.ratingRow}>
                  <Image
                    source={icons.yellowStar}
                    style={styles.starIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.ratingText}>
                    {ratingText} ({reviewCountText}) {distanceText}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Promo */}
          <Text style={[styles.label, {marginTop: width(4)}]}>Promo</Text>

          <View style={styles.promoRow}>
            <TextInput
              value={promoCode}
              onChangeText={setPromoCode}
              placeholder="Enter Promo Code"
              placeholderTextColor={colors.graydark}
              style={styles.promoInput}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleApplyPromo}
              style={styles.applyCodeBtn}>
              <Text style={styles.applyCodeText}>Apply Code</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Summary */}
          <View style={[styles.paymentCard, {marginTop: width(4)}]}>
            <Text style={styles.paymentTitle}>Payment Summary</Text>

            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Sub Total</Text>
              <Text style={styles.paymentValue}>
                £{Number(subTotal).toFixed(2)}
              </Text>
            </View>

            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Traveling Cost</Text>
              <Text style={styles.paymentValue}>£{travelingCost}</Text>
            </View>

            <View style={[styles.paymentRow, {marginTop: width(2)}]}>
              <Text
                style={[
                  styles.paymentLabel,
                  {fontFamily: fontFamily.poppinSemiBold},
                ]}>
                Total Price
              </Text>
              <Text
                style={[
                  styles.paymentValue,
                  {fontFamily: fontFamily.poppinBold},
                ]}>
                £{Number(totalPrice).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Image
              source={icons.Info}
              style={styles.infoIcon}
              resizeMode="contain"
            />
            <Text style={styles.infoText}>
              Traveling cost would be added to your bill based on address
              provided.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonWrapper}>
        <View style={styles.bottomButtonInner}>
          <PrimaryButton
            name="Proceed to Checkout"
            fontSize={14}
            bgcColor={colors.black}
            onPress={handleProceed}
          />
        </View>
      </View>
      <CommonModal ref={modalRef}>
        <MealDetailModal
          item={selectedMeal}
          onClose={() => modalRef.current?.hide()}
        />
      </CommonModal>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: width(22),
  },
  content: {
    padding: width(4),
  },
  label: {
    fontSize: 16,
    fontFamily: fontFamily.poppinSemiBold,
    color: colors.redish,
    marginBottom: width(2),
  },
  dateCard: {
    paddingHorizontal: width(3),
    paddingVertical: width(3),
    borderRadius: 25,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateText: {
    fontSize: 12,
    fontFamily: fontFamily.poppinSemiBold,
    color: colors.graydark,
  },
  eventPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.clay,
    borderRadius: 24,
    paddingHorizontal: width(3),
    paddingVertical: width(2),
  },
  eventPillIconWrap: {
    height: width(8),
    width: width(8),
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: width(3),
    overflow: 'hidden',
  },
  eventPillIcon: {
    height: '100%',
    width: '100%',
  },
  eventPillTitle: {
    fontSize: 14,
    fontFamily: fontFamily.poppinSemiBold,
    color: colors.black,
  },
  eventPillSubtitle: {
    marginTop: width(0.5),
    fontSize: 12,
    color: colors.graydark,
    fontFamily: fontFamily.poppinRegular,
  },
  menuWrap: {
    marginTop: width(1),
    borderRadius: width(3),
    borderWidth: 0,
  },
  sectionWrapper: {
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionBody: {
    paddingVertical: width(2),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: width(4),
  },
  menuRowText: {
    fontFamily: fontFamily.poppinSemiBold,
    fontSize: 16,
    color: colors.redish,
  },
  menuArrow: {
    height: 10,
    width: 10,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width(3),
    borderBottomWidth: 0.5,
    borderColor: colors.border,
  },
  mealCheckCircleTouchable: {
    height: width(5),
    width: width(5),
    borderRadius: 6,
    borderColor: colors.redish,
    backgroundColor: colors.redish,
    borderWidth: 1,
    marginTop: width(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealCheckIcon: {
    height: '80%',
    width: '80%',
  },
  mealImage: {
    height: 70,
    width: 70,
    borderRadius: 10,
    marginHorizontal: width(3),
  },
  mealName: {
    fontFamily: fontFamily.poppinSemiBold,
    fontSize: 14,
    color: colors.black,
  },
  mealTime: {
    fontSize: 12,
    color: colors.gray,
    marginVertical: 4,
  },
  viewDetailsBtn: {
    backgroundColor: colors.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fontFamily.poppinRegular,
  },
  rightIconsWrap: {
    marginLeft: 8,
    gap: 6,
  },
  emptyText: {
    fontFamily: fontFamily.poppinRegular,
    fontSize: 12,
    color: colors.graydark,
    paddingVertical: width(2),
  },
  mainCard: {
    marginTop: width(2),
    borderRadius: width(3),
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: width(3),
  },
  chefAvatar: {
    height: width(14),
    width: width(14),
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.clayLite,
  },
  chefName: {
    fontSize: 14,
    fontFamily: fontFamily.poppinSemiBold,
    color: colors.black,
    flex: 1,
  },
  verifiedBadge: {
    height: width(5),
    width: width(5),
    borderRadius: 999,
    backgroundColor: colors.redish,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: width(2),
  },
  verifiedText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fontFamily.poppinBold,
  },
  cuisineTags: {
    marginTop: width(1),
    fontSize: 12,
    color: colors.graydark,
    fontFamily: fontFamily.poppinRegular,
  },
  ratingRow: {
    marginTop: width(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    height: 14,
    width: 14,
    marginRight: width(2),
  },
  ratingText: {
    fontSize: 12,
    color: colors.graydark,
    fontFamily: fontFamily.poppinSemiBold,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: width(2),
  },
  promoInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: colors.black,
    fontFamily: fontFamily.poppinRegular,
    fontSize: 13,
    marginRight: width(2),
    backgroundColor: colors.white,
  },
  applyCodeBtn: {
    height: 40,
    borderRadius: 999,
    paddingHorizontal: width(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.clayLite,
    borderWidth: 1,
    borderColor: colors.border,
  },
  applyCodeText: {
    color: colors.graydark,
    fontFamily: fontFamily.poppinSemiBold,
    fontSize: 12,
  },
  paymentCard: {
    padding: width(4),
    backgroundColor: colors.white,
    borderRadius: width(3),
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentTitle: {
    fontWeight: '700',
    fontSize: 18,
    fontFamily: fontFamily.poppinBold,
    marginBottom: width(2),
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: width(2),
  },
  paymentLabel: {
    color: colors.graydark,
    fontSize: 13,
    fontFamily: fontFamily.poppinRegular,
  },
  paymentValue: {
    color: colors.black,
    fontSize: 14,
    fontFamily: fontFamily.poppinSemiBold,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: width(3),
    borderRadius: width(3),
    backgroundColor: colors.warn,
    borderWidth: 1,
    borderColor: colors.orangeDark,
    marginTop: width(4),
  },
  infoIcon: {
    height: 18,
    width: 18,
    marginRight: width(2),
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: colors.orangeDark,
    fontFamily: fontFamily.poppinRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  bottomButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: width(3),
    paddingVertical: width(3),
    backgroundColor: colors.white,
  },
  bottomButtonInner: {
    height: width(13),
  },
};

export default OrderSummry;
