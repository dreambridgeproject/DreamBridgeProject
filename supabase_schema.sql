-- DreamBridge Project - Full Supabase Schema

-- 1. Profiles Table (Extending default auth.users)
-- Note: This assumes the profiles table might already exist, so we use IF NOT EXISTS or ALTER
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'talent', -- talent, agency, casting
    bio TEXT,
    location TEXT,
    age INTEGER,
    birth_date DATE,
    height INTEGER,
    weight INTEGER,
    genres TEXT[] DEFAULT '{}',
    hobbies TEXT,
    skills TEXT,
    website_url TEXT,
    instagram_url TEXT,
    x_url TEXT,
    photos TEXT[] DEFAULT '{}',
    videos TEXT[] DEFAULT '{}',
    audios TEXT[] DEFAULT '{}',
    plan TEXT DEFAULT 'free',
    verification_status TEXT DEFAULT 'none', -- none, reviewing, verified, rejected
    verification_doc_url TEXT,
    skill_review_status TEXT DEFAULT 'none', -- none, reviewing, approved, rejected
    boosted_until TIMESTAMP WITH TIME ZONE, -- paid PR exposure window; independent of verification/skill review, never affects sort order
    parental_consent_name TEXT,
    parental_consent_contact TEXT,
    blocked_user_ids UUID[] DEFAULT '{}',
    favorite_ids UUID[] DEFAULT '{}',
    reported_by_ids UUID[] DEFAULT '{}',
    affiliation_status TEXT DEFAULT 'unaffiliated',
    agency_id UUID REFERENCES public.profiles(id),
    accept_external_offers BOOLEAN DEFAULT true,
    skill_tags TEXT[] DEFAULT '{}',
    company_description TEXT,
    contact_info TEXT,
    past_works TEXT,
    representative_name TEXT,
    gender TEXT DEFAULT 'none',
    is_banned BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- 10. Reports Table
    CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- pending, resolved, dismissed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Indices for Reports
    CREATE INDEX IF NOT EXISTS idx_reports_target ON public.reports(target_id);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

    -- 8. Analytics/Log Tables (from previous setup)

CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    sender_role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, declined
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message TEXT,
    mediator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    unread BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Invitations Table (Agency inviting talent)
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, accepted, expired
    pre_filled_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    casting_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    skill_tags TEXT[] DEFAULT '{}',
    reward TEXT,
    location TEXT,
    deadline TEXT,
    description TEXT,
    status TEXT DEFAULT 'open', -- open, closed
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Job Applications Table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    talent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- offer_received, offer_approved, offer_declined, new_message
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- 8. Analytics/Log Tables (from previous setup)
CREATE TABLE IF NOT EXISTS public.view_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_id UUID NOT NULL,
    viewer_role TEXT NOT NULL,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.search_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    search_params JSONB NOT NULL,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.action_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_offers_sender ON public.offers(sender_id);
CREATE INDEX IF NOT EXISTS idx_offers_receiver ON public.offers(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_offer ON public.messages(offer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_casting ON public.jobs(casting_id);
CREATE INDEX IF NOT EXISTS idx_job_apps_job ON public.job_applications(job_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Enable Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 9. Storage Buckets Setup
-- Note: Run these in the Supabase SQL Editor if they are not automatically created.
-- Buckets are managed in the 'storage' schema.

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('audios', 'audios', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-docs', 'verification-docs', false) ON CONFLICT (id) DO NOTHING;

-- Storage Policies

-- Avatars/Photos/Videos/Audios: Everyone can view, owner can upload/delete
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'photos', 'videos', 'audios'));

CREATE POLICY "Users can upload own media" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id IN ('avatars', 'photos', 'videos', 'audios') 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own media" ON storage.objects FOR DELETE 
USING (
    bucket_id IN ('avatars', 'photos', 'videos', 'audios') 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Verification Docs: Only owner can upload, only owner and admins can view
CREATE POLICY "Users can upload own verification docs" ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'verification-docs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own verification docs" ON storage.objects FOR SELECT 
USING (
    bucket_id = 'verification-docs' 
    AND (
        (storage.foldername(name))[1] = auth.uid()::text 
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
);

-- Helper: looks up the caller's own role without going through RLS again
-- (SECURITY DEFINER bypasses RLS, which avoids infinite recursion when a
-- policy on profiles needs to check the requester's own role).
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Basic Policies (Simplified for development)
-- Profile: talent profiles are only visible to agencies/casting companies (and the talent themselves);
-- agency/casting profiles remain public so talents can browse them.
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Role-based profile visibility" ON public.profiles;
CREATE POLICY "Role-based profile visibility" ON public.profiles FOR SELECT USING (
    auth.uid() = id
    OR role != 'talent'
    OR public.get_my_role() IN ('agency', 'casting')
);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Offers: Involved parties can view
CREATE POLICY "Users can view offers they are part of" ON public.offers FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR auth.uid() = mediator_id);

-- Messages: Involved parties can view/send
CREATE POLICY "Users can view messages in their offers" ON public.messages FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.offers 
    WHERE id = offer_id AND (auth.uid() = sender_id OR auth.uid() = receiver_id OR auth.uid() = mediator_id)
));

-- Notifications: Only owner can view/edit
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- TRIGGERS FOR NOTIFICATIONS

-- Trigger for new offer
CREATE OR REPLACE FUNCTION public.handle_new_offer_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        NEW.receiver_id,
        'offer_received',
        '新しいオファーが届きました',
        'スカウトが届いています。詳細を確認しましょう。',
        '/offers'
    );

    IF NEW.mediator_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (
            NEW.mediator_id,
            'offer_received',
            '所属タレントへのオファーが届きました',
            '制作会社から所属タレントへのオファーが届いています。内容を確認しましょう。',
            '/agency/talents'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_offer
AFTER INSERT ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.handle_new_offer_notification();

-- Trigger for offer status change
CREATE OR REPLACE FUNCTION public.handle_offer_status_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'pending' AND NEW.status = 'approved' THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (
            NEW.sender_id,
            'offer_approved',
            'オファーが承認されました',
            '送信したオファーが承認されました。チャットを開始しましょう。',
            '/offers'
        );
    ELSIF OLD.status = 'pending' AND NEW.status = 'declined' THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (
            NEW.sender_id,
            'offer_declined',
            'オファーが見送られました',
            '送信したオファーが見送られました。',
            '/offers'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_offer_status_change
AFTER UPDATE ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.handle_offer_status_notification();

-- Trigger for new message
CREATE OR REPLACE FUNCTION public.handle_new_message_notification()
RETURNS TRIGGER AS $$
DECLARE
    receiver_id UUID;
BEGIN
    -- Find the other party in the offer
    SELECT 
        CASE 
            WHEN sender_id = NEW.sender_id THEN receiver_id 
            ELSE sender_id 
        END INTO receiver_id
    FROM public.offers
    WHERE id = NEW.offer_id;

    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (
        receiver_id,
        'new_message',
        '新しいメッセージ',
        '新着メッセージがあります: ' || left(NEW.text, 30),
        '/chat/' || NEW.offer_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_message
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.handle_new_message_notification();
