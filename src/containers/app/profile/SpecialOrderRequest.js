import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Modal,
} from "react-native";
import AppHeader from "../../../components/headerComponent";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "@react-navigation/native";

const TOTAL_STEPS = 5;
const VISIBLE_STEPS = 4;

const SpecialOrderRequest = () => {
  const [step, setStep] = useState(1);
  const [openDate, setOpenDate] = useState(false);
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [startAmPm, setStartAmPm] = useState("AM");
  const [endAmPm, setEndAmPm] = useState("AM");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [startTimeValue, setStartTimeValue] = useState(new Date());
  const [endTimeValue, setEndTimeValue] = useState(new Date());
  const navigation = useNavigation();

  /* ================= STATES ================= */
  const [personal, setPersonal] = useState({
    email: "",
    customerType: "",
    name: "",
    phone: "",
    contactMethod: "",
    address: "",
    note: "",
    gateCode: "",
  });

  const [food, setFood] = useState({
    culture: "",
    otherReq: "",
    serving: "",
  });

  const [booking, setBooking] = useState({
    date: "",
    startTime: "",
    endTime: "",
    guests: "",
    serviceType: "",
    ingredientPlan: "",
    notes: "",
  });

  const [kitchen, setKitchen] = useState({
    kitchenType: "",
    equipment: [],
    workspace: "",
    servingItems: [],
    notes: "",
  });

  /* ================= DATE/TIME HANDLERS ================= */
  const formatDate = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${dayOfMonth}/${month}/${year}`;
  };

  const formatTime = (date) => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleDateConfirm = (date) => {
    setOpenDate(false);
    setDateValue(date);
    setBooking({ ...booking, date: formatDate(date) });
  };

  const handleStartTimeConfirm = (time) => {
    setOpenStartTime(false);
    setStartTimeValue(time);
    setBooking({ ...booking, startTime: formatTime(time) });
  };

  const handleEndTimeConfirm = (time) => {
    setOpenEndTime(false);
    setEndTimeValue(time);
    setBooking({ ...booking, endTime: formatTime(time) });
  };

  /* ================= HELPERS ================= */
  const toggleCheckbox = (list, value, setter) => {
    if (list.includes(value)) {
      setter(list.filter((i) => i !== value));
    } else {
      setter([...list, value]);
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  /* ================= RENDER CONTENT ================= */
  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={{height: 0.5, borderWidth: 0.5, borderColor: 'black'}}/>

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.inputBox}
              placeholderTextColor="gray"
              placeholder="Type your email"
              value={personal.email}
              onChangeText={(t) =>
                setPersonal({ ...personal, email: t })
              }
            />

            <Text style={styles.label}>
              Are you a new or existing customer? *
            </Text>
            {["New customer", "Existing customer"].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setPersonal({ ...personal, customerType: i })
                }
              >
                <View style={styles.radioOuter}>
                  {personal.customerType === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.label}>Your Name *</Text>
            <TextInput
              style={styles.inputBox}
              placeholderTextColor="gray"
              placeholder="Type your name"
              value={personal.name}
              onChangeText={(t) =>
                setPersonal({ ...personal, name: t })
              }
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="+44"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              value={personal.phone}
              onChangeText={(t) =>
                setPersonal({ ...personal, phone: t })
              }
            />

            <Text style={styles.label}>
              Preferred contact method *
            </Text>
            {["Phone", "Email"].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setPersonal({ ...personal, contactMethod: i })
                }
              >
                <View style={styles.radioOuter}>
                  {personal.contactMethod === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.label}>Service Address *</Text>
            <TextInput
              style={[styles.inputBoxx, { height: 120 }]}
              multiline
              value={personal.address}
              onChangeText={(t) =>
                setPersonal({ ...personal, address: t })
              }
            />

            <Text style={styles.label}>
              Service or access note (optional)
            </Text>
            <TextInput
              style={[styles.inputBoxx, { height: 60 }]}
              multiline
              value={personal.note}
              onChangeText={(t) =>
                setPersonal({ ...personal, note: t })
              }
            />

            <Text style={styles.label}>
              Door or gate code (if needed)
            </Text>
            <TextInput
              style={styles.inputBoxx}
              value={personal.gateCode}
              onChangeText={(t) =>
                setPersonal({ ...personal, gateCode: t })
              }
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Food Details</Text>
            <View style={{height: 0.5, borderWidth: 0.5, borderColor: 'black'}}/>
            <Text style={styles.label}>
              Type of Cultural Food Preference *
            </Text>
            {[
              "African",
              "Caribbean",
              "Asian",
              "Middle Eastern",
              "Mediterranean",
              "British",
              "Fusion",
              "Other",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setFood({ ...food, culture: i })
                }
              >
                <View style={styles.radioOuter}>
                  {food.culture === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.label}>Other Requirements</Text>
            <TextInput
              style={[styles.inputBox, { height: 60 }]}
              multiline
              placeholderTextColor='lightgray'
              placeholder="(e.g dietary needs, allergen information, special req"
              value={food.otherReq}
              onChangeText={(t) =>
                setFood({ ...food, otherReq: t })
              }
            />

            <Text style={styles.label}>
              How would you like the food to be served? *
            </Text>
            {[
              "Buffet Style",
              "Plated Service",
              "Sharing Platter",
              "Other",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setFood({ ...food, serving: i })
                }
              >
                <View style={styles.radioOuter}>
                  {food.serving === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 3:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            <View
              style={{
                height: 0.5,
                borderWidth: 0.5,
                borderColor: "black",
              }}
            />

            {/* DATE */}
            <Text style={styles.label}>Date your order is needed *</Text>
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setOpenDate(true)}
            >
              <Image style={styles.leftIcon} source={require('../../../assets/icons/calendar.png')}/>
              <Text style={styles.timeValue}>
                {booking.date || "Select date"}
              </Text>
            </TouchableOpacity>

            <DatePicker
              modal
              open={openDate}
              date={dateValue}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={() => setOpenDate(false)}
              minimumDate={new Date()}
            />

            <Text style={styles.label}>Start Time *</Text>
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setOpenStartTime(true)}
            >
              <Image style={styles.leftIcon} source={require('../../../assets/icons/timing.png')}/>

              <Text style={styles.timeValue}>
                {booking.startTime || "Select start time"}
              </Text>

              <View style={styles.ampmWrap}>
                {["AM", "PM"].map((i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.ampmBtn,
                      startAmPm === i && styles.ampmActive,
                    ]}
                    onPress={() => setStartAmPm(i)}
                  >
                    <Text
                      style={[
                        styles.ampmText,
                        startAmPm === i && { color: "#fff" },
                      ]}
                    >
                      {i}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>

            <DatePicker
              modal
              open={openStartTime}
              date={startTimeValue}
              mode="time"
              onConfirm={handleStartTimeConfirm}
              onCancel={() => setOpenStartTime(false)}
            />

            <Text style={styles.label}>End Time *</Text>
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setOpenEndTime(true)}
            >
              <Image style={styles.leftIcon} source={require('../../../assets/icons/timing.png')}/>

              <Text style={styles.timeValue}>
                {booking.endTime || "Select end time"}
              </Text>

              <View style={styles.ampmWrap}>
                {["AM", "PM"].map((i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.ampmBtn,
                      endAmPm === i && styles.ampmActive,
                    ]}
                    onPress={() => setEndAmPm(i)}
                  >
                    <Text
                      style={[
                        styles.ampmText,
                        endAmPm === i && { color: "#fff" },
                      ]}
                    >
                      {i}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>

            <DatePicker
              modal
              open={openEndTime}
              date={endTimeValue}
              mode="time"
              onConfirm={handleEndTimeConfirm}
              onCancel={() => setOpenEndTime(false)}
            />

            <Text style={styles.label}>Number of Guests *</Text>
            <TextInput
              style={styles.inputBox}
              keyboardType="number-pad"
              value={booking.guests}
              onChangeText={(t) =>
                setBooking({ ...booking, guests: t })
              }
            />

            <Text style={styles.label}>Type of Service *</Text>
            {[
              "Home meal",
              "Private Dinner",
              "Event catering",
              "Meal prep",
              "Other",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setBooking({ ...booking, serviceType: i })
                }
              >
                <View style={styles.radioOuter}>
                  {booking.serviceType === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}

            <View style={{marginTop: 10}}>
              <Text style={styles.label}>Cuisine Preference *</Text>
              <TextInput
                style={styles.inputBox}
                value={personal.email}
                onChangeText={(t) =>
                  setPersonal({ ...personal, email: t })
                }
              />
              <Text style={styles.label}>Dish Preference (if any) *</Text>
              <TextInput
                style={styles.inputBox}
                value={personal.email}
                onChangeText={(t) =>
                  setPersonal({ ...personal, email: t })
                }
              />
              <Text style={styles.label}>Dish Preference (if any)*</Text>
              <TextInput
                style={styles.inputBox}
                value={personal.email}
                onChangeText={(t) =>
                  setPersonal({ ...personal, email: t })
                }
              />
            </View>

            <Text style={styles.label}>Ingredient Plan *</Text>
            {[
              "Chef Brings all ingredients",
              "Customer provides ingredients",
              "Ingredients delivered in advance",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setBooking({ ...booking, ingredientPlan: i })
                }
              >
                <View style={styles.radioOuter}>
                  {booking.ingredientPlan === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}
            <View style={{marginTop: 10}}>
              <Text style={styles.label}>Notes *</Text>
              <TextInput
                style={[styles.inputBoxx, { height: 120 }]}
                multiline
                value={booking.notes}
                onChangeText={(t) =>
                  setBooking({ ...booking, notes: t })
                }
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>
              Kitchen Information
            </Text>

            <View
              style={{
                height: 0.5,
                borderWidth: 0.5,
                borderColor: "black",
              }}
            />

            <Text style={styles.label}>Kitchen Type *</Text>
            {[
              "Home kitchen",
              "Rented venue",
              "Outdoor space",
              "Other _ _ _ _ _ _ _ _ _ _ _ _",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setKitchen({ ...kitchen, kitchenType: i })
                }
              >
                <View style={styles.radioOuter}>
                  {kitchen.kitchenType === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={{marginTop: 10}}>
                <Text style={styles.label}>Cooking Equipment Available *</Text>
            {[
              "Oven",
              "Hob",
              "Microwave",
              "Fridge",
              "Freezer",
              "Pots and pans",
              "Knives",
              "Utensils",
              "Mixing bowls",
              "Baking trays",
              "Special tools: _ _ _ _ _ _ _ _ _ _ _ _",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setKitchen({ ...kitchen, kitchenType: i })
                }
              >
                <View style={styles.radioOuter}>
                  {kitchen.kitchenType === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}
            </View>

            <View style={{marginTop: 10}}>
              <Text style={styles.label}>Worktop space *</Text>
              {["Small", "Medium", "Large"].map((i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.radioRow}
                  onPress={() =>
                    setKitchen({ ...kitchen, workspace: i })
                  }
                >
                  <View style={styles.radioOuter}>
                    {kitchen.workspace === i && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={styles.radioText}>{i}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{marginTop: 10}}>
                   <Text style={styles.label}>Serving items Available *</Text>
            {[
              "Plates",
              "Bowls",
              "Cutlery",
              "Glasses",
              "Platters",
              "Napkins",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setKitchen({ ...kitchen, kitchenType: i })
                }
              >
                <View style={styles.radioOuter}>
                  {kitchen.kitchenType === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}
            </View>

            <View style={{marginTop: 10}}>
              <Text style={styles.label}>Extras Notes on Kitchen or equipment *</Text>
              <TextInput
                style={[styles.inputBoxx, { height: 120 }]}
                multiline
                value={kitchen.notes}
                onChangeText={(t) =>
                  setKitchen({ ...kitchen, notes: t })
                }
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Access and Setup</Text>
            <View style={{height: 2, backgroundColor: 'gray', marginBottom: 10}}/>

            <Text style={styles.label}>On-site contact (if different from customer):</Text>
            <Text style={styles.labels}>Contact Number *</Text>

            <TextInput
              style={styles.inputBox}
              placeholder="+44"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              value={personal.phone}
              onChangeText={(t) =>
                setPersonal({ ...personal, phone: t })
              }
            />

            <Text style={styles.label}>Any building rules, noise limits or restrictions*</Text>
            <TextInput
              style={[styles.inputBoxx, { height: 120 }]}
              multiline
              value={personal.address}
              onChangeText={(t) =>
                setPersonal({ ...personal, address: t })
              }
            />

            <Text style={styles.label}>Cleanup plan *</Text>
            {[
              "Chef handles full cleanup",
              "Chef handles light cleanup",
              "Customer handles cleanup",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setFood({ ...food, culture: i })
                }
              >
                <View style={styles.radioOuter}>
                  {food.culture === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}

            <View style={{marginTop: 10}}>
            
            <Text style={styles.label}>Review and Confirmation *</Text>
            {[
              "I confirm all details are correct",
              "I understand the chef will work with the items listed above",
              "I agree to the payment terms in the app",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  setFood({ ...food, culture: i })
                }
              >
                <View style={styles.radioOuter}>
                  {food.culture === i && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}
            </View>

           <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 30,}}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            // Handle terms checkbox
          }}
        >
          {/* Checkbox will be added here */}
        </TouchableOpacity>
        <Text style={{fontSize: 14, fontWeight: '500', marginLeft: 1, width: 200}}>
          By checking this box, I Agree to Zannysfood's 
          <Text style={{color:'#d60202'}}> Terms of Service</Text>
        </Text>
      </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <AppHeader
          goBack
          text="Make Special Order"
          notificationsIcon
        />

        <Text style={styles.stepCountText}>
          {step} of {TOTAL_STEPS}
        </Text>

        {/* STEP BAR */}
        <View style={styles.stepperContainer}>
          {Array.from({ length: VISIBLE_STEPS }).map((_, i) => (
            <View key={i} style={styles.stepItem}>
              <View
                style={[
                  styles.dot,
                  i + 1 < step && styles.completedDot,
                  i + 1 === step && styles.activeDot,
                ]}
              >
                <Text
                  style={[
                    styles.stepCheck,
                    {
                      color: i + 1 < step ? "#fff" : "#BDBDBD",
                    },
                  ]}
                >
                  ✓
                </Text>
              </View>

              {i + 1 !== VISIBLE_STEPS && <View style={styles.line} />}
            </View>
          ))}
        </View>

        <Text style={styles.helperText}>
          Please complete the form below to make a special order
        </Text>

        <ScrollView>
          {renderContent()}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={nextStep}
            >
              <Text style={styles.primaryText}>
                {step === TOTAL_STEPS ? "Submit Order Request" : "Proceed"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Image source={require('../../../assets/icons/selected.png')}/>
            <Text style={styles.modalTitle}>Order request Complete</Text>
            <Text style={styles.modalText}>
              Update on your request would be 
              sent to you via email/Phone Number
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text style={styles.confirmText}>Back to Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SpecialOrderRequest;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  stepCountText: { textAlign: "center", marginTop: 10 },
  stepperContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  stepItem: { flexDirection: "row", alignItems: "center" },
  dot: {
    width: 40,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D32F2F'
  },
  activeDot: { backgroundColor: "#D32F2F" },
  line: {
    width: 50,
    height: 2,
    backgroundColor: "#D32F2F",
  },
  helperText: {
    textAlign: "center",
    color: "#973A46",
    marginVertical: 10,
    fontSize: 19,
  },
  formContainer: { paddingHorizontal: 20 },
  sectionTitle: { fontWeight: "600", marginBottom: 10, fontSize: 17, color: '#300303' },
  label: { marginTop: 12, fontSize: 14 },
  labels: { fontSize: 14 },

  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 6,
    backgroundColor: "#fff",
  },

  leftIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  timeValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },

  ampmWrap: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 4,
  },

  ampmBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 5,
    backgroundColor: "lightgray",
    borderRadius: 6,
  },

  ampmActive: {
    backgroundColor: "#4A0F14",
  },

  ampmText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    padding: 10,
    marginTop: 4,
    height: 60
  },
  inputBoxx: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    height: 60
  },
  completedDot: {
    backgroundColor: "#D32F2F",
  },

  stepCheck: {
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: "700",
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#D32F2F",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D32F2F",
  },
  radioText: { fontSize: 14, color: '#300303', fontWeight: '500' },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#D32F2F",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: "#D32F2F",
  },
  checkboxText: { fontSize: 14, color: '#300303', fontWeight: '500' },
  buttonRow: { padding: 16 },
  primaryBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 24,
    textAlign:'center',
    width: 130,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 10,
    color: "#000",
  },

  modalText: {
    fontSize: 14,
    width: 200,
    textAlign:'center',
    color: "#555",
    marginBottom: 20,
  },

  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },

  cancelText: {
    color: "#555",
    fontWeight: "600",
  },

  confirmBtn: {
    backgroundColor: "black",
    paddingVertical: 10,
    width: '100%',
    borderRadius: 20,
  },

  confirmText: {
    color: "#fff",
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: "600",
  },
});