<?php
/**
 * Utilities and helpers.
 *
 * @since 1.0.0
 */
class Astoundify_CI_Utils {

	/**
	 * Handle media upload.
	 *
	 * If the file URL does not have an extension assume its from an image
	 * placeholder service.
	 *
	 * @since 1.0.0
	 *
	 * @param string $file URL to an asset to upload.
	 * @param int    $post_id The post ID to attach the media to.
	 * @return (int|false) The post ID on success.
	 */
	public static function upload_asset( $original_url, $post_id = 0 ) {

		// jic
		require_once( ABSPATH . 'wp-admin/includes/admin.php' );

		$file = esc_url_raw( $original_url );
		$path = parse_url( $file, PHP_URL_PATH );

		if ( ! $path ) {
			return false;
		}

		$filetype = wp_check_filetype( $path );
		$mimes = get_allowed_mime_types();

		// We are interesested in image mime types only.
		$mimes = preg_grep( "/image\//", $mimes );

		// Only allow valid mime types.
		if ( ! in_array( $filetype['type'], $mimes ) ) {
			return false;
		}

		$asset_exists = self::asset_exists( $original_url );

		if ( ! empty( $asset_exists ) ) {
			return $asset_exists;
		}

		$temp_file = download_url( $file );

		if ( is_wp_error( $temp_file ) ) {
			return false;
		}

		$file_array = array(
			'name' => basename( $file ),
			'tmp_name' => $temp_file,
			'error' => 0,
			'size' => filesize( $temp_file ),
		);

		$overrides = array(
			'test_form' => false,
			'test_size' => true,
			'test_upload' => true,
		);

		if ( ! $post_id ) {
			$file = media_handle_sideload( $file_array, $post_id, null );
		} else {
			$file = wp_handle_sideload( $file_array, $overrides );
		}

		if ( ! empty( $file['error'] ) ) {
			@unlink( $file['tmp_name'] );

			return false;
		}

		// Return orphaned upload ID.
		if ( ! $post_id ) {
			return $file;
		}

		// Create the attachment.
		$url = $file['url'];
		$type = $file['type'];
		$file = $file['file'];
		$title = preg_replace( '/\.[^.]+$/', '', basename( $file ) );
		$content = '';

		if ( ! $type && '' == $ext ) {
			$type = $file_array['type'];
		}

		$attachment = array(
			'post_mime_type' => $type,
			'guid' => $url,
			'post_parent' => $post_id,
			'post_title' => $title,
			'post_content' => $content,
		);

		$id = wp_insert_attachment( $attachment, $file, $post_id );

		if ( ! is_wp_error( $id ) ) {
			$generated = wp_generate_attachment_metadata( $id, $file );

			$data = wp_update_attachment_metadata( $id, $generated );

			update_post_meta( $id, '_ast_original_url', $original_url );

			return $id;
		}

		return $file;
	}

	/**
	 * Check if the asset exists.
	 *
	 * @since 1.2.1
	 *
	 * @param string $url URL of an asset to check.
	 * @return (int|false) The attachment ID on success.
	 */
	public static function asset_exists( $url ) {

		// Look for any assets that have the _ast_original_url meta key.
		$args = array(
			'post_type'      => 'attachment',
			'posts_per_page' => 1,
			'post_status'    => 'any',
			'meta_query'     => array(
				array(
					'key'     => '_ast_original_url',
					'value'   => $url,
					'compare' => '=',
				),
			),
		);
		$query = new WP_Query( $args );

		$return = false;

		$query = new WP_Query( $args );
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) :
				$query->the_post();
				$return = (int) get_the_ID();
				break;
			endwhile;
		}

		return $return;
	}

	/**
	 * Get generated content from a lorem ipsum generator.
	 *
	 * @since 1.0.0
	 *
	 * @param string $url URL.
	 * @return string
	 */
	public static function get_lipsum_content( $url = false ) {
		if ( ! $url ) {
			$url = 'http://www.randomtext.me/api/gibberish/p-3/100-200';
		}

		$response = wp_remote_get( esc_url_raw( $url ) );
		$default = '';

		if ( is_wp_error( $response ) ) {
			return $default;
		}

		$body = wp_remote_retrieve_body( $response );
		$body = json_decode( $body, true );

		if ( ! $body['text_out'] ) {
			return $default;
		}

		return $body['text_out'];
	}

	/**
	 * strpos for arrays
	 *
	 * @since 1.0.0
	 * @param string $haystack
	 * @param array  $needs
	 */
	public static function strposa( $haystack, $needles ) {
		if ( ! is_array( $needles ) ) {
			$needles = array( $needlese );
		}

		foreach ( $needles as $query ) {
			if ( false !== strpos( $haystack, $query ) ) {
				return true;
			}
		}
	}

	/**
	 * Convert a numeric string to an integer.
	 *
	 * @since 1.2.0
	 * @param $value
	 * @return $value
	 */
	public static function numeric_to_int( $value ) {
		return is_numeric( $value ) ? floatval( $value ) : $value;
	}

}
