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
