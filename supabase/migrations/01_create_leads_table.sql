-- Migration to create the `leads` table for Auto Wise landing page

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'garage_owner')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL,
    workshop_name TEXT
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert into the leads table
CREATE POLICY "Allow anonymous inserts" ON public.leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated admins to view the leads (optional, if you plan to view them via Supabase Studio, it works by default as admin)
CREATE POLICY "Allow authenticated read" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);
