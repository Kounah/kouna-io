(function($, M) {
  $(document).ready(function() {

    $('.bns-character').each(function() {
      var region  = $(this).attr('data-region');
      var name    = $(this).attr('data-name');

      if( region  != undefined
      &&  name    != undefined) {

        $(this).mouseover(function() {
          var instance = M.Tooltip.init(this, {
            html: '<div class="progress"><div class="indeterminate" style="display: block; width: 100px;"></div>'
          });

          $.ajax({
            method  : 'GET',
            url     : '/bns/profile/' + region + '/' + name + '?compact',
            dataType: 'json'
          }).done(function(data) {
            instance.destroy();
            M.Tooltip.init(this, {
              html: data
            })
          }.bind(this)).fail(function() {
            // fail to load
          }.bind(this));
        })
      }
    })

  })
})(jQuery, M);
