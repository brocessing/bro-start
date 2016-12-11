// experimental list loading plugin
const fs = require('fs-extra')
const yaml = require('js-yaml')
const path = require('path')
const paths = require('../../config/paths.config.js')

/**
 * Create a project list with easy access to a previous / next project
 *
 * @param {string} projectsPath Path to the projects yaml folder
 * @param {array} projectList ordered list of all project you need to load
 * @param {array} keys Array of the keys you want to get from the projects yaml.
 *  First item on the array needs to be the project name.
 * @return {object} projectList
 */
function projectListSync (projectsPath, projectList, keys) {
  if (!keys[0]) throw new Error('You need to add at least one key to load project files')
  let orderedProjects = []
  let visibleProjects = {}
  try {
    fs.readdirSync(projectsPath).forEach((filename) => {
      let file = {}
      let yamlFile = fs.readFileSync(path.join(projectsPath, filename), 'utf8')
      const data = yaml.load(yamlFile)

      // if the name is not on the projectList, stop making this file
      if (!data[keys[0]]) return

      // add info to the file object
      keys.forEach((key) => {
        if (data[key]) file[key] = data[key]
      })

      // route handling with basic multiroute support
      if (data.routes) {
        file.routes = data.routes
      } else {
        file.route = (data.route)
          ? data.route
          : path.relative(paths.content, projectsPath) + '/' + filename.slice(0, -4) + '.html'
      }

      // push file in the visibleProjects
      file.name = data[keys[0]]
      visibleProjects[data[keys[0]]] = file
    })

    // create Ordered Project List
    projectList.forEach((projectName) => {
      if (visibleProjects[projectName]) orderedProjects.push(visibleProjects[projectName])
    })
  } catch (err) {
    throw new Error(err)
  }

  return createProjectList(orderedProjects)
}

function createProjectList (projects) {
  function _getIndexByName (name) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].name === name) return i
    }
    return null
  }

  function getProjectByName (name) {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].name === name) return projects[i]
    }
    return null
  }

  function previousProjectFrom (name, loop = true) {
    const index = _getIndexByName(name)
    if (index === null) return null
    if (index > 0) return projects[index - 1]
    else if (index === 0 && loop) return projects[projects.length - 1]
    else return null
  }

  function nextProjectFrom (name, loop = true) {
    const index = _getIndexByName(name)
    if (index === null) return null
    if (index < (projects.length - 1)) return projects[index + 1]
    else if (index === (projects.length - 1) && loop) return projects[0]
    else return null
  }

  return {
    projects,
    getProjectByName,
    previousProjectFrom,
    nextProjectFrom
  }
}

module.exports = projectListSync
