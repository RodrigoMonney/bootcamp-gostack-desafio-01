const express = require('express')

const server = express()

server.use(express.json())

let projects = [{ id: 1, 
                  title: 'To work at EBANX', 
                  tasks: ['Finish the GoStack Bootcamp', 
                          'Study ReactJS, NodeJS and JavaScript', 
                          'Get great at Hackerrank challenges'] }]


// middlewares
// count requests
server.use((req, res, next) => {
  console.count('visit #')

  next()
})

const checkProjectExists = (req, res, next) => {
  const { id } = req.params;
  res.locals.project = projects.filter(project => project.id == id)[0]

  if (!res.locals.project) {
    return res.status(404).json({ error: `Project with id '${id}' couldn't be found.` })
  }

  return next()
}

// GET: http://server/projects/1
server.get('/projects/:id', checkProjectExists, (req, res) => {
  res.json({ project: res.locals.project })
})

// GET: http://server/projects
server.get('/projects', (req, res) => {
  res.json({ projects })
})

// POST: http://server/projects
server.post('/projects', (req, res) => {
  const { id, title } = req.body
  const project = { id, title }

  const isProjectCreated = projects.filter(p => p.id == project.id)[0]

  if(isProjectCreated){
    return res.status(400).json({ error: `Project with id '${project.id}' already created.` })
  }

  if(project.id && project.title) {
    projects.push(project)

    return res.json({ project })
  }

  res.status(400).json({ error: 'Title and id are required.'})
})

// PUT: http://server/projects/:id
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body
  const projectIndex = projects.findIndex(p => p.id == id);

  if(!title) {
    return res.status(400).json({ error: 'Title is required.'})
  }

  projects[projectIndex].title = title

  res.json({ project: projects[projectIndex] })
})

server.listen(3000)