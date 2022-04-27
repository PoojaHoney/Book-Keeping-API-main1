-- Database: PostgreSQL

CREATE TABLE "gobook" (
  "id" bigserial PRIMARY KEY,
  "title" varchar NOT NULL,
  "author" varchar NOT NULL,
  "callnumber" bigint NOT NULL,
  "publisher" varchar NOT NULL
);

CREATE TABLE "goperson" (
  "id" bigserial PRIMARY KEY,
  "name" varchar NOT NULL,
  "email" varchar NOT NULL,
  "book" bigint NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "entriesbooks" (
  "id" bigserial PRIMARY KEY,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "title" varchar NOT NULL,
  "book" bigint NOT NULL
);

CREATE TABLE "entriespeople" (
  "id" bigserial PRIMARY KEY,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "name" varchar NOT NULL,
  "person_id" bigint NOT NULL
);

CREATE INDEX ON "gobook" ("title");

CREATE INDEX ON "goperson" ("name");

CREATE INDEX ON "entriesbooks" ("title");

CREATE INDEX ON "entriespeople" ("name");

ALTER TABLE "goperson" ADD FOREIGN KEY ("book") REFERENCES "gobook" ("id");

ALTER TABLE "entriesbooks" ADD FOREIGN KEY ("book") REFERENCES "gobook" ("id");

ALTER TABLE "entriespeople" ADD FOREIGN KEY ("person_id") REFERENCES "goperson" ("id");