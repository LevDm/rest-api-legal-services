import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from "@fastify/swagger-ui";


const swaggerOptions = {
    swagger: {
        info: {
            title: "My Title",
            description: "My Description.",
            version: "1.0.0",
        },
        host: "localhost:3000",
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [{ name: "Default", description: "Default" }],
    },
};

const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
};


const fastify = Fastify({logger: true})

const BD = [
    {
        id: '1',
        title: 'title 1'
    },
    {
        id: '2',
        title: 'title 2'
    },
    {
        id: '3',
        title: 'title 3'
    },
    {
        id: '4',
        title: 'title 4'
    },
    {
        id: '5',
        title: 'title 5'
    },
]

type ItemBD = {
    id: string,
    title: string
}

function indexInBD (id: string, reply: FastifyReply) {
    const index = BD.findIndex(i=>i.id === id)
    if(index < 0) {
        reply.status(404)
    }
    return index
}

function deleteInBD (id: string, reply: FastifyReply) {
    const index = indexInBD(id, reply)
    return BD.splice(index, 1)
}




async function getBD (request: any, reply: FastifyReply) {
    reply.send(BD)
}

async function getID (request: FastifyRequest, reply: FastifyReply) {
    const { params: { id } }  = request as {params: {id: string}}
    const index = indexInBD(id, reply)
    reply.send(BD[index])

}

async function deleteID (request: FastifyRequest, reply: FastifyReply) {
    const { params: { id } }  = request as {params: {id: string}}
    reply.send(deleteInBD(id, reply))
}

async function editID (request: FastifyRequest, reply: FastifyReply) {
    const { params: { id, body } }  = request as {params: {id: string, body: Omit<ItemBD, 'id'>}}
    const index = indexInBD(id, reply)
    BD[index] = { ...BD[index], ...body }
    reply.send(BD[index])
}

async function addInBD(request: FastifyRequest, reply: FastifyReply)  {
    const {  body  }  = request as { body: Omit<ItemBD, 'id'> }
    const id = String(1+BD.length)
    console.log(body, request.body)
    const newItem = {
        id: id,
        ...body
    }
    BD.push(newItem)
    const index = indexInBD(id, reply)
    reply.send(BD[index])
}


fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);


fastify.addSchema({
    $id: 'bd-item',
    type: 'object',
    properties: {
        id: { type: 'string' }, 
        title: { type: 'string' }
    }
})

fastify.addSchema({
    $id: 'bd-item-no-id',
    type: 'object',
    properties: {
        title: { type: 'string' }
    }
})

fastify.addSchema({
    $id: 'bd',
    type: 'array',
    items: { $ref: 'bd-item#' }
})

fastify.addSchema({
    $id: 'none-id',
    description: 'No Content',
    type: 'null'
})


fastify.register((app: FastifyInstance, options: any, done: (err?: Error | undefined) => void )=>{
    app.get('/bd', { 
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            response: {
                200: { $ref: 'bd#' },
            }
        }, 
        handler: getBD
    })


    app.get('/bd/:id', {
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            response: {
                200: { $ref: 'bd-item#' },
                404: { $ref: 'none-id#' }
            }
        }, 
        handler: getID
    })


    app.put('/bd/:id', {
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            body: { $ref: 'bd-item-no-id#'},
            response: {
                200: { $ref: 'bd-item#' },
                404: { $ref: 'none-id#' }
            }
        }, 
        handler: editID
    })

    
    app.post('/bd/', {
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            body: { $ref: 'bd-item-no-id#'},
            response: {
                200: { $ref: 'bd-item#' },
            }
        }, 
        handler: addInBD
    })


    app.delete('/bd/:id', {
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            response: {
                200: { $ref: 'bd-item#' },
                404: { $ref: 'none-id#' }
            }
        }, 
        handler: deleteID
    })

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
