<?php
/**
 * Add additional settings.
 *
 * @todo Sanitize and validate settings on save.
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Core
 * @author Astoundify
 */

namespace Astoundify\WPJobManager\ListingLabels;

// Do not access this file directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Add additional settings.
 *
 * @since 2.0.0
 */
class Settings {

	/**
	 * Hook in to WordPress
	 *
	 * @since 2.0.0
	 */
	public static function register() {
		add_filter( 'job_manager_settings', array( __CLASS__, 'settings' ) );
	}

	/**
	 * Add Settings
	 *
	 * @param  array $settings Settings.
	 * @return array
	 */
	public static function settings( $settings = array() ) {
		$settings['astoundify_wpjmll'] = array(
			__( 'Labels', 'wp-job-manager-listing-labels' ),
			array(),
		);

		$settings['astoundify_wpjmll'][1][] = array(
			'name'       => 'job_manager_enable_tag_archive',
			'std'        => '',
			'label'      => __( 'Label Archives', 'wp-job-manager-listing-labels' ),
			'cb_label'   => __( 'Enable Label Archives', 'wp-job-manager-listing-labels' ),
			'desc'       => __( 'Enabling label archives will make listing labels link through to an archive of all listings the selected label.', 'wp-job-manager-listing-labels' ),
			'type'       => 'checkbox',
		);

		$settings['astoundify_wpjmll'][1][] = array(
			'name'       => 'job_manager_tags_filter_type',
			'std'        => 'any',
			'label'      => __( 'Labels Filter Type', 'wp-job-manager-listing-labels' ),
			'desc'       => __( 'Determines how listings are queried when selecting labels.', 'wp-job-manager-listing-labels' ),
			'type'       => 'select',
			'options'    => array(
				'any' => __( 'Listings will be shown if within ANY chosen label', 'wp-job-manager-listing-labels' ),
				'all' => __( 'Listings will be shown if within ALL chosen labels', 'wp-job-manager-listing-labels' ),
			),
		);

		$settings['astoundify_wpjmll'][1][] = array(
			'name'       => 'astoundify_wpjmll_filter_results_all_labels',
			'std'        => '',
			'label'      => __( 'Available Labels', 'wp-job-manager-listing-labels' ),
			'cb_label'   => __( 'Display all labels regardless of current search query', 'wp-job-manager-listing-labels' ),
			'desc'       => __( 'If disabled, it will only display current search results labels.', 'wp-job-manager-listing-labels' ),
			'type'       => 'checkbox',
		);

		$settings['astoundify_wpjmll'][1][] = array(
			'name'       => 'job_manager_max_tags',
			'std'        => '',
			'label'      => __( 'Maximum Listing Labels', 'wp-job-manager-listing-labels' ),
			'desc'       => __( 'Enter the number of labels per listing submission you wish to allow, or leave blank for unlimited labels.', 'wp-job-manager-listing-labels' ),
			'type'       => 'input',
		);

		$settings['astoundify_wpjmll'][1][] = array(
			'name'       => 'job_manager_tag_input',
			'std'        => '',
			'label'      => __( 'Label Input', 'wp-job-manager-listing-labels' ),
			'options'    => array(
				''            => __( 'Text box (comma select labels)', 'wp-job-manager-listing-labels' ),
				'multiselect' => __( 'Multiselect (list of pre-defined labels)', 'wp-job-manager-listing-labels' ),
				'checkboxes'  => __( 'Checkboxes (list of pre-defined labels)', 'wp-job-manager-listing-labels' ),
			),
			'desc'       => '',
			'type'       => 'select',
		);

		$settings['astoundify_wpjmll'][1][] = array(
			'name'       => 'astoundify_wpjmll_order_by',
			'type'       => 'select',
			'label'      => __( 'Label Order By', 'wp-job-manager-listing-labels' ),
			'std'        => 'count',
			'desc'       => __( 'Default label order by sorting', 'wp-job-manager-listing-labels' ),
			'options'    => array(
				'count'       => __( 'Count', 'wp-job-manager-listing-labels' ),
				'name'        => __( 'Name', 'wp-job-manager-listing-labels' ),
			),
			'attributes'    => array(),
		);
		$settings['astoundify_wpjmll'][1][] = array(
			'name'       => 'astoundify_wpjmll_order',
			'type'       => 'select',
			'label'      => __( 'Label Order', 'wp-job-manager-listing-labels' ),
			'std'        => 'DESC',
			'desc'       => __( 'Default label order sorting', 'wp-job-manager-listing-labels' ),
			'options'    => array(
				'DESC'        => __( 'Descending', 'wp-job-manager-listing-labels' ),
				'ASC'         => __( 'Ascending', 'wp-job-manager-listing-labels' ),
			),
			'attributes'    => array(),
		);

		$settings['astoundify_wpjmll'][1][] = array(
			'name' => 'wp-job-manager-listing-labels',         // plugin slug.
			'type' => 'wp-job-manager-listing-labels_license', // {plugin_slug}_license.
			'std' > '',
			'placeholder' => '',
			'label' => __( 'License Key', 'wp-job-manager-listing-labels' ),
			'desc' => __( 'Enter the license key you received with your purchase receipt to continue receiving plugin updates.', 'wp-job-manager-listing-labels' ),
		);

		return $settings;
	}

}
