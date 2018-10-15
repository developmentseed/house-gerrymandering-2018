# Brennan Gerrymandering Map

### Processing national analysis

```(bash)
# format the national analysis CSV
cat bin/in/national-swing-vote-analysis.csv | ./bin/scripts/process-national.js > ./national-analysis.csv

# output as JSON
./node_modules/.bin/csv2json -o app/scripts/static/national-analysis.json ./national-analysis.csv
```

### Processing state-level analysis

```(bash)
./bin/scripts/process-states.js
```
