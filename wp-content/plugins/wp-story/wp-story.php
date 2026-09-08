<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://wpuzman.com
 * @since             1.0.0
 * @package           Wp_Story
 *
 * @wordpress-plugin
 * Plugin Name:       WP Story
 * Plugin URI:        https://codecanyon.net/user/wpuzman/
 * Description:       Create your own simple stories.
 * Version:           2.1.2
 * Author:            wpuzman
 * Author URI:        https://codecanyon.net/user/wpuzman/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-story
 * Domain Path:       /languages
 * Tested up to:      5.6.2
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'WP_STORY_VERSION', '2.1.2' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-wp-story-activator.php
 */
function activate_wp_story() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wp-story-activator.php';
	Wp_Story_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-wp-story-deactivator.php
 */
function deactivate_wp_story() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wp-story-deactivator.php';
	Wp_Story_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_wp_story' );
register_deactivation_hook( __FILE__, 'deactivate_wp_story' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-wp-story.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_wp_story() {

	$plugin = new Wp_Story();
	$plugin->run();

}
run_wp_story();
