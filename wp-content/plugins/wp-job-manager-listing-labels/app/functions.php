<?php
/**
 * Utility Functions
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Core
 * @author Astoundify
 */

// Do not access this file directly.
if ( ! defined( 'ABSPATH' ) ) {
	wp_die();
}

/**
 * Taxonomy.
 *
 * @since 2.0.0
 *
 * @return string
 */
function astoundify_wpjmll_taxonomy() {
	// To modify taxonomy, add filters in "init" hook at priority -1 or earlier.
	return apply_filters( 'astoundify_wpjmll_taxonomy', 'job_listing_label' );
}

/**
 * Get a list of tags for a specific listing.
 *
 * @since 2.0.0
 *
 * @param int $listing_id The current ID.
 * @return string
 */
function astoundify_wpjmll_get_label_list( $listing_id ) {
	$terms = get_the_term_list( $listing_id, astoundify_wpjmll_taxonomy(), '', apply_filters( 'job_manager_tag_list_sep', ', ' ), '' );

	if ( is_wp_error( $terms ) ) {
		return '';
	}

	if ( ! get_option( 'job_manager_enable_tag_archive', false ) ) {
		$terms = strip_tags( $terms );
	}

	return $terms;
}

/**
 * Tag cloud text callback.
 *
 * @since 2.0.0
 *
 * @param int $count The current count.
 * @return string
 */
function astoundify_wpjmll_tag_cloud_text_callback( $count ) {
	// Translators: %s Number of listings.
	return sprintf( _n( '%s listing', '%s listings', $count, 'wp-job-manager-listing-labels' ), number_format_i18n( $count ) );
}

/**
 * Order by labels.
 *
 * @since 2.0.0
 *
 * @return string
 */
function astoundify_wpjmll_cloud_orderby() {
	$orderby = get_option( 'astoundify_wpjmll_order_by', 'count' );

	if ( ! in_array( $orderby, array( 'count', 'name' ), true ) ) {
		return 'count';
	}

	return $orderby;
}

/**
 * Order labels.
 *
 * @since 2.0.0
 *
 * @return string
 */
function astoundify_wpjmll_cloud_order() {
	$order = get_option( 'astoundify_wpjmll_order', 'DESC' );

	if ( ! in_array( $order, array( 'ASC', 'DESC' ), true ) ) {
		return 'DESC';
	}

	return $order;
}
