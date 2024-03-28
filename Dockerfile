# docker run --name postgres-db -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
FROM postgres
ENV POSTGRES_PASSWORD abc123.
ENV POSTGRES_USER postgres
ENV POSTGRES_DB pomoroom_dev