//db_processor.js
import session from 'express-session';            // Express session middleware
import SQLiteStoreFactory from 'connect-sqlite3'; // SQLite session store factory
import Database from 'better-sqlite3';            // SQLite driver with optional SQLCipher encryption

