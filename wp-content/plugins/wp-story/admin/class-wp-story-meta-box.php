<?php

class Wp_Story_Meta_Box {

	/**
	 * Wp_Story_Meta_Box constructor.
	 * Hook meta box
	 */
	public function __construct() {
		add_action( 'edit_form_after_title', array( $this, 'render_meta_box_content' ) );
		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
		add_action( 'save_post', array( $this, 'save' ) );
	}

	/**
	 * @param $post_type
	 * Register meta box
	 */
	public function add_meta_box( $post_type ) {
		if ( $post_type == 'wp-story' ) {
			add_meta_box(
				'wp_story_shortcode',
				__( 'Shortcode', 'wp-story' ),
				array( $this, 'render_side_meta_box_content' ),
				$post_type,
				'side',
				'high'
			);

			add_meta_box(
				'wp_story_rate',
				__( 'Rate Us', 'wp-story' ),
				array( $this, 'render_side_rate' ),
				$post_type,
				'side',
				'high'
			);
		}
	}

	/**
	 * @param $post_id
	 * @return mixed
	 * Save meta box
	 */
	public function save( $post_id ) {

		if ( ! isset( $_POST['wp_story_meta_box_nonce_field'] ) ) {
			return $post_id;
		}

		if ( ! wp_verify_nonce( $_POST['wp_story_meta_box_nonce_field'], 'wp_story_meta_box_nonce_action' ) ) {
			return $post_id;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return $post_id;
		}

		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return $post_id;
		}

		$story_items = [];
		for ( $i = 0; $i < count( $_POST['wp_story_items_text'] ); $i++ ) {
			$story_items[] = [
				'text'    => isset( $_POST['wp_story_items_text'][ $i ] ) ? sanitize_text_field( $_POST['wp_story_items_text'][ $i ] ) : '',
				'link'    => isset( $_POST['wp_story_items_link'][ $i ] ) ? sanitize_text_field( $_POST['wp_story_items_link'][ $i ] ) : '',
				'src'     => isset( $_POST['wp_story_items_image'][ $i ] ) ? sanitize_text_field( $_POST['wp_story_items_image'][ $i ] ) : '',
				'new_tab' => isset( $_POST['wp_story_items_new_tab'][ $i ] ) ? sanitize_text_field( $_POST['wp_story_items_new_tab'][ $i ] ) : '',
			];
		}

		update_post_meta( $post_id, 'wp_story_items', $story_items );

		return $post_id;
	}

	public function render_side_meta_box_content() {
		echo '<input type="text" value="[wp-story]" style="width: 100%;" readonly>';
	}

	public function render_side_rate() {
		echo '<a href="https://tr.wordpress.org/plugins/wp-story/#reviews" target="_blank"><img class="rate-img" src="' . plugin_dir_url( __FILE__ ) . 'img/rate.png' . '"></a>';
		echo '<a class="rate-link" href="https://tr.wordpress.org/plugins/wp-story/#reviews" target="_blank">' . esc_html__( 'Please rate our plugin!', 'wp-story' ) . '</a>';
	}

	/**
	 * @param $post
	 * Render meta box
	 */
	public function render_meta_box_content( $post ) {
		if ( $post->post_type != 'wp-story' )
			return;

		wp_enqueue_media();
		wp_nonce_field( 'wp_story_meta_box_nonce_action', 'wp_story_meta_box_nonce_field' );

		$stories = get_post_meta( $post->ID, 'wp_story_items', true );

		if ( empty( $stories ) ) $stories = [ 1 ];
		?>
		<div class="ws-wrapper">
			<div class="ws-repeater-wrapper">
				<?php
				foreach ( $stories as $story ) { ?>
					<div class="ws-row" id="ws-repeater">
						<div class="ws-col-3">
							<div class="ws-inner">
								<label><?php esc_html_e( 'Story Link Text', 'wp-story' ); ?></label>
								<input type="text" name="wp_story_items_text[]" value="<?php echo esc_attr( $story['text'] ); ?>">
								<button type="button" class="story-remove">
									<span class="dashicons dashicons-trash"></span><?php esc_html_e( 'Delete', 'wp-story' ); ?>
								</button>
							</div>
						</div>
						<div class="ws-col-3">
							<div class="ws-inner">
								<label><?php esc_html_e( 'Story Link', 'wp-story' ); ?></label>
								<input type="text" name="wp_story_items_link[]" value="<?php echo esc_attr( $story['link'] ); ?>">
								<label class="wps-cb-label"><?php esc_html_e( 'New Tab', 'wp-story' ); ?>
									<input type="checkbox" name="wp_story_items_new_tab[]" <?php checked( ! empty( $story['new_tab'] ), true ); ?>>
									<span></span></label>
							</div>
						</div>
						<div class="ws-col-3">
							<div class="ws-inner">
								<label><?php esc_html_e( 'Story Image', 'wp-story' ); ?></label>
								<div class="uploader-wrapper">
									<input type="text" class="ws-image" name="wp_story_items_image[]" value="<?php echo isset( $story['src'] ) ? esc_attr( $story['src'] ) : ''; ?>">
									<button type="button" class="ws-uploader">
										<span class="dashicons dashicons-format-image"></span>
									</button>
								</div>
								<?php if ( isset( $story['src'] ) ): ?>
									<img src="<?php echo esc_url( $story['src'] ); ?>" alt="<?php esc_attr_e( 'Story Image', 'wp-story' ); ?>">
								<?php endif; ?>
							</div>
						</div>
						<div class="ws-col-3">
							<div class="ws-inner">
								<label for=""><?php esc_html_e( 'Duration (Sec)', 'wp-story' ); ?></label>
								<div class="pro-wrapper">
									<input type="number" name="">
									<a href="https://codecanyon.net/item/wp-story-premium/27546341" target="_blank" class="pro-info"><?php esc_html_e( 'PRO', 'wp-story' ); ?></a>
								</div>
							</div>
						</div>
					</div>
				<?php } ?>
			</div>
			<button type="button" class="story-add">
				<span class="dashicons dashicons-plus"></span><?php esc_html_e( 'Add Story', 'wp-story' ); ?>
			</button>
		</div>

		<script type="text/javascript">
			(function ($) {
				'use strict';

				let images = $('.ws-repeater-wrapper').find('img');

				images.each(function () {
					if ($(this).attr('src') === '') {
						$(this).hide();
					}
				});


				$('.story-add').on('click', function () {
					let repeater = $('#ws-repeater');

					repeater.clone().appendTo('.ws-repeater-wrapper').show(function () {
						$(this).find('img').attr('src', '').hide();
						$(this).find('input').val('');
						$(this).show();
					});
				});

				$(document).on('click', '.story-remove', function (e) {
					let remove = $(this).parent().parent().parent();
					remove.slideUp(250, function () {
						$(this).remove();
					});
				});

				$(document).on('click', '.ws-uploader', function (e) {
					e.preventDefault();

					let input = $(this).parent().find('.ws-image'),
						img = $(this).parent().parent().find('img');


					let custom_uploader = wp.media.frames.file_frame = wp.media({
						title: '<?php esc_html_e( 'Choose Image', 'wp-story' ); ?>',
						button: {
							text: '<?php esc_html_e( 'Choose Image', 'wp-story' ); ?>'
						},
						multiple: false,
						library: {
							type: ['image']
						},
					});

					custom_uploader.on('select', function () {
						let attachment = custom_uploader.state().get('selection').first().toJSON();
						input.val(attachment.url);
						img.attr('src', attachment.url);
						img.show();
					});

					custom_uploader.open();
				});
			})(jQuery);
		</script>
		<?php
	}
}

new Wp_Story_Meta_Box();