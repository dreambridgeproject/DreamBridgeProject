import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env manually
const envContent = fs.readFileSync('/workspaces/DreamBridgeProject/.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

console.log('Connecting to Supabase at:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';

  console.log(`1. Signing up user: ${email}...`);
  try {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Test User',
          role: 'talent'
        }
      }
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      return;
    }

    const userId = signUpData.user?.id;
    console.log('Sign up success! User ID:', userId);

    if (!userId) {
      console.error('No User ID returned');
      return;
    }

    // Now test fetchProfile logic
    console.log('2. Trying to fetch the profile (should PGRST116)...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('Fetch result:', { data: profileData, error: profileError });

    if (profileError && profileError.code === 'PGRST116') {
      console.log('3. Trying to insert profile...');
      const newProfile = {
        id: userId,
        full_name: 'Test User',
        role: 'talent',
        genres: [],
        photos: [],
        videos: [],
        audios: [],
        plan: 'free',
        verification_status: 'none',
        blocked_user_ids: [],
        company_description: '',
        contact_info: '',
        representative_name: '',
        affiliation_status: 'unaffiliated',
        gender: 'none'
      };

      console.time('Insert Time');
      const { data: createdData, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();
      console.timeEnd('Insert Time');

      console.log('Insert result:', { data: createdData, error: createError });
    }
  } catch (err) {
    console.error('Exception during test:', err);
  }
}

runTest();
