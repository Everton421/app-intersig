 

export interface Produto {
    codigo:number
    descricao:string
    preco:number
    quantidade?:number
    desconto?:number
    totalLiquido?:number
    estoque?:number,
}

const p1 :Produto= {
    codig:1,
    DESCRICAO:"teste1",
    PRECO:10,
}

const p2 :Produto= {
    CODIGO:2,
    DESCRICAO:"teste2",
    PRECO:25,
}

const p3 :Produto= {
    CODIGO:3,
    DESCRICAO:"teste3",
    PRECO:15,
}

const p4 :Produto= {
    CODIGO:4,
    DESCRICAO:"teste4",
    PRECO:95,
}


const p5 :Produto= {
    CODIGO:5,
    DESCRICAO:"teste4",
    PRECO:95,
}
const p6 :Produto= {
    CODIGO:6,
    DESCRICAO:"teste6",
    PRECO:95,
}
const p7 :Produto= {
    CODIGO:7,
    DESCRICAO:"teste7",
    PRECO:95,
}
const p8 :Produto= {
    CODIGO:8,
    DESCRICAO:"teste8",
    PRECO:95,
}
const p9 :Produto= {
    CODIGO:9,
    DESCRICAO:"teste9",
    PRECO:95,
}


export const produtosFic: Produto[] =  [p1,p2,p3,p4,p5,p6,p7,p8,p9]