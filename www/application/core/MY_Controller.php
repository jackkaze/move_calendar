<?php
  defined('BASEPATH') OR exit('No direct script access allowed');

  class MY_Controller extends CI_Controller
  {

    protected $_content = array();
  	
  	public function __construct()
    {
      parent::__construct();
      //$this->load->helper('common');
      $this->lang->load('common', 'chinese');
      $this->_content['session']['login_status'] = 'N';
      $this->_content['session']['login_type'] = 0;
      $this->_content['session']['login_sn'] = NULL;
      $session_array = $this->session->all_userdata();

  		if(isset($session_array['logged_in']) && $session_array['logged_in'] == 'Y')
      {
  			$this->_content['session']['login_status'] = $session_array['logged_in'];
  			if(isset($session_array['login_type']))
        {
  				$this->_content['session']['login_type'] = $session_array['login_type'];
  			}
  			if(isset($session_array['login_sn']))
        {
          if (!$this->input->is_ajax_request() && $session_array['login_sn'] == '1')
          {
            //$this->output->enable_profiler(TRUE);
          }
  				$this->_content['session']['login_sn'] = $session_array['login_sn'];
  			}
  		}

      $this->_content['show_top_link']['show_link_array'] = $this->_get_show_link_array($this->_content['session']['login_type']);
    	$this->_content['show_top_link']['master_show_link_array'] = $this->_get_master_show_link_array($this->_content['session']['login_type']);
      $this->_content['csrf'] = $this->security->get_csrf_hash();
    }

    protected function _view()
    {
      $this->_content['common_css'] = array('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway:700,400">',
                                            '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">',
                                            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css">',
                                            '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">',
                                            '<link rel="stylesheet" href="/www/css/normalize.css">',
                                            '<link rel="stylesheet" href="/www/css/style.css">'

      );
      $this->_content['common_js'] = array('<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>',
                                           '<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>',
                                           '<script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>',
                                           '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>',
                                            
      );
      $this->_content['body'] = $this->load->view($this->_content['view'], $this->_content, true);
      $this->load->view('common', $this->_content);
    }

    private function _get_show_link_array($login_type = 0)
    {
      $show_link_array[] = '<ul class="nav fixed-top navbar-light bg-faded">';
      $show_link_array[] = '<li class="nav-item base_border">';
      $show_link_array[] = '<a class="nav-link" href="javascript:window.history.back();">←</a>';
      $show_link_array[] = '</li>';
      $show_link_array[] = '<li class="nav-item base_border">';
      $show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_HOME.'">home</a>';
      $show_link_array[] = '</li>';
      if(in_array($login_type, array(1, 2, 3)))
      {
        $show_link_array[] = '<li class="nav-item base_border dropdown">';
        $show_link_array[] = '<a class="nav-link dropdown-toggle" href="'.HTML_HREF_GUEST.'" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'.$this->lang->line('common_title_guest').'</a>';
        $show_link_array[] = '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
        $show_link_array[] = '<a class="dropdown-item" href="'.HTML_HREF_GUEST.'">'.$this->lang->line('common_title_sub_guest_price').'</a>';
        $show_link_array[] = '<a class="dropdown-item" href="'.HTML_HREF_GUEST_CREATE.'">'.$this->lang->line('common_title_sub_guest_add').'</a>';
        if(in_array($login_type, array(1, 2)))
        {
          $show_link_array[] = '<a class="dropdown-item" href="'.HTML_HREF_GUEST_TOTAL.'">'.$this->lang->line('common_title_sub_guest_total').'</a>';
        }
        $show_link_array[] = '</div>';
        $show_link_array[] = '</li>';
      }
      $show_link_array[] = '<li class="nav-item base_border">';
      if(in_array($login_type, array(0)))
      {
        $show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_LOGIN.'">'.$this->lang->line('common_button_login').'</a>';
      }
      else
      {
        $show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_LOGIN_LOGOUT.'">'.$this->lang->line('common_button_logout').'</a>';
      }
      $show_link_array[] = '</li>';
      return $show_link_array;
    }
    private function _get_master_show_link_array($login_type = 0)
    {
      if($login_type == '1')
      {
        $master_show_link_array[] = '<li class="nav-item base_border dropdown">';
        $master_show_link_array[] = '<a class="nav-link dropdown-toggle" href="/www/Guest/" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'.$this->lang->line('common_title_admin').'</a>';
        $master_show_link_array[] = '<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
        $master_show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_MEMO.'">'.$this->lang->line('common_title_memo').'</a>';
        $master_show_link_array[] = '<a class="nav-link" href="'.HTML_HREF_ACCOUNT.'">'.$this->lang->line('common_title_account').'</a>';
        $master_show_link_array[] = '</div>';
        $master_show_link_array[] = '</li>';
        $master_show_link_array[] = '</ul>';
        return $master_show_link_array;
      }
      return array('</ul>');
    }

    protected function pre_print($array)
    {
      echo '<pre>';
      print_r($array);
      echo '</pre>';
    }
  }