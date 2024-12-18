import prismaClient from "../../prisma";

interface TamanhoRequest {
  id?: number; // O ID do tamanho é opcional para identificar os existentes e atualizar.
  tamanho: string;
}

interface ValorRequest {
  id?: number; // O ID do valor é opcional para identificar os existentes e atualizar.
  preco: number;
  tamanhoId: number; // Alterado para 'number', já que representa um ID.
}

interface ProdutoUpdateRequest {
  id: number; // ID do produto que será atualizado
  nome?: string;
  descricao?: string;
  categoriaId?: number;
  status?: string; // Adicionando status ao ProdutoUpdateRequest
  tamanhos?: TamanhoRequest[];
  valores?: ValorRequest[];
}

class UpdateProductService {
  private async produtoExiste(id: number) {
    const produto = await prismaClient.produto.findUnique({ where: { id } });
    return !!produto;
  }

  private async atualizarTamanhos(produtoId: number, tamanhos: TamanhoRequest[]) {
    for (const tamanho of tamanhos) {
      if (tamanho.id) {
        // Se um ID for fornecido, atualizar o tamanho existente
        await prismaClient.tamanho.update({
          where: { id: tamanho.id },
          data: { 
            tamanho: tamanho.tamanho,
            dataUpdate: new Date(),
          },
        });
      } else {
        // Se não tiver ID, criar um novo tamanho
        await prismaClient.tamanho.create({
          data: { 
            produtoId, 
            tamanho: tamanho.tamanho,
            dataCreate: new Date(),
          },
        });
      }
    }
  }

  private async atualizarValores(produtoId: number, valores: ValorRequest[]) {
    // Limpa valores existentes para evitar duplicatas
    await prismaClient.valor.deleteMany({
      where: {
        produtoId: produtoId,
        id: { notIn: valores.map(v => v.id).filter(id => id !== undefined) },
      },
    });

    for (const valor of valores) {
      if (valor.id) {
        // Se um ID for fornecido, atualizar o valor existente
        await prismaClient.valor.update({
          where: { id: valor.id },
          data: { 
            preco: valor.preco,
            tamanhoId: valor.tamanhoId,
            dataUpdate: new Date(),
          },
        });
      } else {
        // Se não tiver ID, criar um novo valor
        await prismaClient.valor.create({
          data: { 
            produtoId, 
            preco: valor.preco, 
            tamanhoId: valor.tamanhoId,
            dataCreate: new Date(),
          },
        });
      }
    }
  }

  public async execute({ id, nome, descricao, categoriaId, status, tamanhos, valores }: ProdutoUpdateRequest) {
    const produtoExiste = await this.produtoExiste(id);
    if (!produtoExiste) {
      throw new Error("Produto não encontrado.");
    }

    // Atualizar os dados do produto, incluindo o status, se fornecido
    const produtoAtualizado = await prismaClient.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        categoriaId,
        status, // Atualizando o status aqui
        dataUpdate: new Date(),
      },
      include: {
        tamanhos: true,
        valores: true,
      },
    });

    // Atualizar tamanhos se fornecido
    if (tamanhos && tamanhos.length > 0) {
      await this.atualizarTamanhos(id, tamanhos);
    }

    // Atualizar valores se fornecido
    if (valores && valores.length > 0) {
      await this.atualizarValores(id, valores);
    }

    // Buscar produto atualizado com seus relacionamentos
    const produtoCompleto = await prismaClient.produto.findUnique({
      where: { id },
      include: {
        tamanhos: true,
        valores: true,
      },
    });

    return produtoCompleto;
  }
}

export { UpdateProductService };
