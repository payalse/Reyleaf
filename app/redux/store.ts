import { configureStore } from '@reduxjs/toolkit';
import appReducer from './features/app/appSlice';
import authReducer from './features/auth/authSlice';
import categoryReducer from './features/category/categorySlice';
import productReducer from './features/product/productSlice';
import eventReducer from './features/event/eventSlice';
import sellerReducer from './features/seller/sellerSlice';
import feedReducer from './features/feed/feedSlice';
import supportReducer from './features/support/supportSlice';
import { createLogger } from 'redux-logger';
import friendReducer from './features/friends/friendsSlice';

const logger = createLogger({});

const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    event: eventReducer,
    sellers: sellerReducer,
    feed: feedReducer,
    friend: friendReducer,
    support: supportReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
