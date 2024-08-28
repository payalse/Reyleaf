import { BASE_URL } from './index';

export const api_getCategories = () => {
  const uri = `${BASE_URL}/api/v1/admin/get-category`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'GET',
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
