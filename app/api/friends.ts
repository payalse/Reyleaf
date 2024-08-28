import { BASE_URL } from './index';

export const api_searchSuggessions = (token: string, username: string) => {
  const uri = `${BASE_URL}/api/v1/friend/search?username=${username}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: token,
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
export const api_fiendSuggessions = (token: string) => {
  const uri = `${BASE_URL}/api/v1/friend/suggessions`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data, 'data');
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
export const api_getMyfiends = (token: string) => {
  const uri = `${BASE_URL}/api/v1/friend/myFriends`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: token,
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
export const api_getBlocked = (token: string) => {
  const uri = `${BASE_URL}/api/v1/friend/blocked`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
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
export const api_getReported = (token: string) => {
  const uri = `${BASE_URL}/api/v1/friend/reported`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
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
export const api_RecivedRequested = (token: string) => {
  const uri = `${BASE_URL}/api/v1/friend/requested`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {
        // Authorization: `Bearer ${token}`,
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
export const api_friendfollowUnfollow = (
  token: string,
  followingId: string,
) => {
  const uri = `${BASE_URL}/api/v1/friend/followUnfollow`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        followingId,
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
export const api_requestAcceptReject = (token: string, payload: any) => {
  const uri = `${BASE_URL}/api/v1/friend/requestAcceptReject`;
  console.log({ payload }, token);
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status !== 200) {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
export const api_reportOrBlock = (token: string, payload: any) => {
  const uri = `${BASE_URL}/api/v1/friend/reportOrBlock`;
  console.log(payload, 'payload');
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Authorization: token,
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

export const api_cancelRequest = (
  token: string,
  followingId: string,
) => {
  const uri = `${BASE_URL}/api/v1/friend/cancelFollowRequest`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        followingId,
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
