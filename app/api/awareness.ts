import {BASE_URL} from './index';

export const api_addResource = (token: string, formData: FormData) => {
  const uri = `${BASE_URL}/api/v1/feed/resource`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
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
export const api_updateResource = (
  token: string,
  rId: string,
  formData: FormData,
) => {
  const uri = `${BASE_URL}/api/v1/feed/resource/${rId}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
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

export const api_getAllResource = (token: string) => {
  const uri = `${BASE_URL}/api/v1/feed/resource`;
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
export const api_getMyResource = (token: string) => {
  const uri = `${BASE_URL}/api/v1/feed/myResource`;
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

export const api_joinLeaveForm = (token: string, forumId: string) => {
  const uri = `${BASE_URL}/api/v1/feed/forums/joinLeaveForum/${forumId}`;
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
        if (data?.status !== 200 && data.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
