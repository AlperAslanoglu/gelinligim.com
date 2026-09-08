<?php
/**
 * Standard: Recent Blog Posts
 *
 * @since Listify 1.4.0
 */
class Listify_Widget_Recent_Posts extends Listify_Widget {

	public function __construct() {
		$this->widget_description = __( 'Display a grid of recent blog posts.', 'listify' );
		$this->widget_id          = 'listify_widget_recent_posts';
		$this->widget_name        = __( 'Listify - Page: Recent Posts', 'listify' );
		$this->widget_areas       = array( 'widget-area-home', 'widget-area-page' ); // valid widget areas
		$this->widget_notice      = __( 'Add this widget only in "Page" widget area.', 'listify' );
		$this->settings           = array(
			'title'       => array(
				'type'  => 'text',
				'std'   => '',
				'label' => __( 'Title:', 'listify' ),
			),
			'description' => array(
				'type'  => 'text',
				'std'   => '',
				'label' => __( 'Description:', 'listify' ),
			),
			'post_ids' => array(
				'type'  => 'text',
				'std'   => '',
				'label' => __( 'Post IDs:', 'listify' ),
			),
			'category_ids' => array(
				'type'  => 'text',
				'std'   => '',
				'label' => __( 'Category IDs:', 'listify' ),
			),
			'number'      => array(
				'type'  => 'number',
				'std'   => 3,
				'label' => __( 'Number to display:', 'listify' ),
				'min'   => 1,
				'max'   => 1000,
				'step'  => 1,
			),
			'excerpt'     => array(
				'type'  => 'checkbox',
				'std'   => 1,
				'label' => __( 'Display excerpt', 'listify' ),
			),
			'style'       => array(
				'type'    => 'select',
				'std'     => 'cover',
				'label'   => __( 'Style:', 'listify' ),
				'options' => array(
					'cover'    => __( 'Image Cover', 'listify' ),
					'standard' => __( 'Standard', 'listify' ),
				),
			),
			'blog_link' => array(
				'type'  => 'text',
				'std'   => '',
				'label' => __( 'View Blog link:', 'listify' ),
			),
			'blog_link_label' => array(
				'type'  => 'text',
				'std'   => '',
				'label' => __( 'View Blog label:', 'listify' ),
			),
		);
		parent::__construct();
	}

	function widget( $args, $instance ) {
		// Check widget areas context.
		if ( ! is_singular( 'page' ) ) {
			echo $this->widget_areas_notice(); // WPCS: XSS ok.

			return false;
		}

		global $style, $excerpt;

		extract( $args );

		$title       = apply_filters( 'widget_title', isset( $instance['title'] ) ? $instance['title'] : '', $instance, $this->id_base );
		$description = isset( $instance['description'] ) ? esc_attr( $instance['description'] ) : false;
		$style       = isset( $instance['style'] ) ? $instance['style'] : 'cover';
		$blog_link   = isset( $instance['blog_link'] ) ? $instance['blog_link'] : '';
		$blog_link_label   = isset( $instance['blog_link_label'] ) ? $instance['blog_link_label'] : __('View Blog', 'listify');
		$number      = isset( $instance['number'] ) ? absint( $instance['number'] ) : 3;
		$excerpt     = isset( $instance['excerpt'] ) && 1 == $instance['excerpt'] ? true : false;
		$post_ids    = isset ( $instance['post_ids'] ) ? esc_html__( $instance['post_ids'] ) : '';
		$category_ids    = isset ( $instance['category_ids'] ) ? esc_html__( $instance['category_ids'] ) : '';

		$query_args = array(
			'posts_per_page' => $number,
		);

		if ( ! empty( $post_ids ) ) {
			// make sure that $post_ids contains only numbers
			$post_ids = explode( ',', $post_ids );
			$post_ids = array_map( 'absint', $post_ids );
			$query_args['post__in'] = $post_ids;
		}

		if ( ! empty( $category_ids ) ) {
			// make sure that $category_ids contains only numbers
			$category_ids = explode( ',', $category_ids );
			$category_ids = array_map( 'absint', $category_ids );
			$query_args['cat'] = $category_ids;
		}

		if ( $description && strpos( $after_title, '</div>' ) ) {
			$after_title = str_replace( '</div>', '', $after_title ) . '<p class="home-widget-description">' . $description . '</p></div>';
		}

		if ( empty ( $blog_link ) ) {
			$blog_link = get_permalink( get_option( 'page_for_posts' ) );
		}

		$posts = new WP_Query(
			apply_filters(
				$this->widget_id . '_query',
				$query_args
			)
		);

		if ( ! $posts->have_posts() ) {
			return;
		}

		add_filter( 'excerpt_length', 'listify_short_excerpt_length' );

		ob_start();

		echo str_replace( 'class="widget', 'class="widget ' . $style, $before_widget ); // WPCS: XSS ok.

		if ( $title ) {
			echo $before_title . $title . $after_title; // WPCS: XSS ok.
		}

		echo '<div class="blog-archive blog-archive--grid row" data-columns>';

		while ( $posts->have_posts() ) :
			$posts->the_post();

			get_template_part( 'content', 'recent-posts' );
		endwhile;

		echo '</div>';

		echo '<p class="from-the-blog"><a href="' . esc_url( $blog_link ) . '" class="button">' . esc_html__( $blog_link_label ) . '</a></p>';

		echo $after_widget; // WPCS: XSS ok.

		$content = ob_get_clean();

		remove_filter( 'excerpt_length', 'listify_short_excerpt_length' );

		echo apply_filters( $this->widget_id, $content ); // WPCS: XSS ok.
	}

}
