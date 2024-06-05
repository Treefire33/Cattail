@echo off
echo frameworkify
call python frameworkifyCattail.py
echo build TypeScript
call tsc -p tsconfig.json
echo minify Cattail
call uglifyjs-folder ./dist/Cattail/Framework -o ./cattail.min.js