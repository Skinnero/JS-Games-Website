FROM postgres:latest

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB jsgame

COPY sql/dump.sql /docker-entrypoint-initdb.d/