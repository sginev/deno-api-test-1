import nanoid from "https://deno.land/x/nanoid/mod.ts"
import { faker } from "https://raw.githubusercontent.com/jackfiszr/deno-faker/master/locale/de.ts";
import * as graphql from "https://cdn.pika.dev/graphql/^15.0.0";

const schemaString = new TextDecoder('utf8').decode( await Deno.readFile( "./lib/data.schema.graphql" ) );
const schema = graphql.buildSchema( schemaString );

const gen = {
  person : () => ({
    id: nanoid(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    address: faker.address.streetAddress(),
    // motto: faker.company.catchPhrase(),
    motto: faker.hacker.phrase(),
    avatar: faker.internet.avatar(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    job: faker.name.jobTitle(),
    phone: faker.phone.phoneNumber(),
  })
}

const resolvers = {
    persons: () => new Array(10).fill(0).map( gen.person ),
    person: ({id,username}) => ({ ...gen.person(), username }),
}

export const resolveQuery = (q:string) => graphql.graphql( schema, q, resolvers ) 
  

