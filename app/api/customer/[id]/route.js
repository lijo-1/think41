import supabase from "@/app/config/supabaseClient"

export async function GET(request, { params }) {
  const id = params.id

  if (!id || isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid customer ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  const { data: customer, error: customerError } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (customerError || !customer) {
    return new Response(JSON.stringify({ error: 'Customer not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  const { count: orderCount, error: orderError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id)

  if (orderError) {
    return new Response(JSON.stringify({ error: 'Failed to count orders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  return new Response(JSON.stringify({ customer, orderCount }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
