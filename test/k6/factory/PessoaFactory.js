import { Faker } from 'k6/x/faker';
import { generateCpf } from '../helpers/generateCpf.js';
import {
  randomAnoNascimento,
  randomDia,
  randomIdade,
  randomMes,
  randomNumber,
  randomSexo,
} from '../helpers/randomUtils.js';

const fakeGen = new Faker();

export function buildPessoa() {
  const idade = randomIdade();
  const anoNascimento = randomAnoNascimento(idade);
  const mes = randomMes();
  const dia = randomDia();
  return {
    nome: fakeGen.person.firstName(),
    sobrenome: fakeGen.person.lastName(),
    cpf: generateCpf(),
    dataNascimento: `${anoNascimento}-${mes}-${dia}`,
    nomePai: fakeGen.person.firstName(),
    nomeMae: fakeGen.person.firstName(),
    telefone: `9${randomNumber(9)}`,
    sexo: randomSexo(),
  };
}
