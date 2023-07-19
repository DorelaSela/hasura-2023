CREATE TABLE "badges_versions" (
  "id" INTEGER,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "created_by" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "title" VARCHAR(255),
  "description" TEXT,
  "requirements" TEXT,
  "is_deleted" BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY ("id", "created_at")
);

CREATE VIEW "badges_versions_last" AS
SELECT DISTINCT ON ("id") "id", "created_at", "created_by", "title", "description", "requirements" , "is_deleted"
FROM "badges_versions"
ORDER BY "id", "created_at" DESC;

-- Private version of the function

-- (useful for seeding or testing)

CREATE OR REPLACE FUNCTION "_create_badge_version"(
  "user_id" INTEGER,
  "badge_def_id" INTEGER,
  "version_at" TIMESTAMP,
  "is_deleted" BOOLEAN
)

RETURNS SETOF "badges_versions" AS $$
BEGIN
  RETURN QUERY
  INSERT INTO "badges_versions"(
    "id",
    "title",
    "description",
    "requirements",
    "created_at",
    "created_by",
    "is_deleted"
  )

  SELECT
    "bd"."id",
    "bd"."title",
    "bd"."description",
    coalesce(
        json_agg(
            json_build_object(
                'id', "rd"."id",
                'title', "rd"."title",
                'description', "rd"."description"
            )
            ORDER BY "rd"."id"
        ) FILTER (WHERE "rd"."id" IS NOT NULL),
        '[]'::json

    ) AS "requirements",
    version_at,
    user_id,
    is_deleted 
  FROM "badges_definitions" "bd"
  LEFT JOIN "requirements_definitions" "rd" ON "bd"."id" = "rd"."badge_id"
  WHERE "bd"."id" = "badge_def_id"
  GROUP BY "bd"."id", "bd"."title", "bd"."description"
  RETURNING *;
END; $$ LANGUAGE plpgsql;

-- Public version of the function)


-- (will receive the Hasura Session to figure out the user
CREATE OR REPLACE FUNCTION "create_badge_version"(
  "hasura_session" JSON,
  "badge_def_id" INTEGER,
  "is_deleted" BOOLEAN
)
RETURNS SETOF "badges_versions" AS $$
DECLARE
  tenant_id integer := (hasura_session ->> 'x-hasura-tenant-id')::integer;
BEGIN
  RETURN QUERY
  SELECT * FROM _create_badge_version(tenant_id, badge_def_id, (SELECT now() AT TIME ZONE 'UTC'), is_deleted);
END; $$ LANGUAGE plpgsql;