
const fastify = require('fastify')({
    logger: true
})


fastify.get('/', async (request: any, reply: any) => {
    console.log(request, reply)
    return { hello: 'world' }
})

// Run server
const start = async () => {
    try {
        await fastify.listen(3000)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()