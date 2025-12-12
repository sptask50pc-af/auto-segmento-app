-- Add reference column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reference TEXT;