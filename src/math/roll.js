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
    static DELTA = 0.5;

    constructor() {
        this.probabilites = [...Roll.PROBABILITIES];
        this.pivots = this.getPivots();
        this.prevPivots = this.pivots;
        this.history = [];
    }

    updateProbabilities(index) {
        const coef = 1 / (1 - Roll.DEFAULT_MULTIPLIER[index]);
        this.probabilites.forEach((_, i) => {
            if (i === index) {
                this.probabilites[i] -= Roll.DELTA;
            } else {
                this.probabilites[i] += Roll.DELTA * Roll.DEFAULT_MULTIPLIER[i] * coef;
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
        this.prevPivots = this.getPivots();
        const index = this.getIndex(this.randomValue, this.prevPivots);
        this.updateProbabilities(index);
        this.history.push(index + 2);
        this.pivots = this.getPivots();
        return index + 2;
    }
}


// const all = Array.from({ length: 10 }, _ => new Roll).map(r => {
//     for (let i = 0; i < 60; i++) r.roll();

//     return r.history.reduce((o, v) => {
//         o[v] = (o[v] || 0) + 1;
//         return o;
//     }, {});
// });
// console.log(all);