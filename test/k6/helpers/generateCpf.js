// Função para gerar CPF válido
export function generateCpf() {
  function randomInt(n) {
    return Math.floor(Math.random() * n);
  }
  function mod11(num) {
    return num % 11 < 2 ? 0 : 11 - (num % 11);
  }
  let n = [];
  for (let i = 0; i < 9; i++) n.push(randomInt(10));
  n[9] = mod11(
    n[0] * 10 +
      n[1] * 9 +
      n[2] * 8 +
      n[3] * 7 +
      n[4] * 6 +
      n[5] * 5 +
      n[6] * 4 +
      n[7] * 3 +
      n[8] * 2,
  );
  n[10] = mod11(
    n[0] * 11 +
      n[1] * 10 +
      n[2] * 9 +
      n[3] * 8 +
      n[4] * 7 +
      n[5] * 6 +
      n[6] * 5 +
      n[7] * 4 +
      n[8] * 3 +
      n[9] * 2,
  );
  return n.join('');
}
