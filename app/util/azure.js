'use strict';

const CryptoJS = require('crypto-js');
const fetch = require('node-fetch');

const curDate = new Date();
const formatDate = [ curDate.getUTCFullYear(), curDate.getUTCMonth() + 1, curDate.getUTCDate() ].join('-') + ' ' + [ curDate.getUTCHours(), curDate.getUTCMinutes(), curDate.getUTCSeconds() ].join(':');

const subscriptionsId = 'Azure CDN订阅ID';
const config = {
  keyId: 'Azure CDN ID',
  keyValue: 'Azure CDN Value',
  requestUrl: `/subscriptions/${subscriptionsId}/purges?apiVersion=1.0`,
  requestTime: formatDate,
  requestMethod: 'POST',
};

const getAllUriParams = url => {
  const params = {};
  const queries = url.split('&');
  let i;
  let l;
  for (i = 0, l = queries.length; i < l; i++) {
    const temp = queries[i].split('=');
    params[temp[0]] = temp[1];
  }
  return params;
};

const computerHttpSignature = config => {
  const index = config.requestUrl.indexOf('?');
  const queries = config.requestUrl.substring(index + 1);
  let orderedQueryParameters = '';
  const queryParameters = getAllUriParams(queries);
  const keys = Object.keys(queryParameters);
  keys.sort();
  const keysLen = keys.length;
  for (let i = 0; i < keysLen; i++) {
    const key = keys[i];
    const value = queryParameters[key];
    if (orderedQueryParameters !== '') {
      orderedQueryParameters += ', ';
    }
    orderedQueryParameters += key + ':' + value;
  }
  const requestUrl = config.requestUrl.substring(0, index);
  const hashTarget = requestUrl + '\r\n' + orderedQueryParameters + '\r\n' + config.requestTime + '\r\n' + config.requestMethod;
  const hash = CryptoJS.HmacSHA256(hashTarget, config.keyValue);
  return `AzureCDN ${config.keyId}:${CryptoJS.enc.Hex.stringify(hash).toUpperCase()}`;
};

module.exports = {
  // Azure CDN强制刷新
  async refreshRes(url) {
    const sig = computerHttpSignature(config);
    try {
      const res = await fetch(`https://restapi.cdn.azure.cn/subscriptions/${subscriptionsId}/purges?apiVersion=1.0`, {
        method: 'POST',
        body: JSON.stringify({
          Files: [ url ],
        }),
        headers: {
          Authorization: sig,
          'Content-Type': 'application/json',
          'x-azurecdn-request-date': formatDate,
        },
      });
      const resJson = await res.json();
      return resJson.Succeeded;
    } catch (e) {
      return false;
    }
  },
};
