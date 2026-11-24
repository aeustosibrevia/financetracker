import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import api, { getErrorMessage } from '../api/axios'

const CategoryDialog = ({ category, onClose, onSaved }) => {
  const isEdit = Boolean(category)

  const [name, setName] = useState(category?.name || '')
  const [type, setType] = useState(category?.type || 'expense')
  const [error, setError] = useState('')

  const handleSave = async () => {
    setError('')

    try {
      if (isEdit) {
        await api.put(`/categories/${category.id}`, { name })
      } else {
        await api.post('/categories', { name, type })
      }
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{isEdit ? 'Edit category' : 'New category'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          select
          label="Type"
          fullWidth
          margin="normal"
          disabled={isEdit}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="expense">Expense</MenuItem>
          <MenuItem value="income">Income</MenuItem>
        </TextField>
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

const CategoryList = ({ title, categories, onEdit, onDelete }) => (
  <Paper sx={{ p: 2, flex: 1 }}>
    <Typography variant="h6">{title}</Typography>
    <List>
      {categories.map((c) => (
        <ListItem
          key={c.id}
          secondaryAction={
            <>
              <IconButton onClick={() => onEdit(c)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(c.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <ListItemText primary={c.name} />
        </ListItem>
      ))}
    </List>
  </Paper>
)

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (category) => {
    setEditing(category)
    setDialogOpen(true)
  }

  const handleSaved = () => {
    setDialogOpen(false)
    loadCategories()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return

    try {
      await api.delete(`/categories/${id}`)
      setError('')
      loadCategories()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <CategoryList
          title="Expenses"
          categories={categories.filter((c) => c.type === 'expense')}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
        <CategoryList
          title="Income"
          categories={categories.filter((c) => c.type === 'income')}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </Box>

      {dialogOpen && (
        <CategoryDialog
          category={editing}
          onClose={() => setDialogOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

export default CategoriesPage
