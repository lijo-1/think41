'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

export default function CustomerPage() {
  const [customers, setCustomers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customer')
        const json = await res.json()

        const withName = (json.customers || []).map((c) => ({
          ...c,
          name: `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim(),
        }))

        setCustomers(withName)
        setFiltered(withName)
      } catch (err) {
        console.error('Failed to load customers:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  useEffect(() => {
    const term = search.toLowerCase()
    const result = customers.filter((c) =>
      c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
    )
    setFiltered(result)
  }, [search, customers])

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
        </div>
      ) : (
        <>
          {/* 🧾 Customer Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="p-4 space-y-1">
                  <h2 className="text-lg font-semibold text-black">{customer.name}</h2>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  <p className="text-sm">Orders: {customer.order_count ?? 0}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 📊 Summary Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Order Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.order_count ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
