<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://wpuzman.com
 * @since      1.0.0
 *
 * @package    Wp_Story
 * @subpackage Wp_Story/admin/partials
 */
?>

<div class="wrap">
    <?php settings_errors(); ?>
	<h2><?php esc_html_e( 'Stories', 'wp-story' ); ?></h2>
	<form class="story-form" action="options.php" method="post">
        <?php
        settings_fields( $this->plugin_name );
        do_settings_sections( $this->plugin_name );
        ?>
		<table class="form-table">
			<tr>
				<th></th>
				<td><?php submit_button(); ?></td>
			</tr>
		</table>
	</form>

	<div class="information">
		<table class="form-table">
			<tr>
				<th><label for="display-editor"><?php esc_html_e( 'Editor Display (Shortcode)', 'wp-story' ); ?></label>
				</th>
				<td>
					<input type="text" value="<?php echo esc_attr( '[wp-story]' ); ?>" readonly>
				</td>
			</tr>
			<tr>
				<th><label for="display-editor"><?php esc_html_e( 'Code Display (PHP)', 'wp-story' ); ?></label></th>
				<td>
					<code>&lt;?php echo do_shortcode( '[wp-story]' ); ?&gt;</code>
				</td>
			</tr>
		</table>
	</div>
</div>