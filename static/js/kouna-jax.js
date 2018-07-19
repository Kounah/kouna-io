(function($) {
  window.asyncUser = function(elem) {
    $(elem).addClass('center');
    $(elem).html('<div class="col s12 center"><div class="kouna-loader"><div></div><div></div><div></div><div></div></div></div>');

    $.ajax({
      method  : 'GET',
      url     : '/user/' + $(elem).attr('data-id') + '/short',
      dataType: 'json'
    }).done(function(data) {
      $(elem).removeClass('center')
      $(elem).html(data.local.name);
    }).fail(function() {
      $(elem).html('');
      $(elem).append(
        $(document.createElement('a'))
        .attr('href', '#!')
        .text('Retry')
        .on('click', function() {
          asyncUser(elem)
        })
      )
    })
  }

  window.init = function($) {


    $.fn.asyncUser = function() {
      window.asyncUser(this);
      return this;
    }

    $('.async-user').each(function() {
      window.asyncUser(this);
    })
  }

  document.addEventListener('DOMContentLoaded', function() {
    window.init($);
  })
})(jQuery)
