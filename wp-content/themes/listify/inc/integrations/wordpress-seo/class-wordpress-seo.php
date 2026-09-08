<?php
/**
 * WordPress SEO integration.
 *
 * @since 2.7.0
 *
 * @package Listify
 * @category Integration
 * @author Astoundify
 */


if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * WordPress SEO integration.
 *
 * @since 2.7.0
 */
class Listify_WordPress_SEO extends Listify_Integration {

	/**
	 * Constructor Class.
	 *
	 * @since 2.7.0
	 */
	public function __construct() {
		$this->includes    = array();
		$this->integration = 'wordpress-seo';

		parent::__construct();
	}

	/**
	 * Setup Action
	 *
	 * @since 2.7.0
	 */
	public function setup_actions() {
		add_filter(
			'theme_mod_gallery-comments',
			function() {
				return ! WPSEO_Options::get( 'disable-attachment', false );
			}
		);
	}

}

$GLOBALS['listify_wordpress_seo'] = new Listify_WordPress_SEO();
