<?php
/**
 * Modify frontend of the theme.
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Template
 * @author Astoundify
 */

namespace Astoundify\WPJobManager\ListingLabels;

// Do not access this file directly.
if ( ! defined( 'ABSPATH' ) ) {
	wp_die();
}

/**
 * Frontend-specific functionality.
 *
 * @since 2.0.0
 */
class Frontend {

	/**
	 * Hook in to WordPress
	 *
	 * @since 2.0.0
	 */
	public static function register() {
		add_filter( 'the_job_description', array( __CLASS__, 'render' ) );
	}

	/**
	 * Render a list of labels under the listing description.
	 *
	 * @param string $content Current object content.
	 * @return string
	 */
	public static function render( $content ) {
		$terms = astoundify_wpjmll_get_label_list( get_the_ID() );

		if ( $terms ) {
			$content .= '<p class="listing_labels">' . __( 'Labeled as:', 'wp-job-manager-listing-labels' ) . ' ' . $terms . '</p>';
		}

		return $content;
	}

}
