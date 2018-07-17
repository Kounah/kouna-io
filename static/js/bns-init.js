var __DEBUG = false;

(function($, M) {
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

      if(__DEBUG)
      console.log(document.getElementById(elem.getAttribute('data-container')));

      elem.setAttribute('data-target', 'gist-dropdown-' + i);
      var instance  = M.Dropdown.init(elem, {
        hover           : true,
        constrainWidth  : false,
        closeOnClick    : false,
        coverTrigger    : false,
        alignment       : elem.getAttribute('data-position') != undefined
        ? elem.getAttribute('data-position')
        : 'left',
        container       : elem.getAttribute('data-container') != undefined
        ? document.getElementById(elem.getAttribute('data-container'))
        : null
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

    var elems = document.querySelectorAll('.bns-character-model-keys');
    var instances = M.Autocomplete.init(elems, {});

    $(elems).on('keydown', function (event) {
      if(!['ArrowUp', 'ArrowDown'].includes(event.key)) {
        M.Autocomplete.getInstance(this).open()
      }
    });

    $.ajax({
      method    : 'GET',
      url       : '/bns/api/keys/char',
      dataType  : 'json'
    }).done(function(data) {
      instances.forEach(ins => {
        ins.updateData(data);
        console.log('updated data');
      })
    }).fail(function() {
      console.log('Failed to get character model keys');
    })
  })
})(jQuery, M);
