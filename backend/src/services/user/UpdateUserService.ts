import prismaClient from "../../prisma";
import { hash } from 'bcryptjs';

interface UserUpdateRequest {
    pessoa_id: number;
    nome?: string;
    email?: string;
    senha?: string;
    genero?: string;
    dataNasc?: string;
    cpf?: string;
    tipo?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    telefoneResidencial?: string;
    telefoneCelular?: string;
}

class UpdateUserService {
    async execute({
        pessoa_id,
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
    }: UserUpdateRequest) {
        
        // Converte `pessoa_id` para número, caso esteja como string
        const pessoaId = Number(pessoa_id);

        // Criptografa a senha se for atualizada
        const passwordHash = senha ? await hash(senha, 8) : undefined;

        // Busca telefones existentes
        const telefoneExistente = await prismaClient.telefonePessoa.findMany({
            where: { pessoaId }, // Certifique-se de que o valor é numérico
            select: {
                telefoneId: true,
                Telefone: {
                    select: {
                        telefoneResidencial: true,
                        telefoneCelular: true,
                    }
                }
            }
        });

        const idTelefoneResidencial = telefoneExistente.find(
            tel => tel.Telefone.telefoneResidencial
        )?.telefoneId;

        const idTelefoneCelular = telefoneExistente.find(
            tel => tel.Telefone.telefoneCelular
        )?.telefoneId;

        // Atualiza os dados do usuário
        const updatedUser = await prismaClient.pessoa.update({
            where: { id: pessoaId }, // Certifique-se de que o valor é numérico
            data: {
                nome,
                email,
                genero,
                dataNasc: dataNasc ? new Date(dataNasc) : undefined,
                cpf,
                tipo,
                logins: senha ? {
                    updateMany: {
                        where: { pessoaId },
                        data: { senha: passwordHash }
                    }
                } : undefined,
                enderecos: {
                    updateMany: {
                        where: { pessoaId },
                        data: {
                            cep,
                            logradouro,
                            numero,
                            complemento,
                            bairro,
                            cidade,
                            uf,
                        }
                    }
                },
                telefones: {
                    upsert: [
                        {
                            where: {
                                pessoaId_telefoneId: idTelefoneResidencial ? { pessoaId, telefoneId: idTelefoneResidencial } : undefined,
                            },
                            create: {
                                Telefone: {
                                    create: { telefoneResidencial }
                                }
                            },
                            update: {
                                Telefone: {
                                    update: { telefoneResidencial }
                                }
                            }
                        },
                        {
                            where: {
                                pessoaId_telefoneId: idTelefoneCelular ? { pessoaId, telefoneId: idTelefoneCelular } : undefined,
                            },
                            create: {
                                Telefone: {
                                    create: { telefoneCelular }
                                }
                            },
                            update: {
                                Telefone: {
                                    update: { telefoneCelular }
                                }
                            }
                        }
                    ]
                }
            },
            select: {
                id: true,
                nome: true,
                email: true,
                genero: true,
                dataNasc: true,
                cpf: true,
                logins: { select: { id: true } },
                enderecos: {
                    select: {
                        id: true,
                        cep: true,
                        logradouro: true,
                        numero: true,
                        complemento: true,
                        bairro: true,
                        cidade: true,
                        uf: true,
                    }
                },
                telefones: {
                    select: {
                        Telefone: {
                            select: {
                                telefoneResidencial: true,
                                telefoneCelular: true,
                            }
                        }
                    }
                },
                dataCreate: true,
                dataUpdate: true
            }
        });

        return updatedUser;
    }
}

export { UpdateUserService };
