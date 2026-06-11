#!/bin/bash
echo "Waiting for SQL Server to start..."

for i in $(seq 1 30); do
  /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${SQL_PASSWORD}" -C -Q "SELECT 1" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "SQL Server is ready!"
    break
  fi
  echo "Attempt $i: SQL Server not ready yet, waiting 5s..."
  sleep 5
done

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${SQL_PASSWORD}" -C \
  -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'API_SHOP') CREATE DATABASE [API_SHOP]"

/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${SQL_PASSWORD}" -C -d API_SHOP -i /init/init.sql
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${SQL_PASSWORD}" -C -d API_SHOP -i /init/data.sql

echo "Database initialized!"
