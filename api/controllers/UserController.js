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

    APIService.req({ path: `/users?username=${username}`, user: data.currentUser })
      .then((APIResponse) => {
        data.user = APIResponse.data[0];
        data.user.role = RolesService.getHighestRole(data.user.roles);
        console.log(data.user);

        data.title = MetaDataService.pageTitle(`@${data.user.username}`);
        data.metaData = MetaDataService.pageMeta('user-likes', data.user);
        return;
      })
      .then(() => APIService.req({ path: `/posts?author=${data.user.id}&sort=publishedAt%20DESC`, user: data.currentUser }))
      .then((APIResponse) => {
        const posts = APIResponse.data;
        console.log(posts);
        return data.posts = Array.isArray(posts) ? posts : [posts];
      })
      .then(() => APIService.req({ path: '/posts?limit=4', session: req.session }))
      .then((APIResponse) => data.sidebarPosts = APIResponse.data)
      .then(() =>  res.view('user-posts', data));

  },

  likes: function (req, res) {

    const username = req.params.username;
    let data = {};
    data.currentUser = req.session.user;

    APIService.req({ path: `/users?username=${username}`, user: data.currentUser })
      .then((APIResponse) => {
        data.user = APIResponse.data[0];
        data.user.role = RolesService.getHighestRole(data.user.roles);
        //console.log(data.user);

        data.title = MetaDataService.pageTitle(`@${data.user.username}`);
        data.metaData = MetaDataService.pageMeta('user-likes', data.user);
        return;
      })
      .then(() => APIService.req({ path: `/likes?user=${data.user.id}&sort=publishedAt%20DESC`, user: data.currentUser }))
      .then((APIResponse) => {
        const likes = APIResponse.data;
        console.log(likes[0]);
        return data.likes = Array.isArray(likes) ? likes : [likes];
      })
      .then(() => APIService.req({ path: '/posts?limit=4', session: req.session }))
      .then((APIResponse) => data.sidebarPosts = APIResponse.data)
      .then(() =>  res.view('user-likes', data));

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
      .then(() => APIService.req({ path: path, user: req.session.user, method: 'PUT', data: profile }))
      .then((APIResponse) => {
        const updatedUser = APIResponse.data;
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
    APIService.req({ path: path, user: req.session.user, method: 'PUT', data: details })
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


