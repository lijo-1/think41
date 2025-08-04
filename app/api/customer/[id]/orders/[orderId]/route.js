import supabase from "@/app/config/supabaseClient"

export async function GET(request, { params }) {
  const { id, orderId } = params

  if (!id || isNaN(id) || !orderId || isNaN(orderId)) {
    return new Response(JSON.stringify({ error: 'Invalid customer or order ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  // Confirm customer exists
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

  // Get specific order for the customer
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', id)
    .eq('order_id', orderId)
    .single()

  if (orderError || !order) {
    return new Response(JSON.stringify({ error: 'Order not found for this customer' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  return new Response(JSON.stringify({ order }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
