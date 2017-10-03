<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class Memo extends MY_Controller
  {
    public function __construct()
    {
      parent::__construct();
      if($this->_content['session']['login_type'] != '1')
      {
        if (!$this->input->is_ajax_request())
        {
          header("location:".LOCATION_HREF_LOGIN);
        }
        else
        {
          $result['status'] = 'permission_denied';
          $result['message'] = $this->lang->line('common_permission_denied');
          echo json_encode($result);
        }
        exit;
      }
      $this->load->model('Memo_model', 'memo');
    }
    public function index()
    {
      $this->_content['title'] = $this->lang->line('common_title_memo');
      $this->_content['memo_list'] = $this->memo->get_memo_list();
      $this->_content['view'] = 'memo';
      $this->_view();
    }

    public function save_data($action)
    {
      $form_array = $this->input->post(NULL, true);
      if($action == 'add')
      {
        $this->_add($form_array);
      }
    }

    private function _add($form_array)
    {
      if(isset($form_array['memo']) && $form_array['memo'] != ''){
        $data_array = array('memo' => $form_array['memo'],
                            'create_admin' => $this->_content['session']['login_sn'],
                            'create_date' => date("Y-m-d H:i:s")
        );
        $sql_result = $this->memo->insert($data_array);
        if($sql_result > 0){
          $result['status'] = 'success';
          $result['message'] = $this->lang->line('common_add_success');
        }
        else{
          $result['status'] = 'failed';
          $result['message'] = $this->lang->line('common_add_failed');
        }
      }
      else{
        $result['status'] = 'failed';
        $result['message'] = $this->lang->line('common_empty_content');
      }
      echo json_encode($result);
    }
  }