# Run website build
yarn build > $null

# Copy files to build folder
Copy-Item -Recurse -Force bench build

# Fix files location for server routing
Move-Item -Force build/bench/index.html build/bench.html

# Website is ready
Write-Host "Open webpage in your browser: http://localhost:4200/bench"

# Start dev server + open page in browser
yarn start > $null
