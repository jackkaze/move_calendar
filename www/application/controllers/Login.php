<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class Login extends MY_Controller
  {
    public function __construct()
    {
      parent::__construct();
      $this->load->model('Login_model', 'login');
    }

    public function index()
    {
      if($this->_content['session']['login_status'] == 'Y')
      {
        header("location:".LOCATION_HREF_HOME);
        exit;
      }
      $this->_content['title'] = $this->lang->line('common_title_login');
      $this->_content['view'] = 'login';
      $this->_view();
    }

    public function sso()
    {
      $form_array = $this->input->post(NULL, true);
      $result = array('status' => 'failed',
                      'message' => $this->lang->line('common_account_and_paaword_is_wrong')
      );
      if(isset($form_array['account']) && isset($form_array['password'])){
        if($this->login->sso($form_array)){
          $result = array('status' => 'success',
                          'message' => $this->lang->line('common_login_success')
          );
        }
      }
      echo json_encode($result);
      exit;
    }

    public function logout()
    {
      $this->session->sess_destroy();
      header("location:".LOCATION_HREF_HOME);
      exit;
    }
  }