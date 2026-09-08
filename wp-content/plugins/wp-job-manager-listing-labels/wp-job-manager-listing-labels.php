<?php
/**
 * Plugin Name: Listing Labels for WP Job Manager
 * Plugin URI: https://astoundify.com/products/wp-job-manager-listing-labels/
 * Description: Add labels to listings to further organize site structure.
 * Version: 2.5.3
 * Author: Astoundify
 * Author URI: https://astoundify.com
 * Requires at least: 4.9.0
 * Tested up to: 5.2
 * Requires PHP: 5.6.20
 * WC requires at least: 3.0.0
 * WC tested up to: 3.6.0
 * Text Domain: wp-job-manager-listing-labels
 * Domain Path: resources/languages/
 *
 * 	Copyright: 2017 Astoundify
 * 	License: GNU General Public License v3.0
 * 	License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * 	Copyright: 2015 Automattic
 * 	License: GNU General Public License v3.0
 * 	License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package Listing Labels
 * @category Core
 * @author Astoundify
 */

// Do not access this file directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Activation PHP Notice
 *
 * @since 2.0.0
 */
function astoundify_wpjmll_php_notice() {
	// translators: %1$s minimum PHP version, %2$s current PHP version.
	$notice = sprintf( esc_html__( 'Listing Labels for WP Job Manager requires at least PHP %1$s. You are running PHP %2$s. Please upgrade and try again.', 'wp-job-manager-listing-labels' ), '<code>5.6.20</code>', '<code>' . PHP_VERSION . '</code>' ); ?>

<div class="notice notice-error">
	<p><?php echo wp_kses_post( $notice, array( 'code' ) ); ?></p>
</div>

<?php
}

// Check for PHP version..
if ( version_compare( PHP_VERSION, '5.6.20', '<' ) ) {
	add_action( 'admin_notices', 'astoundify_wpjmll_php_notice' );

	return;
}

// Plugin can be loaded... define some constants.
define( 'ASTOUNDIFY_WPJMLL_VERSION', '2.5.3' );
define( 'ASTOUNDIFY_WPJMLL_URL', trailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'ASTOUNDIFY_WPJMLL_PATH', trailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'ASTOUNDIFY_WPJMLL_PLUGIN', plugin_basename( __FILE__ ) );

/**
 * Plugin Updater.
 *
 * @since 2.0.0
 */
function astoundify_wpjmll_plugin_updater() {
	require_once( dirname( __FILE__ ) . '/vendor/astoundify/plugin-updater/astoundify-pluginupdater.php' );

	new Astoundify_PluginUpdater( __FILE__ );

	if ( defined( 'JOB_MANAGER_VERSION' ) ) {
		new Astoundify_PluginUpdater_Integration_WPJobManager( __FILE__ );
	}
}
add_action( 'admin_init', 'astoundify_wpjmll_plugin_updater', 9 );

/**
 * Load auto loader.
 *
 * @since 2.0.0
 */
require_once( __DIR__ . '/bootstrap/autoload.php' );

/**
 * Start the application.
 *
 * @since 2.0.0
 */
require_once( __DIR__ . '/bootstrap/app.php' );
