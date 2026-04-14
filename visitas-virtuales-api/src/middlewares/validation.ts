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