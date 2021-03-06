document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();

  var dropdowns  = M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {
    coverTrigger: false,
    hover: true,
    constrainWidth: false
  })

  var slider = M.Slider.init(document.querySelectorAll('.slider'), {

  })

  var sidenavs = M.Sidenav.init(document.querySelectorAll('.sidenav'), {

  })

  var selects = M.FormSelect.init(document.querySelectorAll('select'), {

  });

  var collapsible = M.Collapsible.init(document.querySelectorAll('.collapsible'), {

  })

  var tooltips = M.Tooltip.init(document.querySelectorAll('.tooltipped'), {
    enterDelay: 400
  })

  var htmlTooltips = Array.prototype.slice.call(document.querySelectorAll('.tooltipped.html')).map(function (elem) {
    return M.Tooltip.init(elem, {
      html: elem.getAttribute('data-tooltip'),
      enterDelay: 400
    });
  })

  document.querySelectorAll('.close-this-modal').forEach(function (elem) {
    elem.addEventListener('click', function(event) {
      M.Modal.getInstance(elem.parentElement.parentElement).close();
    })
  })

  document.querySelectorAll('.svg-icon').forEach(function(elem) {
    elem.style.backgroundImage = 'url(' + elem.getAttribute('data-src') + ')';
  })
})

window.selfInitSlider = function() {
  console.log(this);
  var slider = M.Slider.init(this, {
  })
}
