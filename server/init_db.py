#!/usr/bin/env python3
"""
Initialize the database with required tables for the class schedule application.
"""

import sqlite3
import os

def init_database():
    # Database file path
    db_path = 'classes.db'
    
    # Remove existing database if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")
    
    # Create new database connection
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create schedule table
    cursor.execute('''
        CREATE TABLE schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            code TEXT NOT NULL,
            layman TEXT NOT NULL,
            semester TEXT NOT NULL,
            user_email TEXT NOT NULL,
            FOREIGN KEY (user_email) REFERENCES users (email)
        )
    ''')
    print("Created 'schedule' table")
    
    # Create users table
    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    print("Created 'users' table")
    
    # No sample data - users will create their own classes
    
    # Insert a test user
    import bcrypt
    test_password = bcrypt.hashpw("test".encode('utf-8'), bcrypt.gensalt())
    cursor.execute('''
        INSERT INTO users (first_name, last_name, email, password) 
        VALUES (?, ?, ?, ?)
    ''', ('Test', 'User', 'sasha@gmail.com', test_password))
    print("Inserted test user: sasha@gmail.com / test")
    
    # Commit changes and close
    conn.commit()
    conn.close()
    print(f"Database '{db_path}' initialized successfully!")

if __name__ == "__main__":
    init_database()
