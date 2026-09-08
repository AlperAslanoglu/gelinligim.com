<?php
if (!defined('ABSPATH'))
  exit();
class PGBlockDoActions
{
  function __construct()
  {
    add_action('init', array($this, 'register_scripts'));
  }
  // loading src files in the gutenberg editor screen
  function register_scripts()
  {
    register_block_type(
      post_grid_plugin_dir . 'build/blocks/do-actions/block.json',
      array(
        'render_callback' => array($this, 'theHTML'),
      )
    );
  }
  // front-end output from the gutenberg editor 
  function theHTML($attributes, $content, $block)
  {
    global $postGridCssY;
    $post_ID = isset($block->context['postId']) ? $block->context['postId'] : '';
    $post_url = get_the_permalink($post_ID);
    $the_post = get_post($post_ID);


    $hook = isset($attributes['hook']) ? $attributes['hook'] : [];
    $hookOptions = isset($hook['options']) ? $hook['options'] : [];
    $hookKey = isset($hookOptions['key']) ? $hookOptions['key'] : [];

    $wrapper = isset($attributes['wrapper']) ? $attributes['wrapper'] : [];
    $wrapperOptions = isset($wrapper['options']) ? $wrapper['options'] : [];
    $wrapperClass = isset($wrapperOptions['class']) ? $wrapperOptions['class'] : '';
    $blockId = isset($attributes['blockId']) ? $attributes['blockId'] : '';
    $blockAlign = isset($attributes['align']) ? 'align' . $attributes['align'] : '';

    $wrapperOptions = isset($wrapper['options']) ? $wrapper['options'] : [];
    $wrapperID = isset($wrapperOptions['id']) ? $wrapperOptions['id'] : '';
    $wrapperTag = isset($wrapperOptions['tag']) ? $wrapperOptions['tag'] : 'div';

    $blockCssY = isset($attributes['blockCssY']) ? $attributes['blockCssY'] : [];
    $postGridCssY[] = isset($blockCssY['items']) ? $blockCssY['items'] : [];

    $obj['id'] = $post_ID;
    $obj['type'] = 'post';
    $wrapperClass = post_grid_parse_css_class($wrapperClass, $obj);
    // //* Visible condition


    // //* Visible condition
    ob_start();
?>
    <<?php echo pg_tag_escape($wrapperTag); ?> id="<?php echo esc_attr($blockId); ?>"
      class="<?php echo esc_attr($wrapperClass); ?> <?php echo esc_attr($blockId); ?> <?php echo esc_attr($blockAlign); ?>">
      <?php do_action($hookKey); ?> </<?php echo pg_tag_escape($wrapperTag); ?>>
<?php
    $html = ob_get_clean();
    $cleanedHtml = post_grid_clean_html($html);
    return $cleanedHtml;
  }
}
$BlockPostGrid = new PGBlockDoActions();
