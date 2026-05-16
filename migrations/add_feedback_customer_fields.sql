-- Migration: Add customer-specific columns to feedback table
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/mcrqfavucthxfuabbmhq/sql/new

ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS customer_first_name text,
  ADD COLUMN IF NOT EXISTS customer_last_name  text,
  ADD COLUMN IF NOT EXISTS customer_email      text,
  ADD COLUMN IF NOT EXISTS customer_phone      text,
  ADD COLUMN IF NOT EXISTS device_type         text,
  ADD COLUMN IF NOT EXISTS issue_category      text,
  ADD COLUMN IF NOT EXISTS issue_types         text[],
  ADD COLUMN IF NOT EXISTS order_number        text,
  ADD COLUMN IF NOT EXISTS source              text DEFAULT 'help-center';
