<?php
/**
 * Import a user.
 *
 * @uses Astoundify_AbstractItemImport
 * @implements Astoundify_ItemImportInterface
 *
 * @since 1.3.0
 */
class Astoundify_CI_Import_Item_User extends Astoundify_CI_Import_Item implements Astoundify_CI_Import_Item_Interface {

	/**
	 * Import a user.
	 *
	 * @since 1.3.0
	 * @return bool True on success
	 */
	public function import() {
		$result = $this->get_default_error();

		if ( $this->get_previous_import() ) {
			return $this->get_previously_imported_error();
		}

		$result = wp_insert_user( array(
			'user_login' => $this->item['data']['name'],
			'role' => $this->item['data']['role']
		) );

		if ( ! is_wp_error( $result ) ) {
			$result = new WP_User( $result );
		}

		return $result;
	}

	/**
	 * Reset a single item
	 *
	 * @since 1.3.0
	 * @return bool True on success
	 */
	public function reset() {
		$user = $this->get_previous_import();

		if ( ! $user ) {
			return $this->get_not_found_error();
		}

		$result = wp_delete_user( $user->ID );

		if ( ! $result ) {
			return $this->get_default_error();
		}

		return $result;
	}

	/**
	 * Retrieve a previously imported item
	 *
	 * @since 1.3.0
	 * @uses $wpdb
	 * @return bool True if a child theme already exists
	 */
	public function get_previous_import() {
		if ( ! isset( $this->item['data']['name'] ) ) {
			return false;
		}

		$user = get_user_by( 'user_login', $this->item['data']['name'] );

		return $user;
	}

}
