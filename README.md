# The Quest Board

The Quest Board is a mobile app built with Expo and React Native. It also includes a Spring Boot API and a PostgreSQL database.

## What you need

Install these programs before starting:

1. Node.js
2. Docker Desktop
3. Git
4. Android Studio if you want to run the Android app

You can also use a physical Android device with USB debugging enabled.

## Get the project

Open a terminal and run:

```text
git clone https://github.com/CST438-P3-G3/the_quest_board.git
cd the_quest_board
```

Install the project packages:

```text
npm install
```

## Create the environment file

Create a file named `.env` in the project root. The project root is the folder that contains `package.json` and `compose.yml`.

Add the values provided by the project team:

```text
POSTGRES_DB=your_database_name
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_database_password
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
EXPO_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
JWT_SECRET_BASE64=your_base64_secret
EXPO_PUBLIC_API_URL=http://localhost:8080
```

Do not share the `.env` file. Do not commit it to GitHub.

The GitHub client ID is used by the app. The GitHub client secret is used only by the API.

## Start the database and API

Make sure Docker Desktop is open.

From the project root run:

```text
docker compose up --build
```

Keep this terminal open while using the app. The first startup can take several minutes.

The API runs at:

```text
http://localhost:8080
```

To check that the API is running open this address in a browser:

```text
http://localhost:8080/health
```

You should see:

```text
{"status":"ok"}
```

## Start the mobile app

Open a second terminal. Go to the project root if needed:

```text
cd the_quest_board
```

Start Expo:

```text
npm start
```

Use the Expo terminal menu to select an Android emulator or a connected Android device.

You can also start Android directly:

```text
npm run android
```

The Expo commands must be run from the project root. Do not run them from the `api` folder.

## Android API connection

When using the Android emulator the app usually needs this API address in `.env`:

```text
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

When using the web app use:

```text
EXPO_PUBLIC_API_URL=http://localhost:8080
```

When using a physical Android device replace `localhost` with the local network address of the computer running Docker.

## Start the web app

From the project root run:

```text
npm run web
```

The web app opens in the browser.

## Stop the API and database

In the terminal running Docker press Control and C. Then run:

```text
docker compose down
```

The database data is stored in a Docker volume so it remains available the next time the project starts.

## Useful checks

Run the type checker:

```text
npx tsc --noEmit
```

Run the Expo lint check:

```text
npm run lint
```

## Common problems

### Docker is not running

Open Docker Desktop and run `docker compose up --build` again.

### The app cannot reach the API

Check the value of `EXPO_PUBLIC_API_URL`. The Android emulator uses `10.0.2.2`. A physical device uses the computer local network address.

### GitHub sign in does not work

Check the GitHub client ID and secret in `.env`. Make sure the GitHub app has permission to read email addresses.

### The Android app does not open

Start an Android emulator in Android Studio or connect a physical Android device. Then run `npm run android` from the project root.
