import * as Dialog from '@radix-ui/react-dialog'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import {
  CloseButton,
  Content,
  Overlay,
  TransactionType,
  TransactionTypeButton,
} from './styles'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { TransactionsContext } from '../../contexts/transactionsContext'
import { useContextSelector } from 'use-context-selector'

const newTransactionFormSchema = z.object({
  id: z.number(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

export function EditTransactionModal(transaction: Transaction) {
  const editTransaction = useContextSelector(TransactionsContext, (context) => {
    return context.editTransaction
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransactionFormInputs>({
    defaultValues: {
      id: transaction.id,
      description: transaction.description,
      type: transaction.type,
      price: transaction.price,
      category: transaction.category,
    },
    resolver: zodResolver(newTransactionFormSchema),
  })

  async function handleEditNewTransaction(data: NewTransactionFormInputs) {
    const { id, description, price, category, type } = data

    await editTransaction({
      id,
      description,
      price,
      category,
      type,
    })

    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova Transação</Dialog.Title>
        <CloseButton>
          <X size={24} />
        </CloseButton>
        <form onSubmit={handleSubmit(handleEditNewTransaction)}>
          <input
            type="text"
            placeholder="Descrição"
            required
            {...register('description')}
          />
          <input
            type="number"
            placeholder="Preço"
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Categoria"
            required
            {...register('category')}
          />
          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <>
                  <TransactionType
                    onValueChange={field.onChange}
                    value={transaction.type}
                  >
                    <TransactionTypeButton variant="income" value="income">
                      <ArrowCircleUp size={24} />
                      Entrada
                    </TransactionTypeButton>
                  </TransactionType>
                  <TransactionType
                    onValueChange={field.onChange}
                    value={transaction.type}
                  >
                    <TransactionTypeButton variant="outcome" value="outcome">
                      <ArrowCircleDown size={24} />
                      Saida
                    </TransactionTypeButton>
                  </TransactionType>
                </>
              )
            }}
          />
          <button type="submit" disabled={isSubmitting}>
            Edit
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
