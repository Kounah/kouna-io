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
          $(document.createElement('span')).text(' by ').insertBefore(this);
          $(document.createElement('br')).insertBefore(this);
        }
      }.bind(this)).fail(function() {
        $(this).text('user-' + $(this).attr('data-user')).css({display: 'none'});
      }.bind(this))
      // .always(function(...params) {
      //   console.log($(this).attr('data-user'), params)
      // }.bind(this))
    })
  })

})(jQuery)
