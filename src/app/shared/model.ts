export class Contact {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  mobile!: string;
  groupId!: string;
}

export class Group {
  id: string;
  groupName: string;
  createdBy: string;
  isActive: boolean = true;
  isEditing: boolean;
  constructor() {
    this.isActive = true;
  }
}

export class UserDetails {
  idToken: string;
  email: string;
  localId: string;
  constructor(idToken: string, email: string, localId: string) {
    this.idToken = idToken;
    this.email = email;
    this.localId = localId;
  }
}
