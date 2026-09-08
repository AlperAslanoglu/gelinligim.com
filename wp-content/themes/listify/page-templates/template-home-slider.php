<?php
/**
 * Template Name: Page: Home (Slider)
 *
 * @package Listify
 */

if ( ! listify_has_integration( 'wp-job-manager' ) ) {
	return locate_template( array( 'page.php' ), true );
}

get_header(); ?>



	<div 
				<?php
				echo apply_filters(
					'listify_cover',
					'homepage-cover page-cover entry-cover entry-cover--home entry-cover--' . get_theme_mod( 'home-hero-overlay-style', 'gradient' ),
					array(
						'size' => 'full',
					)
				);
				?>
			>
				<div class="cover-wrapper container">
					<?php
						the_widget(
							'Listify_Widget_Search_Listings',
							array(
								'title'       => get_the_title(),
								'description' => strip_shortcodes( get_the_content() ),
							),
							array(
								'before_widget' => '<div class="listify_widget_search_listings">',
								'after_widget'  => '</div>',
								'before_title'  => '<div class="home-widget-section-title"><h3 class="home-widget-title">',
								'after_title'   => '</h3></div>',
								'widget_id'     => 'search-12391',
							)
						);
					?>
				</div>

<?php get_footer(); ?>
