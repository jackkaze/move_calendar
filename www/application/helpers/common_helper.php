<?php
  function get_show_link_array($login_type = 0){
    $show_link_array[] = '<ul class="nav fixed-top navbar-light bg-faded">';
    $show_link_array[] = '<li class="nav-item base_border">';
    $show_link_array[] = '<a class="nav-link" href="javascript:window.history.back();">←</a>';
    $show_link_array[] = '</li>';
    $show_link_array[] = '<li class="nav-item base_border">';
    $show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_HOME.'">home</a>';
    $show_link_array[] = '</li>';
    if(in_array($login_type, array(1, 2, 3))){
      $show_link_array[] = '<li class="nav-item base_border dropdown">';
      $show_link_array[] = '<a class="nav-link dropdown-toggle" href="'.HTML_HREF_GUEST.'" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">賓客系統</a>';
      $show_link_array[] = '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
      $show_link_array[] = '<a class="dropdown-item" href="'.HTML_HREF_GUEST.'">輸入禮金</a>';
      $show_link_array[] = '<a class="dropdown-item" href="'.HTML_HREF_GUEST_CREATE.'">新增賓客</a>';
      if(in_array($login_type, array(1, 2))){
        $show_link_array[] = '<a class="dropdown-item" href="'.HTML_HREF_GUEST_TOTAL.'">總計</a>';
      }
      $show_link_array[] = '</div>';
      $show_link_array[] = '</li>';
    }
    $show_link_array[] = '<li class="nav-item base_border">';
    if(in_array($login_type, array(0))){
      $show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_LOGIN.'">登入</a>';
    }
    else{
      $show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_LOGIN_LOGOUT.'">登出</a>';
    }
    $show_link_array[] = '</li>';
    return $show_link_array;
  }
  function get_master_show_link_array($login_type = 0){
    if($login_type == '1'){
      $master_show_link_array[] = '<li class="nav-item base_border dropdown">';
      $master_show_link_array[] = '<a class="nav-link dropdown-toggle" href="/www/Guest/" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">管理員</a>';
      $master_show_link_array[] = '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
      $master_show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_MEMO.'">隨手記</a>';
      $master_show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_ACCOUNT.'">會員系統</a>';
      $master_show_link_array[] = '</div>';
      $master_show_link_array[] = '</li>';
      $master_show_link_array[] = '</ul>';
      return $master_show_link_array;
    }
    return array('</ul>');
  }
?>