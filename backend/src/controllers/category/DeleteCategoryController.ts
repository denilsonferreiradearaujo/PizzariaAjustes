import { Request, Response } from "express";
import { DeleteCategoryService } from "../../services/category/DeleteCategoryService"; // Importação corrigida

class DeleteCategoryController {
  async handle(req: Request, res: Response) {
    // Obtém o `id` dos parâmetros da URL
    const { id } = req.params;

    const deleteCategoryService = new DeleteCategoryService();

    try {
      // Executa o serviço de exclusão
      await deleteCategoryService.execute({ id });

      return res.status(204).send(); // Retorna status 204 (No Content) para indicar sucesso na exclusão
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteCategoryController };
