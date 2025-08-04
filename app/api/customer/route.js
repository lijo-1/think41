import supabase from "@/app/config/supabaseClient"

export async function GET(request) {
  const { data, error } = await supabase.from('users').select('*')

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch customers' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  return new Response(JSON.stringify({ customers: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
