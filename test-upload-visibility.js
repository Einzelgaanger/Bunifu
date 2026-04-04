// Test script to check upload visibility
// Run this in your browser console while logged in

async function testUploadVisibility() {
  console.log('🔍 Testing upload visibility...');
  
  try {
    // Import supabase client (adjust path as needed)
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
    
    // Do not commit real keys. Paste VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY from .env
    const SUPABASE_URL = 'REPLACE_WITH_VITE_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'REPLACE_WITH_VITE_SUPABASE_PUBLISHABLE_KEY';
    if (SUPABASE_URL.includes('REPLACE') || SUPABASE_ANON_KEY.includes('REPLACE')) {
      console.error('Set SUPABASE_URL and SUPABASE_ANON_KEY in this script (from your .env), then re-run.');
      return;
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Check current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('❌ User error:', userError);
      return;
    }
    
    console.log('✅ Current user:', user.email);

    // Check user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile error:', profileError);
    } else {
      console.log('✅ User profile:', profile);
      console.log('📚 Class ID:', profile.class_id);
    }

    // Check uploads
    const { data: uploads, error: uploadsError } = await supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (uploadsError) {
      console.error('❌ Uploads error:', uploadsError);
      console.log('💡 This suggests RLS policies are blocking access');
    } else {
      console.log('✅ Found uploads:', uploads.length);
      console.log('📄 Uploads:', uploads);
    }

    // Check classes
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('*');
    
    if (classesError) {
      console.error('❌ Classes error:', classesError);
    } else {
      console.log('✅ Available classes:', classes.length);
      console.log('🏫 Classes:', classes);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testUploadVisibility();
