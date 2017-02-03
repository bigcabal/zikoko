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

  'get /': 'PostsController.index',
  'get /category/:category_id': 'PostsController.category',

  'get /search': 'PostsController.search',

  'get /new': { view: 'new' },
  'get /post/:id': 'PostsController.single',
  'get /post/:id/amp': 'PostsController.amp',
  'get /feed/instant-articles': 'PostsController.instant_articles',

  'get /user/:id': 'UserController.posts',
  'get /user/:id/likes': 'UserController.likes',

  'get /me': 'UserController.posts', // @todo Redirect to user/current_user_id
  'get /me/profile': { view: 'me-profile' },
  'get /me/password': { view: 'me-password' },

  'get /login': { view: 'sign-in' },
  'post /login': 'AuthController.login',
  'get /register': { view: 'sign-up' },
  'post /register': 'AuthController.register'

};
