export interface UserDetails {
  userId: String;
  username: String;
  roles: String[];
  createdOn: Date;
  isBanned: boolean;
  isDisabled: boolean;
}

export interface LoginReturnDetails {
  token: String;
  details: UserDetails;
}
