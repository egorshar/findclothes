define(function () {
  var is_disabled = false,
      timer;

  function disableHover() {
    if (!is_disabled) {
      document.body.classList.add('disable-hover');
      is_disabled = true;
    }
  }

  function enableHover() {
    if (is_disabled) {
      document.body.classList.remove('disable-hover');
      is_disabled = false;
    }
  }

  window.addEventListener('scroll', function (e) {
    if (document.activeElement !== document.body) {
      return;
    }

    clearTimeout(timer);
    disableHover();

    timer = setTimeout(enableHover, 300);
  }, false);
});
