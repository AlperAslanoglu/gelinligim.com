<?php
/**
 * Add shortcodes.
 *
 * @since 2.0.0
 *
 * @package Listing Labels
 * @category Shortcode
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
class Shortcodes {

	/**
	 * Hook in to WordPress
	 *
	 * @since 2.0.0
	 */
	public static function register() {
		add_action( 'init', array( __CLASS__, 'register_shortcodes' ) );
	}

	/**
	 * Register shortcodes.
	 *
	 * @since 2.0.0
	 */
	public static function register_shortcodes() {
		add_shortcode( 'listings_by_label', array( __CLASS__, 'listings_by_label' ) );
		add_shortcode( 'listings_label_cloud', array( __CLASS__, 'listing_label_cloud' ) );

		// Deprecated.
		add_shortcode( 'jobs_by_tag', array( __CLASS__, 'listings_by_label' ) );
		add_shortcode( 'job_tag_cloud', array( __CLASS__, 'listing_label_cloud' ) );
	}

	/**
	 * Display listings connected to a certain label.
	 *
	 * @since 2.0.0
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string
	 */
	public static function listings_by_label( $atts ) {
		global $job_manager;

		$atts = shortcode_atts( array(
			'per_page' => '-1',
			'orderby' => 'date',
			'order' => 'desc',
			'tag' => '',
			'tags' => '',
			'label' => '',
			'labels' => '',
		), $atts );

		// Map `tag` to `label`.
		if ( $atts['tag'] ) {
			$atts['label'] = $atts['tag'];
		}

		// Map `tags` to `labels`.
		if ( $atts['tags'] ) {
			$atts['labels'] = $atts['tags'];
		}

		$labels = (array) array_filter( array_map( 'sanitize_title', explode( ',', $atts['labels'] ) ) );

		if ( $atts['label'] ) {
			$labels[] = sanitize_title( $atts['label'] );
		}

		if ( ! $labels ) {
			return;
		}

		$args = array(
			'post_type'           => 'job_listing',
			'post_status'         => 'publish',
			'ignore_sticky_posts' => 1,
			'posts_per_page'      => $atts['per_page'],
			'orderby'             => $atts['orderby'],
			'order'               => $atts['order'],
		);

		$args['tax_query'] = array(
			array(
				'taxonomy' => astoundify_wpjmll_taxonomy(),
				'field'    => 'slug',
				'terms'    => $tags,
			),
		);

		if ( get_option( 'job_manager_hide_filled_positions' ) === 1 ) {
			$args['meta_query'] = array(
				array(
					'key'     => '_filled',
					'value'   => '1',
					'compare' => '!=',
				),
			);
		}

		$listings = new WP_Query( apply_filters( 'job_manager_output_jobs_args', $args ) );

		ob_start();
?>

<?php if ( $listings->have_posts() ) : ?>

	<ul class="job_listings">

		<?php while ( $listings->have_posts() ) : $listings->the_post(); ?>

			<?php get_job_manager_template_part( 'content', 'job_listing' ); ?>

		<?php endwhile; ?>

	</ul>

<?php else : ?>

	<p>
		<?php
			// Translators: %s List of tags.
			printf( esc_html__( 'No listings found labeled with %s.', 'wp-job-manager-listing-labels' ), implode( ', ', $labels ) ); // WPCS: XSS ok.
		?>
	<p>

<?php endif; ?>

<?php
		wp_reset_postdata();

		return '<div class="job_listings">' . ob_get_clean() . '</div>';
	}

	/**
	 * Display a cloud of available labels.
	 *
	 * @since 2.0.0
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string
	 */
	public static function job_tag_cloud( $atts ) {
		ob_start();

		$atts = shortcode_atts( array(
			'smallest'                  => 8,
			'largest'                   => 22,
			'unit'                      => 'pt',
			'number'                    => 45,
			'format'                    => 'flat',
			'separator'                 => "\n",
			'orderby'                   => astoundify_wpjmll_cloud_orderby(),
			'order'                     => astoundify_wpjmll_cloud_order(),
			'exclude'                   => null,
			'include'                   => null,
			'link'                      => 'view',
			'taxonomy'                  => astoundify_wpjmll_taxonomy(),
			'echo'                      => false,
			'topic_count_text_callback' => 'astoundify_wpjmll_tag_cloud_text_callback',
		), $atts );

		$atts = apply_filters( 'listing_label_cloud', $atts );

		// Backwards compat.
		$atts = apply_filters( 'job_tag_cloud', $atts );

		$html = wp_tag_cloud( $atts );

		if ( ! apply_filters( 'enable_job_tag_archives', get_option( 'job_manager_enable_tag_archive' ) ) ) {
			$html = str_replace( '</a>', '</span>', preg_replace( "/<a(.*)href='([^'']*)'(.*)>/", '<span$1$3>', $html ) );
		}

		return $html;
	}

}
