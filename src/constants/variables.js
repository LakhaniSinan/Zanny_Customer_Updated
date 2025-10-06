export const notification = {};

export const requestType = {
  POST: 'post',
  GET: 'get',
  PUT: 'put',
  DELETE: 'delete',
};

export const endPoints = {
  //auth
  registerCustomer: 'registerCustomer',
  loginCustomer: 'loginCustomer',
  sendCode: 'sendCode',
  resetPasswordCustomer: 'resetPasswordCustomer',
  sendResetCodeCustomer: 'sendResetCodeCustomer',
  socialLogin: 'socialLogin',

  //merchant
  getAllMerchants: 'getAllMerchants',
  getAllMerchantByCurrentLocation: 'getAllMerchantByCurrentLocation',
  getAllMerchantByCurrentLocationPickUp:
    'getAllMerchantByCurrentLocation/pickup',
  updateMerchantStatus: 'updateMerchantStatus',
  getSearchdMerchants: 'getSearchdMerchants',
  getMerchantProfile: 'getMerchantProfile',
  //product
  getProductsByMerchantId: 'getProduct',

  //admin settings
  getSettings: 'getSettings',

  //profile
  getCustomerProfile: 'getCustomer',
  updateCustomerProfile: 'updateCustomerProfile',
  changePasswordCustomer: 'changePasswordCustomer',

  //order
  addOrder: 'addOrder',
  getOrderByCustomer: 'getOrderByCustomer',
  updateOrderStatus: 'updateOrderStatus',
  getCalculatedDeliveryFee: 'getCalculatedDeliveryFee',
  addReview: 'addReview',
  createPaymentIntent: 'createGooglePay',

  //private hire
  addPrivateOrder: 'addPrivateOrder',
  gePrivatetOrderByCustomer: 'gePrivatetOrderByCustomer',
  updatePrivateOrderStatus: 'updatePrivateOrderStatus',

  //subscribe
  addSubscribers: 'addSubscribers',
  removeSubscribers: 'removeSubscribers',

  //dietRequirement
  addDietRequirements: 'addDietRequirements',
  getDietRequirements: 'getDietRequirements',
  updateDietRequirements: 'updateDietRequirements',
  getPerKmCharges: 'getPerKmCharges',

  //address
  addAddress: 'addAddress',
  getAddress: 'getAddress',
  updateAddress: 'updateAddress',
  deleteAddress: 'deleteAddress',
  addressCahngeIsPossible: 'changeAddress',

  //support
  createSupportMessage: 'createSupportMessage',
  getSupportMessagesById: 'getSupportMessagesById',

  //payment card
  addPaymentCard: 'addPaymentCard',
  getPaymentCardById: 'getPaymentCardById',
  deletePaymentCard: 'deletePaymentCard',
  updatePaymentCard: 'updatePaymentCard',

  //allergiesss
  getAllergiesCategories: 'getAllergiesCategories',
  getAllAllergies: 'getAllAllergies',

  //FAQs
  getAllFAQs: 'getAllFAQs',
};
