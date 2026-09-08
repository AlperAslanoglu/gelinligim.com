<?php
/**
 * Modify submissino form.
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Frontend
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
class Submit {

	/**
	 * Hook in to WordPress
	 *
	 * @since 2.0.0
	 */
	public static function register() {
		// Add a field to the frontend.
		add_filter( 'submit_job_form_fields', array( __CLASS__, 'add_field' ) );

		// Validate field.
		add_filter( 'submit_job_form_validate_fields', array( __CLASS__, 'validate_field' ), 10, 3 );

		// Save field.
		add_action( 'job_manager_update_job_data', array( __CLASS__, 'save_field' ), 10, 2 );

		// Get field data when editing.
		add_action( 'submit_job_form_fields_get_job_data', array( __CLASS__, 'edit_field' ), 10, 2 );
	}

	/**
	 * Add the Label field to submission form.
	 *
	 * @since 2.0.0
	 *
	 * @param array $fields List of fields.
	 * @return array
	 */
	public static function add_field( $fields ) {
		// Limit labels.
		$max = get_option( 'job_manager_max_tags', '' );

		if ( '' !== $max ) {
			// Translators: %d Maximum number of labels.
			$max = ' ' . sprintf( __( 'Maximum of %d.', 'wp-job-manager-listing-labels' ), $max );
		}

		// Depending on chosen input type.
		switch ( get_option( 'job_manager_tag_input' ) ) {

			case 'multiselect' :
				$fields['job']['job_tags'] = array(
					'label'       => __( 'Listing Labels', 'wp-job-manager-listing-labels' ),
					'description' => __( 'Choose labels for this listing.', 'wp-job-manager-listing-labels' ) . $max,
					'placeholder' => __( 'Choose labels&hellip;', 'wp-job-manager-listing-labels' ),
					'type'        => 'term-multiselect',
					'taxonomy'    => astoundify_wpjmll_taxonomy(),
					'required'    => false,
					'priority'    => '4.5',
				);
			break;

			case 'checkboxes' :
				$fields['job']['job_tags'] = array(
					'label'       => __( 'Listing Labels', 'wp-job-manager-listing-labels' ),
					'description' => __( 'Choose labels for this listing.', 'wp-job-manager-listing-labels' ) . $max,
					'type'        => 'term-checklist',
					'taxonomy'    => astoundify_wpjmll_taxonomy(),
					'required'    => false,
					'priority'    => '4.5',
				);
			break;

			default :
				$fields['job']['job_tags'] = array(
					'label'       => __( 'Listing Labels', 'wp-job-manager-listing-labels' ),
					'description' => __( 'Comma separated labels for this listing.', 'wp-job-manager-listing-labels' ) . $max,
					'type'        => 'text',
					'required'    => false,
					'placeholder' => '',
					'priority'    => '4.5',
				);
			break;
		} // End switch().

		return $fields;
	}

	/**
	 * Validate field.
	 *
	 * @param bool  $passed Current list of validated items.
	 * @param array $fields List of registered fields.
	 * @param array $values Current values.
	 * @return mixed Bool on success, WP_Error on failure.
	 */
	public static function validate_field( $passed, $fields, $values ) {
		$max  = intval( get_option( 'job_manager_max_tags' ) );

    if ( ! isset( $values['job']['job_tags'] ) ) {
      return $passed;
    }

		$labels = is_array( $values['job']['job_tags'] ) ? $values['job']['job_tags'] : array_filter( explode( ',', $values['job']['job_tags'] ) );

		if ( $max && count( $labels ) > $max ) {
			// Translators: %d Maximum number of labels.
			return new \WP_Error( 'validation-error', sprintf( __( 'Please enter no more than %d labels.', 'wp-job-manager-listing-labels' ), $max ) );
		}

		return $passed;
	}

	/**
	 * Save field.
	 *
	 * @since 2.0.0
	 *
	 * @param int   $job_id The ID of the job being saved.
	 * @param array $values Current values.
	 */
	public static function save_field( $job_id, $values ) {
		$labels = array();

		if( ! isset( $values['job']['job_tags'] ) ) {
			return;
		}

		switch ( get_option( 'job_manager_tag_input' ) ) {
			case 'multiselect' :
			case 'checkboxes' :
				if ( is_array( $values['job']['job_tags'] ) ) {
					$labels = array_map( 'absint', $values['job']['job_tags'] );
				}

				break;

			default :
				if ( is_array( $values['job']['job_tags'] ) ) {
					$labels = array_map( 'absint', $values['job']['job_tags'] );
				} else {
					$labels = array_filter( array_map( 'sanitize_text_field', explode( ',', $values['job']['job_tags'] ) ) );
				}

				break;
		}

		if ( ! empty( $labels ) ) {
			wp_set_object_terms( $job_id, $labels, astoundify_wpjmll_taxonomy(), false );
		}
	}

	/**
	 * Get label data when editing a listing.
	 *
	 * @since 2.0.0
	 *
	 * @param array   $data Current data.
	 * @param WP_Post $post Current post.
	 * @return array $data
	 */
	public static function edit_field( $data, $post ) {
		$terms = get_the_terms( $post->ID, astoundify_wpjmll_taxonomy() );

		if ( ! is_array( $terms ) || is_wp_error( $terms ) ) {
			$terms = array();
		}

		switch ( get_option( 'job_manager_tag_input' ) ) {
			case 'multiselect' :
			case 'checkboxes' :
				$terms = wp_list_pluck( $terms, 'term_id' );

				$data['job']['job_tags']['value'] = $terms;

				break;

			default :
				$terms = wp_list_pluck( $terms, 'name' );

				$data['job']['job_tags']['value'] = implode( ', ', (array) $terms );

				break;
		}

		return $data;
	}

}
