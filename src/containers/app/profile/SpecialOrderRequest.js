import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import AppHeader from "../../../components/headerComponent";
import DatePicker from "react-native-date-picker";

const TOTAL_STEPS = 4;

const SpecialOrderRequest = () => {
  const [step, setStep] = useState(1);
  const [openDate, setOpenDate] = useState(false);
const [openStartTime, setOpenStartTime] = useState(false);
const [openEndTime, setOpenEndTime] = useState(false);

const [dateValue, setDateValue] = useState(new Date());
const [startTimeValue, setStartTimeValue] = useState(new Date());
const [endTimeValue, setEndTimeValue] = useState(new Date());


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

  /* ================= HELPERS ================= */

  const toggleCheckbox = (list, value, setter) => {
    if (list.includes(value)) {
      setter(list.filter((i) => i !== value));
    } else {
      setter([...list, value]);
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };


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

      /* ---------- STEP 2 ---------- */
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

      /* ---------- STEP 3 ---------- */
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
        style={styles.inputBox}
        onPress={() => setOpenDate(true)}
      >
        <Text style={{ color: booking.date ? "#000" : "#999" }}>
          {booking.date || "Select date"}
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={openDate}
        date={dateValue}
        mode="date"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setOpenDate(false);
          setDateValue(date);
          setBooking({
            ...booking,
            date: date.toLocaleDateString(),
          });
        }}
        onCancel={() => setOpenDate(false)}
      />

      {/* START TIME */}
      <Text style={styles.label}>Start Time *</Text>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setOpenStartTime(true)}
      >
        <Text style={{ color: booking.startTime ? "#000" : "#999" }}>
          {booking.startTime || "Select start time"}
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={openStartTime}
        date={startTimeValue}
        mode="time"
        onConfirm={(time) => {
          setOpenStartTime(false);
          setStartTimeValue(time);
          setBooking({
            ...booking,
            startTime: time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }}
        onCancel={() => setOpenStartTime(false)}
      />

      {/* END TIME */}
      <Text style={styles.label}>End Time *</Text>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setOpenEndTime(true)}
      >
        <Text style={{ color: booking.endTime ? "#000" : "#999" }}>
          {booking.endTime || "Select end time"}
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={openEndTime}
        date={endTimeValue}
        mode="time"
        onConfirm={(time) => {
          setOpenEndTime(false);
          setEndTimeValue(time);
          setBooking({
            ...booking,
            endTime: time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }}
        onCancel={() => setOpenEndTime(false)}
      />

      {/* GUESTS */}
      <Text style={styles.label}>Number of Guests *</Text>
      <TextInput
        style={styles.inputBox}
        keyboardType="number-pad"
        value={booking.guests}
        onChangeText={(t) =>
          setBooking({ ...booking, guests: t })
        }
      />

      {/* SERVICE TYPE */}
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
    </View>
  );


      /* ---------- STEP 4 ---------- */
      case 4:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>
              Kitchen Information
            </Text>

            <Text style={styles.label}>Kitchen Type *</Text>
            {[
              "Home kitchen",
              "Rented venue",
              "Outdoor space",
              "Other",
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

            <Text style={styles.label}>
              Cooking Equipment Available *
            </Text>
            {[
              "Oven",
              "Hob",
              "Microwave",
              "Fridge",
              "Freezer",
              "Pots and pans",
              "Utensils",
            ].map((i) => (
              <TouchableOpacity
                key={i}
                style={styles.radioRow}
                onPress={() =>
                  toggleCheckbox(
                    kitchen.equipment,
                    i,
                    (val) =>
                      setKitchen({
                        ...kitchen,
                        equipment: val,
                      })
                  )
                }
              >
                <View style={styles.checkbox}>
                  {kitchen.equipment.includes(i) && (
                    <View style={styles.checkboxInner} />
                  )}
                </View>
                <Text style={styles.radioText}>{i}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
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
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
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
        color:
          i + 1 < step
            ? "#fff"
            : "#BDBDBD",
      },
    ]}
  >
    ✓
  </Text>
</View>

            {i + 1 !== TOTAL_STEPS && (
              <View style={styles.line} />
            )}
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
              {step === TOTAL_STEPS ? "Submit" : "Proceed"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    // backgroundColor: "#F2C1C1",
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
  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    padding: 10,
    marginTop: 4,
    height: 60
  },inputBoxx: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    height: 60
  }
  ,
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
  buttonRow: { padding: 16 },
  primaryBtn: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "600" },
});
