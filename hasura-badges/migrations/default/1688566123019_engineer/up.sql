
CREATE TABLE engineer_to_manager_badge_candidature_proposals (
  id SERIAL PRIMARY KEY, 
  manager INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  badge_id INTEGER NOT NULL,
  badge_version TIMESTAMP NOT NULL,
  proposal_description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (badge_id, badge_version) REFERENCES badges_versions(id, created_at)
);

CREATE TABLE manager_badge_candidature_proposal_response (
  response_id SERIAL PRIMARY KEY,
  is_approved BOOLEAN NOT NULL,
  disapproval_motivation VARCHAR(255) DEFAULT NULL,
  proposal_id INTEGER NOT NULL REFERENCES engineer_to_manager_badge_candidature_proposals(id) ON DELETE RESTRICT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  created_by INTEGER REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE badge_candidature_request (
  id SERIAL PRIMARY KEY,
  is_issued BOOLEAN NOT NULL,
  badge_id INTEGER NOT NULL,
  badge_version TIMESTAMP NOT NULL,
  badge_description TEXT NOT NULL,
  badge_title TEXT NOT NULL,
  badges_requirements JSONB NOT NULL,
  engineer_id INTEGER NOT NULL,
  manager_id INTEGER NOT NULL,
  candidature_evidences JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);


CREATE OR REPLACE FUNCTION get_pending_responses_for_engineer(engineer_id INTEGER)
RETURNS SETOF engineer_badge_candidature_proposal_response
AS $$
BEGIN
  RETURN QUERY
  SELECT response_id, is_approved, disapproval_motivation, proposal_id, created_at, created_by
  FROM engineer_badge_candidature_proposal_response
  WHERE created_by = engineer_id AND is_approved = NULL;
END;
$$ LANGUAGE PLPGSQL;



CREATE OR REPLACE PROCEDURE insert_candidature_request(
  proposal_badge_id INTEGER,
  proposal_badge_version TIMESTAMP,
  proposal_id INTEGER,
  is_approved BOOLEAN,
  created_by INTEGER
)
AS $$
BEGIN
  IF is_approved = TRUE THEN
    INSERT INTO badge_candidature_request (
      is_issued,
      badge_id,
      badge_version,
      badge_description,
      badge_title,
      badges_requirements,
      engineer_id,
      manager_id,
      candidature_evidences
    )
    SELECT
      FALSE AS is_issued,
      proposal_badge_id,
      proposal_badge_version,
      bv.title AS badge_title,
      bv.description AS badge_description,
      bv.requirements AS badges_requirements,
      COALESCE(embc.created_by, mebc.engineer) AS engineer_id,
      COALESCE(embc.manager, mebc.created_by) AS manager_id,
      NULL AS candidature_evidences
    FROM
      badges_versions bv
      LEFT JOIN engineer_to_manager_badge_candidature_proposals embc ON embc.id = proposal_id
      LEFT JOIN manager_to_engineer_badge_candidature_proposals mebc ON mebc.id = proposal_id
    WHERE
      bv.id = proposal_badge_id
      AND bv.created_at = proposal_badge_version;

  END IF;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION insert_badge_candidature_request()
  RETURNS TRIGGER AS $$
DECLARE
  proposal_badge_id INTEGER;
  proposal_badge_version TIMESTAMP;
BEGIN
  IF TG_TABLE_NAME = 'manager_badge_candidature_proposal_response' AND NEW.is_approved = TRUE THEN
    SELECT badge_id, badge_version
    INTO proposal_badge_id, proposal_badge_version
    FROM engineer_to_manager_badge_candidature_proposals
    WHERE id = NEW.proposal_id;

  ELSIF TG_TABLE_NAME = 'engineer_badge_candidature_proposal_response' AND NEW.is_approved = TRUE THEN
    SELECT badge_id, badge_version
    INTO proposal_badge_id, proposal_badge_version
    FROM manager_to_engineer_badge_candidature_proposals
    WHERE id = NEW.proposal_id;

  END IF;

  CALL insert_candidature_request(
    proposal_badge_id,
    proposal_badge_version,
    NEW.proposal_id,
    NEW.is_approved,
    NEW.created_by
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER manager_badge_candidature_proposal_response_trigger
AFTER INSERT ON manager_badge_candidature_proposal_response
FOR EACH ROW
EXECUTE FUNCTION insert_badge_candidature_request();

CREATE TRIGGER engineer_badge_candidature_proposal_response_trigger
AFTER INSERT ON engineer_badge_candidature_proposal_response
FOR EACH ROW
EXECUTE FUNCTION insert_badge_candidature_request();
