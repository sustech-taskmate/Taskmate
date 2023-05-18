import {Submission} from "@/composable/serverRequest";

export function getStatisticalInformation(submissions: Submission[]) {
    const nullIgnoreScores = submissions.map(submission =>
        ({...submission, score: submission.score === null ? 0 : submission.score}));
    let median: number | null;
    if (nullIgnoreScores.length > 0) {
        const sortedScores = nullIgnoreScores.sort((a, b) => a.score as number - b.score as number);
        const midIndex = Math.floor(sortedScores.length / 2);
        if (sortedScores.length % 2 === 0) {
            median = (sortedScores[midIndex - 1].score as number + sortedScores[midIndex].score as number) / 2.0;
        } else {
            median = sortedScores[midIndex].score as number;
        }
    } else {
        median = null;
    }
    const average = nullIgnoreScores.length > 0 ?
        nullIgnoreScores.reduce((a, b) => a + b.score as number, 0) / nullIgnoreScores.length : null;
    const minimum = nullIgnoreScores.length > 0 ? Math.min(...nullIgnoreScores.map(submission => submission.score as number)) : null;
    const maximum = nullIgnoreScores.length > 0 ? Math.max(...nullIgnoreScores.map(submission => submission.score as number)) : null;
    return [average, median, minimum, maximum]
}


export function getScoreDistribution(submissions: Submission[]) {
    const nullIgnoreScores = submissions.map(submission =>
        ({...submission, score: submission.score === null ? 0 : submission.score}));
    const scoreDistribution = new Map<string, number>();
    scoreDistribution.set('< 60', 0);
    scoreDistribution.set('60-69', 0);
    scoreDistribution.set('70-79', 0);
    scoreDistribution.set('80-89', 0);
    scoreDistribution.set('90-99', 0);
    scoreDistribution.set('≥ 100', 0);
    nullIgnoreScores.forEach(submission => {
        const score = submission.score as number;
        const range = judgeRange(score);
        scoreDistribution.set(range, scoreDistribution.get(range) as number + 1);
    });
    return scoreDistribution;
}

function judgeRange(score: number) {
    if (score < 60) {
        return '< 60'
    } else if (score < 70) {
        return '60-69'
    } else if (score < 80) {
        return '70-79'
    } else if (score < 90) {
        return '80-89'
    } else if (score < 100) {
        return '90-99'
    } else {
        return '≥ 100'
    }
}

export function getPrefixData(submissions: Submission[]) {
    const nullIgnoreScores = submissions.map(submission =>
        ({...submission, score: submission.score === null ? 0 : submission.score}));
    const prefixData = new Array(11).fill(0);
    nullIgnoreScores.forEach(submission => {
        if (submission.score > 100) {
            prefixData[10]++;
            return;
        }
        for (let i = 10;i >= 0;i--) {
            if (submission.score as number <= i * 10) {
                prefixData[i]++;
            } else break;
        }
    })
    return prefixData;
}

export function getSuffixData(submissions: Submission[]) {
    const nullIgnoreScores = submissions.map(submission =>
        ({...submission, score: submission.score === null ? 0 : submission.score}));
    const suffixData = new Array(11).fill(0);
    nullIgnoreScores.forEach(submission => {
        for (let i = 0;i <= 10;i++) {
            if (submission.score as number >= i * 10) {
                suffixData[i]++;
            } else break;
        }
    })
    return suffixData;
}
