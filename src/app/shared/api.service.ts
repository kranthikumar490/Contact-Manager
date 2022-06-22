import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact, Group, UserDetails } from './model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  userDetails!: UserDetails;
  userLoggedIn!: boolean;

  setUserDetails(userDetails: UserDetails) {
    this.userDetails = userDetails;
    this.userLoggedIn = userDetails != null;
  }

  getUserDetails(): UserDetails {
    return this.userDetails;
  }

  isUserLoggedIn(): boolean {
    return this.userLoggedIn;
  }

  createGroup(data: Group) {
    return this.http
      .post<any>(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/groups.json',
        data
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getAllGroups() {
    return this.http
      .get<any>(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/groups.json?orderBy="createdBy"&equalTo="' +
          this.userDetails.localId +
          '"'
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  toggleGroupStatus(id: string, isActive: boolean) {
    return this.http
      .patch(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/groups/' +
          id +
          '.json',
        {
          isActive: isActive,
        }
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  editGroup(group: Group) {
    return this.http
      .put(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/groups/' +
          group.id +
          '.json',
        group
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  deleteGroup(groupId: string) {
    const reqs = [];
    return new Observable((obs) => {
      this.getContactsOfGroup(groupId).subscribe((res) => {
        const deleteGroup = this.http.delete(
          'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/groups/' +
            groupId +
            '.json'
        );
        reqs.push(deleteGroup);
        for (let id in res) {
          const deleteGroupContact = this.http.delete(
            'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/' +
              id +
              '.json'
          );
          reqs.push(deleteGroupContact);
        }
        return forkJoin(reqs)
          .pipe(
            map((res: any) => {
              return res;
            })
          )
          .subscribe((data) => obs.next(data));
      });
    });
  }

  createContact(data: Contact) {
    return this.http
      .post<any>(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/contacts.json',
        data
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getContactsOfGroup(groupId: string) {
    return this.http
      .get<any>(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/contacts.json?orderBy="groupId"&equalTo="' +
          groupId +
          '"'
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  updateContact(contact: Contact) {
    return this.http
      .put<any>(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/' +
          contact.id +
          '.json',
        contact
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  toggleContactStatus(id: string, isActive: boolean) {
    return this.http
      .patch(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/' +
          id +
          '.json',
        {
          isActive: isActive,
        }
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  deleteContact(id: string) {
    return this.http
      .delete<any>(
        'https://contact-manager-3dbcd-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/' +
          id +
          '.json'
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
