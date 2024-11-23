import prismaClient from "../../prisma";

interface ItemRequest {
  produtoId: number;
  quantidade: number;
  idValor: number;
}

interface PedidoRequest {
  pessoaId: number;
  taxaEntregaId: number;
  status: string;
  numMesa: number;
  valTotal: number;
  items: ItemRequest[];
}

class CreatePedidoService {
  async execute({ pessoaId, taxaEntregaId, status, numMesa, valTotal, items }: PedidoRequest) {
    // Verificar se a Pessoa existe
    const pessoaExists = await prismaClient.pessoa.findUnique({
      where: { id: pessoaId },
    });

    if (!pessoaExists) {
      throw new Error("Pessoa não encontrada.");
    }

    // // Verificar se a Taxa de Entrega existe
    // const taxaEntregaExists = await prismaClient.taxaEntrega.findUnique({
    //   where: { id: taxaEntregaId },
    // });

    // if (!taxaEntregaExists) {
    //   throw new Error("Taxa de entrega não encontrada.");
    // }

    // Validar items
    if (!items || items.length === 0) {
      throw new Error("Nenhum item foi fornecido para o pedido.");
    }

    const invalidItems = items.filter((item) => !item.produtoId);
    if (invalidItems.length > 0) {
      throw new Error("Todos os itens devem conter um produtoId válido.");
    }

    // **Nova Verificação**: Certifique-se de que todos os `produtoId` existem no banco de dados
    const produtoIds = items
      .map((item) => item.produtoId)
      .filter((id) => id !== undefined && id !== null); // Remover IDs inválidos

    const existingProducts = await prismaClient.produto.findMany({
      where: {
        id: {
          in: produtoIds,
        },
      },
    });

    if (existingProducts.length !== produtoIds.length) {
      throw new Error("Um ou mais produtos não foram encontrados. Verifique os IDs dos produtos.");
    }

    // Criar o Pedido e associar os Items
    const pedido = await prismaClient.pedido.create({
      data: {
        pessoaId,
        taxaEntregaId,
        status,
        numMesa,
        valTotal,
        items: {
          create: items.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            idValor: item.idValor,
          })),
        },
      },
      include: {
        items: true, // Incluir os Items no retorno
      },
    });

    console.log("Items recebidos:", items);
    console.log("Produto IDs:", produtoIds);

    return pedido;
  }
}

export { CreatePedidoService };

