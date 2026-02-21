const callRoutes = async (fastify) => {
  const auth = { onRequest: [fastify.authenticate] }

  fastify.post('/initiate',   { ...auth, schema: { tags: ['Calls'], summary: 'Start call' } },    async (req, rep) => rep.code(201).send({ message: 'Phase 6' }))
  fastify.post('/:callId/end',{ ...auth, schema: { tags: ['Calls'], summary: 'End call' } },      async () => ({ message: 'Phase 6' }))
  fastify.get('/history',     { ...auth, schema: { tags: ['Calls'], summary: 'Call history' } },  async () => ({ message: 'Phase 6' }))
}

export default callRoutes