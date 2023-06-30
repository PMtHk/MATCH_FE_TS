import React, { useState, useEffect } from 'react';
import { defaultAxios, authAxios } from 'apis/utils';

const promiseWrapper = (promise: Promise<any>) => {
  let status = 'pending';
  let result: any;

  const s = promise.then(
    (value: any) => {
      status = 'success';
      result = value;
    },
    (error: any) => {
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
        throw new Error('Unknown Status');
    }
  };
};

export const useGetData = (url: string) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = defaultAxios.get(url);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, [url]);

  return resource;
};

export const useGetDataWithAuth = (url: string) => {
  const [resource, setResource] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const promise = authAxios.get(url);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, [url]);

  return resource;
};
