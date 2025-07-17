# Start the API server and the client in the background
Start-Process -FilePath "deno" -ArgumentList "run -A --unstable index.ts" -WorkingDirectory .\projlette-api
Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory .\projlette-app