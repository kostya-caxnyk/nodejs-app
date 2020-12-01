const Xi = [2, 4, 6, 9, 13, 18, 21, 24, 27];
const Ni = [13, 2, 3, 24, 11, 5, 12, 3, 7];

const V = Ni.reduce((acc, e) => acc + e);
const SV = (1 / V) * Ni.reduce((acc, e, i) => acc + e * Xi[i], 0);
const L = (1 / SV).toFixed(2);

console.log('Xi: ', Xi.toString());
console.log('Ni: ', Ni.toString());
console.log("Об'єм вибірки: ", V);
console.log('Середнє вибіркове: ', SV);
console.log('Лянда: ', L);
