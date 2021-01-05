export interface User {
  id: number;

  email: string;

  username: string;

  password: string;

  displayName: string;

  profileBio: string;

  socialProvider: string;

  socialProviderId: string;

  photo: string;

  verified: boolean;

  createdAt: Date;

  updatedAt: Date;
}
