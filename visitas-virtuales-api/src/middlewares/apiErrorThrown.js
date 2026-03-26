const apiErrorThrown = (err, req, res, next) => {
  console.error('Error capturado por apiErrorThrown:', err)
  res.locals.statusMessage = 'error(apiErrorThrown): ' + err.message
  res.status(err.statusCode || 500).json({ message: 'Error: ' + err.message })
}

export default apiErrorThrown
