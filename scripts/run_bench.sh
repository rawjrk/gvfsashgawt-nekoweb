# Run website build
yarn build >> /dev/null

# Copy files to build folder
cp -r bench build

# Fix files location for server routing
mv build/bench/index.html build/bench.html

# Website is ready
echo 'Open webpage in your browser: http://localhost:4200/bench'

# Start dev server
yarn start >> /dev/null
