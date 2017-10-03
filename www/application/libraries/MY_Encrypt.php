<?php

Class MY_Encrypt extends CI_Encrypt{
	private $_security_key = 'abcefge875960^&%$#@&^%TGBRFDASQ@';
	
	public function __construct()
    {
        parent::__construct();
        $this->set_key($this->_security_key);
        $this->set_hash('sha256');
    }

}
?>