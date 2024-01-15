$(document).ready(function() {
  $('.grey').hoverIntent(
    function() {
      $(this).children('.hex').fadeIn(500);
    }, function() {
      $(this).children('.hex').fadeOut(500);
    }
  );
});