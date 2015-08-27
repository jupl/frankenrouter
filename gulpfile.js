'use strict'

var
rump = require('rump'),
reconfiguring = false

rump.autoload().addGulpTasks().configure({
  clean: false,
  paths: {
    source: {scripts: ''},
    destination: {scripts: 'dev'},
  },
  scripts: {library: 'frankenrouter', sourceMap: false},
})

rump.on('update:main', function() {
  if(reconfiguring) {
    return
  }
  reconfiguring = true
  rump.reconfigure({paths: {destination: {scripts: path()}}})
  reconfiguring = false
})

function path() {
  return rump.configs.main.environment === 'production' ? 'min' : 'dev'
}
