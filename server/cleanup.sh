#!/bin/bash
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
find . -type d -name "__pycache__" -exec rm -r {} +
if [ -f db.sqlite3 ]; then
    rm db.sqlite3
fi
echo "Migration and pycache files removed."