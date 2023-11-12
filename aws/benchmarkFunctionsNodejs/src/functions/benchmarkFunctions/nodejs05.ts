export const nodeFactors = () => {
    const n = 2688834647444046;

    factors(n);

    return true;
};

function factors(num: number) {
    let n_factors = [];

    for (let i = 1; i <= Math.floor(Math.sqrt(num)); i += 1)
        if (num % i === 0) {
            n_factors.push(i);
            if (num / i !== i) {
                n_factors.push(num / i);
            }
        }

    n_factors.sort(function (a, b) {
        return a - b;
    });

    return n_factors;
}
