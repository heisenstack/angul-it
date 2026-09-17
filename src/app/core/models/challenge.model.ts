export interface Challenge {
    id: string;
    prompt: string;
    answer: string;
}

export interface ChallengeResult {
    challengeId: string;
    correct: boolean;
}
