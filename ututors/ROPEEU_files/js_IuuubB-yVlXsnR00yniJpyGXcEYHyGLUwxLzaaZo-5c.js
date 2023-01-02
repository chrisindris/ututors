// ----- INITIALIZE BS5 TOOL TIPS
document.addEventListener("DOMContentLoaded", function() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
});


// ----- BACK TO TOP
document.addEventListener("DOMContentLoaded", function() {
  let bttBTN = document.getElementById("back-to-top");

  // When the user scrolls down 50px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
    ) {
      bttBTN.style.display = "block";
    } else {
      bttBTN.style.display = "none";
    }
  }
  // When the user clicks on the button, scroll to the top of the document
  bttBTN.addEventListener("click", backToTop);

  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
});

// ----- MENU
document.addEventListener("DOMContentLoaded", function() {
  let navigation = document.getElementById("navigation");
  let navPanel = document.querySelector(".nav-panel-inner");
  let navOffcanvas = document.querySelector(".offcanvas");
  let searchBTN = document.getElementById("small-search-button");
  let searchBar = document.getElementById("search-bar");
  let searchIcon = document.querySelector("#small-search-button > i");
  let searchField = document.getElementById("utm-search-bar");
  let bsSearchBar = new bootstrap.Collapse(searchBar, {toggle: false});
  var bsNavOffcanvas = new bootstrap.Offcanvas(navOffcanvas);

  function closeSearch() {
    searchBTN.classList.remove('open');
    bsSearchBar.toggle();
    searchBTN.focus();
  }

  //Events

  // Switch Icon - Avoid out of sync
  searchBar.addEventListener('hide.bs.collapse', function () {
    searchIcon.classList.add('fa-search');
    searchIcon.classList.remove('fa-times-circle');
  });

  searchBar.addEventListener('show.bs.collapse', function () {
    searchIcon.classList.remove('fa-search');
    searchIcon.classList.add('fa-times-circle');
  });

  // Focus on input when open
  searchBar.addEventListener('shown.bs.collapse', function() {
    if (searchBar.classList.contains('show')) {
      searchField.focus();
    }
  });

  // Offcanvas Event
  navOffcanvas.addEventListener('show.bs.offcanvas', function () {
    if (searchBar.classList.contains('show')) {
      closeSearch();
    }
  });

  // Search
  searchBTN.addEventListener('click', function (event) {
    if (navigation.classList.contains('show')) {
      bsNavOffcanvas.hide();
    }
    searchBTN.classList.toggle('open');
  }, false);

  // Esc Key Functions
  function escapeSearch(ev) {
    if (ev.key === 'Escape') { // Esc key code

      if (searchField.matches(':focus')) {
        // close search bar with esc key if input is focused
        closeSearch(ev);
      }
    }
  }

  document.onkeyup = escapeSearch;


  // Height Calculations
  function addMaxHeight() {
    let windowSize = window.innerWidth;
    let navPanelHeight;
    let headerHeight;
    let calcMH;

    if (windowSize < 768) {
      let header = document.querySelector("#header");
      headerHeight = header.getBoundingClientRect().height + 'px';
      navPanelHeight = '100vh - ' + headerHeight;
      calcMH = 'calc(' + navPanelHeight + ')';
    } else {
      let navPanelTitle = document.querySelector(".nav-panel-title");
      headerHeight = 0;
      navPanelHeight = '100vh - '+ navPanelTitle.getBoundingClientRect().height +'px';
      calcMH = 'calc(' + navPanelHeight + ')';
    }

    navigation.style.top = headerHeight;
    navPanel.style.maxHeight = calcMH;

  }
  addMaxHeight();
  window.addEventListener('resize', addMaxHeight);
});

//  Submenu Toggle
Drupal.behaviors.menuLoad = {
  attach: function (context, settings) {
    once("menuLoad", '.submenu-toggle', context).forEach(function (element) {
      element.addEventListener('click', (ev) => {
        ev.preventDefault();
        let target = ev.currentTarget;
        let targetMenu = target.dataset.target;
        let menu = document.getElementById(targetMenu);
        target.classList.toggle('menu-open');
        menu.classList.toggle('menu-open');
      })
    })
  }
};


// ----- Navigator.share
document.addEventListener("DOMContentLoaded", function() {
  const shareBTN = document.getElementById('navigator-share-btn');
  const shareTitle = document.title;
  const shareURL = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href;

  var newsNode = document.querySelector('.node--type-news');
  var blogNode = document.querySelector('.node--type-blog');
  var papersNode = document.querySelector('.node--type-student-papers');

  if (newsNode || blogNode || papersNode) {
    if (!navigator.share) {
      shareBTN.style.display = 'none';
    } else {
      shareBTN.style.display = 'inline-block';
    }

    shareBTN.addEventListener('click', event => {
      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          url: shareURL
        }).then(() => {
          console.log('Thanks for sharing!');
        }).catch(console.error);
      }
    });
  }
});

// ----- CKEDITOR CALENDAR

document.addEventListener("DOMContentLoaded", function() {
  let calContents = document.querySelectorAll('.cal-day-contents');

  calContents.forEach( function (calContent, index) {
    if ( calContent.innerText.trim().length === 0) {
      calContent.parentElement.classList.add('no-data');
    }
  });
});

// ----- HERO IMAGE

document.addEventListener("DOMContentLoaded", function() {
  let heroCarousel = document.getElementById('hero-image-carousel');

  if (heroCarousel) {
    heroCarousel.addEventListener('slide.bs.carousel', function (ev) {
      heroCarousel.parentNode.querySelector('.hero-image-thumb.active').classList.remove('active');
      heroCarousel.parentNode.querySelector('.hero-image-thumb[data-bs-slide-to="' + ev.to + '"]').classList.add('active');
    });
  }
});;
