const apiErrorThrown = (err, req, res, next) => {
	console.error(err)
	res.status(err.statusCode || 500).json({ message: 'Error: ' + err.message })
}

export default apiErrorThrown
