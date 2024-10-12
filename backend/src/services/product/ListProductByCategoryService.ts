import prismaClient from "../../prisma";

class ListProductByCategoryService {
  async execute(categoriaId: number) {
    const produtos = await prismaClient.produto.findMany({
      where: {
        categoriaId: categoriaId,
      },
      include: {
        valores: true,
        Categoria: {
          select: {
            nome: true,
          },
        },
      },
    });

    // Formata os preços dos produtos para duas casas decimais
    const produtosFormatados = produtos.map(produto => ({
      ...produto,
      valores: produto.valores.map(valor => ({
        ...valor,
        preco: valor.preco.toFixed(2),
      })),
    }));

    return produtosFormatados;
  }
}

export { ListProductByCategoryService };