import {BASE_URL} from './index';

export const api_getAllForums = (token: string) => {
  const uri = `${BASE_URL}/api/v1/feed/forums`;
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
        if (data?.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const api_getForumDetails = (token: string, id: string) => {
  const uri = `${BASE_URL}/api/v1/feed/forums/${id}`;
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
        if (data?.status !== 200 && data?.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getForumContents = (token: string, id: string) => {
  const uri = `${BASE_URL}/api/v1/feed/forumContent/${id}`;
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
        if (data?.status !== 200 && data?.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_getJoinedForums = (token: string) => {
  const uri = `${BASE_URL}/api/v1/feed/joinedForums`;
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
        if (data?.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const api_forumContent = (token: string, data: any, id: any) => {
  const uri = `${BASE_URL}/api/v1/forums/forumContent/${id}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: data,
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