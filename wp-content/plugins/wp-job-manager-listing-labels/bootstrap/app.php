<?php
/**
 * Load the application.
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Bootstrap
 * @author Astoundify
 */

namespace Astoundify\WPJobManager\ListingLabels;

// Load helper functions.
require_once( ASTOUNDIFY_WPJMLL_PATH . 'app/functions.php' );

/**
 * Initialize plugin.
 *
 * @since 2.0.0
 */
add_action( 'plugins_loaded', function() {
	// Load text domain.
	load_plugin_textdomain( dirname( ASTOUNDIFY_WPJMLL_PLUGIN ), false, dirname( ASTOUNDIFY_WPJMLL_PLUGIN ) . '/resources/languages/' );

	// Bail if required plugin not active.
	if ( ! class_exists( '\WP_Job_Manager' ) ){
		return;
	}

	// Bail if Job Tags active.
	if ( class_exists( '\WP_Job_Manager_Job_Tags' ) ) {

		// Add admin notice.
		add_action( 'admin_notices', function() {
?>

<div class="notice notice-error">
	<p><?php esc_html_e( 'Please deactivate "WP Job Manager - Job Tags" to use "Listing Labels for WP Job Manager".', 'wp-job-manager-listing-labels' ); ?></p>
</div>

<?php
		} );

		return; // Bail.
	}

	// Register admin/settings.
	Admin::register();
	Settings::register();

	// Register schema.
	Taxonomy::register();

	// Register shortcodes.
	Shortcodes::register();

	// Register frontend.
	Frontend::register();
	Listings::register();
	Submit::register();
} );
