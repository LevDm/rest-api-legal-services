import { FastifyReply } from "fastify";

const ItemBD: Record<string, string | number> = {
    id: '',

    industry: '',
    title: '',
    description: '',
    price: 0,
}
export type ItemBDType = typeof ItemBD

export const BD: ItemBDType[] = [
    {
        "id": "1702374626720",
        "industry": "Торговля",
        "title": "Консультация",
        "description": "Правовая оценка ситуации и варианты решения",
        "price": 1000
    },
    {
        "id": "1702374626721",
        "industry": "Автомобильный спор",
        "title": "Подготовка документов",
        "description": "Подготовка документов для защиты прав",
        "price": 1590
    },
    {
        "id": "1702374626722",
        "industry": "Недвижимость",
        "title": "Судебный спор",
        "description": "Правовая помощь в суде для защиты интересов",
        "price": 6490
    },
]


export function getItemBDSchema (exceptions: string[] = []) {
    const schema: Record<string, {type: string}>  = {}
    for(const key in ItemBD){
        if(exceptions.indexOf(key) === -1){
            const value: string | number = ItemBD[key]
            schema[key] = {type: typeof value}
        }
    }
    return schema
}



export function indexInBD (id: string, reply: FastifyReply) {
    const index = BD.findIndex(i=>i.id === id)
    if(index < 0) {
        reply.status(404)
    }
    return index
}

export function deleteInBD (id: string, reply: FastifyReply) {
    const index = indexInBD(id, reply)
    const result = BD.splice(index, 1)
    return result[0]
}