import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { resolveQuery } from "./lib/data.ts";
import { load } from "https://deno.land/x/denv/mod.ts";

Deno.stat( ".env" ).then ( () =>
  load(".env").catch( e => console.warn( `Failed loading '.env' file.`, e ) )
).catch()

const { data } = await resolveQuery( new TextDecoder('utf8').decode( await Deno.readFile( "test.gql" ) ) )
console.log( data );

const app = new Application();
const router = new Router();

router.post( `/`, async ({ request, response }) => {
  const body = await request.body();
  const query = body.value.query;
  try {
    const result = await resolveQuery( query );
    //console.log({ query, result });
    response.status = 200;
    response.body = result;
  } catch ( error ) {
    response.status = 500;
    response.body = { errors: [ error ], outsideGraphQL: true }
  }
} )

app.use( router.routes() );
app.use( router.allowedMethods() );

await app.listen(`0.0.0.0:7999`);