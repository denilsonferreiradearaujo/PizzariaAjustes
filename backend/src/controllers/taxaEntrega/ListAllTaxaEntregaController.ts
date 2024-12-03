import { Request, Response } from "express";
import { ListAllTaxaEntregaService } from "../../services/taxaEntrega/ListAllTaxaEntregaService";

class ListAllTaxaEntregaController {
  async handle(req: Request, res: Response) {
    console.log("Rota /taxasEntrega foi chamada");
    const listAllTaxaEntregaService = new ListAllTaxaEntregaService();

    try {
      const taxaEntrega = await listAllTaxaEntregaService.execute();
      console.log("Resposta enviada:", taxaEntrega);
      return res.json(taxaEntrega);
    } catch (error) {
      console.error("Erro ao listar taxas de entrega:", error.message);
      return res.status(500).json({
        message: error.message || "Erro inesperado ao listar taxas de entrega.",
      });
    }
  }
}
export { ListAllTaxaEntregaController };
