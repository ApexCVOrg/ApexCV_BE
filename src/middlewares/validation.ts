import { Request, Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'
import { RegisterDto } from '../validations/user'

export const validateRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const registerDto = plainToClass(RegisterDto, req.body)
    const errors = await validate(registerDto)

    if (errors.length > 0) {
      const validationErrors: { [key: string]: string } = {}
      errors.forEach((error) => {
        if (error.constraints) {
          validationErrors[error.property] = Object.values(error.constraints)[0]
        }
      })

      console.log('❌ Validation errors:', validationErrors)
      res.status(400).json({
        success: false,
        message: 'validation_error',
        errors: validationErrors
      })
      return
    }

    // Add validated data to request
    req.body = registerDto
    next()
  } catch (error) {
    console.error('Validation error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during validation',
      error: (error as Error).message
    })
  }
}
