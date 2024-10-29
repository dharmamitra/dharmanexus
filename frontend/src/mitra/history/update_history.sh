#!/bin/bash

OUTPUT_DIR="src/mitra/history"
DELETED_FILE="${OUTPUT_DIR}/deleted.txt"
ADDED_FILE="${OUTPUT_DIR}/added.txt"
ADJUSTED_FILE="${OUTPUT_DIR}/adjusted.txt"
TEMP_FILE="${OUTPUT_DIR}/temp.txt"

# List staged or changed files excluding src/mitra/
git status --porcelain | grep -v "^??" | grep -P -v "src/mitra/" >"${TEMP_FILE}"
grep -P "^\s?D" "${TEMP_FILE}" | sed -r 's/^\s?D //' >>"${DELETED_FILE}"
grep -P "^\s?A" "${TEMP_FILE}" | sed -r 's/^\s?A //' >>"${ADDED_FILE}"
grep -P "^\s?M" "${TEMP_FILE}" | sed -r 's/^\s?M //' >>"${ADJUSTED_FILE}"
sort -u "${DELETED_FILE}" -o "${DELETED_FILE}"
sort -u "${ADDED_FILE}" -o "${ADDED_FILE}"
sort -u "${ADJUSTED_FILE}" -o "${ADJUSTED_FILE}"
