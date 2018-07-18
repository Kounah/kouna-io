(function($) {
  document.addEventListener('DOMContentLoaded', function() {
    $('.user-popup[data-user]').each(function() {
      $.ajax({
        method  : 'GET',
        url     : '/user/' + $(this).attr('data-user') + '/short',
        dataType: 'json'
      }).done(function(data) {
        console.log($(this).attr('data-user'), data);
        if(data != undefined) {
          $(this).text(data.local.name);
          $(document.createElement('br')).insertBefore(this);
          $(document.createElement('span')).text(' by ').insertBefore(this);
        }
      }.bind(this)).fail(function() {
        $(this).text('user-' + $(this).attr('data-user')).css({display: 'none'});
      }.bind(this))
      // .always(function(...params) {
      //   console.log($(this).attr('data-user'), params)
      // }.bind(this))
    })

    function asyncUser(elem) {
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
        $(elem).append($(document.createElement('a')
          .attr('href', '#!')
          .text('Retry')
          .on('click', function() {
            asyncUser(elem)
          })
        ))
      })
    }

    $('.async-user').each(function() {
      asyncUser(this);
    })
  })

})(jQuery)
