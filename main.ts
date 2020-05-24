import { Application } from "https://deno.land/x/abc/mod.ts";
import { resolveQuery } from "./lib/data.ts";

const { data } = await resolveQuery( new TextDecoder('utf8').decode( await Deno.readFile( "test.gql" ) ) )
console.log( data );

const app = new Application();

app.post( `/`, async c => {
  const { query } = await c.body<{query:string}>();
  return await resolveQuery( query );
} )

app.start( { port:7999 } );