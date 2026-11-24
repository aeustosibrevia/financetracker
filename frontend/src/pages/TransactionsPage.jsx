import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import api, { getErrorMessage } from '../api/axios'
import TransactionDialog from '../components/TransactionDialog'
import { formatAmount, getCurrentMonth } from '../utils/format'

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ flex: 1 }}>
    <CardContent>
      <Typography color="text.secondary">{title}</Typography>
      <Typography variant="h5" color={color}>
        {formatAmount(value)}
      </Typography>
    </CardContent>
  </Card>
)

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, expensesByCategory: [] })
  const [month, setMonth] = useState(getCurrentMonth())
  const [type, setType] = useState('')
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const loadData = useCallback(async () => {
    try {
      const params = { month: month || undefined, type: type || undefined }

      const [transactionsRes, summaryRes, categoriesRes] = await Promise.all([
        api.get('/transactions', { params }),
        api.get('/transactions/summary', { params: { month: month || undefined } }),
        api.get('/categories'),
      ])

      setTransactions(transactionsRes.data)
      setSummary(summaryRes.data)
      setCategories(categoriesRes.data)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }, [month, type])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (transaction) => {
    setEditing(transaction)
    setDialogOpen(true)
  }

  const handleSaved = () => {
    setDialogOpen(false)
    loadData()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return

    try {
      await api.delete(`/transactions/${id}`)
      loadData()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <SummaryCard title="Income" value={summary.income} color="success.main" />
        <SummaryCard title="Expenses" value={summary.expense} color="error.main" />
        <SummaryCard title="Balance" value={summary.balance} />
      </Box>

      {summary.expensesByCategory.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Expenses by category
          </Typography>
          {summary.expensesByCategory.map((item) => (
            <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>{item.name}</Typography>
              <Typography>{formatAmount(item.total)}</Typography>
            </Box>
          ))}
        </Paper>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          label="Month"
          type="month"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <TextField
          select
          label="Type"
          size="small"
          sx={{ minWidth: 140 }}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expenses</MenuItem>
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.categoryName}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: t.type === 'income' ? 'success.main' : 'error.main' }}
                >
                  {t.type === 'income' ? '+' : '−'}
                  {formatAmount(t.amount)}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(t)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(t.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No transactions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {dialogOpen && (
        <TransactionDialog
          transaction={editing}
          categories={categories}
          onClose={() => setDialogOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

export default TransactionsPage
