/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const postsPerPage = sails.config.globals.settings.postsPerPage;

module.exports = {

  list: function (req, res) {

    console.log("POSTS ============")

    // Request parameters
    const categorySlug = req.params.category_slug || null;
    const page = req.params.page_number || 1;

    // Default view data
    let data = {};
    data.order = req.param('order') || 'latest';
    data.feed = categorySlug ? null : 'Everything';
    data.currentUser = req.session.user;
    data.title = MetaDataService.pageTitle();
    data.metaData = MetaDataService.pageMeta();

    // Pagination
    let queryLimit = `&limit=${postsPerPage}`;
    let queryPagination = `&skip=${ (page - 1) * postsPerPage}`;

    // Default query
    let query = `/posts?sort=publishedAt%20DESC${queryLimit}${queryPagination}`;


    APIService.req({ path: '/categories', user: data.currentUser, session: req.session })
      .then((APIResponse) => data.categories = APIResponse.data)
      .then(() => {
        if ( data.feed === 'Everything' ) return;
        const category = data.categories.find((category) => { return category.slug === categorySlug });
        query = `/categories/${category.id}/populatedposts?sort=publishedAt%20DESC${queryLimit}${queryPagination}`;
        data.title = MetaDataService.pageTitle(category.name);
        data.metaData = MetaDataService.pageMeta('category', category);
        return data.feed = category.name;
      })
      .then(() => APIService.req({ path: query, user: data.currentUser }))
      .then((APIResponse) => {
        data.pagination = {
          page: page,
          total: APIResponse.headers.total,
          pageBase: ''
        }
        console.log(APIResponse.headers);
        return APIResponse.data;
      })
      .then((posts) => data.posts = posts)
      .then(() => APIService.req({ path: '/posts?limit=4', session: req.session }))
      .then((APIResponse) => data.sidebarPosts = APIResponse.data)
      .then(() => res.view('posts', data))
      .catch((err) => res.redirect('/login?error=list'));

  },

  search: function (req, res) {

    // Search term
    const term = req.param('term') || null;
    if ( !term ) res.redirect('/');

    // Default view data
    let data = {};
    data.term = term;
    data.currentUser = req.session.user;
    data.title = MetaDataService.pageTitle(`Search Results for "${term}"`);
    data.metaData = MetaDataService.pageMeta('search', term);

    let query = '/posts?sort=publishedAt%20DESC';

    APIService.req({ path: query, user: data.currentUser })
      .then((APIResponse) => data.posts = APIResponse.data)
      .then(() => APIService.req({ path: '/categories', user: data.currentUser }))
      .then((APIResponse) => data.categories = APIResponse.data)
      .then(() => APIService.req({ path: '/posts?limit=4', session: req.session }))
      .then((APIResponse) => data.sidebarPosts = APIResponse.data)
      .then(() => {
        console.log(data.posts);
        res.view('search', data)
      })
      .catch(() => res.redirect('/'))

  },

  instant_articles: function (req, res) {

    APIService.req({ path: query })
      .then((APIResponse) => {
        console.log(APIResponse.data);
        res.set('Content-Type', 'application/rss+xml');
        res.type('application/rss+xml');
        res.view('feed-ia', {
          layout: null,
          posts: APIResponse.data
        });
      })
      .catch(() => res.redirect('/'))
  },

};
