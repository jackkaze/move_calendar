<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class Home extends MY_Controller
  {
    public function index()
    {
      $this->_content['title'] = $this->lang->line('common_title_home');
      $this->_content['view'] = 'home_content';
      $this->_view();
    }
  }