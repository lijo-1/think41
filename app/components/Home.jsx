'use client'

import { useEffect, useState } from 'react'
import supabase from '../config/supabaseClient'

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const [{ data: usersData, error: usersError }, { data: ordersData, error: ordersError }] =
        await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('orders').select('*'),
        ])

      if (usersError || ordersError) {
        console.error(usersError || ordersError)
        setError('Failed to fetch data')
      } else {
        setUsers(usersData || [])
        setOrders(ordersData || [])

        // ✅ Correct place to log data
        console.log('Users:', usersData)
        console.log('Orders:', ordersData)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="p-4 space-y-6">
      {/* ✅ Optional visual output if needed */}
      <h2 className="text-xl font-bold">Users</h2>
      <ul className="list-disc pl-6">
        {users.map((user) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>

      <h2 className="text-xl font-bold">Orders</h2>
      <ul className="list-disc pl-6">
        {orders.map((order) => (
          <li key={order.id}>
            Order #{order.id} — User ID: {order.user_id} — Total: ${order.total}
          </li>
        ))}
      </ul>
    </div>
  )
}
