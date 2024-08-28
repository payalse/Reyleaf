import {BASE_URL} from './index';

export const api_orderPlace = (token: string, addressId: string) => {
  let uri = `${BASE_URL}/api/v1/product/orderPlace`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({addressId}),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getMyOrders = (token: string) => {
  let uri = `${BASE_URL}/api/v1/product/myOrders`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getOrderDetail = (token: string, orderId: string) => {
  let uri = `${BASE_URL}/api/v1/product/orderDetail/${orderId}`;

  return new Promise((resolve, reject) => {
    fetch(uri, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const api_getSellerHomeOrders = (token: string) => {
  let uri = `${BASE_URL}/api/v1/product/sellerHomeOrders`;

  return new Promise((resolve, reject) => {
    fetch(uri, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_sellerHomeOrderAction = (
  token: string,
  orderId: string,
  action: string,
) => {
  let uri = `${BASE_URL}/api/v1/product/order/${orderId}/${action}`;

  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getSellerOrders = (token: string) => {
  let uri = `${BASE_URL}/api/v1/product/sellerOrders`;

  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getInvoice = (token: string, orderId: string) => {
  let uri = `${BASE_URL}/api/v1/user/invoice/${orderId}`;

  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
