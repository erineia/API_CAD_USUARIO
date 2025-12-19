export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomInt(0, chars.length - 1)];
  }
  return result;
}

export function randomFromArray(array) {
  return array[randomInt(0, array.length - 1)];
}

export function randomNome() {
  return randomFromArray([
    'Ana',
    'Carlos',
    'João',
    'Maria',
    'Pedro',
    'Lucas',
    'Paula',
  ]);
}

export function randomSobrenome() {
  return randomFromArray(['Silva', 'Santos', 'Oliveira', 'Pereira', 'Costa']);
}

export function randomSexo() {
  return randomFromArray(['M', 'F']);
}

export function randomTelefone() {
  return `119${randomInt(10000000, 99999999)}`;
}

export function randomDataNascimento() {
  const ano = randomInt(1995, 2008);
  const mes = String(randomInt(1, 12)).padStart(2, '0');
  const dia = String(randomInt(1, 28)).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}
