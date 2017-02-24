// Search Bar

document.querySelector('.toggle--open-search').addEventListener('click', function () {
  document.querySelector('.search-header').classList.add('search-header--is-opened');
  document.querySelector('.page-overlay').classList.add('page-overlay--is-visible');
  document.querySelector('.search-header__field').focus();
  return false;
});


document.querySelector('.toggle--close-search').addEventListener('click', function () {
  closeSearchHeader();
  return false;
});

document.querySelector('.page-overlay').addEventListener('click', function () {
  closeSearchHeader();
  return false;
});

function closeSearchHeader() {
  document.querySelector('.search-header').classList.remove('search-header--is-opened');
  document.querySelector('.page-overlay').classList.remove('page-overlay--is-visible');
  document.querySelector('.search-header__field').value = '';
}


var feed_filter_dropdown_toggle =  Array.from( document.querySelectorAll('.feed-filter__dropdown-toggle') );

feed_filter_dropdown_toggle.forEach(function(element){
  element.addEventListener('click', function(e){
    e.preventDefault();
    console.log("clicked feed filter dropdown");
    findAncestor(e.target, 'feed-filter__dropdown').classList.toggle('feed-filter__dropdown--opened');
  })
});

function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}


var zkk_nav_dropdown = Array.from( document.querySelectorAll('.zkk-nav__dropdown') );
zkk_nav_dropdown.forEach(function(element) {
  element.addEventListener('click', function (e) {
    e.target.classList.toggle('zkk-nav__dropdown--opened');
    return false;
  });
})



/*
 * LIKE POST
 *
 */



var likePostForms = Array.from( document.querySelectorAll('.js-likePostForm') );

function likePost(e) {

  e.preventDefault();

  var postId = e.target[0].value;
  var userId = '5897941e9bc4d71100448c21';
  var userAuth = 'aXJlQGJpZ2NhYmFsLmNvbTpwYXNzd29yZA==';

  console.log("STARTING====")

  //

  var xhr = new XMLHttpRequest();
  var url = "https://formation-api.herokuapp.com/api/likes";
  var formData = { post: postId, user: userId };

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Authorization", "Basic "+userAuth);
  xhr.onreadystatechange = function() {
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      // Request finished. Do processing here.
      console.log("done ==========")
      console.log(xhr);
    }
  }
  xhr.send(formData);


}

likePostForms.forEach(function(form) {
  //form.addEventListener('submit', likePost);
})



