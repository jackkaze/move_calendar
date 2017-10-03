<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

class MY_model extends CI_Model{
  public function __construct() {
    //parent::__construct();
  }
  //取得資料庫的內容與筆數
  protected function get_all_result($query){
    $result = array('data' => $query->result_array(),
                    'count' => $query->num_rows()
    );
    return $result;
  }
}