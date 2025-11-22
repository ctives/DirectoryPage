-- Add 2FA columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_fa_enabled BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_fa_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_fa_verified_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes TEXT[]; -- Array of backup codes

-- Create 2FA sessions table for tracking verification attempts
CREATE TABLE IF NOT EXISTS two_fa_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_two_fa_sessions_user_id ON two_fa_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_two_fa_sessions_expires_at ON two_fa_sessions(expires_at);
