import ENV from '../utills/loadEnv';

export const colors = {
  pinkColor: '#d70f64',
  white: '#ffffff',
  black: '#000000',
  grey: '#a3a3a3',
  grey1: '#c3c3c3',
  grey2: '#a3a3a3',
  green: '#198f15',
  yellow: '#ff9935',
  themeColor: [
    '#f68843',
    '#f6a03f',
    '#f4b10e',
    '#f66701',
    '#f45001',
    '#e29127',
  ],
  orangeColor: '#ff9935',
};

export const STRIPE_PUBLISH_TEST = ENV.STRIPE_PUBLISH_TEST;
export const STRIPE_SECRET_TEST = ENV.STRIPE_SECRET_TEST;
export const STRIPE_PUBLISH_LIVE = ENV.STRIPE_PUBLISH_LIVE;
export const STRIPE_SECRET_LIVE = ENV.STRIPE_SECRET_LIVE;
export const constants = {};
