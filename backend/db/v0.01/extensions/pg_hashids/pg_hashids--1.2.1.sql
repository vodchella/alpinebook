-- use CREATE EXTENSION
\echo Use "CREATE EXTENSION pg_hashids" to load this file. \quit

CREATE SCHEMA hashids;

-- v1
CREATE OR REPLACE FUNCTION hashids.hash_encode(BIGINT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.hash_encode(BIGINT, TEXT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.hash_encode(BIGINT, TEXT, INT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.hash_decode(TEXT, TEXT, INT) RETURNS INT
  AS 'pg_hashids', 'id_decode_once' LANGUAGE C;

-- v1.2.1
CREATE OR REPLACE FUNCTION hashids.id_encode(BIGINT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_encode(BIGINT, TEXT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_encode(BIGINT, TEXT, INT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_encode(BIGINT, TEXT, INT, TEXT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode' LANGUAGE C;

CREATE OR REPLACE FUNCTION hashids.id_encode(BIGINT[]) RETURNS TEXT
  AS 'pg_hashids', 'id_encode_array' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_encode(BIGINT[], TEXT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode_array' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_encode(BIGINT[], TEXT, INT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode_array' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_encode(BIGINT[], TEXT, INT, TEXT) RETURNS TEXT
  AS 'pg_hashids', 'id_encode_array' LANGUAGE C;

CREATE OR REPLACE FUNCTION hashids.id_decode(TEXT) RETURNS BIGINT[]
  AS 'pg_hashids', 'id_decode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_decode(TEXT, TEXT) RETURNS BIGINT[]
  AS 'pg_hashids', 'id_decode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_decode(TEXT, TEXT, INT) RETURNS BIGINT[]
  AS 'pg_hashids', 'id_decode' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_decode(TEXT, TEXT, INT, TEXT) RETURNS BIGINT[]
  AS 'pg_hashids', 'id_decode' LANGUAGE C;

CREATE OR REPLACE FUNCTION hashids.id_decode_once(TEXT) RETURNS BIGINT
  AS 'pg_hashids', 'id_decode_once' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_decode_once(TEXT, TEXT) RETURNS BIGINT
  AS 'pg_hashids', 'id_decode_once' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_decode_once(TEXT, TEXT, INT) RETURNS BIGINT
  AS 'pg_hashids', 'id_decode_once' LANGUAGE C;
CREATE OR REPLACE FUNCTION hashids.id_decode_once(TEXT, TEXT, INT, TEXT) RETURNS BIGINT
  AS 'pg_hashids', 'id_decode_once' LANGUAGE C;