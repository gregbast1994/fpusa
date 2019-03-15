<?php

class Address
{
  public $ID;
  public $ship_to;
  public $address_1;
  public $address_2;
  public $city;
  public $state;
  public $postal;
  public $country;
  public $phone;
  public $notes;
  public $user_id;

  public function __construct( $id ){
    $data = $this->get_data( $id );
    if( ! empty( $data ) ){
      $this->ID = $id;
      $this->ship_to = $data->address_shipto;
      $this->address_1 = $data->address_1;
      $this->address_2 = $data->address_2;
      $this->city = $data->address_city;
      $this->state = $data->address_state;
      $this->postal = $data->address_postal;
      $this->country = $data->address_country;
      $this->phone = $data->address_phone;
      $this->notes = $data->address_delivery_notes;
      $this->user_id = $data->address_user_id;
    }
  }

  public function is_default(){
    $default = get_metadata( 'user', get_current_user_id(), 'default_address', true );
    return ( $this->ID === $default );
  }

  public function formatted_address(){
    return sprintf("<ul class='list-unstyled m-0 p-0'>
  									<li><b>%s</b></li>
  									<li>%s <br>
  											%s
  									</li>
  									<li>%s, %s  %s</li>
  									<li>Phone number: +%s</li>
  									<ul>
  									",
  									$this->ship_to, $this->address_1, $this->address_2,
  									$this->city, $this->state, $this->postal,
  									$this->phone, $this->notes);
  }

  public function get_notes(){
    return '<b>Order Notes:</b> ' . $this->notes;
  }

  public function get_data( $id ){
    if( $id != 'new' ){
      global $wpdb;
      $table_name = $wpdb->prefix . 'address';

      $address = $wpdb->get_row(
        "SELECT *
        FROM $table_name
        WHERE address_id = $id"
      );

      return ( ! empty( $address ) ) ? $address : '';
    }
  }

  public function get_edit_link(){
    return "/edit-address/$this->ID";
  }

  public function get_delete_link(){
    return admin_url( "admin-post.php?action=fpusa_delete_address&id=$this->ID" );
  }

  public function get_address_as_default_link(){
    return admin_url( "admin-post.php?action=fpusa_make_address_default&id=$this->ID" );
  }
}
