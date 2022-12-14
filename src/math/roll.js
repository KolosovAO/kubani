export class Roll {
    static PROBABILITIES = [
        1, // 2
        2, // 3
        3, // 4
        4, // 5
        5, // 6
        6, // 7
        5, // 8
        4, // 9
        3, // 10
        2, // 11
        1, // 12
    ];

    static TOTAL = Roll.PROBABILITIES.reduce((a, b) => a + b);
    static DEFAULT_MULTIPLIER = Roll.PROBABILITIES.map((v) => v / Roll.TOTAL);
    static DELTA = 0.4;
    static COEFS = [
        1, // 2
        0.9, // 3
        0.8, // 4
        0.7, // 5
        0.6, // 6
        0.5, // 7
        0.6, // 8
        0.7, // 9
        0.8, // 10
        0.9, // 11
        1, // 12
    ];

    constructor() {
        this.probabilites = [...Roll.PROBABILITIES];
        this.pivots = this.getPivots();
        this.history = [];
    }

    updateProbabilities(index) {
        const rollDelta = this.probabilites[index] * Roll.DELTA * Roll.COEFS[index];
        const coef = 1 / (1 - Roll.DEFAULT_MULTIPLIER[index]);
        this.probabilites.forEach((_, i) => {
            if (i === index) {
                this.probabilites[i] -= rollDelta;
            } else {
                this.probabilites[i] += rollDelta * Roll.DEFAULT_MULTIPLIER[i] * coef;
            }
        });
    }

    getPivots() {
        return this.probabilites.reduce((res, v) => {
            res.push(v / Roll.TOTAL + res[res.length - 1]);
            return res;
        }, [0]);
    }

    getIndex(value, pivots) {
        for (let i = 0; i < pivots.length; i++) {
            if (value >= pivots[i] && value < pivots[i + 1]) {
                return i;
            }
        }
    }

    roll() {
        this.randomValue = Math.random();
        const index = this.getIndex(this.randomValue, this.pivots);
        this.updateProbabilities(index);
        this.history.push(index + 2);
        this.pivots = this.getPivots();
        return index + 2;
    }
}


const all = Array.from({ length: 10 }, _ => new Roll()).map(r => {
    for (let i = 0; i < 100; i++) r.roll();

    return r.history.reduce((o, v) => {
        o[v] = (o[v] || 0) + 1;
        return o;
    }, {});
});
console.log('100 ROLLS');
console.log('-----RAW------');
console.log(all);
console.log('------%-------');
console.log(all.map((o) => Object.entries(o).reduce((res, [k, v]) => {
    res[k] = v / 100;
    return res;
}, {})));