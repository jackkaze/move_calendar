<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

class Account_model extends MY_Model{
  public function __construct() {
    $this->load->library('Encrypt', 'encrypt');
  }
  
  //取得指定條件的素材資料
  public function get_guest_list($para = array()){
    $this->db->select('account, type')
             ->from('admin')
             ->order_by('sn', 'DESC');
    if(isset($para['where_array']) && count($para['where_array']) > 0){
      $this->db->where($para['where_array']);
    }
    $query = $this->db->get();
    //echo $this->db->last_query();
    return $this->get_all_result($query);
  }

  public function update($data = array(), $where = array()){
    $this->db->update('admin', $data, $where);
    //echo $this->db->last_query();
    return $this->db->affected_rows();
  }

  public function check_account_exist($account = ''){
    $query = $this->db->select('sn')
                      ->from('admin')
                      ->where('account', $account)
                      ->get();
    //echo $this->db->last_query();
    $result = $this->get_all_result($query);
    if(isset($result['count']) && $result['count'] > 0){
      return true;
    }
    return false;
  }

  public function insert($data = array()){
    $data['password'] = $this->encrypt->encode($data['password']);
    $this->db->insert('admin', $data);
    //echo $this->db->last_query();
    return $this->db->affected_rows();
  }
}