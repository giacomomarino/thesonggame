-- migrate:up

create extension if not exists "uuid-ossp";

create table if not exists player (
    id uuid primary key default uuid_generate_v4(),
    name varchar,
    email varchar,
    img varchar,
    otherSongsGuessed integer,
    userSongsGuessed integer
);

create table if not exists song (
    id varchar primary key,
    name varchar,
    artist varchar,
    album varchar,
    img varchar,
    uri varchar
);

-- our data
create table if not exists games (
    gameId uuid primary key default uuid_generate_v4(),
    gamecode varchar unique not null,
    hostId uuid not null references player (id),
    songs varchar[],
    playerIds uuid[],
    currentSong varchar references song (id),
    songsPlayed varchar[],
    scores jsonb
);


-- migrate:down

drop table user;
drop table song;
drop table games;



