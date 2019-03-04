<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $product;
$count = $product->get_review_count();
$has_comments = ( $count > 1 );
$header = ( $has_comments ) ? $count . ' customer reviews' : 'Customer review';
?>
<h2><?php echo $header; ?></h2>
<div id="fpusa_get_stars" class="">
  <div class="d-flex mb-2">
		<?php echo wc_get_rating_html( $product->get_average_rating(), $count ); ?>
		<span><?php echo $product->get_average_rating() ?> out of 5 stars </span>
	</div>
	<?php
    if( ! $has_comments ){
			echo '<h5>No reviews yet, be a pioneer!</h5>';
		} else {
			fpusa_get_rating_histogram( $product->get_rating_counts(), $count );
		}
  ?>
</div>
