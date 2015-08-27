import page from 'page'
import RouteNode from 'route-node'

const
observers = {},
tree = new RouteNode(),
{base, start, stop} = page
let onChangeObservers = []

page('*', middleware)
page('*', handler)

export {base, page, start, stop, tree}

export function addRoute(name, path, ...handlers) {
  tree.addNode(name, path)
  observers[name] = handlers
}

export function navigate(...args) {
  return page(tree.buildPath(...args))
}

export function onChange(...handlers) {
  onChangeObservers = onChangeObservers.concat(handlers)
}

function buildNames(names, name) {
  const [currentName] = names.slice(-1)
  names.push(currentName ? `${currentName}.${name}` : name)
  return names
}

function handler(ctx) {
  const
  context = {...ctx},
  {frankenroute} = ctx
  delete context.frankenroute
  onChangeObservers
    .concat(observers[frankenroute.name] || [])
    .forEach(observer => observer(frankenroute, context))
}

function middleware(ctx, next) {
  const
  {pathname} = ctx,
  {name, params} = tree.matchPath(pathname, true) || {},
  names = name ? name.split('.').reduce(buildNames, []).reverse() : []
  ctx.frankenroute = {name, names, params}
  next()
}
