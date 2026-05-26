import {BASE_URL} from './index';

export const api_getAllForums = (
  token: string,
  params?: {page?: number; limit?: number; search?: string},
) => {
  const parts: string[] = [];
  if (params?.page) parts.push(`page=${params.page}`);
  if (params?.limit) parts.push(`limit=${params.limit}`);
  if (params?.search) parts.push(`search=${encodeURIComponent(params.search)}`);
  const qs = parts.length ? `?${parts.join('&')}` : '';
  const uri = `${BASE_URL}/api/v1/feed/forums${qs}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {Authorization: token, 'Content-Type': 'application/json'},
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status !== 200 && data?.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_getForumDetails = (token: string, id: string) => {
  const uri = `${BASE_URL}/api/v1/feed/forums/${id}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {Authorization: token, 'Content-Type': 'application/json'},
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status !== 200 && data?.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_getForumContents = (token: string, id: string) => {
  const uri = `${BASE_URL}/api/v1/feed/forumContent/${id}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {Authorization: token, 'Content-Type': 'application/json'},
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status !== 200 && data?.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_getJoinedForums = (token: string) => {
  const uri = `${BASE_URL}/api/v1/feed/joinedForums`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
      headers: {Authorization: token, 'Content-Type': 'application/json'},
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status !== 200 && data?.status !== 'OK') {
          throw new Error(data.message || 'something went wrong!');
        }
        resolve(data);
      })
      .catch(err => reject(err));
  });
};

export const api_forumContent = (
  token: string,
  data: {content: string},
  id: string,
) => {
  const uri = `${BASE_URL}/api/v1/feed/forums/forumContent/${id}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {Authorization: token, 'Content-Type': 'application/json'},
    })
      .then(res => res.json())
      .then(res => {
        if (res?.status !== 200 && res?.status !== 'OK') {
          throw new Error(res.message || res.error || 'something went wrong!');
        }
        resolve(res);
      })
      .catch(err => reject(err));
  });
};
