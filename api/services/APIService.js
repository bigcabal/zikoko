/**
 * APIService
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var https = require('https');
var isJSON = require('is-json');

module.exports = {

  // Generic request
  req: function(options) {
    return new Promise(function(resolve, reject) {
      const user = options.user || null;
      const path = options.path;
      const method = options.method ? options.method.toUpperCase() : 'GET';
      const data = options.data || null;
      const saveDataToSession = options.session || false;

      const requestOptions = {
        host: sails.config.API.host,
        port: 443,
        path: `${sails.config.API.path}${path}`,
        method: method
      }

      if (user) {
        requestOptions.headers = {'Authorization': `Basic ${user.authorization}`}
      } else {
        const defaultAuth = new Buffer(`${sails.config.globals.defaultAuth.email}:${sails.config.globals.defaultAuth.password}`).toString('base64');
        requestOptions.headers = {'Authorization': `Basic ${defaultAuth}`};
      }


      if ( saveDataToSession ) {

        options.session.temporaryStorage = options.session.temporaryStorage || {};

        if ( options.session.temporaryStorage[path] ) {
          //console.log(`FOUND RESULT TO "${path}" IN TEMPORARYSTORAGE`);
          resolve(options.session.temporaryStorage[path])
        } else {
          httpRequest(method, requestOptions, data, options.session)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
        }

      } else {
        httpRequest(method, requestOptions, data)
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      }


    }) // end Promise
  },


  /*
   * REPEATED REQUESTS
   * ==================
   * Most requests are made using the APIService.req() method because they are only called once.
   * The following methods are for requests that are made in multiple locations
   */

  getSidebarPosts: function(session) {
    return new Promise((resolve, reject) => {
      const path = '/posts?limit=4';
      const defaultAuth = new Buffer(`${sails.config.globals.defaultAuth.email}:${sails.config.globals.defaultAuth.password}`).toString('base64');
      session.temporaryStorage = session.temporaryStorage || {};

      const requestOptions = {
        host: sails.config.API.host,
        port: 443,
        path: `${sails.config.API.path}${path}`,
        method: 'GET',
        headers: {'Authorization': `Basic ${defaultAuth}`}
      }

      if (session.temporaryStorage[path]) {
        //console.log(`FOUND RESULT TO "${path}" IN TEMPORARYSTORAGE (sidebarPosts)`);
        resolve(session.temporaryStorage[path])
      } else {
        httpRequest('GET', requestOptions, null, session)
          .then((response) => resolve(response))
          .catch((err) => reject(err));
      }

    });

  },

  getRelatedPosts: function(path, session) {
    return new Promise((resolve, reject) => {
      if (session.temporaryStorage[path])
        return resolve(session.temporaryStorage[path]);

      const defaultAuth = new Buffer(`${sails.config.globals.defaultAuth.email}:${sails.config.globals.defaultAuth.password}`).toString('base64');
      const requestOptions = {
        host: sails.config.API.host,
        port: 443,
        path: `${sails.config.API.path}${path}`,
        method: 'GET',
        headers: {'Authorization': `Basic ${defaultAuth}`}
      }

      httpRequest('GET', requestOptions, null, session)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  },

  getPostsNavigation: function(options) {

    const defaultNavigation = [
      {
        url: '/',
        label: 'Everything'
      },
      {
        url: '/category/list',
        label: 'List'
      },
      {
        url: '/category/gist',
        label: 'Gist'
      },
      {
        url: '/category/story',
        label: 'Story'
      },
      {
        url: '/category/news',
        label: 'News'
      },
      {
        url: '/category/videos',
        label: 'Videos'
      }
    ];

    return Promise.resolve(defaultNavigation);

  }


};


function httpRequest(method, requestOptions, data, session) {
  return new Promise((resolve, reject) => {
    let newRequest = https.request(requestOptions, function (response) {

      const RESPONSE = { headers: response.headers };
      let body = '';

      response.on('data', function (data) {
        data = data.toString();
        body += data;
      });

      response.on('end', function () {
        if (isJSON(body)) {
          body = JSON.parse(body);
          RESPONSE.data = body;
          if ( session ) {
            const path = requestOptions.path.split(sails.config.API.path)[1];
            session.temporaryStorage[path] = RESPONSE;
          }
          resolve(RESPONSE);
        } else if (body == '[]') {
          RESPONSE.data = [];
          resolve(RESPONSE);
        } else {
          //console.log("IS NOT JSON =====")
          //console.log(body);
          reject(body);
        }
      });
    });

    newRequest.on('error', (e) => {
      //console.error(e);
      reject(e);
    });

    if (method === 'POST' | method === 'PUT') {
      newRequest.write(JSON.stringify(data));
    }

    newRequest.end();
  })
}
