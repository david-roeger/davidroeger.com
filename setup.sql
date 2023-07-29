CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE auth_user (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    role user_role NOT NULL
);

CREATE TABLE user_key (
    id TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id),
    hashed_password TEXT
);

CREATE TABLE user_session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id),
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL
);

create table dreams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by TEXT REFERENCES auth_user(id) not null,
  text text not null,
  emoji text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON dreams
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();