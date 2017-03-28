/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  login: function(req, res) {

    const user = {
      identifier: req.body.identifier,
      password: req.body.password
    };
    const authorization = new Buffer(`${user.identifier}:${user.password}`).toString('base64');

    AuthService.signIn(user)
      .then((signedInUser) => {
        if ( !signedInUser ) return Promise.reject();
        req.session.user = signedInUser;
        req.session.user.authorization = authorization;
        console.log(req.session.user);
        res.redirect('/new');
      })
      .catch(() => {
        res.redirect('/login?error=true');
      })

  },

  logout: function(req, res) {
    req.session.user = null;
    res.redirect('/');
  },

  register: function(req, res) {

    function getUsername(user) {
      return new Promise((resolve, reject) => {
        const data = { username: user.username };
        APIService.req({ path: '/users/checkUsername', method: 'POST', data: data })
          .then((APIResponse) => {
            console.log(APIResponse.data);
            if ( APIResponse.data.available ) {
              resolve(user)
            } else {
              user.username = user.username + Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
              resolve(user);
            }

          })
      })
    }

    function setupUser(roles) {
      const registeredRole = roles.find((role) => { return role.name === 'registered' });
      const username = req.body.email.split('@')[0];
      return Promise.resolve({
        email: req.body.email,
        password: req.body.password,
        username: username,
        roles: [{ id: registeredRole.id }]
      })
    }

    function handleSuccess() {
      const user = {
        identifier: req.body.email,
        password: req.body.password
      };
      const authorization = new Buffer(`${user.identifier}:${user.password}`).toString('base64');

      AuthService.signIn(user)
        .then((signedInUser) => {
          if ( !signedInUser ) return Promise.reject();
          req.session.user = signedInUser;
          req.session.user.authorization = authorization;
          console.log(req.session.user);
          res.redirect('/me/profile');
        })
        .catch(() => {
          console.log("errrorrrr");
          res.redirect('/login');
        })

    }

    function handleError() {
      // @todo Send error message
      console.log("error")
      res.view('sign-up', { error: 'Error message here' });
    }

    APIService.req({ path: '/roles' })
      .then((APIResponse) => setupUser(APIResponse.data))
      .then((newUser) => getUsername(newUser))
      .then((newUser) => AuthService.createUser(newUser))
      .then((registeredUser) => {
        if ( !registeredUser ) return Promise.reject();
        handleSuccess();
      })
      .catch(() => handleError())

  },

  resetPassword: function(req, res) {


  },


  loginView: function(req, res) {
    const data = {
      title: MetaDataService.pageTitle('Login'),
      metaData: MetaDataService.pageMeta()
    };
    res.view('sign-in', data);
  },
  registerView: function(req, res) {
    const data = {
      title: MetaDataService.pageTitle('Register'),
      metaData: MetaDataService.pageMeta()
    };
    res.view('sign-up', data);
  },
  resetPasswordView: function(req, res) {
    const data = {
      title: MetaDataService.pageTitle('Reset Password'),
      metaData: MetaDataService.pageMeta()
    };
    res.view('reset-password', data);
  },

};

