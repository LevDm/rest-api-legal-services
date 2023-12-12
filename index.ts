import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from "@fastify/swagger-ui";


import { swaggerOptions, swaggerUiOptions, modelsSchemes, endpointsOptions } from "./src";

const fastify = Fastify({logger: true})

fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

Object.values(modelsSchemes).map((schema)=>{fastify.addSchema(schema)})

fastify.register((app: FastifyInstance, options: any, done: (err?: Error | undefined) => void )=>{
    app.get('/legal_services', endpointsOptions["get-bd"])
    app.get('/legal_services/:id', endpointsOptions["get-bd-id"])
    app.put('/legal_services/:id', endpointsOptions["put-bd-id"])
    app.post('/legal_services/', endpointsOptions["post-bd"])
    app.delete('/legal_services/:id', endpointsOptions["delete-bd-id"])
    done();
})


const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
        const address = fastify.server.address()
        const port = typeof address === 'string' ? address : address?.port
        fastify.log.info(`server listening on ${port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
