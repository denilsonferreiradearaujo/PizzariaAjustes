import prisma from "../../prisma/index"; // Importando o cliente Prisma como padrão

interface DeleteCategoryRequest {
  id: string; // ou number, dependendo do tipo do ID no seu banco de dados
}

class DeleteCategoryService {
  async execute({ id }: DeleteCategoryRequest) {
    // Verifica se a categoria existe
    const category = await prisma.categoria.findUnique({
      where: { id: Number(id) }, // Converte para número, se necessário
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    // Exclui a categoria
    await prisma.categoria.delete({
      where: { id: Number(id) },
    });
  }
}

export { DeleteCategoryService };
