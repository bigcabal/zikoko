/**
 * AuthService
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var https = require('https');

const config = {
  headers: {
    'Authorization': `Basic ${new Buffer(`${sails.config.authorization.identifier}:${sails.config.authorization.password}`).toString('base64')}`
  }
}

module.exports = {

  createUser: function (newUser) {
    return new Promise(function (resolve, reject) {
      let options = {
        host: sails.config.globals.API.host,
        port: 443,
        path: `${sails.config.globals.API.path}/register`,
        method: 'POST',
        headers: config.headers
      }
      let newRequest = https.request(options, function (response) {
        let body = '';
        response.on('data', function (data) {
          data = data.toString();
          body += data;
        });
        response.on('end', function () {
          resolve(body);
        });
      });
      newRequest.on('error', (e) => {
        console.error("error: ", e);
        reject(e);
      });
      newRequest.write( JSON.stringify(newUser) );
      newRequest.end();
    })
  },

  signIn: function(login) {
    return new Promise(function (resolve, reject) {
      let options = {
        host: sails.config.globals.API.host,
        port: 443,
        path: `${sails.config.globals.API.path}/auth/local`,
        method: 'POST',
        headers: config.headers
      }

      let newRequest = https.request(options, function (response) {
        let body = '';
        response.on('data', function (data) {
          data = data.toString();
          body += data;
        });
        response.on('end', function () {
          resolve(body);
        });
      });
      newRequest.on('error', (e) => {
        console.error("error: ", e);
        reject(e);
      });
      newRequest.write( JSON.stringify(login) );
      newRequest.end();
    })

  }

};

