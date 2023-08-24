export interface UserDetails {
  userId: String;
  username: String;
  roles: String[];
  createdOn: Date;
  banned: boolean;
  disabled: boolean;
}
export interface TokenReturn {
  token: string;
  expires: string;
}

export interface LoginReturnDetails {
  token: TokenReturn;
  details: UserDetails;
}
