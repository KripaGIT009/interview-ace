#!/bin/bash
set -e

# Create multiple databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE auth_db;
    CREATE DATABASE questions_db;
    CREATE DATABASE interviews_db;
    CREATE DATABASE users_db;
    CREATE DATABASE payments_db;
    
    GRANT ALL PRIVILEGES ON DATABASE auth_db TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE questions_db TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE interviews_db TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE users_db TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE payments_db TO $POSTGRES_USER;
EOSQL

echo "Databases created successfully"
