# Create MongoDB Image
FROM mongo:5.0.25
ENV MONGO_INITDB_ROOT_PASSWORD abc123.
ENV MONGO_INITDB_ROOT_USERNAME mongo
COPY priv/docker-entrypoint-initdb.d/* /docker-entrypoint-initdb.d
EXPOSE 27017