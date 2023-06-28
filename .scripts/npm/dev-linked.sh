#!/bin/sh

# NPM Bin Shell Script: Dev Linked
#
# Watches hh-util and gh-shared for trigger updates and installs accordingly
# Then calls ghui-dev to do remainder of dev build work.

npx hh-util_clean && \
npx concurrently \
  --names 'Link hh-util,Link gh-shared,Dev' \
  'npx hh-util_triggerWatch --no-save' \
  'npx ghsvc-util_triggerWatch' \
  "npx ghui-dev $*"
