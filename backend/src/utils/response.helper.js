const successResponse = (reply, data, message = 'Success', statusCode = 200) => {
  return reply.code(statusCode).send({ success: true, message, data, timestamp: new Date().toISOString() })
}

const errorResponse = (reply, message = 'An error occurred', statusCode = 500) => {
  return reply.code(statusCode).send({ success: false, message, timestamp: new Date().toISOString() })
}

const paginatedResponse = (reply, data, pagination) => {
  return reply.code(200).send({
    success: true,
    data,
    pagination: {
      page:       pagination.page,
      limit:      pagination.limit,
      total:      pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext:    pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev:    pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  })
}

export { successResponse, errorResponse, paginatedResponse }