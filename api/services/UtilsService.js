/**
 * UtilsService
 *   Simple utility functions used on the Frontend
 *
 */

var moment = require('moment');
var markdown = require('markdown-it')('commonmark');

module.exports = {

  displayDate: function (timestamp) {

    const calendarDate = moment(timestamp).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'Do MMMM, YYYY'
    });

    if ( calendarDate !== 'Today' ) return calendarDate;

    const timeFromNow = moment(timestamp).fromNow();
    return timeFromNow;

  },

  truncatedCount: function(count) {

    if ( !count ) return count;

    count = parseInt(count);

    if ( count < 1000 ) {
      return count;
    }

    else if ( count > 999 && count < 10000 ) {
      const count_string = count + '';
      const thousand = count_string[0];
      const hundred = count_string[1];
      return `${thousand}${hundred === '0' ? '' : `.${hundred}`}k`;
    }

    else if ( count > 9999 && count < 100000 ) {
      const count_string = count + '';
      const tenThousand = count_string[0] + count_string[1];
      return `${tenThousand}k`
    }

    else if ( count > 99999 && count < 1000000 ) {
      const count_string = count + '';
      const hundredThousand = count_string[0] + count_string[1] + count_string[2];
      return `${hundredThousand}k`;
    }

    else {
      return count;
    }


  },

  commentsPermalink: function(post) {
    switch(post.post_type) {
      case 'archived':
        return post.old_url;
        break;
      default:
        return `${sails.config.SITE.url}/post/${post.slug}`
        break;
    }

  },

  parseMarkdown: function(content){
    var defaultRender = markdown.renderer.rules.link_open || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      // If you are sure other plugins can't add `target` - drop check below
      var aIndex = tokens[idx].attrIndex('target');

      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
      } else {
        tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
      }

      // pass token to default renderer.
      return defaultRender(tokens, idx, options, env, self);
    };

    return markdown.renderInline(content);
  }

};
