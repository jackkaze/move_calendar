<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

class Guest_model extends MY_Model{
  public function __construct() {
  }
  
  //取得指定條件的素材資料
  public function get_guest_list($para = array()){
    $this->db->select('sn, name, phone, price')
             ->from('person_info')
             ->order_by('name', 'ASC');
    if(isset($para['where_array']) && count($para['where_array']) > 0){
      $this->db->where($para['where_array']);
    }
    $query = $this->db->get();
    //echo $this->db->last_query();
    return $this->get_all_result($query);
  }

  //取得總素材筆數
  public function get_guest_list_json(){
    $tmp = array();
    $result = $this->get_guest_list();
    if(isset($result['count']) && $result['count'] > 0){
      $key = 0;
      foreach($result['data'] as $key => $array){
        $tmp[$key]['value'] = $array['sn'];
        $tmp[$key]['label'] = $array['name'];
        $key++;
      }
    }
    return json_encode($tmp);
  }

  public function update($data = array(), $where = array()){
    $this->db->update('person_info', $data, $where);
    //echo $this->db->last_query();
    return $this->db->affected_rows();
  }

  public function insert($data = array()){
    $this->db->insert('person_info', $data);
    //echo $this->db->last_query();
    return $this->db->affected_rows();
  }

  public function get_total(){
    $query = $this->db->select('SUM(price) AS total')
                      ->from('person_info')
                      ->get();
    //echo $this->db->last_query();
    return $this->get_all_result($query);
  }
  public function del(){
    $this->db->delete('person_info', array(1 => 1));
    //echo $this->db->last_query();
    return $this->db->affected_rows();
  }
}