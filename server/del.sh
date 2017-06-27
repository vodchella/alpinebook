#!/bin/bash

find pkg -type f -regex ".*\.\(pyc\|log\)" -exec rm -rf {} \;
find pkg -type d -name "__pycache__"  -exec rmdir {} \; 2> /dev/null
rm -rf *.log