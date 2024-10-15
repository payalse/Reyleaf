import {BASE_URL} from './index';

export const api_getFAQ = () => {
  const uri = `${BASE_URL}/api/v1/get-all-faq`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
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

export const api_addFeedback = (token: any, data: any) => {
  const uri = `${BASE_URL}/api/v1/user/feedback`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(data => {
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
