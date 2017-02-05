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

    APIService.request(`/users/${userId}?populate=[roles]`)
      .then((user) => {
        user.role = getHighestRole(user.roles);
        return data.user = user;
      })
      .then(() => APIService.request(`/users/${userId}/posts?sort=publishedAt%20DESC`))
      .then((posts) => {
        posts.forEach((post) => { post.author = data.user });
        return data.posts = posts
      })
      .then(() =>  res.view('user', data));

  },

  likes: function (req, res) {

    const userId = req.params.id;
    let data = {}

    APIService.request(`/users/${userId}`)
      .then((user) => {
        console.log(user);
        return data.user = user;
      })
      .then(() => {
        res.view('user', data);
      })

  },

  updateProfile: function(req, res) {

    const profile = {
      username: req.body.username,
      email: req.body.email
    };

    console.log(profile);
    res.redirect('/me/profile');

    // const path = `/users/id`;
    // APIService.authRequest(null, path, 'put', profile)
    //   .then((updatedUser) => {
    //     console.log(updatedUser);
    //     res.redirect('/me/profile')
    //   })
    //   .catch(() => {
    //     console.log("error")
    //   })

  },

  updatePassword: function(req, res) {

    const details = {
      oldPassword: req.body.old_password,
      newPassword: req.body.password,
      confirmation: req.body.password_confirmation
    }

    console.log(details);
    res.redirect('/me/password')

    // const path = `/users/changePassword/:id`;
    // APIService.authRequest(null, path, 'put', details)
    //   .then((updatedUser) => {
    //     console.log(updatedUser);
    //     res.redirect('/me/password')
    //   })
    //   .catch(() => {
    //     console.log("error")
    //   })


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

