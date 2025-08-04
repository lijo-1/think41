import supabase from "@/app/config/supabaseClient"

export async function GET(request, { params }) {
  const { id } = params

  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid customer ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  // Validate customer exists
  const { data: customer, error: customerError } = await supabase
    .from('users')
    .select('id')
    .eq('id', id)
    .single()

  if (customerError || !customer) {
    return new Response(JSON.stringify({ error: 'Customer not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  // Get orders
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', id)

  if (ordersError) {
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  return new Response(JSON.stringify({ orders }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
