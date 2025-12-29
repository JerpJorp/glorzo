#!/bin/bash
export API_URL="${API_URL:-http://localhost:3000}"
envsubst < src/assets/env.template.js > src/assets/env.js
npm start
