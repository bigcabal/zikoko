/**
 * MetaDataService
 *
 */

module.exports = {
  pageTitle: function (title) {
    const pageTitle = title ? `${title} | Zikoko` : 'Zikoko | Enjoy and Share';
    return pageTitle;
  },

  metaData: function(title, description, image, url) {

    title = title || 'Zikoko';
    description = description || 'Enjoy and Share';
    url = url || 'https://zikoko.com';
    image = image || 'https://res.cloudinary.com/big-cabal/image/upload/w_300,f_auto,fl_lossy,q_auto/v1473414487/logo-300x92_cnlz0c.jpg';

    return `<meta property="og:title" content="${title}">
            <meta property="og:locale" content="en_US">
            <meta property="og:type" content="website">
            <meta property="og:image" content="${image}">
            <meta property="og:site_name" content="Zikoko!">
            <meta property="og:url" content="${url}">
            <meta property="og:description" content="${description}">
            <meta property="fb:app_id" content="593692017438309">
            
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:description" content="${description}">
            <meta name="twitter:title" content="${title}">
            <meta name="twitter:image" content="${image}">
            <meta name="twitter:site" content="@zikokomag">
            <meta name="twitter:creator" content="@zikokomag">`;

  }
};

