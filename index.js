const express = require('express')

const server = express()

server.use(express.json())

// middlewares
/**
 * check if a project with an id exists
 *  */
const checkProjectExists = (req, res, next) => {
  const { id } = req.params
  const project = projects.filter(p => p.id == id)[0]

  if(!project) {
    return res.status(400).json({ error: `Project with id '${id}' couldn't be found.` })
  }

  res.locals.project = project

  return next()
}

/**
 * count requests to the server
 */
const countRequests = (req, res, next) => {
  console.count('request #')

  return next()
}

server.use(countRequests)

const projects = [{ id: 1, 
                  title: 'To work at EBANX', 
                  tasks: ['Finish the GoStack Bootcamp', 
                          'Study ReactJS, NodeJS and JavaScript', 
                          'Get great at Hackerrank challenges'] }]

// POST: http://server/projects
server.post('/projects', (req, res) => {
  const { id, title } = req.body
  const project = {
    id,
    title,
    tasks: []
  }

  const isProjectCreated = projects.filter(p => p.id == project.id)[0]

  if(isProjectCreated){
    return res.status(400).json({ error: `Project with id '${project.id}' already created.` })
  }

  if(project.id && project.title) {
    projects.push(project)

    return res.json({ project })
  }

  return res.status(400).json({ error: 'Title and id are required.'})
})

// POST: http://server/projects/:id/tasks
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  if(!title) {
    return res.status(400).json({ error: 'Title is required.'})
  }

  const projectIndex = projects.findIndex(p => p.id == id);

  projects[projectIndex].tasks.push(title)

  return res.json(projects[projectIndex])
})

// GET: http://server/projects
server.get('/projects', (req, res) => {
  return res.json(projects)
})

// GET: http://server/projects/1
server.get('/projects/:id', checkProjectExists, (req, res) => {
  return res.json(res.locals.project)
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

  return res.json(projects[projectIndex])
})

// DELETE: http://server/projects/:id
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1)
  
  return res.json(projects)
})

server.listen(3000)