# Krima Server

# Populate Data

**Any reference to a real person is entirely coincidental**

```
(person:Person {forename: firstName, surname: lastName, city: city, country: country, latitude: latitude, longitude: longitude } *20)-[:FATHER_OF *n..1]->(person)
(person:Person {forename: firstName, surname: lastName, city: city, country: country, latitude: latitude, longitude: longitude } *20)-[:MOTHER_OF *n..1]->(person)

(person)-[:OFFENDER *n..n]->(crime:Crime {date: iso8601, desc: realText, type: {randomElement:["THEFT", "RAPE", "MURDER", "ATTEMPTED MURDER", "FRAUD", "ARSON", "BRIBERY", "EXTORTION"] } } *15)
(person)-[:WITNESS *n..n]->(crime:Crime {date: iso8601, desc: realText, type: {randomElement:["THEFT", "RAPE", "MURDER", "ATTEMPTED MURDER", "FRAUD", "ARSON", "BRIBERY", "EXTORTION"] } } *15)
(person)-[:SUSPECT *n..n]->(crime:Crime {date: iso8601, desc: realText, type: {randomElement:["THEFT", "RAPE", "MURDER", "ATTEMPTED MURDER", "FRAUD", "ARSON", "BRIBERY", "EXTORTION"] } } *15)
(person)-[:REPORTER *n..n]->(crime:Crime {date: iso8601, desc: realText, type: {randomElement:["THEFT", "RAPE", "MURDER", "ATTEMPTED MURDER", "FRAUD", "ARSON", "BRIBERY", "EXTORTION"] } } *15)
```

```
match (n) set n.id = ID(n)
```

# Installation

## Run Neo4J Instance

```
docker run \
 --rm \
 --name neo4j \
 --env=NEO4J_AUTH=none \
 --env=NEO4J_dbms_shell_enabled=true \
 --publish=7474:7474 \
 --publish=7687:7687 \
 --volume=$PWD/data:/data \
 --volume=$PWD/import:/import \
 --volume=$PWD/plugins:/plugins \
 neo4j
```

## Import Data

```
docker exec neo4j \
 sh -c "cat /import/setup.cql | cypher-shell > /dev/null"
```
