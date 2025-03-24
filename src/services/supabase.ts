import { createClient } from '@supabase/supabase-js'

// 这里替换成你的 Supabase 项目 URL 和 API Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase