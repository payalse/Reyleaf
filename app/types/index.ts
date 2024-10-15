export type AppMode = 'USER' | 'VENDOR';
export type SelectedImage = {
  height: number;
  mime: string;
  modificationDate: string;
  path: string;
  size: number;
  width: number;
};

/* ACCOUNT STATUS
  1 -> unverified
  2 -> active
  3 -> blocked
  4 -> deleted
*/

export type AuthUserType = {
  token: string;
  _id: string;
  role: 1 | 2;
  email: string;
  account_status: 1 | 2 | 3 | 4;
  profile_status: 1 | 2 | 3 | 4;
  account_type: 0;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  bio?: string;
  fullname?: string;
  picture?: string;
  phone?: string;
  pronouns?: string;
  dob?: string;
  data?: any;
  stripeCustomerId?: string;
  orderNotification: boolean;
  messageNotification: boolean;
  eventNotification: boolean;
};
export type CategoryType = {
  _id: string;
  name: string;
  updated_at: string;
};
export type ProductType = {
  categoryId: {
    name: string;
    _id: string;
  };
  description: string;
  discountedProce: number;
  photos: {url: string}[];
  price: any;
  status: 'active';
  title: string;
  updated_at: string;
  userId: string;
  _id: string;
  rating: number;
  isFavourite: boolean;
};
export type CartItemType = {
  _id: string;
  user: string;
  product: {
    _id: string;
    userId: string;
    categoryId: {
      name: string;
      _id: string;
    };
    title: string;
    price: number;
    discountedProce: number;
    description: string;
    status: string;
    photos: {url: string}[];
    updated_at: string;
  };
  quantity: number;
  updated_at: string;
};

export type OrderType = {
  address: {
    address: string;
    city: string;
    country: string;
    state: string;
    updated_at: string;
    user: string;
    zipcode: string;
    _id: string;
  };
  createdAt: string;
  items: {
    product: ProductType;
    quantity: 1;
    _id: string;
  }[];
  orderId: string;
  status: string;
  rating: number;
  totalAmount: number;
  user: AuthUserType;
  _id: string;
};

export type CardType = {
  address_city: string;
  address_country: string;
  address_line1: string;
  address_line1_check: string;
  address_line2: string;
  address_state: string;
  address_zip: string;
  address_zip_check: string;
  brand: string;
  country: string;
  customer: string;
  cvc_check: string;
  dynamic_last4: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  id: string;
  last4: string;
  name: string;
  object: string;
  tokenization_method: string;
  wallet: string;
};

export type FeedType = {
  _id: string;
  userId: AuthUserType;
  description: string;
  status: string;
  isLiked: boolean;
  likeCount: string;
  photos: {
    url: string;
    _id: string;
  }[];
  updated_at: string;
  likes: [];
  comments: [];
};

export type CommentType = {
  comment: string;
  created_at: string;
  itemId: string;
  itemType: 'feed';
  userId: AuthUserType;
  _id: string;
};

export type Sellers = {
  email: string;
  account_status: number;
  fullname: string;
  pronouns: string;
  _id: string;
};

export type FAQ = {
  title: string;
  description: string;
  addedBy: string;
  _id: string;
};

export type Reviews = {
  rating: number;
  review: string;
  user: any;
  updateAt: string;
  _id: string;
};

export type Friend = {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  picture?: string | null;
  followingId?: any;
  status?: string | '';
};

export type SupportTickets = {
  _id: string;
  user: string;
  title: string;
  description: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type SupportTicketChat = {
  _id: string;
  sender: any;
  receiver: any;
  ticketId: any;
  message: string;
  status: string;
  lastActive: string;
  updatedAt: string;
};
