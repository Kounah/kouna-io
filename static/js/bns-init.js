var __DEBUG = false;
var loader = '<div class="col s12 center"><div class="kouna-loader"><div></div><div></div><div></div><div></div></div></div>';
var bnsCharGistCounter = 0;

function getJsonPath(o, path) {
  if(path.length > 0) {
    return getJsonPath(o[path.shift()], path);
  } else {
    return o;
  }
}

function bnsInit ($, M) {
  { // bns character gist
    function bnsCharGist (elem) {
      console.log(elem);

      bnsCharGistCounter++;
      var region      = elem.getAttribute('data-region');
      var name        = elem.getAttribute('data-name');
      var dropdown    = document.createElement('div');
      dropdown.classList.add('dropdown-content');
      dropdown.classList.add('row')
      dropdown.setAttribute('id', 'gist-dropdown-' + bnsCharGistCounter);

      elem.style.cursor = 'pointer';

      $(dropdown).append(loader);
      elem.parentElement.insertBefore(dropdown, elem)

      if(__DEBUG)
      console.log(document.getElementById(elem.getAttribute('data-container')));

      elem.setAttribute('data-target', 'gist-dropdown-' + bnsCharGistCounter);
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
      bnsCharGistCounter++;
    }
    $('.bns-character-gist:not(.initialized)').each(function() {
      bnsCharGist(this)
      $(this).addClass('initialized');
    })
  }

  { // bns character model keys
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
  }

  { // bns raid member detail
    function bnsRaidMemberDetail(elem) {
      $(elem).addClass('center')
      .html(loader);

      var userId = $(elem).attr('data-userid');
      var raidId = $(elem).attr('data-raidid');

      $.ajax({
        method      : 'GET',
        url         : '/bns/raid/' + raidId + '/member/' + userId + '/detail',
        datayType   : 'html'
      }).done(function(data) {
        $(elem).removeClass('center')
        .html(data)

        M.AutoInit(elem);
        bnsInit($, M);
      }).fail(function() {
        $(elem).html('')
        .append($(document.createElement('p'))
          .append('<span>Something went wrong, to retry click </span>')
          .append($(document.createElement('a'))
            .text('here')
            .attr('href', '#!')
            .on('click', function() {
              bnsRaidMemberDetail(elem);
            }))
          .append('<span>.</span>')
        )
      })
    }
    $('.bns-raid-member-detail:not(.initialized)').each(function() {
      bnsRaidMemberDetail(this);
      this.classList.add('initialized')
    })
  }

  { // bns get char by id
    function bnsGetCharById(elem) {
      var charId = $(elem).attr('data-id');
      var option = {};
      option.preventoverwritetext = $(elem).attr('preventoverwritetext') != undefined;
      option.usechargist = $(elem).attr('usechargist') != undefined;
      option.overwritehref = $(elem).attr('overwritehref') != undefined;
      option.usechildnodes = $(elem).attr('usechildnodes') != undefined;

      $.ajax({
        method    : 'GET',
        url       : '/bns/char/id/' + charId,
        dataType  : 'json'
      }).done(function(d) {
        if(!option.preventoverwritetext) {
          $(elem).text(d.general.name)
        }

        if(option.usechargist) {
          var $namelink = $(elem)
          .attr('data-region', d.region)
          .attr('data-name', d.general.name)
          .addClass('bns-char-gist')
          .removeClass('get-bns-char-by-id');

          var namelink = $namelink.get().shift()
          elem = namelink;
        }

        if(option.overwriteHref) {
          $(elem)
          .attr('href', '/bns/profile/' + d.region + '/' + d.general.name)
          .attr('target', '_blank')
        }

        if(option.usechildnodes) {
          elem.querySelectorAll('.print-info').forEach(function(pi) {
            var text = getJsonPath(d, pi.innerText.split('.'));
            if(pi.getAttribute('uppercase') != undefined) {
              text = text.toUpperCase();
            }

            pi.innerText = text;
          })
        }
      }).fail(function() {
        $(elem).html('')
        .append($(document.createElement('a'))
          .text('retry')
          .attr('href', '#!')
          .on('click', function() {
            bnsGetCharById(elem);
          }))
      })
    }
    $('.bns-get-char-by-id').each(function() {
      bnsGetCharById(this);
    })
  }
}

(function($, M) {
  $(document).ready(function() {
    bnsInit(jQuery, M);
  })
})(jQuery, M)
