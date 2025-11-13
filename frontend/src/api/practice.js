import client from './client.js'

// GET /practice - получить статистику практики
export const getPracticeStats = async () => {
  const response = await client.get('/practice', {
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data
}

// GET /practice/mode1 - получить упражнение режима 1 (ввод перевода)
export const getMode1Form = async () => {
  const response = await client.get('/practice/mode1', {
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data
}

// POST /practice/mode1 - отправить ответы режима 1
export const submitMode1 = async (answers, ids) => {
  const response = await client.post('/practice/mode1', {
    answers,
    ids,
  }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// GET /practice/mode2 - получить упражнение режима 2 (выбор из вариантов)
export const getMode2Form = async () => {
  const response = await client.get('/practice/mode2', {
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data
}

// POST /practice/mode2 - отправить ответы режима 2
export const submitMode2 = async (answers, ids) => {
  const response = await client.post('/practice/mode2', {
    answers,
    ids,
  }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// GET /practice/mode3 - получить упражнение режима 3 (ввод слова)
export const getMode3Form = async () => {
  const response = await client.get('/practice/mode3', {
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data
}

// POST /practice/mode3 - отправить ответы режима 3
export const submitMode3 = async (answers, ids) => {
  const response = await client.post('/practice/mode3', {
    answers,
    ids,
  }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// GET /practice/mode4 - получить упражнение режима 4 (cloze test)
export const getMode4Form = async () => {
  const response = await client.get('/practice/mode4', {
    headers: {
      'Accept': 'application/json',
    },
  })
  return response.data
}

// POST /practice/mode4 - отправить ответы режима 4
export const submitMode4 = async (answers, ids) => {
  const response = await client.post('/practice/mode4', {
    answers,
    ids,
  }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

