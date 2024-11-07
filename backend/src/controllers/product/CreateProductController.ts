import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
    async handle(req: Request, res: Response) {
        const { nome, descricao, categoriaId, tamanhos, valores } = req.body;

        const createProductService = new CreateProductService();

        try {
            const produto = await createProductService.execute({
                nome,
                descricao, // Incluído no objeto enviado ao serviço
                categoriaId,
                tamanhos: tamanhos || null, // Permite que tamanhos sejam null se não fornecidos
                valores
            });

            return res.json(produto);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export { CreateProductController };
