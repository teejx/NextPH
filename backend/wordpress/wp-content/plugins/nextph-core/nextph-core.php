<?php
/**
 * Plugin Name: NextPH Core
 * Plugin URI: https://nextph.example
 * Description: Core headless CMS capabilities for NextPH: trending/featured metadata, safe REST endpoints, role restrictions, and cache revalidation webhooks.
 * Version: 1.0.0
 * Author: NextPH Engineering
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

class NextPH_Core {
    const REST_NAMESPACE = 'nextph/v1';

    public function __construct() {
        // Register post meta
        add_action('init', [$this, 'register_post_meta']);

        // Auto-create default editorial categories (Tech, Travel, Lifestyle)
        add_action('init', [$this, 'ensure_default_categories']);

        // Register custom REST routes
        add_action('rest_api_init', [$this, 'register_rest_routes']);

        // Enforce role capabilities: authors cannot publish directly
        add_action('init', [$this, 'enforce_author_restrictions']);

        // Webhook for revalidation on post publish / update / trash
        add_action('transition_post_status', [$this, 'on_post_status_transition'], 10, 3);

        // Editor UI: Add Editorial Curation Meta Box
        add_action('add_meta_boxes', [$this, 'add_editorial_meta_box']);
        add_action('save_post', [$this, 'save_editorial_meta']);
    }

    /**
     * Register meta fields for posts: featured and trending flags.
     */
    public function register_post_meta() {
        register_post_meta('post', '_nextph_is_featured', [
            'show_in_rest' => true,
            'single'       => true,
            'type'         => 'boolean',
            'auth_callback' => function() {
                return current_user_can('edit_others_posts');
            },
            'sanitize_callback' => 'rest_sanitize_boolean',
            'description'  => 'Designates this post as a featured editorial story for the lead hero slot.',
        ]);

        register_post_meta('post', '_nextph_is_trending', [
            'show_in_rest' => true,
            'single'       => true,
            'type'         => 'boolean',
            'auth_callback' => function() {
                return current_user_can('edit_others_posts');
            },
            'sanitize_callback' => 'rest_sanitize_boolean',
            'description'  => 'Designates this post as an editor-curated trending story.',
        ]);
    }

    /**
     * Register public REST endpoint for trending stories.
     */
    public function register_rest_routes() {
        register_rest_route(self::REST_NAMESPACE, '/trending', [
            'methods'  => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_trending_posts'],
            'permission_callback' => '__return_true', // Public read-only endpoint
            'args' => [
                'limit' => [
                    'default'           => 8,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0 && $param <= 20;
                    },
                ],
            ],
        ]);
    }

    /**
     * Return published posts flagged as trending, with fallback to latest published posts.
     */
    public function get_trending_posts(WP_REST_Request $request) {
        $limit = min(20, max(1, (int)$request->get_param('limit')));

        $query_args = [
            'post_type'      => 'post',
            'post_status'    => 'publish',
            'posts_per_page' => $limit,
            'meta_query'     => [
                [
                    'key'     => '_nextph_is_trending',
                    'value'   => 1,
                    'compare' => '=',
                ],
            ],
            'orderby'        => 'date',
            'order'          => 'DESC',
            'no_found_rows'  => true,
        ];

        $query = new WP_Query($query_args);

        // Fallback: if not enough posts are marked trending, fill with recent published posts
        if ($query->post_count < $limit) {
            $existing_ids = wp_list_pluck($query->posts, 'ID');
            $needed = $limit - $query->post_count;

            $fallback_args = [
                'post_type'      => 'post',
                'post_status'    => 'publish',
                'posts_per_page' => $needed,
                'post__not_in'   => $existing_ids,
                'orderby'        => 'date',
                'order'          => 'DESC',
                'no_found_rows'  => true,
            ];
            $fallback_query = new WP_Query($fallback_args);
            $posts = array_merge($query->posts, $fallback_query->posts);
        } else {
            $posts = $query->posts;
        }

        $controller = new WP_REST_Posts_Controller('post');
        $data = [];

        foreach ($posts as $post) {
            $response = $controller->prepare_item_for_response($post, $request);
            $data[] = $controller->prepare_response_for_collection($response);
        }

        $response = rest_ensure_response($data);
        // Add short cache header for public cache
        $response->header('Cache-Control', 'public, max-age=120, s-maxage=300');

        return $response;
    }

    /**
     * Enforce publishing capabilities: Author role must NOT have publish_posts.
     * Authors can submit drafts for review ('edit_posts', 'upload_files'),
     * but cannot directly publish or edit others' posts.
     */
    public function enforce_author_restrictions() {
        $author_role = get_role('author');
        if ($author_role) {
            if ($author_role->has_cap('publish_posts')) {
                $author_role->remove_cap('publish_posts');
            }
        }
    }

    /**
     * Post status transition hook for Next.js ISR cache invalidation.
     */
    public function on_post_status_transition($new_status, $old_status, $post) {
        if ($post->post_type !== 'post') {
            return;
        }

        // Only trigger if publishing, updating, or unpublishing
        $is_relevant = ($new_status === 'publish' || $old_status === 'publish');
        if (!$is_relevant) {
            return;
        }

        $revalidate_url = defined('NEXTPH_REVALIDATE_URL') ? NEXTPH_REVALIDATE_URL : get_option('nextph_revalidate_url');
        $revalidate_secret = defined('NEXTPH_REVALIDATE_SECRET') ? NEXTPH_REVALIDATE_SECRET : get_option('nextph_revalidate_secret');

        if (!$revalidate_url || !$revalidate_secret) {
            return;
        }

        wp_remote_post($revalidate_url, [
            'timeout' => 5,
            'blocking' => false,
            'headers' => [
                'Content-Type' => 'application/json',
                'X-Revalidate-Secret' => $revalidate_secret,
            ],
            'body' => wp_json_encode([
                'id'        => $post->ID,
                'slug'      => $post->post_name,
                'newStatus' => $new_status,
                'oldStatus' => $old_status,
                'timestamp' => time(),
            ]),
        ]);
    }

    /**
     * Automatically ensure required NextPH categories (Tech, Travel, Lifestyle) exist.
     */
    public function ensure_default_categories() {
        $required_categories = [
            'Tech'      => 'tech',
            'Travel'    => 'travel',
            'Lifestyle' => 'lifestyle',
        ];

        foreach ($required_categories as $name => $slug) {
            if (!term_exists($slug, 'category')) {
                wp_insert_term($name, 'category', [
                    'slug' => $slug,
                ]);
            }
        }
    }

    /**
     * Add Editorial Curation meta box to post editor.
     */
    public function add_editorial_meta_box() {
        add_meta_box(
            'nextph_editorial_meta',
            'NextPH Editorial Curation',
            [$this, 'render_editorial_meta_box'],
            'post',
            'side',
            'high'
        );
    }

    /**
     * Render the curation controls in the post sidebar.
     */
    public function render_editorial_meta_box($post) {
        wp_nonce_field('nextph_save_editorial_meta', 'nextph_editorial_nonce');
        $is_featured = get_post_meta($post->ID, '_nextph_is_featured', true);
        $is_trending = get_post_meta($post->ID, '_nextph_is_trending', true);
        $video_url = get_post_meta($post->ID, 'video_url', true);
        ?>
        <div style="padding: 6px 0;">
            <p>
                <label>
                    <input type="checkbox" name="_nextph_is_featured" value="1" <?php checked($is_featured, 1); ?> />
                    <strong>Lead Hero Featured Story</strong>
                </label>
                <br>
                <small style="color: #666;">Shows this story as the lead hero banner on the homepage.</small>
            </p>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ddd;" />
            <p>
                <label>
                    <input type="checkbox" name="_nextph_is_trending" value="1" <?php checked($is_trending, 1); ?> />
                    <strong>Curated Trending Story</strong>
                </label>
                <br>
                <small style="color: #666;">Adds this story to the numbered Trending rankings list.</small>
            </p>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ddd;" />
            <p>
                <label for="nextph_video_url"><strong>Video Embed URL (Optional):</strong></label>
                <input type="url" id="nextph_video_url" name="video_url" value="<?php echo esc_attr($video_url); ?>" placeholder="https://www.youtube.com/watch?v=..." style="width: 100%; margin-top: 4px;" />
                <small style="color: #666;">Allowed: YouTube or Vimeo URLs only.</small>
            </p>
        </div>
        <?php
    }

    /**
     * Save the editorial curation meta values.
     */
    public function save_editorial_meta($post_id) {
        if (!isset($_POST['nextph_editorial_nonce']) || !wp_verify_nonce($_POST['nextph_editorial_nonce'], 'nextph_save_editorial_meta')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $is_featured = isset($_POST['_nextph_is_featured']) ? 1 : 0;
        $is_trending = isset($_POST['_nextph_is_trending']) ? 1 : 0;

        update_post_meta($post_id, '_nextph_is_featured', $is_featured);
        update_post_meta($post_id, '_nextph_is_trending', $is_trending);

        if (isset($_POST['video_url'])) {
            update_post_meta($post_id, 'video_url', esc_url_raw($_POST['video_url']));
        }
    }
}

new NextPH_Core();
