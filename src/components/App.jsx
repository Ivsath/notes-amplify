import { useEffect, useReducer } from 'react'
import { API } from 'aws-amplify'
import { List, Input, Button } from 'antd'
import { v4 as uuid } from 'uuid'

import { listNotes } from '../graphql/queries'
import { createNote as CreateNote } from '../graphql/mutations'

const CLIENT_ID = uuid()

const initialState = {
  notes: [],
  loading: true,
  error: false,
  form: { name: '', description: '' },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.notes, loading: false }
    case 'ADD_NOTE':
      return { ...state, notes: [action.note, ...state.notes] }
    case 'RESET_FORM':
      return { ...state, form: initialState.form }
    case 'SET_INPUT':
      return { ...state, form: { ...state.form, [action.name]: action.value } }
    case 'ERROR':
      return { ...state, loading: false, error: true }
    default:
      return state
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const notesData = await API.graphql({ query: listNotes })
      dispatch({ type: 'SET_NOTES', notes: notesData.data.listNotes.items })
    } catch (err) {
      console.log('error: ', err)
      dispatch({ type: 'ERROR' })
    }
  }

  const createNote = async () => {
    const { form } = state
    if (!form.name || !form.description) {
      return alert('Please enter a name and description')
    }

    const note = { ...form, clientId: CLIENT_ID, completed: false, id: uuid() }
    dispatch({ type: 'ADD_NOTE', note })
    dispatch({ type: 'RESET_FORM' })

    try {
      await API.graphql({
        query: CreateNote,
        variables: { input: note },
      })

      console.log('Successfully created note!')
    } catch (err) {
      console.log('error: ', err)
    }
  }

  function onChange(e) {
    dispatch({ type: 'SET_INPUT', name: e.target.name, value: e.target.value })
  }

  const renderItem = (item) => {
    return (
      <List.Item style={styles.item}>
        <List.Item.Meta title={item.name} description={item.description} />
      </List.Item>
    )
  }

  return (
    <div style={styles.container}>
      <Input
        onChange={onChange}
        value={state.form.name}
        placeholder="Note Name"
        name="name"
        style={styles.input}
      />
      <Input
        onChange={onChange}
        value={state.form.description}
        placeholder="Note description"
        name="description"
        style={styles.input}
      />
      <Button onClick={createNote} type="primary">
        Create Note
      </Button>
      <List
        loading={state.loading}
        dataSource={state.notes}
        renderItem={renderItem}
      />
    </div>
  )
}

const styles = {
  container: { padding: 20 },
  input: { marginBottom: 10 },
  item: { textAlign: 'left' },
  p: { color: '#1890ff' },
}
