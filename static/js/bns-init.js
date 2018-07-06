(function($, M) {
  function makePreloader() {
    function makeCircle() {
      var circle = document.createElement('div');
      circle.classList.add('circle');
      return circle;
    }

    // <div class="preloader-wrapper small active">
    var preloaderWrapper = document.createElement('div');
    preloaderWrapper.classList.add('preloader-wrapper');
    preloaderWrapper.classList.add('small');
    preloaderWrapper.classList.add('active');
    //   <div class="spinner-layer spinner-green-only">
    var preloaderSpinnerLayer = document.createElement('div');
    preloaderSpinnerLayer.classList.add('spinner-layer');
    //     <div class="circle-clipper left">
    var circleClipperLeft = document.createElement('div');
    circleClipperLeft.classList.add('circle-clipper');
    circleClipperLeft.classList.add('left');
    circleClipperLeft.appendChild(makeCircle());
    //     </div>
    preloaderSpinnerLayer.appendChild(circleClipperLeft);
    //     <div class="gap-patch">
    var gapPatch = document.createElement('div');
    gapPatch.classList.add('gap-patch');
    gapPatch.appendChild(makeCircle());
    //     </div>
    preloaderSpinnerLayer.appendChild(gapPatch);
    //     <div class="circle-clipper right">
    var circleClipperRight = document.createElement('div');
    circleClipperRight.classList.add('circle-clipper');
    circleClipperRight.classList.add('right');
    circleClipperRight.appendChild(makeCircle());
    //     </div>
    preloaderSpinnerLayer.appendChild(circleClipperRight);
    //   </div>
    preloaderWrapper.appendChild(preloaderSpinnerLayer);
    // </div>

    return preloaderWrapper;
  }

  $(document).ready(function() {
    document.querySelectorAll('.bns-character-gist').forEach(function(elem, i) {
      var region      = elem.getAttribute('data-region');
      var name        = elem.getAttribute('data-name');
      var dropdown    = document.createElement('div');
      dropdown.classList.add('dropdown-content');
      dropdown.classList.add('row')
      dropdown.setAttribute('id', 'gist-dropdown-' + i);

      elem.style.cursor = 'pointer';

      $(dropdown).append('<div class="col s12 center"><div class="kouna-loader"><div></div><div></div><div></div><div></div></div></div>');
      elem.parentElement.insertBefore(dropdown, elem)

      elem.setAttribute('data-target', 'gist-dropdown-' + i);
      var instance  = M.Dropdown.init(elem, {
        hover           : true,
        constrainWidth  : false,
        closeOnClick    : false,
        coverTrigger    : false,
        alignment       : 'center'
      })

      function asyncLoadContent() {
        $.ajax({
          method:     'GET',
          url:        '/bns/profile/' + region + '/' + name + '?gist',
          dataType:   'html'
        }).done(function(data) {
          dropdown.innerHTML = data;
          instance.recalculateDimensions();
          elem.removeEventListener('mouseover', asyncLoadContent);
          M.AutoInit(dropdown);
        }).fail(function() {
          console.log('Failed to get gist for', name, '@', 'region');
        })
      }

      elem.addEventListener('mouseover', asyncLoadContent);
    })
  })
})(jQuery, M);
