import {BASE_URL} from './index';

export const api_getUserDetails = (token: string) => {
  const uri = `${BASE_URL}/api/v1/user`;
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
        if (data?.status !== 200) {
          throw new Error(data.message || data.error || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_deleteUser = (token: string) => {
  const uri = `${BASE_URL}/api/v1/user`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'DELETE',
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
};

export const api_updateProfilePic = (formData: FormData, token: string) => {
  const uri = `${BASE_URL}/api/v1/user/profilepic`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'PUT',
      body: formData,
      headers: {
        authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data || data?.status === 400) {
          throw new Error(data?.message || 'Failed to update profile picture');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_createVendorProfile = (
  payload: {
    fullname: string;
    phone: string;
    companyName: string;
    dob?: string;
    gender?: number;
    companyAddress?: string;
  },
  token: string,
) => {
  const uri = `${BASE_URL}/api/v1/user/vendor/profile/create`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status !== 200) {
          throw new Error(data.message || data.error || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_getVendorProfile = (token: string) => {
  const uri = `${BASE_URL}/api/v1/user/vendor/profile/get`;
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
        if (data?.status !== 200) {
          throw new Error(data.message || data.error || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_editVendorProfile = (
  payload: {
    fullname?: string;
    phone?: string;
    companyName?: string;
    dob?: string;
    gender?: number;
    companyAddress?: string;
  },
  token: string,
) => {
  const uri = `${BASE_URL}/api/v1/user/vendor/profile/edit`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status !== 200) {
          throw new Error(data.message || data.error || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_vendorStripeOnboarding = (
  payload: {refresh_url: string; return_url: string},
  token: string,
) => {
  const uri = `${BASE_URL}/api/v1/user/vendor/stripe/onboarding`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status !== 200) {
          throw new Error(data.message || data.error || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_getVendorStripeStatus = (token: string) => {
  const uri = `${BASE_URL}/api/v1/user/vendor/stripe/status`;
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
        if (data?.status !== 200) {
          throw new Error(data.message || data.error || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

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

export const api_updateFcmToken = (token: string, fcmToken: string) => {
  const uri = `${BASE_URL}/api/v1/user/fcm-token`;
  return fetch(uri, {
    method: 'PUT',
    body: JSON.stringify({fcmToken}),
    headers: {
      authorization: token,
      'Content-Type': 'application/json',
    },
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
        reject(err);
      });
  });
};
