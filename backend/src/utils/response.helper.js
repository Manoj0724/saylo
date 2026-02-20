export const sendSuccess = (reply, data = {}, message = 'Success', statusCode = 200) => {
  return reply.status(statusCode).send({
    success: true,
    message,
    data,
  })
}

export const sendError = (reply, message = 'Something went wrong', statusCode = 400, errors = null) => {
  return reply.status(statusCode).send({
    success: false,
    message,
    ...(errors && { errors }),
  })
}