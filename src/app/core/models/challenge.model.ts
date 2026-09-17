export type ChallengeType = 'math' | 'text' | 'image-select';
export interface Challenge {
    id: string;
    type: ChallengeType;
    options?: string[];
    prompt: string;
    answer: string | string[];
}

export interface ChallengeResult {
    challengeId: string;
    correct: boolean;
}
