import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import api, { getErrorMessage } from '../api/axios'
import { getToday } from '../utils/format'

const TransactionDialog = ({ transaction, categories, onClose, onSaved }) => {
  const isEdit = Boolean(transaction)

  const [type, setType] = useState(transaction?.type || 'expense')
  const [categoryId, setCategoryId] = useState(transaction?.categoryId || '')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [date, setDate] = useState(transaction?.date || getToday())
  const [description, setDescription] = useState(transaction?.description || '')
  const [error, setError] = useState('')

  const filteredCategories = categories.filter((c) => c.type === type)

  const handleTypeChange = (e, newType) => {
    if (newType) {
      setType(newType)
      setCategoryId('')
    }
  }

  const handleSave = async () => {
    setError('')

    const numericAmount = parseFloat(amount.replace(',', '.'))

    if (!categoryId) {
      setError('Select a category')
      return
    }

    if (!numericAmount || numericAmount <= 0) {
      setError('Enter an amount greater than zero')
      return
    }

    const body = { type, categoryId, amount: numericAmount, date, description }

    try {
      if (isEdit) {
        await api.put(`/transactions/${transaction.id}`, body)
      } else {
        await api.post('/transactions', body)
      }
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{isEdit ? 'Edit transaction' : 'New transaction'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}
        <ToggleButtonGroup
          value={type}
          exclusive
          fullWidth
          onChange={handleTypeChange}
          sx={{ mt: 1 }}
        >
          <ToggleButton value="expense">Expense</ToggleButton>
          <ToggleButton value="income">Income</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          select
          label="Category"
          fullWidth
          margin="normal"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {filteredCategories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransactionDialog
