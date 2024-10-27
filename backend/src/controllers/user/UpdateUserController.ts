import { Request, Response } from "express";
import { UpdateUserService } from "../../services/user/UpdateUserService";

class UpdateUserController {
    async handle(req: Request, res: Response) {
        // Converte `pessoa_id` para número, caso venha como string
        const pessoa_id = Number(req.params.pessoa_id || req.body.pessoa_id);

        // Verifique se a conversão para número foi bem-sucedida
        if (isNaN(pessoa_id)) {
            return res.status(400).json({ error: "pessoa_id precisa ser um número válido" });
        }

        const {
            nome,
            email,
            senha,
            genero,
            dataNasc,
            cpf,
            tipo,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            telefoneResidencial,
            telefoneCelular,
        } = req.body;

        const updateUserService = new UpdateUserService();

        try {
            const updatedUser = await updateUserService.execute({
                pessoa_id, // Agora `pessoa_id` é um número
                nome,
                email,
                senha,
                genero,
                dataNasc,
                cpf,
                tipo,
                cep,
                logradouro,
                numero,
                complemento,
                bairro,
                cidade,
                uf,
                telefoneResidencial,
                telefoneCelular,
            });

            return res.json(updatedUser);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar o usuário" });
        }
    }
}

export { UpdateUserController };
