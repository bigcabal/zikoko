/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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
      // @todo Login user and redirect them to edit profile page or new post page
      res.redirect('/login');
    }

    function handleError() {
      // @todo Send error message
      console.log("error")
      res.view('sign-up', { error: 'Error message here' });
    }

    APIService.get('/roles')
      .then((roles) => setupUser(roles))
      .then((newUser) => AuthService.createUser(newUser))
      .then((registeredUser) => {
        if ( !registeredUser ) return Promise.reject();
        handleSuccess();
      })
      .catch(() => handleError())

  }

};

