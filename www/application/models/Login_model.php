<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

class Login_model extends MY_Model{
  public function __construct() {
    $this->load->library('Encrypt', 'encrypt');
  }
  
  //取得指定條件的素材資料
  public function sso($form_array){
    $this->db->select('sn, password, type')
             ->from('admin')
             ->where('account', $form_array['account'])
             ->where('status', 1);
    $query = $this->db->get();
    $sql_result = $this->get_all_result($query);
    if(isset($sql_result['count']) && $sql_result['count'] > 0){
      $form_password = $form_array['password'];
      $correct_password = $this->encrypt->decode($sql_result['data'][0]['password']);
      //echo $form_password.'<br />'.$correct_password;
      if($form_password == $correct_password){
        $newdata = array(
                         'logged_in' => TRUE,
                         'login_type' => $sql_result['data'][0]['type'],
                         'login_sn' => $sql_result['data'][0]['sn']
        );

        $this->session->set_userdata($newdata);
        $data = array('last_logined' => date("Y-m-d H:i:s"));
        $where = array('sn' => $sql_result['data'][0]['sn']);
        $this->_update($data, $where);
        return true;
      }
    }
    return false;
  }
  private function _update($data = array(), $where = array()){
    $this->db->update('admin', $data, $where);
    //echo $this->db->last_query();
    return $this->db->affected_rows();
  }
}