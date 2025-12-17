#!/bin/bash

# Export the token required by docker-compose.yml
# Replace "TOKEN AQUI" with your actual GitHub Access Token
export GITHUB_ACCESS_TOKEN="TOKEN AQUI"

# Run docker compose in detached mode
docker compose up -d

# Clear the history for security
history -c
history -w


