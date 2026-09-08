<?php
/**
 * User Favorites Query
 * 
 * @since 1.0.0
 * @version 1.0.0
 * 
 * @vars object $favorite_query \Astoundify\Favorites\Favorite_Query
 */
?>

<?php astoundify_favorites_notices(); ?>

<?php astoundify_favorites_get_template( 'dashboard-view-tabs', array(
	'active_tab' => 'favorites',
) ); ?>

<div id="astoundify-favorites-dashboard-favorites">

	<table>
		<thead>
			<tr>
				<th><?php echo astoundify_favorites_label( 'Favorite' ); ?></th>
				<th><?php echo astoundify_favorites_label( 'List' ); ?></th>
				<th><?php _e( 'Note', 'astoundify-favorites' ); ?></th>
			</tr>
		</thead>
		<tbody>
			<tr id="astoundify-favorite-0" style="<?php echo $favorite_query->favorites ? 'display:none;' : '' ?>">
				<td colspan="3">
					<?php
					// Translators: %s is favorites.
					printf( __( 'You currently have no %s', 'astoundify-favorites' ), astoundify_favorites_label( 'favorites' ) ); ?>
				</td>
			</tr>

			<?php foreach ( $favorite_query->favorites as $favorite ) : ?>
				<?php astoundify_favorites_get_template( 'dashboard-favorite-item', array(
					'favorite' => $favorite,
				) ); ?>
			<?php endforeach; ?>
		</tbody>
	</table>

</div><!-- #astoundify-favorites-dashboard-favorites -->


<?php $favorite_query->pagination(); ?>
