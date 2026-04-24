#!/usr/bin/env bash
set -euo pipefail

if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "Copying google-services.json from EAS secret..."
  cp "$GOOGLE_SERVICES_JSON" android/app/google-services.json
fi
