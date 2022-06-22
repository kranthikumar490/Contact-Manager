import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../shared/model';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-group-contacts',
  templateUrl: './group-contacts.component.html',
  styleUrls: ['./group-contacts.component.css'],
})
export class GroupContactsComponent implements OnInit {
  selectedContact!: Contact;
  public contactForm!: FormGroup;
  contacts!: Contact[];
  showAdd!: boolean;
  showUpdate!: boolean;
  groupId!: string;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
    });
    this.groupId = this.route.snapshot.params['id'];
    this.getContactsOfGroup();
  }

  createContact() {
    const contact = this.contactForm.value;
    contact.groupId = this.groupId;

    this.api.createContact(contact).subscribe(
      (res) => {
        console.log(res);
        alert('Contact created Successfully');
        let ref = document.getElementById('cancel');
        ref?.click();
        this.contactForm.reset();
        this.getContactsOfGroup();
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  getContactsOfGroup() {
    this.api.getContactsOfGroup(this.groupId).subscribe((res) => {
      this.contacts = [];
      for (let id in res) {
        const contact = new Contact();
        contact.id = id;
        contact.email = res[id].email;
        contact.firstName = res[id].firstName;
        contact.lastName = res[id].lastName;
        contact.groupId = res[id].groupId;
        contact.mobile = res[id].mobile;
        this.contacts.push(contact);
      }
    });
  }

  deleteContact(contact: Contact) {
    this.api.deleteContact(contact.id).subscribe((res) => {
      this.getContactsOfGroup();
      alert('Contact Deleted');
    });
  }

  editContact(contact: Contact) {
    this.contactForm.patchValue(contact);
    this.showUpdate = true;
    this.selectedContact = contact;
  }

  updateContactDetails() {
    const contact = this.contactForm.value;
    contact.groupId = this.groupId;
    contact.id = this.selectedContact.id;
    this.api.updateContact(contact).subscribe((res) => {
      this.getContactsOfGroup();
      this.showUpdate = false;
      this.contactForm.reset();
      let ref = document.getElementById('cancel');
      ref?.click();
      alert('Contact updated');
    });
  }

  closeModal() {
    this.contactForm.reset();
  }

  logout() {
    this.api.setUserDetails(null);
    this.router.navigate(['login']);
  }
}
