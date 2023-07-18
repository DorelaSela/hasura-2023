DROP TRIGGER IF EXISTS "badges_versions_immutable" ON "badges_versions";
DROP TRIGGER IF EXISTS "audit_trails_immutable" ON "audit_trails";
DROP FUNCTION IF EXISTS  "trigger_prevent_changes"();
