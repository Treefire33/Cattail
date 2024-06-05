import os
import linecache

frameworked = ""
frameworkOrder = ["audio", "graphics", "cattail", "components"]
for file in frameworkOrder:
    for line in linecache.getlines(os.getcwd()+"\\src\\Cattail\\"+file+".ts"):
        if "import" in line:
            continue
        frameworked += line

frameworkFile = open(os.getcwd()+"\\src\\Framework\\cattail-framework.ts", "w")
frameworkFile.write(frameworked)

frameworkFile.close()

print("finished frameworkify")