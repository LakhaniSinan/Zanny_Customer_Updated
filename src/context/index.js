import React, {createContext, useState, memo} from 'react';

export const AppContext = createContext();
const AppProvider = props => {
  const [user, setUser] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [merchantDetail, setMerchantDetail] = useState(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setCartData,
        cartData,
        setUser,
        merchantDetail,
        setMerchantDetail,
      }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default memo(AppProvider);
