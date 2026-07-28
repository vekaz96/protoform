-- Seed the PROTOFORM admin login (Supabase Auth).
-- Safe to re-run: skips if vekaz96@gmail.com already exists.
-- Run after supabase/schema.sql (tables + RLS must exist).
-- Any authenticated user can edit content via RLS — disable public sign-ups in the dashboard.

DO $$
DECLARE
  admin_email text := 'vekaz96@gmail.com';
  admin_password text := 'Modeling2026!';
  inst_id uuid := '00000000-0000-0000-0000-000000000000';
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = admin_email;

  IF user_id IS NOT NULL THEN
    RAISE NOTICE 'Admin user already exists: %', admin_email;
    RETURN;
  END IF;

  user_id := gen_random_uuid();

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    inst_id,
    user_id,
    'authenticated',
    'authenticated',
    admin_email,
    extensions.crypt(admin_password, extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    user_id,
    jsonb_build_object('sub', user_id::text, 'email', admin_email),
    'email',
    user_id::text,
    now(),
    now(),
    now()
  );

  RAISE NOTICE 'Created admin user: %', admin_email;
END $$;
