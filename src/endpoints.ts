import { FastifyRequest, FastifyReply } from "fastify";

import { BD, indexInBD, deleteInBD, ItemBDType, getItemBDSchema } from "./data";


// schemes

export const modelsSchemes = {
    'bd-item': {
        '$id': 'bd-item',
        type: 'object',
        properties: {
            ...getItemBDSchema()
        }
    },
    'bd': {
        '$id': 'bd',
        type: 'array',
        items: { '$ref': 'bd-item#' }
    },
    'bd-item-no-id': {
        '$id': 'bd-item-no-id',
        type: 'object',
        properties: {
            ...getItemBDSchema(['id'])
        }
    },
    'none-id': {
        '$id': 'none-id',
        description: 'No Content',
        type: 'null'
    }
}




// requests

export async function getBD (_: any, reply: FastifyReply) {
    reply.send(BD)
}


export async function getID (request: FastifyRequest, reply: FastifyReply) {
    const { params: { id } } = request as {params: {id: string}}
    const index = indexInBD(id, reply)
    reply.send(BD[index])
}


export async function deleteID (request: FastifyRequest, reply: FastifyReply) {
    const { params: { id } } = request as {params: {id: string}}
    reply.send(deleteInBD(id, reply))
}


export async function editID (request: FastifyRequest, reply: FastifyReply) {
    const { params: { id }, body } = request as {params: {id: string, }, body: Omit<ItemBDType, 'id'>}
    const index = indexInBD(id, reply)
    BD[index] = { id: id, ...body }
    reply.send(BD[index])
}


export async function addInBD(request: FastifyRequest, reply: FastifyReply)  {
    const {  body  } = request as { body: Omit<ItemBDType, 'id'> }
    const id = String(new Date().getTime())
    const newItem = {
        id: id,
        ...body
    } as ItemBDType
    BD.push(newItem)
    const index = indexInBD(id, reply)
    reply.send(BD[index])
}

// 

export const endpointsOptions = {
    'get-bd': {
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            response: {
                200: { '$ref': 'bd#' },
            }
        }, 
        handler: getBD
    },
    'get-bd-id': {
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            response: {
                200: { '$ref': 'bd-item#' },
                404: { '$ref': 'none-id#' }
            }
        }, 
        handler: getID
    }, 
    'put-bd-id': {
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            body: { '$ref': 'bd-item-no-id#'},
            response: {
                200: { '$ref': 'bd-item#' },
                404: { '$ref': 'none-id#' }
            }
        }, 
        handler: editID
    }, 
    'post-bd': {
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            body: { '$ref': 'bd-item-no-id#'},
            response: {
                200: { '$ref': 'bd-item#' },
            }
        }, 
        handler: addInBD
    }, 
    'delete-bd-id':{
        schema: {
            tags: ['Default'],
            description: 'Expected Response',
            response: {
                200: { '$ref': 'bd-item#' },
                404: { '$ref': 'none-id#' }
            }
        }, 
        handler: deleteID
    },
}