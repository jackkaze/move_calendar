<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class Account extends MY_Controller
  {
    public function __construct()
    {
      parent::__construct();
      if($this->_content['session']['login_type'] != 1)
      {
        if (!$this->input->is_ajax_request())
        {
          header("location:".LOCATION_HREF_LOGIN);
        }
        else
        {
          $result['status'] = 'relogin';
          $result['message'][] = $this->lang->line('common_relogin');
          echo json_encode($result);
        }
        exit;
      }
      $this->load->model('Account_model', 'account');
    }
    public function index()
    {
      header("location:".LOCATION_HREF_ACCOUNT_CREATE);
      exit;
    }

    public function create()
    {
      $this->_content['title'] = $this->lang->line('common_title_account');
      $this->_content['view'] = 'create_account';
      $this->_view();
    }

    public function save_data($action)
    {
      $form_array = $this->input->post(NULL, true);
      if($action == 'update')
      {
        $this->_update($form_array);
      }
      elseif($action == 'add')
      {
        $this->_add($form_array);
      }
    }

    private function _update($form_array)
    {
      if(isset($form_array['sn']) && $form_array['sn'] > 0)
      {
        if(isset($form_array['price']) && $form_array['price'] >= 0)
        {
          $data_array = array('price' => $form_array['price'],
                              'modified_admin' => $this->_content['session']['login_sn'],
                              'modified_date' => date("Y-m-d H:i:s")
          );
          $where_array = array('sn' => $form_array['sn']);
          $sql_result = $this->guest->update($data_array, $where_array);
          if($sql_result > 0)
          {
            $result['status'] = 'success';
            $result['message'][] = $this->lang->line('common_save_success');
          }
          else
          {
            $result['status'] = 'failed';
            $result['message'][] = $this->lang->line('common_save_failed');
          }
        }
        else
        {
          $result['status'] = 'failed';
          $result['message'][] = $this->lang->line('common_money_is_wrong');
        }
      }
      else
      {
        $result['status'] = 'failed';
        $result['message'][] = $this->lang->line('common_choice_one_to_save');
      }
      echo json_encode($result);
    }

    private function _add($form_array)
    {
      $result['status'] = '';
      if(isset($form_array['account']) && $form_array['account'] != '')
      {
        if($this->account->check_account_exist($form_array['account']))
        {
          $result['status'] = 'failed';
          $result['message'][] = $this->lang->line('common_acount_aleady_exist');
        }
        $data['account'] = $form_array['account'];
      }
      else
      {
        $result['status'] = 'failed';
        $result['message'][] = $this->lang->line('common_acount_is_empty');
      }
      if(isset($form_array['password']) && $form_array['password'] != '')
      {
        $data['password'] = $form_array['password'];
      }
      else
      {
        $result['status'] = 'failed';
        $result['message'][] = $this->lang->line('common_password_is_empty');
      }
      if(isset($form_array['password_confirm']) && $form_array['password_confirm'] != '')
      {

      }
      else
      {
        $result['status'] = 'failed';
        $result['message'][] = $this->lang->line('common_confirm_password_is_empty');
      }
      if(isset($form_array['password']) && isset($form_array['password_confirm']) && $form_array['password'] != $form_array['password_confirm'])
      {
        $result['status'] = 'failed';
        $result['message'][] = $this->lang->line('common_password_is_not_match');
      }
      if(isset($form_array['type']) && $form_array['type'] > 1)
      {
        $data['type'] = $form_array['type'];
      }
      else
      {
        $result['status'] = 'failed';
        $result['message'][] = $this->lang->line('common_type_is_empty');
      }

      if($result['status'] == '')
      {
        $data['create_admin'] = $this->_content['session']['login_sn'];
        $data['create_date'] = date("Y-m-d H:i:s");
        $sql_result = $this->account->insert($data);
        if($sql_result)
        {
          $result['status'] = 'success';
          $result['message'][] = $this->lang->line('common_add_success');
        }
        else
        {
          $result['status'] = 'failed';
          $result['message'][] = $this->lang->line('common_add_failed');
        }
      }
      echo json_encode($result);
    }
  }