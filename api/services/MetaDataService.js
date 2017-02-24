/**
 * MetaDataService
 *
 */

const siteUrlBase = 'https://zikoko.com';
const socialInfo = {
  facebook: {
    app_id: '593692017438309'
  },
  twitter: {
    username: 'zikokomag'
  }
}

module.exports = {
  pageTitle: function (title) {
    const pageTitle = title ? `${title} | Zikoko` : 'Zikoko | Enjoy and Share';
    return pageTitle;
  },

  pageMeta: function(page, data) {

    let info = {
      title: 'Zikoko',
      description: 'Enjoy and Share',
      url: siteUrlBase,
      image: 'https://res.cloudinary.com/big-cabal/image/upload/w_300,f_auto,fl_lossy,q_auto/v1473414487/logo-300x92_cnlz0c.jpg'
    };

    switch(page) {
      case 'post':
        info.title = data.sharing.title;
        info.description = data.sharing.subtitle;
        info.url = `${siteUrlBase}/post/${data.slug}`;
        info.image = data.sharing.imageUrl;
        break;
      case 'category':
        info.title = `Posts in the "${data.name}" Category`;
        info.url = `${siteUrlBase}/category/${data.slug}`;
        break;
      case 'search':
        info.title = `Search Results for "${data}"`;
        break;
      case 'user-posts':
        info.title = data.username;
        info.description = `Posts created by @${data.username}`;
        info.url = `${siteUrlBase}/user/${data.username}`;
        info.image = data.imageUrl || data.gravatarUrl;
        break;
      case 'user-likes':
        info.title = data.username;
        info.description = `Posts liked by @${data.username}`;
        info.url = `${siteUrlBase}/user/${data.username}`;
        info.image = data.imageUrl || data.gravatarUrl;
        break;
      default:
        if (data) {
          if (data.title) info.title = data.title;
          if (data.description) info.description = data.description;
          if (data.url) info.url = `${siteUrlBase}${data.url}`;
          if (data.image) info.image = data.image;
        }
        break;
    }

    return `<meta property="og:site_name" content="Zikoko!">
            <meta property="og:locale" content="en_US">
            <meta property="og:type" content="website">
            <meta property="og:title" content="${info.title}">
            <meta property="og:url" content="${info.url}">
            <meta property="og:description" content="${info.description}">
            <meta property="og:image" content="${info.image}">
            <meta property="fb:app_id" content="${socialInfo.facebook.app_id}">
            
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:description" content="${info.description}">
            <meta name="twitter:title" content="${info.title}">
            <meta name="twitter:image" content="${info.image}">
            <meta name="twitter:site" content="@${socialInfo.twitter.username}">
            <meta name="twitter:creator" content="@${socialInfo.twitter.username}">`;

  }
};

