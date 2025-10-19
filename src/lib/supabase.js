import {
    createClient
} from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Los tipos se eliminan en JavaScript puro
// Si necesitas documentación, puedes usar JSDoc:
/**
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string} image_url
 * @property {string} category
 * @property {number} rating
 * @property {string} created_at
 */
/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} game_id
 * @property {string} user_id
 * @property {number} rating
 * @property {string} comment
 * @property {string} created_at
 * @property {Object} [users]
 * @property {string} users.username
 * @property {string} users.avatar_url
 */
/**
 * @typedef {Object} CommunityMessage
 * @property {string} id
 * @property {string} user_id
 * @property {string} [game_id]
 * @property {string} message
 * @property {string} created_at
 * @property {Object} [users]
 * @property {string} users.username
 * @property {string} users.avatar_url
 * @property {Object} [games]
 * @property {string} games.title
 */
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} avatar_url
 * @property {string} created_at
 */