<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class Guest extends MY_Controller
  {
  	public function __construct()
    {
  		parent::__construct();
  		if( !($this->_content['session']['login_status'] == 'Y' && in_array($this->_content['session']['login_type'], array(1, 2, 3))))
      {
  			if (!$this->input->is_ajax_request())
        {
  				header("location:".LOCATION_HREF_LOGIN);
  			}
  			else
        {
  				$result['status'] = 'relogin';
        	$result['message'] = $this->lang->line('common_relogin');
   		    echo json_encode($result);
  			}
  			exit;
  		}
   		$this->load->model('Guest_model', 'guest');
  	}
  	public function index()
  	{
  		$para = array();
  		$form_array = $this->input->post(NULL, true);
  		if(isset($form_array['search_sn']) && $form_array['search_sn'] > 0)
      {
  			$para['where_array']['sn'] = $form_array['search_sn'];
  		}
      $this->_content['title'] = $this->lang->line('common_title_guest_price');
  		$this->_content['guest_list'] = $this->guest->get_guest_list($para);
  		$this->_content['guest_list_json'] = $this->guest->get_guest_list_json();
      $this->_content['view'] = 'guest';
      $this->_view();
  	}

  	public function create()
    {
      $this->_content['title'] = $this->lang->line('common_title_guest_add');
      $this->_content['view'] = 'create';
      $this->_view();
  	}

  	public function total()
    {
     	if(in_array($this->_content['session']['login_type'], array(1, 2)))
      {
        $this->_content['total'] = 0;
  			$total = $this->guest->get_total();
  		  if(isset($total['count']) && $total['count'] > 0)
        {
          $this->_content['title'] = $this->lang->line('common_title_guest_total');
  				$this->_content['total'] = number_format($total['data'][0]['total']);
  			}
        $this->_content['view'] = 'total';
        $this->_view();
     	}
     	else
      {
  			header("location:".LOCATION_HREF_GUEST);
  			exit;
     	}
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

    public function import_guest($dflag = ''){
      $result = file_get_contents(getcwd()."/application/data/guest_list.txt");
      $result_explode = explode("\n", $result);
      if(count($result_explode) > 0){
        $pass = 'lin'.date("Hi");
        if($dflag == $pass){
          $this->guest->del();
          echo 'deleted';
        }
        foreach($result_explode as $key => $tmp_name){
          $data['name'] = $tmp_name;
          $data['create_admin'] = 1;
          $data['create_date'] = date("Y-m-d H:i:s");
          $this->guest->insert($data);
        }
      }
    }

  	private function _update($form_array)
    {
  		if(isset($form_array['sn']) && preg_match("/[0-9]/", $form_array['sn']))
      {
  			if(isset($form_array['price']) && preg_match("/[0-9]{1,6}/", $form_array['price']))
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
          	$result['message'] = $this->lang->line('common_save_success');
          }
          else
          {
          	$result['status'] = 'failed';
          	$result['message'] = $this->lang->line('common_save_failed');
          }
  			}
  			else
        {
  				$result['status'] = 'failed';
      		$result['message'] = $this->lang->line('common_money_is_wrong');
  			}
  		}
  		else
      {
  			$result['status'] = 'failed';
      	$result['message'] = $this->lang->line('common_choice_one_to_save');
  		}
      echo json_encode($result);
  	}

  	private function _add($form_array)
    {
  		$result['status'] = '';
  		if(isset($form_array['name']) && $form_array['name'] != '')
      {
  			$data['name'] = $form_array['name'];
  		}
  		else
      {
  			$result['status'] = 'failed';
      	$result['message'] = $this->lang->line('common_name_is_empty');
  		}
  		if(isset($form_array['price']) && $form_array['price'] != '')
      {
        if(preg_match("/[0-9]{1,6}/", $form_array['price']))
        {
          $data['price'] = $form_array['price'];
        }
        else
        {
          $result['status'] = 'failed';
          $result['message'] = $this->lang->line('common_money_is_wrong');
        }
  		}

  		if($result['status'] == '')
      {
  			$data['create_admin'] = $this->_content['session']['login_sn'];
  			$data['create_date'] = date("Y-m-d H:i:s");
  			$sql_result = $this->guest->insert($data);
  			if($sql_result)
        {
  				$result['status'] = 'success';
        	$result['message'] = $this->lang->line('common_add_success');
  			}
  			else
        {
  				$result['status'] = 'failed';
        	$result['message'] = $this->lang->line('common_add_failed');
  			}
  		}
  		echo json_encode($result);
  	}
  }