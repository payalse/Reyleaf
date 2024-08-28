import { CartItemType, CategoryType, FAQ, OrderType, ProductType, Reviews, Sellers } from '.';

interface ApiResponse {
  status: 200 | number;
  message: string;
}

type BeforeLoginUser = {
  _id: string;
  role: 1 | 2;
  email: string;
  account_status: 1 | 2 | 3 | 4;
  profile_status: 1 | 2 | 3 | 4;
  account_type: 0;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
};

export interface LoginResponseType extends ApiResponse {
  token: string;
  data: BeforeLoginUser;
}
export interface SignupResponse extends ApiResponse {
  token: string;
  data: BeforeLoginUser;
}

export interface VerifyEmailResponse extends ApiResponse { }
export interface ForgetPasswordResponse extends ApiResponse {
  refData: string;
}
export interface GetCategoriesResponse extends ApiResponse {
  data: CategoryType[];
}

export interface GetSellersResponse extends ApiResponse {
  data: Sellers[];
}
export interface GetHomeProductResponse extends ApiResponse {
  data: {
    bestSeller: ProductType[];
    newAdded: [ProductType];
    recentViewed: ProductType[]; 
  };
}
export interface GetCartResponse extends ApiResponse {
  data: CartItemType[];
}
export interface GetProductByIdResponse extends ApiResponse {
  data: ProductType;
}
export interface GetMyOrderResponse extends ApiResponse {
  data: {
    completed: OrderType[];
    pending: OrderType[];
  };
}

export interface GetMyFAQResponse extends ApiResponse {
  data: FAQ[];
}

export interface GetReviewsResponse extends ApiResponse {
  data: Reviews[];
}

export interface GetSimilarProductResponse extends ApiResponse {
  data: ProductType[];
}
