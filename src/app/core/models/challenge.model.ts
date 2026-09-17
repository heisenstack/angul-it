export interface Challenge {
    id: string;
    prompt: string;
    answer: string;
}

export interface ChallengeResult {
    challengId: string;
    correct: boolean;
}
