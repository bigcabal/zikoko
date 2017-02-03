// Search Bar
$('.toggle--open-search').click(function(){
	$('.search-header').addClass('search-header--is-opened');
	$('.page-overlay').addClass('page-overlay--is-visible');
	$('.search-header__field').focus();
});

$('.toggle--close-search').click(function(){
	closeSearchHeader();
});	

$('.page-overlay').click(function(){
	closeSearchHeader();
});

function closeSearchHeader(){
	$('.search-header').removeClass('search-header--is-opened');
	$('.page-overlay').removeClass('page-overlay--is-visible');
	$('.search-header__field').val('');
}


// Feed Filter
$('.feed-filter__dropdown').click(function(){
	$(this).toggleClass('feed-filter__dropdown--opened');
});

$('.zkk-nav__dropdown').click(function(){
	$(this).toggleClass('zkk-nav__dropdown--opened');
});



