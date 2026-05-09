import { supabase } from './supabase';

/**
 * Log profile view for AI analytics
 */
export const logView = async (viewerId: string | undefined, targetId: string, viewerRole: string) => {
  if (!targetId) return;
  try {
    await supabase.from('view_logs').insert({
      viewer_id: viewerId || null,
      target_id: targetId,
      viewer_role: viewerRole || 'guest'
    });
  } catch (error) {
    console.error('Failed to log view:', error);
  }
};

/**
 * Log search parameters for AI analytics
 */
export const logSearch = async (agencyId: string | undefined, params: any) => {
  try {
    await supabase.from('search_logs').insert({
      agency_id: agencyId || null,
      search_params: params
    });
  } catch (error) {
    console.error('Failed to log search:', error);
  }
};

/**
 * Log actions (scout, approve, decline, like) for AI analytics
 */
export const logAction = async (userId: string | undefined, actionType: string, targetId: string) => {
  if (!targetId) return;
  try {
    await supabase.from('action_logs').insert({
      user_id: userId || null,
      action_type: actionType,
      target_id: targetId
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};
