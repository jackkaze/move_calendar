<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| Pagination Class
| -------------------------------------------------------------------------
|
|	https://codeigniter.com/user_guide/libraries/pagination.html
|
*/



$config['use_page_numbers'] = TRUE;


$config['num_tag_open']     = '<li>';
$config['num_tag_close']    = '</li>';
$config['cur_tag_open']     = '<li class="current_page"><strong>';
$config['cur_tag_close']    = '</strong></li>';


$config['prev_link']        = '&laquo;';
$config['prev_tag_open']    = '<li>';
$config['prev_tag_close']   = '</li>';

$config['next_link']        = '&raquo;';
$config['next_tag_open']    = '<li>';
$config['next_tag_close']   = '</li>';


