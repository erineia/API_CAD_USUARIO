export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomIdade(min = 18, max = 65) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomAnoNascimento(idade) {
  return new Date().getFullYear() - idade;
}

export function randomMes() {
  return String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
}

export function randomDia() {
  return String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
}
export function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomInt(0, chars.length - 1)];
  }
  return result;
}
export function randomSexo() {
  return Math.random() < 0.5 ? 'M' : 'F';
}

export function randomNumber(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}
