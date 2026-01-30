-- EcoTwin Sample Data
-- Seed data for demo institutions and sample analytics

-- Insert sample institutions
INSERT INTO institutions (name, slug, description, industry, headquarters_country, year_founded, sustainability_goals)
VALUES
  (
    'Global Tech Corporation',
    'global-tech-corp',
    'Leading technology company committed to net-zero emissions by 2030',
    'Technology',
    'USA',
    1998,
    ARRAY['Net-zero emissions', 'Renewable energy transition', 'Circular economy']
  ),
  (
    'EcoManufacturing Ltd',
    'eco-manufacturing',
    'Sustainable manufacturing facility focused on waste reduction',
    'Manufacturing',
    'Germany',
    1995,
    ARRAY['90% waste diversion', 'Water conservation', 'Clean energy production']
  ),
  (
    'Green Finance Group',
    'green-finance-group',
    'Financial institution promoting sustainable investment',
    'Finance',
    'UK',
    2010,
    ARRAY['Carbon-neutral operations', 'Sustainable portfolio', 'Community engagement']
  );

-- Insert sample users for Global Tech Corporation
INSERT INTO users (email, password_hash, full_name, role, institution_id)
SELECT
  'admin@globaltech.com',
  '$2b$10$YourHashedPasswordHere1',
  'Alice Johnson',
  'admin',
  id
FROM institutions WHERE slug = 'global-tech-corp';

INSERT INTO users (email, password_hash, full_name, role, institution_id)
SELECT
  'manager@globaltech.com',
  '$2b$10$YourHashedPasswordHere2',
  'Bob Smith',
  'manager',
  id
FROM institutions WHERE slug = 'global-tech-corp';

-- Insert sample users for EcoManufacturing Ltd
INSERT INTO users (email, password_hash, full_name, role, institution_id)
SELECT
  'admin@ecomanuf.com',
  '$2b$10$YourHashedPasswordHere3',
  'Carol Williams',
  'admin',
  id
FROM institutions WHERE slug = 'eco-manufacturing';

-- Insert sample users for Green Finance Group
INSERT INTO users (email, password_hash, full_name, role, institution_id)
SELECT
  'admin@greenfinance.com',
  '$2b$10$YourHashedPasswordHere4',
  'David Brown',
  'admin',
  id
FROM institutions WHERE slug = 'green-finance-group';

-- Insert sample sustainability metrics for Global Tech Corporation
INSERT INTO sustainability_metrics (institution_id, metric_type, value, unit, period_start, period_end, source)
SELECT
  id,
  'carbon_emissions',
  125000,
  'tonnes CO2e',
  '2024-01-01'::date,
  '2024-12-31'::date,
  'annual_report'
FROM institutions WHERE slug = 'global-tech-corp';

INSERT INTO sustainability_metrics (institution_id, metric_type, value, unit, period_start, period_end, source)
SELECT
  id,
  'energy_consumption',
  450000,
  'MWh',
  '2024-01-01'::date,
  '2024-12-31'::date,
  'energy_management_system'
FROM institutions WHERE slug = 'global-tech-corp';

INSERT INTO sustainability_metrics (institution_id, metric_type, value, unit, period_start, period_end, source)
SELECT
  id,
  'renewable_energy_percentage',
  45,
  'percent',
  '2024-01-01'::date,
  '2024-12-31'::date,
  'energy_management_system'
FROM institutions WHERE slug = 'global-tech-corp';

-- Insert sample metrics for EcoManufacturing Ltd
INSERT INTO sustainability_metrics (institution_id, metric_type, value, unit, period_start, period_end, source)
SELECT
  id,
  'waste_generated',
  2500,
  'tonnes',
  '2024-01-01'::date,
  '2024-12-31'::date,
  'waste_tracking_system'
FROM institutions WHERE slug = 'eco-manufacturing';

INSERT INTO sustainability_metrics (institution_id, metric_type, value, unit, period_start, period_end, source)
SELECT
  id,
  'waste_diverted',
  2250,
  'tonnes',
  '2024-01-01'::date,
  '2024-12-31'::date,
  'waste_tracking_system'
FROM institutions WHERE slug = 'eco-manufacturing';

INSERT INTO sustainability_metrics (institution_id, metric_type, value, unit, period_start, period_end, source)
SELECT
  id,
  'water_usage',
  850000,
  'cubic_meters',
  '2024-01-01'::date,
  '2024-12-31'::date,
  'water_management_system'
FROM institutions WHERE slug = 'eco-manufacturing';

-- Insert sample sustainability goals
INSERT INTO sustainability_goals (institution_id, goal_category, target_value, baseline_value, unit, target_year, status)
SELECT
  id,
  'emissions_reduction',
  50,
  100,
  'percent',
  2030,
  'active'
FROM institutions WHERE slug = 'global-tech-corp';

INSERT INTO sustainability_goals (institution_id, goal_category, target_value, baseline_value, unit, target_year, status)
SELECT
  id,
  'renewable_energy',
  100,
  45,
  'percent',
  2030,
  'active'
FROM institutions WHERE slug = 'global-tech-corp';

INSERT INTO sustainability_goals (institution_id, goal_category, target_value, baseline_value, unit, target_year, status)
SELECT
  id,
  'waste_diversion',
  90,
  90,
  'percent',
  2025,
  'active'
FROM institutions WHERE slug = 'eco-manufacturing';

INSERT INTO sustainability_goals (institution_id, goal_category, target_value, baseline_value, unit, target_year, status)
SELECT
  id,
  'water_reduction',
  20,
  0,
  'percent',
  2028,
  'active'
FROM institutions WHERE slug = 'eco-manufacturing';
