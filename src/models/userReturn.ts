export interface UserDetails {
  userId: String;
  username: String;
  roles: String[];
  createdOn: Date;
}

export interface LoginReturnDetails {
  token: String;
  details: UserDetails;
}
