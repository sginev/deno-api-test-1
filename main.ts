import { serve } from "https://deno.land/std/http/server.ts"
import { resolveQuery } from "./lib/data.ts";
import * as jwt from "./lib/auth.ts";

const { data } = await resolveQuery( new TextDecoder('utf8').decode( await Deno.readFile( "test.gql" ) ) )
console.log( data );

class ApiError extends Error { 
  constructor ( message:string, public status:number ) {
    super( message );
  }
}

const assertAuthTokenValid = async authHeader => {
  if ( ! authHeader )
    throw new ApiError( `Missing authentication token.\nPlease use /auth to obtain a valid token.`, 401 );
  const [type,token] = authHeader.split(' ') as [string,string];
  if ( type.toLowerCase() !== "bearer" )
    throw new ApiError( `Wrong authentication type`, 401 );
  if ( ! jwt.validate( token ) )
    throw new ApiError( `Invalid authentication token.\nPlease use /auth to obtain a valid token.`, 401 );
}

console.log("~ server is listening at 0.0.0.0:7999 ~")
for await (const req of serve("0.0.0.0:7999")) {
  try {
    if ( req.method === "GET" && req.url.endsWith("/auth") ) {
      req.respond({ body: jwt.make() + '\n' })
    } else
    if ( req.method === "POST" ) {
      assertAuthTokenValid( req.headers.get("Authorization") )
      const json = new TextDecoder().decode( await Deno.readAll(req.body) );
      const { query } = await JSON.parse( json );
      const result =  await resolveQuery( query );
      const response = JSON.stringify( result )
      const headers = new Headers();
      headers.append( "Content-type", "application/json" );
      req.respond({ body: response, headers })
    } else {
      throw new ApiError( "Invalid request method", 404 );
    }
  }
  catch ( e ) {
    req.respond({ body: e.message, status: e.status || 500 })
  }
}