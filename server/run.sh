#!/bin/bash

sudo apt install python3.8-venv -y

python3 -m venv venv

source venv/bin/activate

pip install django pillow djangorestframework djangorestframework-simplejwt django-environ django-cors-headers
pip install -r requirements.txt

./cleanup.sh
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver