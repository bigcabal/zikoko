/**
 * APIService
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var https = require('https');
var isJSON = require('is-json');

const config = {
  headers: {
    'Authorization': `Basic ${new Buffer(`${ process.env.AUTH_IDENTIFIER || sails.config.authorization.identifier }:${ process.env.AUTH_PASSWORD || sails.config.authorization.password }`).toString('base64')}`
  }
}

module.exports = {

  request: function (path, method = 'GET', data = null) {
    return new Promise(function (resolve, reject) {
      let options = {
        host: sails.config.globals.API.host,
        port: 443,
        path: `${sails.config.globals.API.path}${path}`,
        method: method
      }
      let newRequest = https.request(options, function (response) {
        let body = '';
        response.on('data', function (data) {
          data = data.toString();
          body += data;
        });
        response.on('end', function () {
          body = JSON.parse(body);
          resolve(body);
        });
      });
      newRequest.on('error', (e) => {
        console.error(e);
        reject(e);
      });

      if ( method.toLowerCase() === 'post' | method.toLowerCase() === 'put' ) newRequest.write( JSON.stringify(data) );
      newRequest.end();

    })
  },

  authRequest: function (auth, path, method = 'GET', data = null) {
    return new Promise(function (resolve, reject) {
      let options = {
        host: sails.config.globals.API.host,
        port: 443,
        path: `${sails.config.globals.API.path}${path}`,
        method: method,
        headers: {
          'Authorization': auth ? `Basic ${auth}` : config.headers.Authorization
        }
      }
      let newRequest = https.request(options, function (response) {
        let body = '';
        response.on('data', function (data) {
          data = data.toString();
          body += data;
        });
        response.on('end', function () {
          body = JSON.parse(body);
          resolve(body);
        });
      });
      newRequest.on('error', (e) => {
        console.error(e);
        reject(e);
      });

      if ( method.toLowerCase() === 'post' || method.toLowerCase() === 'put' ) {
        newRequest.write( JSON.stringify(data) );
      }
      newRequest.end();

    })
  },
};

