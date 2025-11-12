//written with help from chat


## Overview

- Server: Flask (routes under `/schedule`), stores data in `server/classes.db` (SQLite).
- Client: Static HTML/CSS/JS in `client/`.

## Quick start

1. Create and activate a Python virtual environment

2. Install Python deps:

requirements.txt

3. Start the server:

```bash
cd server
python3 app.py
```

The server will run on `http://localhost:5000`.

4. Start the client (simple static server recommended):

```bash
cd client
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## API

- GET /schedule — List all classes (returns JSON array)
- POST /schedule — Add class (form-encoded: `type`, `code`, `layman`, `semester`)
- PUT /schedule/<id> — Update class (form-encoded)
- DELETE /schedule/<id> — Delete class

## Database

- File: `server/classes.db`
- Table: `schedule` (id, name, type, code, layman, semester)

You can view the DB with `sqlite3 server/classes.db "SELECT * FROM schedule;"`.