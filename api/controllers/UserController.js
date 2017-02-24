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
    data.activeTab = 'posts';

    APIService.request(`/users?username=${username}`)
      .then((users) => {
        data.user = users[0];
        console.log(data.user);

        data.title = MetaDataService.pageTitle(`@${data.user.username}`);
        data.metaData = MetaDataService.pageMeta('user-likes', data.user);
        // @todo there is no fucking role to get the fucking highest yet okay??!!?
        //data.user.role = RolesService.getHighestRole(data.user.roles);
        data.user.role = 'TINGZ FAM';

        return data.user;
      })
      .then(() => APIService.request(`/posts?author=${data.user.id}&sort=publishedAt%20DESC`))
      .then((posts) => {

        return data.posts = posts
      })
      .then(() =>  res.view('user', data));

  },

  likes: function (req, res) {

    const username = req.params.username;
    let data = {};
    data.currentUser = req.session.user;
    data.activeTab = 'likes';

    APIService.request(`/users?username=${username}`)
      .then((users) => {
        data.user = users[0];
        console.log(data.user);

        data.title = MetaDataService.pageTitle(`@${data.user.username}`);
        data.metaData = MetaDataService.pageMeta('user-likes', data.user);
        // @todo there is no fucking role to get the fucking highest yet okay??!!?
        //data.user.role = RolesService.getHighestRole(data.user.roles);
        data.user.role = 'TINGZ FAM';

        return data.user;
      })
      .then(() => APIService.request(`/likes?user=${data.user.id}&sort=publishedAt%20DESC`))
      .then((posts) => { return data.posts = posts })
      .then(() =>  res.view('user', data));

  },

  updateProfile: function(req, res) {

    const profile = {
      username: req.body.username,
      email: req.body.email,
      first_name: req.body.first_name || '',
      last_name: req.body.last_name || ''
    };

    const path = `/users/${req.session.user.id}`;

    checkIfFileUploaded( req.file('profileImage') )
      .then((fileWasUploaded) => {
        if (!fileWasUploaded) return Promise.resolve();
        return CloudinaryService.upload( req.file('profileImage') )
          .then((result) => { return profile.imageUrl = result.secure_url })
      })
      .then(() => APIService.authRequest(req.session.user.authorization, path, 'PUT', profile))
      .then((updatedUser) => {
        console.log(updatedUser);
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
    data.title = MetaDataService.pageTitle('Edit Profile');
    data.metaData = MetaDataService.pageMeta();
    res.view('me-profile', data);
  },

  updatePassword: function(req, res) {

    const details = {
      newPassword: req.body.password,
      confirmation: req.body.password_confirmation
    }

    const path = `/users/changePassword/${req.session.user.id}`;
    APIService.authRequest(req.session.user.authorization, path, 'PUT', details)
      .then(() => res.redirect('/logout'))
      .catch(() => {
        res.redirect('/me/password?error=true')
      })


  },
  updatePasswordView: function(req, res) {
    if ( !req.session.user ) res.redirect('/login');
    let data = { currentUser: req.session.user };
    data.title = MetaDataService.pageTitle('Change Password');
    data.metaData = MetaDataService.pageMeta();
    res.view('me-password', data);
  },

};


function checkIfFileUploaded( file ) {
  return new Promise((resolve) => {
    file.upload(function (err, uploadedFiles) {
      if (err) resolve(false)
      if (!uploadedFiles) resolve(false)
      if (uploadedFiles.length === 0) resolve(false)
      resolve(true);
    });
  })
}

