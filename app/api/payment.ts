import {BASE_URL} from './index';

export const api_chargePayment = (
  payload: {
    email: string;
    amount: number;
    currency: String;
    source: string;
    description: string;
  },
  token: string,
) => {
  const uri = `${BASE_URL}/api/v1/payment/create-charge`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.Status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const api_createCard = (
  payload: {
    customerId: string;
    source: string;
  },
  token: string,
) => {
  const uri = `${BASE_URL}/api/v1/payment/create-card`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.success !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getCard = (customerId: string, token: string) => {
  const uri = `${BASE_URL}/api/v1/payment/get-cards`;
  console.log(token);
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        customerId: customerId,
        limit: 10,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data, 'datddda');
        if (data?.Status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getAllTransactions = (token: string) => {
  const uri = `${BASE_URL}/api/v1/payment/all-transactions`;
  console.log(token);
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.Status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
