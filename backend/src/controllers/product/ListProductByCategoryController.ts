import { Request, Response } from "express";
import { ListProductByCategoryService } from "../../services/product/ListProductByCategoryService";

class ListProductByCategoryController {
  async handle(req: Request, res: Response) {
    const { categoriaId } = req.query;

    const listProductByCategoryService = new ListProductByCategoryService();
    const produtos = await listProductByCategoryService.execute(Number(categoriaId));

    return res.json(produtos);
  }
}

export { ListProductByCategoryController };