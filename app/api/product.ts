import {BASE_URL} from './index';

export const api_getHomeProducts = (
  token: string,
  categoryId: string | null,
) => {
  let uri = '';

  if (categoryId === null) {
    uri = `${BASE_URL}/api/v1/product`;
  } else {
    uri = `${BASE_URL}/api/v1/product?categoryId=${categoryId}`;
  }

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

export const api_productGetById = (token: string, productId: string) => {
  let uri = `${BASE_URL}/api/v1/product/detail/${productId}`;

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

export const api_productCreate = (formData: FormData, token: string) => {
  const uri = `${BASE_URL}/api/v1/product`;
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

export const api_getSellerProduct = (token: string, search?: string) => {
  let uri = `${BASE_URL}/api/v1/product/myProducts`;
  
  if (search && search.trim()) {
    uri += `?search=${encodeURIComponent(search.trim())}`;
  }

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
export const api_searchProduct = (token: string, query: string) => {
  let uri = `${BASE_URL}/api/v1/product/searchProducts?query=${query}`;
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

export const api_searchProductWithFilters = (token: string, body: any) => {
  let uri = `${BASE_URL}/api/v1/product/searchProductsByFilters`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: token,
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

export const api_addProductToFavourite = (token: string, productId: any) => {
  let uri = `${BASE_URL}/api/v1/product/favorites/${productId}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'POST',
      headers: {
        Authorization: token,
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

export const api_getFavouriteList = (token: string, body: any) => {
  let uri = `${BASE_URL}/api/v1/product/favorites`;
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

export const api_getReviewList = (token: string, productId: any) => {
  let uri = `${BASE_URL}/api/v1/product/reviews/${productId}`;
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

export const apiSimilarProductList = (token: string, productId: any) => {
  let uri = `${BASE_URL}/api/v1/product/similar/${productId}`;
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

export const api_productUpdate = (isFormData: boolean, payload: any, token: string, productId: string) => {
  const uri = `${BASE_URL}/api/v1/product/${productId}`;
  return new Promise((resolve, reject) => {
    fetch(uri, {
      method: 'PUT',
      body: isFormData ? payload : JSON.stringify(payload),
      headers: {
        authorization: token,
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    })
      .then(res => {
        return res.json()
      })
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


export const api_productDelete = (token: string, productId: string) => {
  const uri = `${BASE_URL}/api/v1/product/myProducts/${productId}`;
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