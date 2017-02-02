/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  posts: function (req, res) {

    const userId = req.params.id;
    let data = {}

    APIService.get(`/users/${userId}?populate=[roles]`)
      .then((user) => {
        user.role = getHighestRole(user.roles);
        return data.user = user;
      })
      .then(() => APIService.get(`/users/${userId}/posts`))
      .then((posts) => {
        posts.forEach((post) => { post.author = data.user });
        return data.posts = posts
      })
      .then(() =>  res.view('user', data));

  },

  likes: function (req, res) {

    const userId = req.params.id;
    let data = {}

    APIService.get(`/users/${userId}`)
      .then((user) => {
        console.log(user);
        return data.user = user;
      })
      .then(() => {
        res.view('user', data);
      })

  }

};


function getHighestRole(roles) {
  const ROLES = ['admin', 'editor', 'registered'];
  const PUBLIC_ROLE_NAMES = {
    'admin': 'Staff Writer',
    'editor': 'Staff Writer',
    'registered': 'User'
  }

  let lowestIndex = ROLES.length - 1;
  roles.forEach(role => {
    if (role.active) {
      const index = ROLES.indexOf(role.name);
      if ( index < lowestIndex ) lowestIndex = index;
    }
  });

  let highestRole = PUBLIC_ROLE_NAMES[ROLES[lowestIndex]];
  return highestRole;
}

