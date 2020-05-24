const input = await Deno.readFile( Deno.args[0] || "test.gql" );
const query = new TextDecoder('utf8').decode( input );
const graphql = JSON.stringify({ query, variables: {} })
const requestOptions = {
  method: 'POST',
  headers: { "Content-Type": "application/json" },
  body: graphql,
  redirect: 'follow' as 'follow'
};
const r = await fetch("http://localhost:7999/", requestOptions);
console.log( await r.text() );