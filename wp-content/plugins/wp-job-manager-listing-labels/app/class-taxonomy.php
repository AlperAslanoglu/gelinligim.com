<?php
/**
 * Add taxonomy.
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Schema
 * @author Astoundify
 */

namespace Astoundify\WPJobManager\ListingLabels;

// Do not access this file directly.
if ( ! defined( 'ABSPATH' ) ) {
	wp_die();
}

/**
 * Shortcodes.
 *
 * @since 2.0.0
 */
class Taxonomy {

	/**
	 * Hook in to WordPress
	 *
	 * @since 2.0.0
	 */
	public static function register() {
		add_action( 'init', array( __CLASS__, 'register_taxonomy' ), 0 );
	}

	/**
	 * Create taxonomy schema.
	 *
	 * @since 2.0.0
	 */
	public static function register_taxonomy() {
		// Don't add twice.
		if ( taxonomy_exists( astoundify_wpjmll_taxonomy() ) ) {
			return;
		}

		$singular = __( 'Listing Label', 'wp-job-manager-listing-labels' );
		$plural = __( 'Listing Labels', 'wp-job-manager-listing-labels' );
		$admin_capability = 'manage_job_listings';

		/* Tax Args */
		$args = array(
			'hierarchical'           => false,
			'update_count_callback'  => '_update_post_term_count',
			'label'                  => $plural,
			'labels'                 => array(
				'name'                 => $plural,
				'singular_name'        => $singular,
				// Translators: %s Plural label.
				'search_items'         => sprintf( __( 'Search %s', 'wp-job-manager-listing-labels' ), $plural ),
				// Translators: %s Plural label.
				'all_items'            => sprintf( __( 'All %s', 'wp-job-manager-listing-labels' ), $plural ),
				// Translators: %s Plural label.
				'parent_item'          => sprintf( __( 'Parent %s', 'wp-job-manager-listing-labels' ), $singular ),
				// Translators: %s Singular label.
				'parent_item_colon'    => sprintf( __( 'Parent %s:', 'wp-job-manager-listing-labels' ), $singular ),
				// Translators: %s Singular label.
				'edit_item'            => sprintf( __( 'Edit %s', 'wp-job-manager-listing-labels' ), $singular ),
				// Translators: %s Singular label.
				'update_item'          => sprintf( __( 'Update %s', 'wp-job-manager-listing-labels' ), $singular ),
				// Translators: %s Singular label.
				'add_new_item'         => sprintf( __( 'Add New %s', 'wp-job-manager-listing-labels' ), $singular ),
				// Translators: %s Singular label.
				'new_item_name'        => sprintf( __( 'New %s Name', 'wp-job-manager-listing-labels' ),  $singular ),
			),
			'show_ui'                => true,
			'show_in_rest'           => true,
			'query_var'              => get_option( 'job_manager_enable_tag_archive' ) ? true : false,
			'capabilities'           => array(
				'manage_terms'       => $admin_capability,
				'edit_terms'         => $admin_capability,
				'delete_terms'       => $admin_capability,
				'assign_terms'       => $admin_capability,
			),
			'rewrite'                => array(
				// Remains `job-tag` for backwards compatibility.
				'slug'         => sanitize_title( apply_filters( 'astoundify_wpjmll_taxonomy_permalink', __( 'job-tag', 'wp-job-manager-listing-labels' ) ) ),
				'with_front'   => false,
			),
		);

		register_taxonomy( astoundify_wpjmll_taxonomy(), array( 'job_listing' ), $args );
	}

}
