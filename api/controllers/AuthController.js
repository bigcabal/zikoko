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
        req.session.user = JSON.parse(signedInUser);
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

    function setupUser(roles) {
      const registeredRole = roles.find((role) => { return role.name === 'registered' });
      const username = req.body.email.split('@')[0] + Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
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
          req.session.user = JSON.parse(signedInUser);
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

    APIService.request('/roles')
      .then((roles) => setupUser(roles))
      .then((newUser) => AuthService.createUser(newUser))
      .then((registeredUser) => {
        if ( !registeredUser ) return Promise.reject();
        handleSuccess();
      })
      .catch(() => handleError())

  },


  loginView: function(req, res) {
    let data = {};
    data.title = MetaDataService.pageTitle('Login');
    data.metaData = MetaDataService.metaData();
    res.view('sign-in', data);
  },
  registerView: function(req, res) {
    let data = {};
    data.title = MetaDataService.pageTitle('Register');
    data.metaData = MetaDataService.metaData();
    res.view('sign-up', data);
  },
  resetPasswordView: function(req, res) {
    let data = {};
    data.title = MetaDataService.pageTitle('Reset Password');
    data.metaData = MetaDataService.metaData();
    res.view('reset-password', data);
  },

};

