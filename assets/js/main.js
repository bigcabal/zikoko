// Search Bar

document.querySelector('.toggle--open-search').addEventListener('click', function() {
	document.querySelector('.search-header').classList.add('search-header--is-opened');
  document.querySelector('.page-overlay').classList.add('page-overlay--is-visible');
  document.querySelector('.search-header__field').focus();

  console.log("clicked");
  return false;
});


document.querySelector('.toggle--close-search').addEventListener('click', function() {
  closeSearchHeader();
  return false;
});

document.querySelector('.page-overlay').addEventListener('click', function() {
	closeSearchHeader();
  return false;
});

function closeSearchHeader(){
  document.querySelector('.search-header').classList.remove('search-header--is-opened');
  document.querySelector('.page-overlay').classList.remove('page-overlay--is-visible');
  document.querySelector('.search-header__field').value = '';
}


// Feed Filter
document.querySelector('.feed-filter__dropdown').addEventListener('click', function(e) {
  console.log("clicked");
  e.target.classList.toggle('feed-filter__dropdown--opened');
  return false;
})

document.querySelector('.zkk-nav__dropdown').addEventListener('click', function(e) {
  e.target.classList.toggle('zkk-nav__dropdown--opened');
  return false;
});



