import {BASE_URL} from './index';

export const api_getFeeds = (token: string, description: string = '') => {
  const uri = `${BASE_URL}/api/v1/feed?description=${description}`;
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

export const api_feedCreate = (token: string, formData: FormData) => {
  const uri = `${BASE_URL}/api/v1/feed`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
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

export const api_getFeedsByZipCode = (token: string, zipCode: string = '') => {
  const uri = `${BASE_URL}/api/v1/feed/search/zipcode?zipcode=${zipCode}`;
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

export const api_likeDislikeFeed = (token: string, feedId: string) => {
  const uri = `${BASE_URL}/api/v1/feed/likeDislike`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemId: feedId,
        itemType: 'feed',
      }),
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
export const api_addComment = (
  token: string,
  feedId: string,
  comment: string,
) => {
  const uri = `${BASE_URL}/api/v1/feed/addComment`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemId: feedId,
        comment,
      }),
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

export const api_reportPost = (token: string, data: any) => {
  const uri = `${BASE_URL}/api/v1/feed/report`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
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
