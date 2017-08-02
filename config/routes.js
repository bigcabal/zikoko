/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/



  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  'get /': 'PostsController.list',
  'get /page/:page_number': 'PostsController.list',
  'get /category/:category_slug': 'PostsController.list',
  'get /category/:category_slug/page/:page_number': 'PostsController.list',

  'get /search': 'PostsController.search',
  'get /search/page/:page_number': 'PostsController.search',

  'get /feed/instant-articles': 'PostsController.instant_articles',

  'get /new': 'NewPostController.view',
  'post /new': 'NewPostController.create',

  'get /post/:slug': 'PostController.single',
  'get /post/:slug/page/:page_number': 'PostController.single',
  'get /post/:slug/amp': 'PostController.amp',
  'post /post/like': 'PostController.like',
  'post /post/delete': 'PostController.delete',

  'get /user/:username': 'UserController.posts',
  'get /user/:username/page/:page_number': 'UserController.posts',
  'get /user/:username/likes': 'UserController.likes',
  'get /user/:username/likes/page/:page_number': 'UserController.likes',

  'get /me/profile': 'UserController.updateProfileView',
  'post /me/profile': 'UserController.updateProfile',
  'get /me/password': 'UserController.updatePasswordView',
  'post /me/password': 'UserController.updatePassword',

  'get /login': 'AuthController.loginView',
  'post /login': 'AuthController.login',
  'get /logout': 'AuthController.logout',
  'get /register': 'AuthController.registerView',
  'post /register': 'AuthController.register',
  'get /reset-password': 'AuthController.resetPasswordView',


  'get /ENV': {
    fn: function(req, res) {
      return res.send(sails.config.API.host);
    }
  },


  'get /:archived_category/:archived_slug': {
    skipAssets: true,
    controller: 'PostController',
    action: 'archived'
  }



};
