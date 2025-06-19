import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://jhcmsrttuocdgqtjsnyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoY21zcnR0dW9jZGdxdGpzbnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTUwNjgsImV4cCI6MjA2NTg5MTA2OH0.10jLb4aoscJIVMRywM0Bt_zjrX8kRwOTJk3xlFhK8qU'

export const supabase = createClient(supabaseUrl, supabaseKey);