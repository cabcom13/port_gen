$(document).foundation();

var $page = $('.page');
var bg_picker = $('#page_background_images');
var border_picker = $('#page_border_images');
var json = {};

$.ajaxSetup({ cache: false });


window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

$(document).keydown(function(e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        disable_editmode();

    }
});

// load projects

$.ajax({
  dataType: "json",
  url: 'ajax.php',
  type: 'GET',
  data: {action: 'get_projects'},
  success: function(data){
    $.each(data, function(k,v){
      // $('<div />', {text: v.name}).addClass('button').appendTo($('#project_viewer'));
            $.each(v.pages, function(a,b){
                var preset_el = $('<div />', {text: b.name}).addClass('button secondary expanded').appendTo($('#project_viewer'));
                preset_el.on('click', function(e){
                    $('#project_viewer').find('.primary').removeClass('primary').addClass('secondary');
                    $(this).removeClass('secondary').addClass('primary');
                    e.preventDefault();
                    load_preset(b);
                });

            });

    });

    $('.add_new_preset').on('click', function(e){
        e.preventDefault();
        var preset_name = prompt("Please enter your name", "Harry Potter");

        if (preset_name != null) {
            $('#project_viewer').find('.primary').removeClass('primary').addClass('secondary');
            var preset_el = $('<div />', {text: preset_name}).addClass('button primary expanded').appendTo($('#project_viewer'));

            $page.empty();
            $('<div />').prop('id', 'background_frame').appendTo($page);
            $('<div />').prop('id', 'border_frame').appendTo($page);
            preset_el.on('click', function(e){

                $(this).removeClass('secondary').addClass('primary');
                e.preventDefault();

            });
        }



    });

  }
});



$.ajax({
    url: 'ajax.php',
    type: 'GET',
    data: {action: 'get_background_images'},
    success: function(resp){

      bg_picker.html(resp).imagepicker({
       hide_select: true,
       changed:function(select, newValues, oldValues, event){

            $page.find('#background_frame').css({
              'background-image': 'url(img/bg/'+newValues+')',
              'background-position' : ' 0 0',
              'background-repeat': 'no-repeat'
            });
       },
       initialized: function(imagePicker){
         $page.find('#background_frame').css({
           'background-image': 'url(img/bg/'+bg_picker.data("picker").selected_values()+')',
           'background-position' : ' 0 0',
           'background-repeat': 'no-repeat'
         });

       }
     });
    }
});
$.ajax({
    url: 'ajax.php',
    type: 'GET',
    data: {action: 'get_border_images'},
    success: function(resp){
      border_picker.html(resp).imagepicker({
       hide_select: true,
       changed:function(select, newValues, oldValues, event){
            $page.find('#border_frame').css({
              'background-image':  'url(img/border/'+ newValues+')',
              'background-position' : ' 0 0',
              'background-repeat': 'no-repeat'
            });
       },
       initialized: function(imagePicker){
         $page.find('#border_frame').css({
           'background-image':  'url(img/border/'+ border_picker.data("picker").selected_values()+')',
           'background-position' : ' 0 0',
           'background-repeat': 'no-repeat'
         });


       }
     });
    }
});

$("#background_color_picker").spectrum({
    color: "#f00",
    preferredFormat: "hex",
    showInput: true,
    showPaletteOnly: true,
    togglePaletteOnly: true,
    togglePaletteMoreText: 'more',
    togglePaletteLessText: 'less',
    color: 'blanchedalmond',
    palette: [
         ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
         ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
         ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
         ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
         ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
         ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
         ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
         ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
    ],
    change: function(color) {
        $page.find('#background_frame').css('background-color', color.toHexString());
    }

});


$(document).keydown(function(e) {

    var cur = $page.find('.draggable');
    if(e.keyCode == 38 && e.shiftKey) {
      $page.find('.draggable').css('top', parseInt(cur.css('top'))-10);
    }
    if(e.keyCode == 40 && e.shiftKey) {
      $page.find('.draggable').css('top', parseInt(cur.css('top'))+10);
    }

    if(e.keyCode == 37 && e.shiftKey) {
      $page.find('.draggable').css('left', parseInt(cur.css('left'))-10);
    }
    if(e.keyCode == 39 && e.shiftKey) {
      $page.find('.draggable').css('left', parseInt(cur.css('left'))+10);
    }

    if (e.keyCode == 38 && !e.shiftKey) {
        $page.find('.draggable').css('top', parseInt(cur.css('top'))-1);
    }
    if (e.keyCode == 40 && !e.shiftKey) {
          $page.find('.draggable').css('top', parseInt(cur.css('top'))+1);
    }
    if (e.keyCode == 37 && !e.shiftKey) {
          $page.find('.draggable').css('left', parseInt(cur.css('left'))-1);
    }
    if (e.keyCode == 39 && !e.shiftKey) {
        $page.find('.draggable').css('left', parseInt(cur.css('left'))+1);
    }
});

function parseColor(color) {
    var arr=[]; color.replace(/[\d+\.]+/g, function(v) { arr.push(parseFloat(v)); });
    return {
        hex:  arr.slice(0, 3).map(toHex).join(""),
        opacity: arr.length == 4 ? arr[3] : 1
    };
}
function toHex(int) {
    var hex = int.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function disable_editmode(){
  $page.removeClass('grid');
  $page.find('.draggable').removeClass('draggable').draggabilly('disable');
}
function enable_editmode(){
  $page.addClass('grid')
  $page.find('.draggable').draggabilly('disable').removeClass('draggable');
}

$('.clearer').on('click', function(){
disable_editmode();

});


$page.dblclick(function(){
  disable_editmode();
});


$('.add_element').on('click', function(e){
    e.preventDefault();
    console.log($(this).data('typ'));
    var typ = $(this).data('typ');
    if(typ == 'text'){
        var new_add_element = $('<div />', {text:' Text hier'});
    }
    if(typ == 'imagebox'){
        var new_add_element = $('<div />').addClass('imagebox');
    }
    new_add_element.appendTo($page).draggabilly({
      containment:$page,
      grid: [ 2, 2 ]
    }).on( 'dragMove', function () {
      var draggie = $(this).data('draggabilly');

    }).on( 'dragEnd', function () {
        var draggie = $(this).data('draggabilly');
    }).on( 'pointerUp', function () {
      var draggie = $(this).data('draggabilly');

    }).on( 'pointerDown', function () {
      disable_editmode();
      var draggie = $(this).data('draggabilly');
      $(this).addClass('draggable').draggabilly('enable');

    });

});



$('.bindtosite').on('click', function(e){
  e.preventDefault();

  var pres_name = prompt("Please enter your name", "Harry Potter");

  if (pres_name != null) {
      var new_preset_btn = $('<li />', {text: pres_name}).addClass('active');
      new_preset_btn.appendTo('.presets');
      $page.empty();
      $('<div />').prop('id', 'background_frame').appendTo($page);
      $('<div />').prop('id', 'border_frame').appendTo($page);
  }


});

function load_preset(json){
    disable_editmode();
    $page.empty();
$('.preset_title').text(json.name);
      // json = {data: da};
      if ($page.is(':empty')){
        $.each(json.data, function (key, val) {

          var new_el = $('<'+val.el+'>', {
            text: val.content,
          }).css(val.style).prop({
            id: val.id,
            class: val.class
          });

          var bg_url = new_el.css('background-image');
             // ^ Either "none" or url("...urlhere..")
             bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg_url);
             bg_url = bg_url ? bg_url[2] : ""; // If matched, retrieve url, otherwise ""



             if(val.id == 'background_frame'){

               $("#background_color_picker").spectrum("set", new_el.css('background-color'));
               bg_picker.val(bg_url.substring(bg_url.lastIndexOf('/')+1)).imagepicker({
                hide_select: true,
                changed:function(select, newValues, oldValues, event){

                     $page.find('#background_frame').css({
                       'background-image': 'url(img/bg/'+newValues+')',
                       'background-position' : ' 0 0',
                       'background-repeat': 'no-repeat'
                     });
                },
                initialized: function(imagePicker){
                  $page.find('#background_frame').css({
                    'background-image': 'url(img/bg/'+bg_picker.data("picker").selected_values()+')',
                    'background-position' : ' 0 0',
                    'background-repeat': 'no-repeat'
                  });

                }
              });
             }
             if(val.id == 'border_frame'){
               border_picker.val(bg_url.substring(bg_url.lastIndexOf('/')+1)).imagepicker({
                hide_select: true,
                changed:function(select, newValues, oldValues, event){

                     $page.find('#border_frame').css({
                       'background-image': 'url(img/border/'+newValues+')',
                       'background-position' : ' 0 0',
                       'background-repeat': 'no-repeat'
                     });
                },
                initialized: function(imagePicker){
                  $page.find('#border_frame').css({
                    'background-image': 'url(img/border/'+border_picker.data("picker").selected_values()+')',
                    'background-position' : ' 0 0',
                    'background-repeat': 'no-repeat'
                  });

                }
              });
             }

          new_el.draggabilly({
            containment:$page,
            grid: [ 2, 2 ]
          }).on( 'dragMove', function () {
            var draggie = $(this).data('draggabilly');

          }).on( 'dragEnd', function () {
              var draggie = $(this).data('draggabilly');
          }).on( 'pointerUp', function () {
            var draggie = $(this).data('draggabilly');

          }).on( 'pointerDown', function () {
            disable_editmode();
            var draggie = $(this).data('draggabilly');
            $(this).addClass('draggable').draggabilly('enable');
            $page.addClass('grid');

          });

          if(new_el.prop('id') == 'background_frame'){
            new_el.draggabilly('destroy').removeClass('draggable');
          }
          if(new_el.prop('id') == 'border_frame'){
            new_el.draggabilly('destroy').removeClass('draggable');
          }

          new_el.appendTo($page);


        });
      }

}

$('.save_preset').on('click', function(e){
  e.preventDefault();
disable_editmode();
  var items = [];

  $page.find('*').each(function() {
     var item = {
       el: $(this).prop("nodeName"),
       content: $(this).text(),
       'class': $(this).prop('class'),
       'id': $(this).prop('id'),
       style: $(this).css()
      };
     items.push(item);
  });
  $('#jsoncode').text(JSON.stringify(items, null, 2));
});

$page.find('*').not( "#border_frame" ).not( "#background_frame" ).on('click', function(){
    var active_el = $(this);
    enable_editmode();
    active_el.addClass('draggable');
    var $draggable = active_el.draggabilly({
    containment:$page,
    grid: [ 2, 2 ]
    }).on( 'dragMove', function () {
      var draggie = $(this).data('draggabilly');
    }).on( 'dragEnd', function () {
        var draggie = $(this).data('draggabilly');
    })
    .on( 'pointerUp', function () {
      var draggie = $(this).data('draggabilly');
    });
    active_el.draggabilly('enable');
});


$('.generate_pdf').on('click', function(e){
  e.preventDefault();
  //run html2canvas
  disable_editmode();

  var w = 2000;
  var h = 2000;
  var div = $page;
  var canvas = document.createElement('canvas');
  canvas.width = w*2;
  canvas.height = h*2;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  var context = canvas.getContext('2d');
  context.scale(4,4);

  html2canvas($page, {
      canvas: canvas,
      onrendered: function(canvas) {
        canvas.toBlob(function(blob) {

          var reader = new FileReader();
             reader.onload = function () {
                 $.ajax({
                     url: 'pdfgen.php',
                     type: 'POST',
                     data: reader.result,
                     success: function(resp){
                        window.open('pdf/'+resp+'.pdf');

                     }
                 })
             }
             reader.readAsDataURL(blob);


        });

      }
  });
});


function takeHighResScreenshot(srcEl, destIMG, scaleFactor) {
    // Save original size of element
    var originalWidth = srcEl.offsetWidth;
    var originalHeight = srcEl.offsetHeight;
    // Force px size (no %, EMs, etc)
    srcEl.style.width = originalWidth + "px";
    srcEl.style.height = originalHeight + "px";

    // Position the element at the top left of the document because of bugs in html2canvas. The bug exists when supplying a custom canvas, and offsets the rendering on the custom canvas based on the offset of the source element on the page; thus the source element MUST be at 0, 0.
    // See html2canvas issues #790, #820, #893, #922
    srcEl.style.position = "absolute";
    srcEl.style.top = "0";
    srcEl.style.left = "0";

    // Create scaled canvas
    var scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = originalWidth * scaleFactor;
    scaledCanvas.height = originalHeight * scaleFactor;
    scaledCanvas.style.width = originalWidth + "px";
    scaledCanvas.style.height = originalHeight + "px";
    var scaledContext = scaledCanvas.getContext("2d");
    scaledContext.scale(scaleFactor, scaleFactor);

    html2canvas(srcEl, { canvas: scaledCanvas })
    .then(function(canvas) {
        destIMG.src = canvas.toDataURL("image/png");
        srcEl.style.display = "none";
    });
};

(function ($) {
    var jQuery_css = $.fn.css,
        //gAttr = ['font-family','font-size','font-weight','font-style','color','text-transform','text-decoration','letter-spacing','word-spacing','line-height','text-align','vertical-align','direction','background-color','background-image','background-repeat','background-position','background-attachment','opacity','width','height','top','right','bottom','left','margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-color','border-right-color','border-bottom-color','border-left-color','border-top-style','border-right-style','border-bottom-style','border-left-style','position','display','visibility','z-index','overflow-x','overflow-y','white-space','clip','float','clear','cursor','list-style-image','list-style-position','list-style-type','marker-offset'];
        gAttr = ['font-family','font-size','font-weight','font-style','color','text-transform','text-decoration','letter-spacing','word-spacing','line-height','text-align','vertical-align','direction','background-color','background-image','background-repeat','background-position','background-attachment','opacity','top','right','bottom','left','margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-color','border-right-color','border-bottom-color','border-left-color','border-top-style','border-right-style','border-bottom-style','border-left-style','position','display','visibility','z-index','overflow-x','overflow-y','white-space','clip','float','clear','cursor','list-style-image','list-style-position','list-style-type','marker-offset'];
    $.fn.css = function() {
        if (arguments.length && !$.isArray(arguments[0])) return jQuery_css.apply(this, arguments);
        var attr = arguments[0] || gAttr,
            len = attr.length,
            obj = {};
        for (var i = 0; i < len; i++) obj[attr[i]] = jQuery_css.call(this, attr[i]);
        return obj;
    }
})(jQuery);
