export async function GET(request: Request) {
  const res = JSON.stringify({ text: 'Hello API World' });
  return new Response(res);
}
