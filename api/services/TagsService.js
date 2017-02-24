/**
 * TagsService
 *
 */

var https = require('https');

const config = {
  headers: {
    'Authorization': `Basic ${new Buffer(`${ process.env.AUTH_IDENTIFIER || sails.config.authorization.identifier }:${ process.env.AUTH_PASSWORD || sails.config.authorization.password }`).toString('base64')}`
  }
}

module.exports = {
  create: function (name) {
    return new Promise((resolve, reject) => {
      getTag(name)
        .then((res) => {
          if ( res.length > 0 ) return resolve({ name: res[0].name, id: res[0].id });
          return Promise.reject('Tag not found');
        })
        .catch(() => createTag(name).then((res) => resolve(res)))
    });
  }
};


function getTag(name) {
  const query = `/tags?where={"name":"${name}"}`;
  return new Promise((resolve, reject) => {

    APIService.req({ path: query })
      .then((res) => resolve(res))
      .catch(() => reject())
  });
}

function createTag(name) {
  const tag = { name: name };
  console.log("need to create tag - ", name);
  return new Promise((resolve, reject) => {
    APIService.req({ path: '/tags', method: 'POST', data: tag })
      .then((tag) => {
        if (tag) resolve({ name: tag.name, id: tag.id })
        reject();
      })
      .catch(() => reject())
  });
}

