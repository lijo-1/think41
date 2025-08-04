import supabase from "@/app/config/supabaseClient"

export async function GET() {
  const { data, error } = await supabase.from("customer_summary").select("*")

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: "Failed to fetch customers" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  return new Response(JSON.stringify({ customers: data }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
