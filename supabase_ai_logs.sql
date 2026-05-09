-- 1. プロフィール閲覧ログ (View Logs)
CREATE TABLE view_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_id UUID NOT NULL, -- タレントや事務所のID
    viewer_role TEXT NOT NULL, -- talent | agency
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 検索条件ログ (Search Logs)
CREATE TABLE search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    search_params JSONB NOT NULL, -- 検索条件をそのまま保存 {"genre": "モデル", "age_min": 20, ...}
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. アクションログ (Action Logs - スカウト、承認、拒否など)
CREATE TABLE action_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL, -- scout_sent, offer_approved, offer_declined, favorite_added
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_view_logs_target ON view_logs(target_id);
CREATE INDEX idx_search_logs_agency ON search_logs(agency_id);
CREATE INDEX idx_action_logs_user ON action_logs(user_id);
CREATE INDEX idx_action_logs_type ON action_logs(action_type);
