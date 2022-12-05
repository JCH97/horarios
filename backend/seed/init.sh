psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'horarios'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE horarios"
