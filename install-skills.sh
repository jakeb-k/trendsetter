#!/usr/bin/env bash

set -e

TMP_DIR=".tmp-skills"
DEST_DIR=".codex/skills"

echo "Creating directories..."
mkdir -p "$TMP_DIR"
mkdir -p "$DEST_DIR"

echo "Fetching expo-app-design skill..."
git clone --filter=blob:none --no-checkout https://github.com/expo/skills.git "$TMP_DIR/expo"
cd "$TMP_DIR/expo"

git sparse-checkout init --cone
git sparse-checkout set plugins/expo-app-design
git checkout main

cd ../..

mkdir -p "$DEST_DIR/expo-app-design"
cp -R "$TMP_DIR/expo/plugins/expo-app-design/"* "$DEST_DIR/expo-app-design/"

echo "Fetching react-native-skills..."
git clone --filter=blob:none --no-checkout https://github.com/vercel-labs/agent-skills.git "$TMP_DIR/vercel"
cd "$TMP_DIR/vercel"

git sparse-checkout init --cone
git sparse-checkout set skills/react-native-skills
git checkout main

cd ../..

mkdir -p "$DEST_DIR/react-native-skills"
cp -R "$TMP_DIR/vercel/skills/react-native-skills/"* "$DEST_DIR/react-native-skills/"

echo "Cleaning up..."
rm -rf "$TMP_DIR"

echo "Done. Skills installed into $DEST_DIR"