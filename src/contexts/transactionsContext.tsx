import { ReactNode, useEffect, useState, useCallback } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface editTransactionInput {
  id: number
  description?: string
  price?: number
  category?: string
  type?: 'income' | 'outcome'
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
  editTransaction: (data: editTransactionInput) => Promise<void>
  deleteTransaction: (transcation: Transaction) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAT',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, price, category, type } = data
      const response = await api.post('transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      })
      setTransactions((state) => [response.data, ...state])
    },
    [],
  )

  const editTransaction = useCallback(async (data: editTransactionInput) => {
    const { id, description, price, category, type } = data
    const response = await api.put(`transactions/${id}`, {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    })
    setTransactions((state) => state.filter((t) => t.id !== data.id))
    setTransactions((state) => [response.data, ...state])
  }, [])

  const deleteTransaction = useCallback(async (transaction: Transaction) => {
    await api.delete(`transactions/${transaction.id}`)
    setTransactions((state) => state.filter((t) => t !== transaction))
  }, [])
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
