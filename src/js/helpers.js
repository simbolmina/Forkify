// we will store helper functions used in project across project over and over. updates and fixes will be done here and managing app will be easer.

import { url } from 'inspector';
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data; //will be resolved value of promise.
  } catch (err) {
    throw err;
  }
};
/*
export const getJSON = async function (url) {
  try {
    // our first API call. we call an example recipce given in documentation
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    // return a promise (response object) and we will await it to return
    //we race fetch() and timout functions. if fetch takes too long timeout() will win the res and catch will catch the error.
    const data = await res.json();
    //we need to convert this returned fetch into json in order to work with.
    // json is avalilable for all the response objects. will return another promise and after we await return we store it in a variable.

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    //we are doing error handling here since default error messages are not helpful.
    //if response is not ok (res object) give me servers error message.
    return data; //will be resolved value of promise.
  } catch (err) {
    throw err;
    //when this function gives error, we want to see where it is being used. in this case its model.js loadRecipe() function. so we throw error.
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        //uploaded recipe will have to have this format
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //will be resolved value of promise.
  } catch (err) {
    throw err;
  }
};
*/
