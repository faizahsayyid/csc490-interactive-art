# csc490-interactive-art

## Web App

Make sure you have node and npm installed: https://nodejs.org/en (download LTS).

Run:

```sh
cd client
```

```sh
npm install
```

```sh
npm run dev
```

To see the web app running, go to http://localhost:5173/

## API

Make sure you have python installed: https://www.python.org/downloads/ (download LTS)

To run locally, globally install python venv

```sh
sudo apt install python3.8-venv -y
```

Then, create virtual environment in the server folder:

```sh
cd server
```

```sh
python3 -m venv venv
```

Then to initialize your environment, run:

```sh
source venv/bin/activate
```

```sh
pip install -r requirements.txt
```

```sh
python3 manage.py makemigrations
```

```sh
python3 manage.py migrate
```

Now, you can start the app:

```sh
python3 manage.py runserver
```
