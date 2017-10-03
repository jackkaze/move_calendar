<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

class Memo_model extends MY_Model{
  public function __construct() {

  }
  
  //取得指定條件的素材資料
  public function get_memo_list($para = array()){
    $this->db->select('sn, memo, create_date')
             ->from('memo')
             ->order_by('sn', 'DESC');
    if(isset($para['where_array']) && count($para['where_array']) > 0){
      $this->db->where($para['where_array']);
    }
    $query = $this->db->get();
    //echo $this->db->last_query();
    return $this->get_all_result($query);
  }

  public function insert($data = array()){
    $this->db->insert('memo', $data);
    //echo $this->db->last_query();
    return $this->db->affected_rows();
  }
}