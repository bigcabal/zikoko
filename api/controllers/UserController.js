/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  posts: function (req, res) {

    const username = req.params.username;
    let data = {};
    data.currentUser = req.session.user;

    console.log(username);

    APIService.request(`/users?username=${username}`)
      .then((users) => {
        data.user = users[0];
        data.user.role = RolesService.getHighestRole(data.user.roles);
        console.log(data.user);
        return data.user;
      })
      .then(() => APIService.request(`/users/${data.user.id}/posts?sort=publishedAt%20DESC`))
      .then((posts) => {
        posts.forEach((post) => { post.author = data.user });
        return data.posts = posts
      })
      .then(() =>  res.view('user', data));

  },

  likes: function (req, res) {

    const username = req.params.username;
    let data = {};
    data.currentUser = req.session.user;

    res.view('user', data);

  },

  updateProfile: function(req, res) {

    const profile = {
      username: req.body.username,
      email: req.body.email,
      first_name: req.body.first_name || '',
      last_name: req.body.last_name || ''
    };

    const path = `/users/${req.session.user.id}`;
    APIService.authRequest(req.session.user.authorization, path, 'PUT', profile)
      .then((updatedUser) => {
        const authorization = req.session.user.authorization;
        req.session.user = updatedUser;
        req.session.user.authorization = authorization;
        console.log(updatedUser);
        res.redirect('/me/profile')
      })
      .catch(() => {
        console.log("error");
        res.redirect('/me/profile?error=true')
      })

  },
  updateProfileView: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');
    let data = { currentUser: req.session.user };
    res.view('me-profile', data);
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


  },
  updatePasswordView: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');
    let data = { currentUser: req.session.user };
    res.view('me-password', data);
  },

};


