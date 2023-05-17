class Problem {
    distributions: ScoreDistribution[] = [];

    constructor(dist: ScoreDistribution[]) {
        this.distributions = dist;
    }
}

class ScoreDistribution {
    score: number = 0;
    count: number = 0;

    constructor(score: number, count: number) {
        this.score = score;
        this.count = count;
    }
}

export {Problem, ScoreDistribution}
