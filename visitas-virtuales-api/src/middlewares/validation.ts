import { ZodError, type ZodType } from 'zod'

export const validateBody = (schema: ZodType) => {
	return (req: any, res: any, next: any) => {
		try {
			const validatedData = schema.parse(req.body)
			;(req as any).body = validatedData
			next()
		} catch (e) {
			if (e instanceof ZodError) {
				return res.status(400).json({
					error: 'Error de validación de datos de entrada',
					details: e.issues.map((err) => ({
						field: err.path.join('.'),
						message: err.message,
					})),
				})
			}
		}
	}
}

export const validateParams = (schema: ZodType) => {
	return (req: any, res: any, next: any) => {
		try {
			const validatedData = schema.parse(req.params)
			;(req as any).params = validatedData
			next()
		} catch (e) {
			if (e instanceof ZodError) {
				return res.status(400).json({
					error: 'Error de validación de parámetros de ruta',
					details: e.issues.map((err) => ({
						field: err.path.join('.'),
						message: err.message,
					})),
				})
			}
		}
	}
}

export const validateQuery = (schema: ZodType) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedData = schema.parse(req.query)
      ;(req as any).query = validatedData
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Error de validación en los parámetros de consulta',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
    }
  }
}

export const validateRequest = (schema: { params?: ZodType; query?: ZodType; body?: ZodType }) => {
  return (req: any, res: any, next: any) => {
    try {
      // Creamos un objeto para guardar lo validado
      req.validData = {
        params: schema.params ? schema.params.parse(req.params) : req.params,
        query: schema.query ? schema.query.parse(req.query) : req.query,
        body: schema.body ? schema.body.parse(req.body) : req.body,
      };
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Error de validación',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e)
    }
  }
}