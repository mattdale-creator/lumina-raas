-- Lumina RaaS Core Schema
-- PRD 4: Database Schema, Models & Data Layer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Users (linked to Clerk auth)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'paid_user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Outcomes (core RaaS billing entity)
-- ============================================
CREATE TABLE outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  prd_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'delivered', 'verified', 'paid')),
  success_criteria TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  payment_triggered BOOLEAN DEFAULT false,
  amount_cents INTEGER DEFAULT 0,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRD Instances (tracked executions)
-- ============================================
CREATE TABLE prd_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  prd_number INTEGER NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  logs JSONB DEFAULT '[]'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Agent Executions (Ralph-loop tracking)
-- ============================================
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE,
  agent_role TEXT NOT NULL,
  iteration_count INTEGER DEFAULT 0,
  last_status TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Aether Leads (PRD 13)
-- ============================================
CREATE TABLE aether_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'qualified', 'booked', 'converted', 'rejected')),
  dnc_checked BOOLEAN DEFAULT true,
  outcome_id UUID REFERENCES outcomes(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Subscriptions (RaaS retainers)
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  tier TEXT DEFAULT 'growth' CHECK (tier IN ('free', 'growth', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  next_billing TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Notification Preferences (PRD 9)
-- ============================================
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  outcome_delivered BOOLEAN DEFAULT true,
  payment_confirmed BOOLEAN DEFAULT true,
  aether_summary BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RaaS Metrics (PRD 10)
-- ============================================
CREATE TABLE raas_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outcome_id UUID REFERENCES outcomes(id),
  metric_type TEXT NOT NULL,
  value NUMERIC,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Aether Campaign Metrics (PRD 10)
-- ============================================
CREATE TABLE aether_campaign_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign TEXT NOT NULL,
  leads_contacted INTEGER DEFAULT 0,
  meetings_booked INTEGER DEFAULT 0,
  cost_cents INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Audit Logs (PRD 11)
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  performed_by TEXT,
  target_type TEXT,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_outcomes_user_status ON outcomes(user_id, status);
CREATE INDEX idx_outcomes_created ON outcomes(created_at DESC);
CREATE INDEX idx_prd_instances_outcome ON prd_instances(outcome_id);
CREATE INDEX idx_agent_executions_outcome ON agent_executions(outcome_id);
CREATE INDEX idx_aether_leads_campaign ON aether_leads(campaign);
CREATE INDEX idx_aether_leads_status ON aether_leads(status);
CREATE INDEX idx_raas_metrics_outcome ON raas_metrics(outcome_id);
CREATE INDEX idx_aether_metrics_campaign ON aether_campaign_metrics(campaign);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = auth_id);

ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own outcomes" ON outcomes
  FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
  );

ALTER TABLE prd_instances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own PRD instances" ON prd_instances
  FOR ALL USING (
    outcome_id IN (
      SELECT id FROM outcomes WHERE user_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()::text
      )
    )
  );

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own preferences" ON notification_preferences
  FOR ALL USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
  );

ALTER TABLE raas_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins see all metrics" ON raas_metrics
  FOR SELECT USING (
    (SELECT role FROM users WHERE auth_id = auth.uid()::text) = 'admin'
  );

-- ============================================
-- Realtime publication
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE outcomes;
ALTER PUBLICATION supabase_realtime ADD TABLE prd_instances;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE aether_leads;
