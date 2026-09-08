<?php
/**
 * WooCommerce template functions.
 *
 * Functions for the templating system.
 *
 * @since 2.5.0
 *
 * @package Listify
 * @category Template
 * @author Astoundify
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Update custom cart template parts.
 *
 * @since 2.5.0
 *
 * @param array $fragments Fragments to update.
 * @return array $fragments
 */
function listify_woocommerce_cart_count_fragments( $fragments ) {
	$fragments['.current-cart-count'] = '<span class="current-cart-count">' . absint( WC()->cart->get_cart_contents_count() ) . '</span>';

	return $fragments;
}

/**
 * Handle the class name for account pages in the Tertiary menu.
 *
 * @since 2.12.0
 *
 * @param $atts
 * @param $item
 * @param $args
 *
 * @return mixed
 */
function listify_woocommerce_account_page_class( $atts, $item, $args ) {
	$my_account_endpoint_id = wc_get_page_id( 'myaccount' );
	if ( ( $args->theme_location === 'tertiary' ) && ( is_account_page() ) && is_wc_endpoint_url() ) {
		if ( $item->object_id == $my_account_endpoint_id ) {
			$atts['class'] = 'myaccount-menu-item';
		}
	}
	return $atts;
}
