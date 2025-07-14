import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, UserAdmin } from '../services/user-admin/user-admin';

@Component({
  selector: 'app-manage-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.css',
})
export class ManageUser implements OnInit {
  admins: User[] = [];
  editMode: boolean = false;
  selectedAdmin: User | null = null;

  admin: User = {
    username: '',
    email: '',
    password: '',
    role: 'admin',
    isActive: true,
    moduleAccess: {
      lcf: false,
      incomeExpense: false,
      members: false,
      user: false,
    },
  };

  constructor(private useradminService: UserAdmin) {}

  ngOnInit() {
    this.loadAdmins();
  }

  createAdmin() {
    console.log(this.admin);

    this.useradminService.createAdminBySuperAdmin(this.admin).subscribe({
      next: () => {
        alert('Admin created successfully');
        this.loadAdmins();

        this.admin = {
          username: '',
          email: '',
          password: '',
          role: 'admin',
          isActive: true,
          moduleAccess: {
            lcf: false,
            incomeExpense: false,
            members: false,
            user: false,
          },
        };
      },
      error: (err) => alert('Error: ' + err.message),
    });
  }

  loadAdmins() {
    this.useradminService
      .getAllAdmins()
      .subscribe((data) => (this.admins = data));
  }

  edit(user: User) {
    this.selectedAdmin = { ...user };
    this.editMode = true;
  }

  save() {
    if (!this.selectedAdmin?._id) return;

    this.useradminService
      .editAdmin(this.selectedAdmin._id, this.selectedAdmin)
      .subscribe(() => {
        this.editMode = false;
        this.selectedAdmin = null;
        this.loadAdmins();
      });
  }

  cancel() {
    this.editMode = false;
    this.selectedAdmin = null;
  }

  delete(id: string) {
    if (confirm('Are you sure?')) {
      this.useradminService.deleteAdmin(id).subscribe(() => {
        this.loadAdmins();
      });
    }
  }
}
