jQuery( function ( $ ){
  var fpusa = {
    $modal: $('#fpusa_modal'),
    init: function(){
      // find title and body
      this.$title = this.$modal.find('.modal-title'),
      this.$body = this.$modal.find('.modal-body'),
      this.$form = this.$modal.find( 'form.modal-form' );

      // set event on show
      this.$modal.on('show.bs.modal', '', this.route);
      this.$modal.on( 'click', 'button.modal_ajax_submit', this.submit_form );
    },

    submit_form: function( e ){
      e.preventDefault();
      var form_data = $('#modal-table input, #modal-table select, #modal-table textarea ').serialize();

      let data = {
        action: `fpusa_${fpusa.path.model}_${fpusa.path.action}`,
        form_data,
      };

      if( fpusa.path.id.length ){
        data.id = fpusa.path.id;
      }

      $.ajax({
        type: 'POST',
        url: ajax_object.ajax_url,
        data: data,
        success: function( response ){
          if( response ){
            // TODO: Work out a way to display new data.
            window.location.reload();
          }
        },
        error: function( error ){
          alert( error );
        }
      });
    },

    // get data from button clicked
    route: function( e ){
      let $button = $(e.relatedTarget);

      var path = {
        title: $button.attr('data-title'),
        model: $button.attr('data-model'),
        action: $button.attr('data-action'),
        id: $button.attr('data-id'),
      }

      fpusa.path = path;

      fpusa.$title.text( path.title );
      // run function based on the data-model and data-action attributes of the button pressed.
      fpusa[ path.model ]( path.action, path.id );
    },

    ['address']: function( action, id = '' ){
      var fields = [
        { label: 'Full name', type: 'text', id: 'address_shipto', value: '' },
        { label: 'Address 1', type: 'text', id: 'address_1', value: '' },
        { label: 'Address 2', type: 'text', id: 'address_2', value: '' },
        { label: 'City', type: 'text', id: 'address_city', value: '' },
        { label: 'State', type: 'text', id: 'address_state', value: '' },
        { label: 'Postal Code', type: 'tel', id: 'address_postal', value: '' },
        { label: 'Country', type: 'tel', id: 'address_country', value: '' },
        { label: 'Phone', type: 'tel', id: 'address_phone', value: '' },
        { label: 'Add delivery instructions (optional)', type: 'textarea', id: 'address_delivery_notes', value: '' },
      ];
      fpusa.build( fields );
    },

    ['billing_address']: function( action, id = '' ){
      var fields = [
        { label: 'First Name', type: 'text', id: 'billing_first_name', value: '' },
        { label: 'Last Name', type: 'text', id: 'billing_last_name', value: '' },
        { label: 'Address 1', type: 'text', id: 'billing_address_1', value: '' },
        { label: 'Address 2', type: 'text', id: 'billing_address_2', value: '' },
        { label: 'City', type: 'text', id: 'billing_city', value: '' },
        { label: 'State', type: 'text', id: 'billing_state', value: '' },
        { label: 'Postal Code', type: 'tel', id: 'billing_postcode', value: '' },
        { label: 'Country', type: 'tel', id: 'billing_country', value: '' },
      ];
      fpusa.build( fields );
    },

    build: function( fields ){
      // console.log( fpusa.path );
      if( fpusa.path.action != 'create' && fpusa.path.id != '' ){
        // console.log( 'get data first' );
        fpusa.get_field_values( fields, fpusa.path.model, fpusa.path.action, fpusa.path.id );
      } else {
        // console.log( 'create the form' );
        fpusa.create_form( fields, fpusa.path.model, fpusa.path.action );
      }
    },

    get_field_values: function( fields, model, action, id ){
      console.log( 'getting_field_values' );

      $.post( ajax_object.ajax_url, { action: `fpusa_get_${model}`, id: id  }, function( data ){
        console.log(  data, fields  );
        Object.keys( fields ).forEach( function(fieldKey) {
          Object.keys( data ).forEach( function(dataKey) {
            if( fields[fieldKey].id == dataKey ){
              fields[fieldKey].value = data[dataKey];
            }
          });
        });

        fpusa.create_form( fields, model, action );
      });

    },

    create_form: function( fields, model, action ){
      console.log( 'create_form', fpusa.path );

      var $form = $('<form/>', {
        method: 'POST',
        action: ajax_object.ajax_url,
        class: 'modal-form'
      });

      $form.append( $('<table/>', { id: 'modal-table', class: 'mx-2' } ) );

      for( var i = 0; i < fields.length; i++ ){
        $form.find('table').append( fpusa.build_field( fields[i] ) );
      }

      $form.append( $('<input/>', { type: 'hidden', name: 'action', value: `fpusa_${model}_${action}` } ) );

      fpusa.$body.html( $form );
    },

    build_field: function( field ){
      let row = $('<tr>');
      let type = field.type;

      if( type == 'select' ){
        alert( 'sorry, you are trying to build a select and that logic isn\'t here yet!' );
      } else if( type ==='textarea' ){
        row.append(
          $('<td/>', { colspan: 2 } ).append(
            $('<label/>', { for: field.id } ).text( field.label ),
            $('<textarea/>', { id: field.id, name: field.id, value: field.value, class: 'form-control' } ),
          ),
        );

      } else {
        // select
        row.append(`<td><label for="${field.id}">${field.label}</label></td>`);
        row.append( $('<td/>').append( $('<input/>', { type: field.type, id: field.id, name: field.id, value: field.value, class: 'form-control' } ) ) )
      }
      return row;
    },

    update_modal: function(){
      console.log( 'update!' );
    }
  }

  fpusa.init();
});
