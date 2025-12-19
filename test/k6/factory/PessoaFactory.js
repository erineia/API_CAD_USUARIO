import { generateCpf } from '../helpers/generateCpf.js';
import {
  randomNome,
  randomSobrenome,
  randomSexo,
  randomTelefone,
  randomDataNascimento,
} from '../helpers/randomUtils.js';

export function buildPessoa() {
  return {
    nome: randomNome(),
    sobrenome: randomSobrenome(),
    cpf: generateCpf(),
    dataNascimento: randomDataNascimento(),
    nomePai: randomNome(),
    nomeMae: randomNome(),
    telefone: randomTelefone(),
    sexo: randomSexo(),
  };
}
