<?php
/**
 * Modify WordPress Admin.
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Admin
 * @author Astoundify
 */

namespace Astoundify\WPJobManager\ListingLabels;

// Do not access this file directly.
if ( ! defined( 'ABSPATH' ) ) {
	wp_die();
}

/**
 * Admin-specific functionality.
 *
 * @since 2.0.0
 */
class Admin {

	/**
	 * Hook in to WordPress
	 *
	 * @since 2.0.0
	 */
	public static function register() {
		add_filter( 'manage_edit-job_listing_columns', array( __CLASS__, 'columns' ), 20 );
		add_action( 'manage_job_listing_posts_custom_column', array( __CLASS__, 'custom_columns' ), 2 );
	}

	/**
	 * Display labels when editing listings.
	 *
	 * @param array $columns Current admin columns.
	 * @return array
	 */
	public static function columns( $columns ) {
		$new_columns = array();

		// Insert after categories.
		foreach ( $columns as $key => $value ) {
			if ( 'job_listing_category' === $key ) {
				$new_columns['listing_labels'] = __( 'Labels', 'wp-job-manager-listing-labels' );
			}

			$new_columns[ $key ] = $value;
		}

		return $new_columns;
	}

	/**
	 * Display labels.
	 *
	 * @param string $column Current column.
	 */
	public static function custom_columns( $column ) {
		global $post;

		if ( 'listing_labels' === $column ) {
			$terms = astoundify_wpjmll_get_label_list( $post->ID );

			echo $terms ? $terms : '<span class="na">&ndash;</span>'; // WPCS: XSS ok.
		}
	}

}
