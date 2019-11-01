const express = require('express')

const server = express()

let projects = [{ id: 1, title: 'Sample project', tasks: [] }]

server.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const project = projects.filter(project => project.id == projectId)

  if (project[0]) {
    return res.json({ project })
  }

  res.status(404).json({ error: `Project with id '${projectId}' couldn't be found.` })
})

server.get('/projects', (req, res) => {
  res.json({ projects })
})

server.listen(3000)