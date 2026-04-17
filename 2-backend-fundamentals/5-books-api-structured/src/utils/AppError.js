export class AppError extends Error {
    constructor(message, status = 500){
        super(message),
        this.status = status,
        this.name = 'AppError'
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Recource'){
        super(`${resource} not found`, 404)
    }
}

export class ValidationError extends AppError{
    constructor(message){
        super(message, 400)
    }
}