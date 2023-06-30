import { useState, useEffect } from 'react';
import axios from 'axios';
import { defaultAxios } from 'apis/utils';

const promiseWrapper = (promise) => {
  let status = 'pending';
  let result;

  const s = promise.then(
    (value) => {
      status = 'success';
      result = value;
    },
    (error) => {
      status = 'error';
      result = error;
    },
  );

  return () => {
    switch (status) {
      case 'pending':
        throw s;
      case 'success':
        return result;
      case 'error':
        throw result;
      default:
        throw new Error('Unknown status');
    }
  };
};

function useGetData(url, config) {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = defaultAxios
        .get(url, config)
        .then((response) => response.data);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, [url]);

  return resource;
}

export default useGetData;
