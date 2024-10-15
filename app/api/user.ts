import {BASE_URL} from './index';

export const api_chnagePassword = (
  paylaod: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  },
  token: string,
) => {
  const uri = `${BASE_URL}/api/v1/user/password`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'PUT',
      body: JSON.stringify(paylaod),
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 201) {
          throw new Error(
            data.message || data.error || 'something went wrong!',
          );
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getAddress = (token: string) => {
  const uri = `${BASE_URL}/api/v1/product/getAddress`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(
            data.message || data.error || 'something went wrong!',
          );
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getNotifications = (token: string) => {
  const uri = `${BASE_URL}/api/v1/user/notification`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(
            data.message || data.error || 'something went wrong!',
          );
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_updateNotificationSettings = (token: string, body: any) => {
  const uri = `${BASE_URL}/api/v1/user/notification-setting`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(
            data.message || data.error || 'something went wrong!',
          );
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_addReviewByUser = (token: string, body: any, orderId: any) => {
  const uri = `${BASE_URL}/api/v1/user/review/${orderId}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(
            data.message || data.error || 'something went wrong!',
          );
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_deleteUserProfile = (token: string) => {
  const uri = `${BASE_URL}/api/v1/user/delete-profile`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        console.log(err, 'hhhhhhhh');
        reject(err);
      });
  });
};
