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
	<h2><?php esc_html_e( 'Options', 'wp-story' ); ?></h2>

	<div class="wp-story-div premium-alert">
		<a href="https://codecanyon.net/item/wp-story-premium/27546341" target="_blank"><?php esc_html_e( 'This section available for only premium version.', 'wp-story' ); ?></a>
	</div>

	<div class="wp-story-div premium-features">
		<h3><?php esc_html_e( 'Premium Features', 'wp-story' ); ?></h3>
		<ul>
			<li><strong><?php esc_html_e( 'Advanced story options.', 'wp-story' ); ?></strong></li>
			<li><strong><?php esc_html_e( 'Advanced styling options.', 'wp-story' ); ?></strong></li>
			<li><strong><?php esc_html_e( 'Create video stories.', 'wp-story' ); ?></strong></li>
			<li><strong><?php esc_html_e( 'Users frontend story submission feature.', 'wp-story' ); ?></strong></li>
			<li>
				<strong><?php esc_html_e( 'Google Web Stories, bbPress, BuddyPress, Elementor, Gutenberg and other platforms integrations.', 'wp-story' ); ?></strong>
			</li>
			<li><strong><?php esc_html_e( 'Story timer (auto delete story).', 'wp-story' ); ?></strong></li>
			<li><strong><?php esc_html_e( 'Creating multiple stories.', 'wp-story' ); ?></strong></li>
			<li><strong><?php esc_html_e( 'Create stories from blog posts.', 'wp-story' ); ?></strong></li>
			<li><strong><?php esc_html_e( 'Create auto stories from latest blog posts.', 'wp-story' ); ?></strong></li>
		</ul>
	</div>

	<div class="wp-story-div wp-story-premium-actions">
		<a href="https://story.wpuzman.com/" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
				<path d="M0 0h24v24H0z" fill="none"/>
				<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
			</svg>
			<?php esc_html_e( 'Check Premium Demo', 'wp-story' ); ?>
		</a>
		<a href="https://codecanyon.net/item/wp-story-premium/27546341" target="_blank">
			<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
				<path d="M0 0h24v24H0z" fill="none"/>
				<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
			</svg>
			<?php esc_html_e( 'Buy Premium Now', 'wp-story' ); ?>
		</a>
	</div>
</div>