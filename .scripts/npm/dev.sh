#!/bin/sh

npx hh-util_nodemon --exec "\
    npx hh-util_lint && \
    npx hh-builder \
"
