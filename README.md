# The Quest Board

The Quest Board is a mobile app built with Expo and React Native. The API is hosted on Render and the database is hosted on Neon.

The normal setup does not require Docker. Docker is only needed for the optional local database and API setup near the bottom of this guide.

## What you need

Install these programs before starting:

1. Git
2. Node.js
3. Android Studio if you want to run Android locally

You can also use a physical Android device with USB debugging enabled.

## Get the project

Clone the repository and enter the project folder:

```text
git clone --branch Carlos/User_API_SetUp --single-branch https://github.com/CST438-P3-G3/the_quest_board.git
cd the_quest_board
```

Install the JavaScript packages:

```text
npm ci
```

If PowerShell reports a permission error for npm use:

```powershell
npm.cmd ci
```

Run Expo commands from the project root.

## Hosted setup

Create a file named `.env` in the project root. This is the folder that contains `package.json` and `compose.yml`.

For the hosted setup only add the public app values:

```text
EXPO_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
EXPO_PUBLIC_WEB_API_URL=https://quest-board-api-dyln.onrender.com
EXPO_PUBLIC_NATIVE_API_URL=https://quest-board-api-dyln.onrender.com
```

The GitHub client ID is safe to use in the app. Never put the GitHub client secret in the Expo app.

Never share `.env` and never commit it to GitHub.

## Run the web app with the hosted API

From the project root run:

```text
npx expo start --web
```

Open the address shown by Expo.

## Run Android with the hosted API

Start an Android emulator in Android Studio. Then run:

```text
npx expo run:android
```

For a physical Android device connect the device with USB debugging enabled.

The Android app uses this callback:

```text
project3://auth/callback
```

The native app must be built after the `project3` scheme is added. Expo Go may not return to this project after GitHub sign in.

## GitHub sign in

The GitHub OAuth callback must match the platform being tested.

For web testing use:

```text
http://localhost:8081/auth/callback
```

For a native Android build use:

```text
project3://auth/callback
```

After signing in confirm that the app returns from GitHub and shows the signed in user.

## Test the hosted API

The hosted API is available at:

```text
https://quest-board-api-dyln.onrender.com
```

Test the health endpoint with PowerShell:

```powershell
Invoke-RestMethod https://quest-board-api-dyln.onrender.com/health
```

The result should contain:

```text
status
------
ok
```

The Render service uses the `Carlos/User_API_SetUp` branch for testing until the changes are merged into `main`.

## Optional local database and API setup

Docker is only needed for this section. Open Docker Desktop before starting.

Create or update the root `.env` file with these local values:

```text
POSTGRES_DB=your_database_name
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_database_password
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
EXPO_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
JWT_SECRET_BASE64=your_base64_secret
EXPO_PUBLIC_WEB_API_URL=http://localhost:8080
EXPO_PUBLIC_NATIVE_API_URL=http://10.0.2.2:8080
```

From the project root run:

```text
docker compose up --build
```

The local API runs at:

```text
http://localhost:8080
```

Test the local API with PowerShell:

```powershell
Invoke-RestMethod http://localhost:8080/health
```

The Android emulator uses `http://10.0.2.2:8080` to reach the API on the computer.

For a physical Android device replace that value with the local network address of the computer running Docker. The computer and phone must be on the same network.

When finished stop the local services:

```text
docker compose down
```

The local database data stays in the Docker volume for the next local run.

## Useful checks

Run the TypeScript check from the project root:

```text
npx tsc --noEmit
```

Run the Expo lint check:

```text
npx expo lint
```

Run the backend test command from the API folder:

```text
cd api
./gradlew test --no-daemon
```

On Windows PowerShell use:

```powershell
cd api
.\gradlew.bat test --no-daemon
```

## Common problems

### Android cannot reach the API

Use the Render URL for hosted mode. Use `http://10.0.2.2:8080` for an Android emulator with the local API.

### GitHub returns to a redirect page

Confirm that the callback in the GitHub OAuth app matches the platform. Confirm that the Android app was rebuilt after adding the `project3` scheme.

### Render cannot connect to Neon

Confirm that the Render datasource URL starts with `jdbc:postgresql://`. Keep the Neon username and password in their own Render variables. Do not use the full `postgresql://username:password@host` string as the JDBC URL.

### Docker cannot be reached

Open Docker Desktop and confirm that the containers are running. Docker is only required for the optional local setup.
