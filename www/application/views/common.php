<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>
<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="EXPIRES" CONTENT="Mon, 22 Jul 2002 11:12:01 GMT">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <link rel="icon" sizes="192x192" href="<?php echo IMAGE_WWW_IMAGES;?>thumbs-up.png">
  <link rel="icon" sizes="128x128" href="<?php echo IMAGE_WWW_IMAGES;?>thumbs-up.png">
  <link rel="apple-touch-icon" sizes="128x128" href="<?php echo IMAGE_WWW_IMAGES;?>thumbs-up.png">
  <link rel="apple-touch-icon-precomposed" sizes="128x128" href="<?php echo IMAGE_WWW_IMAGES;?>thumbs-up.png">
  <title><?php echo isset($title) ? $title : '預設頁'?></title>
  <?php
    if(isset($common_css) && count($common_css) > 0){
      foreach($common_css as $key => $css){
        echo $css;
      }
    }
    if(isset($other_css) && count($other_css) > 0){
      foreach($other_css as $key => $css){
        echo $css;
      }
    }
    if(isset($common_js) && count($common_js) > 0){
      foreach($common_js as $key => $js){
        echo $js;
      }
    }
    if(isset($other_js) && count($other_js) > 0){
      foreach($other_js as $key => $js){
        echo $js;
      }
    }
  ?>
</head>
<body>
<?php
  foreach($show_top_link['show_link_array'] as $key => $show_link){
    echo $show_link;
  }
  foreach($show_top_link['master_show_link_array'] as $key => $master_show_link){
    echo $master_show_link;
  }
?>
<?php
  if(isset($body)){
    echo $body;
  }
?>
  <!-- Alert Modal -->
  <div id="AlertModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content color_black">
        <div class="modal-header">
        <h4 class="modal-title center">訊息提示</h4>
        <!--<button type="button" class="close" data-dismiss="modal">&times;</button>-->
        </div>
        <div class="modal-body">
        <p id="alert_msg" class="center"></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary btn-lg" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div id="loading_bar" style="display:none;"><img src="<?php echo IMAGE_WWW_IMAGES;?>ajax-loader-bar.gif" /></div>
  <nav class="navbar fixed-bottom navbar-light bg-faded center">
     <a class="navbar-brand" href="<?php echo HTML_HREF_HOME;?>">© JackLin site</a>
  </nav>
  <script src="<?php echo JS_WWW_JS;?>placeholders.min.js"></script>
</body>
</html>