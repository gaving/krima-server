import { makeExecutableSchema } from "graphql-tools";
import { v1 as neo4j } from "neo4j-driver";
import { neo4jgraphql } from "neo4j-graphql-js";

const typeDefs = `
type Crime {
    date: String
    desc: String
    type: String
}

type Person {
    id: Int
    forename: String
    surname: String
    city: String
    country: String
    latitude: Float
    longitude: Float
    children: [Person]  @cypher(statement: "MATCH (this)-[:MOTHER_OF|:FATHER_OF]->(p:Person) RETURN p")
    offended: [Crime] @relation(name: "OFFENDER", direction: "OUT")
    witnessed: [Crime] @relation(name: "WITNESS", direction: "OUT")
    reported: [Crime] @relation(name: "REPORTER", direction: "OUT")
    suspected: [Crime] @relation(name: "SUSPECT", direction: "OUT")
    accomplices: [Person]  @cypher(statement: "MATCH (this)-[:OFFENDER]->(c:Crime)<-[:OFFENDER]-(p:Person) RETURN DISTINCT(p)")
    totalChildren: Int  @cypher(statement: "MATCH (this)-[:MOTHER_OF|:FATHER_OF]->(p:Person) RETURN COUNT(p)")
    totalAccomplices: Int  @cypher(statement: "MATCH (this)-[:OFFENDER]->(c:Crime)<-[:OFFENDER]-(p:Person) RETURN COUNT(DISTINCT p)")
    totalOffended: Int  @cypher(statement: "MATCH (this)-[:OFFENDER]->(c:Crime) RETURN COUNT(c)")
    totalWitnessed: Int  @cypher(statement: "MATCH (this)-[:WITNESS]->(c:Crime) RETURN COUNT(c)")
    totalReported: Int  @cypher(statement: "MATCH (this)-[:REPORTER]->(c:Crime) RETURN COUNT(c)")
    totalSuspected: Int  @cypher(statement: "MATCH (this)-[:SUSPECT]->(c:Crime) RETURN COUNT(c)")
    ids: Int  @cypher(statement: "MATCH (this)-[:SUSPECT]->(c:Crime) RETURN COUNT(c)")
}

type Query {
  findPerson(forename: String, surname: String): [Person]
  findPersonById(id: Int!): Person
}
`;

const resolvers = {
  Query: {
    findPerson(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    findPersonById(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    }
  }
};

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

let driver;

export function context(headers, secrets) {
  if (!driver) {
    driver = neo4j.driver(
      secrets.NEO4J_URI || "bolt://localhost:7687",
      neo4j.auth.basic(
        secrets.NEO4J_USER || "neo4j",
        secrets.NEO4J_PASSWORD || "letmein"
      )
    );
  }
  return { driver };
}
