import prismaClient from "../../prisma";

interface TamanhoRequest {
    tamanho: string;
}

interface ValorRequest {
    preco: number;
    tamanho?: string; // Nome do tamanho para buscar ID
}

interface ProdutoRequest {
    nome: string;
    descricao?: string; // Adicionado para descrição
    categoriaId: number;
    tamanhos?: TamanhoRequest[];
    valores: ValorRequest[];
    status : string;
}

class CreateProductService {
    async execute({ nome, descricao, categoriaId, tamanhos, valores }: ProdutoRequest) {
        const produto = await prismaClient.produto.create({
            data: {
                nome,
                descricao, // Adicionado para incluir a descrição
                categoriaId,
                tamanhos: tamanhos
                    ? {
                          create: tamanhos.map(t => ({ tamanho: t.tamanho })),
                      }
                    : undefined,
                    status : "Ativo" //Garante que o status é setado como ativo
            },
        });

        if (valores) {
            for (const valor of valores) {
                let tamanhoId = null;

                if (valor.tamanho) {
                    const tamanho = await prismaClient.tamanho.findFirst({
                        where: {
                            produtoId: produto.id,
                            tamanho: valor.tamanho,
                        },
                    });
                    tamanhoId = tamanho ? tamanho.id : null;
                }

                await prismaClient.valor.create({
                    data: {
                        preco: valor.preco,
                        produtoId: produto.id,
                        tamanhoId: tamanhoId,
                    },
                });
            }
        }

        return produto;
    }
}

export { CreateProductService };
