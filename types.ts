export interface Submission {
  id: string;
  fullName: string;
  dateOfBirth: string;
  cpf: string;
  phone: string;
  email: string;
  allergies: string;
  hasInterest: boolean;
  itemsToBring: string;
}

export type NewSubmission = Omit<Submission, 'id'>;