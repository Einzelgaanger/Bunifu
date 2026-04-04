// Script to fix RLS policies for messages table
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is required (Supabase project URL)');
  process.exit(1);
}
if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('🔧 Example: set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.log('📖 Find it in Supabase dashboard: Settings → API (service_role — never commit or expose to the client)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS policies for messages table...');

  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('fix-messages-rls-policy.sql', 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      return;
    }
    
    console.log('✅ RLS policies updated successfully!');
    console.log('📝 Applied policies:');
    console.log('   - messages_select_policy: Allow authenticated users to read all messages');
    console.log('   - messages_insert_policy: Allow users to insert their own messages');
    console.log('   - messages_update_policy: Allow users to update their own messages');
    console.log('   - messages_delete_policy: Allow users to delete their own messages');
    console.log('   - message_likes policies: Allow users to manage their own likes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixRLSPolicies();
