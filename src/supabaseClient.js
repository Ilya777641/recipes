import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edgmohgtlukfkowwaux.supabase.co';
const supabaseKey = 'sb_publishable_l5Qe2qrep_445_pGGycXoQ_56b7wp3R';

export const supabase = createClient(supabaseUrl, supabaseKey);