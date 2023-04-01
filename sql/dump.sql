-- Drops constraint if exists
ALTER TABLE IF EXISTS ONLY public.scoreboard DROP CONSTRAINT IF EXISTS pk_scoreboard_id;

-- Drops table if exists then creates table
DROP TABLE IF EXISTS public.scoreboard;
CREATE TABLE scoreboard (
    id serial NOT NULL,
    user_name text NOT NULL,
    game text NOT NULL,
    score text NOT NULL
);

-- Sets constraint with primary key to scoreboard id
ALTER TABLE ONLY scoreboard ADD CONSTRAINT pk_scoreboard_id PRIMARY KEY (id);

-- Sample data for tests
INSERT INTO scoreboard(user_name, game, score) VALUES ('Kacper','snake',1);
INSERT INTO scoreboard(user_name, game, score) VALUES ('Kacper','reaction_time',0.444);