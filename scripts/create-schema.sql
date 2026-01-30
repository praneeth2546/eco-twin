-- EcoTwin Database Schema
-- Institutional Sustainability Analytics Platform

-- Create institutions table
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  industry TEXT,
  headquarters_country TEXT,
  year_founded INTEGER,
  sustainability_goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (institution members and admins)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'manager', 'member'
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sustainability metrics table
CREATE TABLE sustainability_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'carbon_emissions', 'energy_consumption', 'waste_generated', 'water_usage', etc.
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL, -- 'tonnes', 'kWh', 'liters', etc.
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  source TEXT, -- 'manual_entry', 'api', 'iot_device', etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sustainability goals table
CREATE TABLE sustainability_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  goal_category TEXT NOT NULL, -- 'emissions_reduction', 'renewable_energy', 'waste_reduction', etc.
  target_value NUMERIC NOT NULL,
  baseline_value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  target_year INTEGER NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  report_type TEXT NOT NULL, -- 'quarterly', 'annual', 'custom'
  metrics_summary JSONB,
  goals_progress JSONB,
  key_highlights TEXT[],
  recommendations TEXT[],
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity logs table
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_institution_id ON users(institution_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sustainability_metrics_institution_id ON sustainability_metrics(institution_id);
CREATE INDEX idx_sustainability_metrics_period ON sustainability_metrics(period_start, period_end);
CREATE INDEX idx_sustainability_goals_institution_id ON sustainability_goals(institution_id);
CREATE INDEX idx_reports_institution_id ON reports(institution_id);
CREATE INDEX idx_activity_logs_institution_id ON activity_logs(institution_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for institutions
CREATE POLICY "Users can view their own institution"
  ON institutions FOR SELECT
  USING (
    id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    )
  );

-- RLS Policies for users (within same institution)
CREATE POLICY "Users can view other users in their institution"
  ON users FOR SELECT
  USING (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can create users in their institution"
  ON users FOR INSERT
  WITH CHECK (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for sustainability metrics
CREATE POLICY "Users can view metrics for their institution"
  ON sustainability_metrics FOR SELECT
  USING (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert metrics for their institution"
  ON sustainability_metrics FOR INSERT
  WITH CHECK (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    )
  );

-- RLS Policies for sustainability goals
CREATE POLICY "Users can view goals for their institution"
  ON sustainability_goals FOR SELECT
  USING (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    )
  );

-- RLS Policies for reports
CREATE POLICY "Users can view reports for their institution"
  ON reports FOR SELECT
  USING (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    )
  );

-- RLS Policies for activity logs
CREATE POLICY "Users can view activity logs for their institution"
  ON activity_logs FOR SELECT
  USING (
    institution_id IN (
      SELECT institution_id FROM users WHERE id = auth.uid()
    )
  );
