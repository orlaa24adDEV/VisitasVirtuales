const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    res.locals.statusMessage =
      'error(adminOnly): El usuario no tiene permisos de administrador'
    return res.status(403).json({
      message:
        'Error: Necesitas permisos de administrador para acceder a esta ruta',
    })
  }
  next()
}

export default isAdmin
