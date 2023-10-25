import { useContextSelector } from 'use-context-selector'
import * as Dialog from '@radix-ui/react-dialog'
import { Header } from '../../components/header/index'
import { Summary } from '../../components/summary'
import { TransactionsContext } from '../../contexts/transactionsContext'
import { dateFormatter, priceFormatter } from '../../utils/formatter'

import { SearchForm } from '../components/SearchForm'
import {
  PriceHighLigth,
  TransactionContainer,
  TransactionTable,
} from './styles'
import { NewTransactionButton } from '../../components/header/styles'
import { EditTransactionModal } from '../../components/editTransactionModal'

export function Transactions() {
  function test(id: number) {
    console.log(id)
  }
  const transactions = useContextSelector(TransactionsContext, (context) => {
    return context.transactions
  })
  const deleteTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.deleteTransaction
    },
  )
  return (
    <div>
      <Header />
      <Summary />
      <TransactionContainer>
        <SearchForm />
        <TransactionTable>
          <tbody>
            {transactions.map((transaction) => {
              return (
                <tr key={transaction.id}>
                  <td width="50%">{transaction.description}</td>
                  <td>
                    <PriceHighLigth variant={transaction.type}>
                      {transaction.type === 'outcome' && '- '}
                      {priceFormatter.format(transaction.price)}
                    </PriceHighLigth>
                  </td>
                  <td>{transaction.category}</td>
                  <td>
                    {dateFormatter.format(new Date(transaction.createdAt))}
                  </td>
                  <td>
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <NewTransactionButton>Edit</NewTransactionButton>
                      </Dialog.Trigger>
                      <EditTransactionModal {...transaction} />
                    </Dialog.Root>
                  </td>
                  <td>
                    <NewTransactionButton
                      onClick={() => deleteTransactions(transaction)}
                    >
                      Delete
                    </NewTransactionButton>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </TransactionTable>
      </TransactionContainer>
    </div>
  )
}
