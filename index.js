const express = require('express')

const server = express()

server.use(express.json())

let projects = [{ id: 1, 
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

  res.status(400).json({ error: 'Title and id are required.'})
})

// POST: http://server/projects/:id/tasks
server.post('/projects/:id/tasks', (req, res) => {
  const { id } = req.params
  const { title } = req.body

  if(!title) {
    return res.status(400).json({ error: 'Title is required.'})
  }

  const projectIndex = projects.findIndex(p => p.id == id);

  projects[projectIndex].tasks.push(title)

  res.json(projects[projectIndex])
})

// GET: http://server/projects
server.get('/projects', (req, res) => {
  res.json(projects)
})

// GET: http://server/projects/1
server.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const project = projects.filter(project => project.id == projectId)

  if (project[0]) {
    return res.json({ project })
  }

  res.status(404).json({ error: `Project with id '${projectId}' couldn't be found.` })
})

// PUT: http://server/projects/:id
server.put('/projects/:id', (req, res) => {
  const { id } = req.params
  const { title } = req.body
  const projectIndex = projects.findIndex(p => p.id == id);
  const project = projects[projectIndex]

  if(!project) {
    return res.status(404).json({ error: `Project with id '${id}' couldn't be found.` })
  }

  if(!title) {
    return res.status(400).json({ error: 'Title is required.'})
  }

  projects[projectIndex].title = title

  res.json({ project: projects[projectIndex] })
})

// DELETE: http://server/projects/:id
server.delete('/projects/:id', (req, res) => {
  const { id } = req.params
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1)
  
  return res.json(projects)
})

server.listen(3000)
