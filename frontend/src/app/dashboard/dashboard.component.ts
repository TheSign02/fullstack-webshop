import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe, CurrencyPipe], // Required for the internal forms
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'products';
  viewMode: 'list' | 'form' = 'list';

  // Data lists
  products: any[] = [];
  categories: any[] = [];
  users: any[] = [];

  // Internal Forms
  productForm!: FormGroup;
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadProducts();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
    });
  }

  // Toggle View
  openCreateForm() {
    this.editingId = null;
    this.productForm.reset();
    this.viewMode = 'form';
  }

  openEditForm(item: any) {
    this.editingId = item.id;
    this.productForm.patchValue(item);
    this.viewMode = 'form';
  }

  saveProduct() {
    if (this.productForm.invalid) return;
    const data = this.productForm.value;

    const request = this.editingId
      ? this.adminService.updateProduct(this.editingId, data)
      : this.adminService.createProduct(data);

    request.subscribe(() => {
      this.viewMode = 'list';
      this.loadProducts();
    });
  }

  loadProducts() {
    // Call your service here
  }

  // Inside AdminDashboardComponent class

  deleteItem(id: string) {
    const message = `Are you sure you want to delete this ${this.activeTab.slice(0, -1)}?`;

    if (confirm(message)) {
      switch (this.activeTab) {
        case 'products':
          this.adminService.deleteProduct(id).subscribe(() => this.loadProducts());
          break;
        case 'categories':
          this.adminService.deleteCategory(id).subscribe(() => this.loadCategories());
          break;
        case 'users':
          this.adminService.deleteUser(id).subscribe(() => this.loadUsers());
          break;
        default:
          console.warn('Delete not supported for this tab');
      }
    }
  }

  // Ensure you have a method to load categories as well
  loadCategories() {
    this.adminService.getCategories().subscribe((res) => (this.categories = res));
  }
  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => console.error('Error loading users', err),
    });
  }

  // Add this to your deleteItem logic for completeness
  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(id).subscribe(() => {
        this.loadUsers(); // This is the call that was failing
      });
    }
  }
}
