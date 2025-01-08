export interface ButtonQuestion {
  id: number;
  text: string;
  type: 'button';
  options: {
    yes: string;
    no: string;
  };
}

export interface InputQuestion {
  id: number;
  text: string;
  type: 'input';
  placeholder: string;
}

export type Question = ButtonQuestion | InputQuestion;

export interface Answer {
  questionId: number;
  answer: string | boolean;
  timestamp: string;
} 