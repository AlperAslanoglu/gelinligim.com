<?php
/**
 * Template Name: Page: Home
 *
 * @package Listify
 */

if ( ! listify_has_integration( 'wp-job-manager' ) ) {
	return locate_template( array( 'page.php' ), true );
}

get_header();

while ( have_posts() ) : the_post();
	$style = get_post()->hero_style;

	if ( 'none' !== $style ) {

		if ( in_array( $style, array( 'image', 'video' ) ) ) { ?>

			<div <?php echo apply_filters( 'listify_cover', 'homepage-cover page-cover entry-cover entry-cover--home entry-cover--' . get_theme_mod( 'home-hero-overlay-style', 'default' ), array( 'size' => 'full' ) ); ?>>
				<div class="cover-wrapper container">
					<?php
					the_widget(
						'Listify_Widget_Search_Listings',
						apply_filters(
							'listify_widget_search_listings_default',
							array(
								'title'       => get_the_title(),
								'description' => strip_shortcodes( get_the_content() ),
							)
						),
						array(
							'before_widget' => '<div class="listify_widget_search_listings">',
							'after_widget'  => '</div>',
							'before_title'  => '<div class="home-widget-section-title"><h1 class="home-widget-title">',
							'after_title'   => '</h1></div>',
							'widget_id'     => 'search-12391',
							'id'            => 'widget-area-home',
						)
					); ?>
				</div>

				<?php if ( 'video' == $style && function_exists( 'the_custom_header_markup' ) ) { ?>
					<div class="custom-header-video">
						<div class="custom-header-media">
							<?php
							add_filter( 'theme_mod_external_header_video', 'listify_header_video' );
							the_custom_header_markup();
							remove_filter( 'theme_mod_external_header_video', 'listify_header_video' ); ?>
						</div>
					</div>
				<?php } ?>

			</div>

		<?php } else { ?>

			<div <?php echo apply_filters( 'listify_cover', 'homepage-cover has-map page-cover' ); ?>>
				<?php
				do_action( 'listify_output_map' );

				if ( ! is_active_widget( false, false, 'listify_widget_map_listings', true ) ) {
					do_action( 'listify_output_results' );
				} ?>
			</div>

		<?php }

	}

	do_action( 'listify_page_before' ); ?>

	<div class="container homepage-hero-style-<?php echo esc_attr( $style ); ?>">

		<?php
		if ( listify_has_integration( 'woocommerce' ) ) { ?>
			<?php wc_print_notices();
		}

		if ( is_active_sidebar( 'widget-area-home' ) ) {
			dynamic_sidebar( 'widget-area-home' );
		} else {
			$args = listify_register_sidebar_args( 'widget-area-home' );

			the_widget(
				'Listify_Widget_Recent_Listings',
				array(
					'title'       => __( 'Recent  Listings', 'listify' ),
					'description' => __( 'Take a look at what\'s been recently added.', 'listify' ),
					'limit'       => 6,
					'featured'    => 0,
				),
				array(
					'before_widget' => '<aside class="home-widget">',
					'after_widget'  => '</aside>',
					'before_title'  => $args['before_title'],
					'after_title'   => $args['after_title'],
				)
			);
		} ?>

	</div>

<?php
endwhile;

get_footer();

