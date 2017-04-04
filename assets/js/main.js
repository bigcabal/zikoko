/*
  Current user
  ========================
 */

var currentUser = null;
if ( document.cookie.indexOf('zikokoUserAuth') > -1 ) {
  var zikokoUserAuth = document.cookie.split('zikokoUserAuth=')[1].split(';')[0];
  var zikokoUserId = document.cookie.split('zikokoUserId=')[1].split(';')[0];
  currentUser = {
    id: zikokoUserId,
    auth: zikokoUserAuth
  };
  console.log(currentUser);
}



/*
 Search Bar
 ========================
 */

var toggleOpenSearchEl = document.querySelector('.toggle--open-search');

if ( toggleOpenSearchEl ) {

  toggleOpenSearchEl.addEventListener('click', function() {
      document.querySelector('.search-header').classList.add('search-header--is-opened');
      document.querySelector('.page-overlay').classList.add('page-overlay--is-visible');
      document.querySelector('.search-header__field').focus();
      return false;
  });

  document.querySelector('.toggle--close-search').addEventListener('click', function() {
      closeSearchHeader();
      return false;
  });

  document.querySelector('.page-overlay').addEventListener('click', function() {
      closeSearchHeader();
      closeDeletePost();
      return false;
  });

  function closeSearchHeader() {
      document.querySelector('.search-header').classList.remove('search-header--is-opened');
      document.querySelector('.page-overlay').classList.remove('page-overlay--is-visible');
      document.querySelector('.search-header__field').value = '';
  }

  document.querySelector('.page-overlay').addEventListener('click', function() {
      closeSearchHeader();
      return false;
  });
}

/*
 Dropdowns
 ========================
 */

function setDropdownListeners() {
    if (document.querySelector('.user-profile-toggle')) {
        document.querySelector('.user-profile-toggle').addEventListener('click', function() {
            var userProfile = document.querySelector('.user-profile');
            if (userProfile.classList.contains('user-profile--active')) {
                userProfile.classList.remove('user-profile--active')
            } else {
                userProfile.classList.add('user-profile--active')
            }
            return false;
        });
    }

    if (document.querySelector('.account-toggle')) {
        document.querySelector('.account-toggle').addEventListener('click', function() {
            var account = document.querySelector('.account');
            if (account.classList.contains('account--active')) {
                account.classList.remove('account--active')
            } else {
                account.classList.add('account--active')
            }
            return false;
        });
    }
}

setDropdownListeners();

var categoryToggleEl = document.querySelector('.category-toggle');

if (categoryToggleEl) {

  categoryToggleEl.addEventListener('click', function() {
    var categories = document.querySelector('.filter__categories');
    if (categories.classList.contains('filter__categories--active')) {
        categories.classList.remove('filter__categories--active')
    } else {
        categories.classList.add('filter__categories--active')
    }
    return false;
});

}



/*
 Delete Post
 ========================
 */

function openDeletePost(e) {
  e.preventDefault();
  document.querySelector('.page-overlay').classList.add('page-overlay--is-visible');
  document.querySelector('.post-modal--delete').classList.add('post-modal--is-visible');
  return false;
}
var deletePostButton = document.querySelector('.post-action--delete');
if ( deletePostButton ) {
  deletePostButton.addEventListener('click', openDeletePost)
}

function closeDeletePost() {
    document.querySelector('.page-overlay').classList.remove('page-overlay--is-visible');
    document.querySelector('.post-modal--delete').classList.remove('post-modal--is-visible');
}



/*
 Like Post
 ========================
 */

function APIRequest(options) {
  return new Promise(function(resolve, reject) {
    options.method = options.method || "GET";
    options.params = options.params || null;
    var url = "https://formation-api-dev.herokuapp.com/api/" + options.path;

    var req = new XMLHttpRequest();
    req.open(options.method, url, true);

    if ( options.params ) {
      req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    req.setRequestHeader("Authorization", "Basic " + currentUser.auth);

    req.onreadystatechange = function () {
      if (req.readyState == XMLHttpRequest.DONE && req.status == 200) { resolve(req.response) }
    }
    req.onerror = function(err) { reject(err) };

    if ( options.params ) {
      req.send(options.params);
    } else {
      req.send();
    }

  });
}

function likePost(e) {

  e.preventDefault();


  function handleSuccess(res) {
    res = JSON.parse(res);
    if ( !res.post ) return handleError();

    var postActionIcon = e.target.querySelector('.post-action-icon');
    postActionIcon.classList.remove('post-action-icon--like');
    postActionIcon.classList.add('post-action-icon--liked');

    var postLikesEl = postActionIcon.nextElementSibling;
    var postLikesCount = postLikesEl.textContent === 'Like' ? 0 : parseInt(postLikesEl.textContent);
    postLikesEl.textContent = postLikesCount + 1;
  }

  function handleError(err) {
    console.log("err")
    console.log(err);
  }

  var postId = e.target[0].value;
  var requestOptions = {
    path: "likes",
    method: "POST",
    params: "post="+postId
  }

  APIRequest(requestOptions)
    .then(handleSuccess)
    .catch(handleError)

}


if ( currentUser ) {
  var likePostForms = Array.from(document.querySelectorAll('.js-likePostForm'));
  likePostForms.forEach(function(form) {
    form.addEventListener('submit', likePost);
  })
}
