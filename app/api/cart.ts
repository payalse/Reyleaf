import {BASE_URL} from './index';

export const api_addToCart = (
  token: string,
  payload: {product: string; quantity: number},
) => {
  let uri = `${BASE_URL}/api/v1/product/addToCart`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
export const api_getCart = (token: string) => {
  let uri = `${BASE_URL}/api/v1/product/getCart`;
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
export const api_updateCartItem = (
  token: string,
  itemId: string,
  qty: number,
) => {
  let uri = `${BASE_URL}/api/v1/product/updateQuantity/${itemId}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({quantity: qty}),
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
export const api_deleteCartItem = (token: string, itemId: string) => {
  let uri = `${BASE_URL}/api/v1/product/delete-item/${itemId}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'DELETE',
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
