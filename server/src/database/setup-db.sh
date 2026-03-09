#!/bin/bash

# Database setup script for FilmHub Booking System
# This script creates the database and runs migrations

echo "Setting up database for FilmHub Booking System..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Warning: .env file not found. Using default values."
    export DB_HOST=localhost
    export DB_PORT=5432
    export DB_NAME=booking_movie_ticket
    export DB_USER=postgres
    export DB_PASSWORD=postgres
fi

# Check if database exists
DB_EXISTS=$(psql -U $DB_USER -h $DB_HOST -p $DB_PORT -lqt | cut -d \| -f 1 | grep -w $DB_NAME | wc -l)

if [ $DB_EXISTS -eq 0 ]; then
    echo "Creating database $DB_NAME..."
    createdb -U $DB_USER -h $DB_HOST -p $DB_PORT $DB_NAME
    if [ $? -eq 0 ]; then
        echo "Database created successfully!"
    else
        echo "Error: Failed to create database. Please check your PostgreSQL connection."
        exit 1
    fi
else
    echo "Database $DB_NAME already exists."
fi

# Run migration
echo "Running database migrations..."
yarn migrate

if [ $? -eq 0 ]; then
    echo "Database setup completed successfully!"
else
    echo "Error: Migration failed."
    exit 1
fi
