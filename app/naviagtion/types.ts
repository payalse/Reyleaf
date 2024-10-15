import { CommentType } from '../types';

export type RootStackParams = {
  Splash: undefined;
  OnBoarding: undefined;
  Welcome: undefined;
  Signup: undefined;
  Login: undefined;
  OtpVerification: { verifyToken: string; authToken: string };
  ForgetPassword: undefined;
  SetNewPassword: { verifyToken: string; otp: string };
  ForgetPasswordOtpVerification: { verifyToken: string };
  CompleteYourProfile: { authToken: string };
  ChooseProfileImage: { setSelectedImage: () => void };
  AddYourAddress: { authToken: string };
  ConnectWithCalendar: undefined;
  AccountCreatedSuccess: undefined;
  VendorLogin: undefined;
  VendorSignup: undefined;
  VendorSetNewPassword: { verifyToken: string; otp: string };
  VendorOtpVerification: { verifyToken: string; authToken: string };
  VendorForgetPassword: undefined;
  VendorForgetPasswordOtpVerification: { verifyToken: string };
  CompleteYourBusinessProfile: { authToken: string };
  AddYourBusinessAddress: { authToken: string };
  ApplicationUnderReview: undefined;
  MainTab: undefined;
  AppDrawer: undefined;
  //
  AddNewAccount: undefined;
  UpdateAccount: undefined;
  Home: undefined;
  TrendingProduct: undefined;
  NewlyArrival: undefined;
  RecentlyViewed: undefined;
  BestSelling: undefined;
  SimilarProducts: undefined;
  Reviews: undefined;
  ProductDetail: {
    productId: string;
    photos: { url: string }[] | undefined;
    title: string;
  };
  SearchResult: undefined; Search: undefined;
  SearchStack: undefined;
  SearchFilter: undefined;
};

export type DrawerParams = {
  MainTab: undefined;
  SearchStack: undefined;
  ProfileEditStack: undefined;
  ChangePassword: undefined;
  ShippingAddress: undefined;
  MyOrders: undefined;
  MyFavourite: undefined;
  FeedbackScreen: undefined;
  Notification: undefined;
  PaymentAndBillingStack: undefined;
  AboutUsStack: undefined;
  SupportStack: undefined;
  ConnectCalender: undefined;
  EarningStack: undefined;
};
export type HomeStackParams = {
  Home: undefined;
  TrendingProduct: undefined;
  NewlyArrival: undefined;
  RecentlyViewed: undefined;
  BestSelling: undefined;
  SimilarProducts: undefined;
  Reviews: undefined;
  ProductDetail: {
    productId: string;
    photos: { url: string }[] | undefined;
    title: string;
  };
  AppNotification: undefined;
  ChatStack: undefined;
  SearchFilter: undefined;
  SearchResult: undefined;
  Welcome: undefined;
};
export type VendorHomeStackParams = {
  VendorHome: undefined;
  VendorOrderDetail: { orderId: string };
  ChatStack: undefined;
  AppNotification: undefined;
};
export type VendorAllOrdersStackStackParams = {
  AllOrder: undefined;
  VendorOrderDetail: { orderId: string };
};

export type CartStackParams = {
  Cart: undefined;
  CheckOut: { total: number };
  AddAddress: undefined;
  EditAddress: undefined;
  EditCard: undefined;
  AddCard: undefined;
  OrderSuccess: undefined;
  AppNotification: undefined;
  ChatStack: undefined;
  OrderStack: undefined;
};
export type SearchStackParams = {
  Search: undefined;
  SearchStack: undefined;
  SearchFilter: undefined;
  SearchResult: {
    categoryId: string;
    vendorId: any[] | undefined;
    priceStart: number | undefined;
    priceEnd: number | undefined;
  };
  AppNotification: undefined;
  ChatStack: undefined;
  ProductDetail: {
    productId: string;
    photos: { url: string }[] | undefined;
    title: string;
  };
};
export type EventStackParams = {
  Event: undefined;
  EventDetail: {
    id: string;
    isAttending: boolean;
  };
  AppNotification: undefined;
  ChatStack: undefined;
  AddEVent: undefined;
};

export type AwarenessStackParams = {
  Awareness: undefined;
  AddResource: undefined;
  ForumDetail: { id: string };
  JoinedForumDetail: { id: string };
  AddContent: { id: string };
  CommentScreen: undefined;
  LikeScreen: undefined;
  AddEvent: undefined;
  EditResource: {
    id: string;
    title: string;
    description: string;
    picture: string;
  };
  ResourceDetail: {
    isReadOnly: boolean;
    data: {
      title: string;
      description: string;
      updated_at: string;
      picture: string;
      id: string;
    };
  };
  AppNotification: undefined;
  ChatStack: undefined;
};

export type FeedStackParams = {
  Feed: undefined;
  CommentScreen: {
    feedId: string;
    comments: CommentType[];
  };
  LikeScreen: undefined;
  CreateFeed: undefined;
  AppNotification: undefined;
  ChatStack: undefined;
};

export type ChatStackParams = {
  AllRequest: undefined;
  Chat: undefined;
  Messages: undefined;
};
export type ProfileEditStackParams = {
  EditProfile: undefined;
  ChooseProfileImage: { setSelectedImage: () => void };
};

export type AllProductStackParams = {
  AllProduct: undefined;
  ProductCreate: undefined;
};

export type ProductDetailParams = {
  ProductDetail: {
    productId: string;
    photos: { url: string }[] | undefined;
    title: string;
  };
  Reviews: undefined;
};
