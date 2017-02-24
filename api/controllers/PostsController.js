/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  list: function (req, res) {

    console.log("POSTS ============")

    const categorySlug = req.params.category_slug || null;

    let data = {};
    data.order = req.param('order') || 'latest';
    data.feed = categorySlug ? null : 'Everything';
    data.currentUser = req.session.user;
    data.title = MetaDataService.pageTitle();
    data.metaData = MetaDataService.pageMeta();

    let query = '/posts?sort=publishedAt%20DESC';

    APIService.request('/categories')
      .then((categories) => data.categories = categories)
      .then(() => {
        if ( data.feed === 'Everything' ) return Promise.resolve();
        const category = data.categories.find((category) => { return category.slug === categorySlug });
        console.log(category)
        query = `/categories/${category.id}/populatedposts`;
        data.title = MetaDataService.pageTitle(category.name);
        data.metaData = MetaDataService.pageMeta('category', category);
        return data.feed = category.name;
      })
      .then(() => {
        if (data.currentUser) return APIService.authRequest(req.session.user.authorization, query)
        return APIService.request(query)
      })
      .then((posts) => {
        console.log(posts[0]);
        return data.posts = posts;
      })
      .then(() => res.view('posts', data))
      .catch((err) => {
        console.log(err);
        res.redirect('/');
      });

  },

  search: function (req, res) {

    const term = req.param('term') || null;
    if ( !term ) res.redirect('/');

    let data = {};
    data.term = term;
    data.currentUser = req.session.user;
    data.title = MetaDataService.pageTitle(`Search Results for "${term}"`);
    data.metaData = MetaDataService.pageMeta('search', term);

    let query = '/posts?sort=publishedAt%20DESC';

    APIService.request(query)
      .then((posts) => data.posts = posts)
      .then(() => APIService.request('/categories'))
      .then((categories) => data.categories = categories)
      .then(() => {
        console.log(data.posts);
        res.view('search', data)
      })
      .catch(() => res.redirect('/'))

  },

  instant_articles: function (req, res) {


    APIService.request('/posts?limit=2')
      .then((posts) => {
        console.log(posts);
        res.set('Content-Type', 'application/rss+xml');
        res.type('application/rss+xml');
        res.view('feed-ia', {
          layout: null,
          posts: posts
        });
      })
      .catch(() => res.redirect('/'))
  },

};
