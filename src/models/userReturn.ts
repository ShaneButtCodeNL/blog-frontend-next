export interface UserDetails {
  userId: String;
  username: String;
  roles: String[];
  createdOn: Date;
  banned: boolean;
  disabled: boolean;
}

export interface LoginReturnDetails {
  token: String;
  details: UserDetails;
}
