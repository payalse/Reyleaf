import {BASE_URL} from './index';

export const api_login = (payload: {
  email: string;
  password: string;
  fcmToken: string;
}) => {
  const uri = `${BASE_URL}/api/v1/login`;
  console.log(payload, 'payload');
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
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

export const api_signup = (payload: {
  email: string;
  password: string;
  role: number;
  fcmToken: string;
}) => {
  const uri = `${BASE_URL}/api/v1/signup`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
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

export const api_socialLogin = (payload: {
  socialId: string;
  email: string;
  fullname: string;
  account_type: number;
  fcmToken: string;
}) => {
  const uri = `${BASE_URL}/api/v1/sociallogin`;
  console.log(payload, '---');
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data?.status !== 200) {
          throw new Error(data.error || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_verifyEmail = (payload: {refId: string; otp: string}) => {
  const uri = `${BASE_URL}/api/v1/verifyEmail`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
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

export const api_completeProfile = (formData: FormData, token: string) => {
  const uri = `${BASE_URL}/api/v1/user`;
  console.log(uri, token);
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

export const api_addUpdateAddress = (payload: any, token: string) => {
  const uri = `${BASE_URL}/api/v1/user/addUpdateAddress`;
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
        console.log(data, '---->');
        // if (data?.status !== 200) {
        //   throw new Error(
        //     data.message || data.error || 'something went wrong!',
        //   );
        // }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_deleteAddress = (id: any, token: string) => {
  const uri = `${BASE_URL}/api/v1/user/deleteAddress/${id}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'DELETE',
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

export const api_OtpResend = (refId: string) => {
  const uri = `${BASE_URL}/api/v1/resendOtp`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify({
        refId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data, '---->');
        // if (data?.status !== 200) {
        //   throw new Error(
        //     data.message || data.error || 'something went wrong!',
        //   );
        // }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_forgetPassword = (email: string) => {
  const uri = `${BASE_URL}/api/v1/forgetpassword`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify({email}),
      headers: {
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

export const api_verifyForgetPasswordOTP = (payload: {
  refId: string;
  otp: string;
}) => {
  const uri = `${BASE_URL}/api/v1/verifyOtp`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
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

export const api_setNewPassword = (paylaod: {
  refId: string;
  otp: string;
  newPassword: string;
}) => {
  const uri = `${BASE_URL}/api/v1/newPassword`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(paylaod),
      headers: {
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
