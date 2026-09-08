<?php
if (!defined('ABSPATH'))
	exit();
class PGBlockCustomFields
{
	function __construct()
	{
		add_action('init', array($this, 'register_scripts'));
	}
	// loading src files in the gutenberg editor screen
	function register_scripts()
	{
		register_block_type(
			post_grid_plugin_dir . 'build/blocks/custom-fields/block.json',
			array(
				'render_callback' => array($this, 'theHTML'),
			)
		);
	}

	// front-end output from the gutenberg editor 
	function theHTML($attributes, $content, $block)
	{
		global $postGridCssY;
		$blockId = isset($attributes['blockId']) ? $attributes['blockId'] : '';
		$blockAlign = isset($attributes['align']) ? 'align' . $attributes['align'] : '';
		if (!is_admin()) {
			//wp_enqueue_script('blk_post_grid', post_grid_plugin_dir . 'build/blocks/post-categories/index.js', array('wp-element'));
			// wp_enqueue_style('blk_post_grid', post_grid_plugin_url . 'includes/blocks/post-categories/index.css');
		}
		$post_ID = isset($block->context['postId']) ? $block->context['postId'] : '';
		$post_url = get_the_permalink($post_ID);
		$template = isset($attributes['template']) ? $attributes['template'] : '';
		$templateLoop = isset($attributes['templateLoop']) ? $attributes['templateLoop'] : '<div>{title}</div><div>{details}</div>';
		$wrapper = isset($attributes['wrapper']) ? $attributes['wrapper'] : [];
		$wrapperOptions = isset($wrapper['options']) ? $wrapper['options'] : [];
		$wrapperTag = isset($wrapperOptions['tag']) ? $wrapperOptions['tag'] : 'div';
		$wrapperClass = isset($wrapperOptions['class']) ? $wrapperOptions['class'] : '';
		$meta = isset($attributes['meta']) ? $attributes['meta'] : [];
		$metaOptions = isset($meta['options']) ? $meta['options'] : [];
		$metaKey = isset($metaOptions['key']) ? $metaOptions['key'] : '';
		$metaKeyType = isset($metaOptions['type']) ? $metaOptions['type'] : '';
		$blockCssY = isset($attributes["blockCssY"])			? $attributes["blockCssY"]			: [];
		$postGridCssY[] = isset($blockCssY["items"]) ? $blockCssY["items"] : [];
		$metaValue = get_post_meta($post_ID, $metaKey, true);

		$obj['id'] = $post_ID;
		$obj['type'] = 'post';
		$wrapperClass = post_grid_parse_css_class($wrapperClass, $obj);
		// //* Visible condition
		$visible = isset($attributes['visible']) ? $attributes['visible'] : [];
		if (!empty($visible['rules'])) {
			$isVisible = post_grid_visible_parse($visible);
			if (!$isVisible) return;
		}
		// //* Visible condition
		ob_start();
		//echo strtr($templateFront, $vars);
		if (!empty($wrapperTag)) :
?>
			<<?php echo pg_tag_escape($wrapperTag); ?> class="
                <?php echo esc_attr($blockId); ?>
                <?php echo esc_attr($wrapperClass); ?>">
				<?php
				echo $metaValue;
				?>
			</<?php echo pg_tag_escape($wrapperTag); ?>>
<?php
		endif;
		$html = ob_get_clean();
		$cleanedHtml = post_grid_clean_html($html);
		return $cleanedHtml;
	}
}
$BlockPostGrid = new PGBlockCustomFields();
