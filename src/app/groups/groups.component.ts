import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { Contact, Group } from '../shared/model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  public contactForm!: FormGroup;
  public groupForm!: FormGroup;
  groups!: Group[];
  showAdd: boolean = false;
  showUpdate!: boolean;
  groupName!: string;
  isStatusChangeInProcess: boolean = false;
  contact!: Contact;
  selectedGroup!: Group;
  groupNameForEdit!: string;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      groupName: [''],
    });
    this.contactForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
    });
    this.getAllGroups();
  }

  postGroup() {
    const group = new Group();
    group.groupName = this.groupForm.value.groupName;
    group.createdBy = this.api.getUserDetails().localId;

    this.api.createGroup(group).subscribe(
      (res) => {
        console.log(res);
        this.showAdd = false;
        this.getAllGroups();
        this.groupForm.reset();
        alert('Group Created Successfully');
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  getAllGroups() {
    this.api.getAllGroups().subscribe((res) => {
      this.groups = [];
      for (let id in res) {
        const group = res[id];
        group.id = id;
        this.groups.push(group);
      }
    });
  }

  deleteGroup(group: Group) {
    this.api.deleteGroup(group.id).subscribe((res) => {
      alert(group.groupName + ' Group Deleted');
      this.getAllGroups();
    });
  }

  logout() {
    this.api.setUserDetails(null);
    this.router.navigate(['login']);
  }

  createGroup() {
    this.showAdd = true;
  }

  deactivateGroup(group: Group) {
    this.isStatusChangeInProcess = true;
    this.api.toggleGroupStatus(group.id, false).subscribe((res) => {
      this.getAllGroups();
      this.isStatusChangeInProcess = false;
      alert('group is inactive');
    });
  }

  activateGroup(group: Group) {
    this.isStatusChangeInProcess = true;
    this.api.toggleGroupStatus(group.id, true).subscribe((res) => {
      this.isStatusChangeInProcess = false;
      this.getAllGroups();
      alert('group is active');
    });
  }

  openCreateContactModal(group: Group) {
    this.selectedGroup = group;
  }

  createContact() {
    this.contact = this.contactForm.value;
    this.contact.groupId = this.selectedGroup.id;
    this.api.createContact(this.contact).subscribe(
      (res) => {
        console.log(res);
        alert(
          'Contact created Successfully for group ' +
            this.selectedGroup.groupName
        );
        let ref = document.getElementById('cancel');
        ref?.click();
        this.contactForm.reset();
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  openEdit(group: Group) {
    this.groupNameForEdit = group.groupName;
    this.groups
      .filter((grp) => grp.id === group.id)
      .map((grp) => (grp.isEditing = true));
  }

  editGroup(originalGroup: Group) {
    originalGroup.groupName = this.groupNameForEdit;
    delete originalGroup.isEditing;
    this.api.editGroup(originalGroup).subscribe((res) => {
      this.getAllGroups();
      this.groupNameForEdit = '';
      alert('group updated');
    });
  }
}
