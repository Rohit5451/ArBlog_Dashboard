import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../Services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categoryArray: Category[] = [];
  formCategory!: string;
  formStatus: string = 'Add';
  categoryId: string | undefined;

  constructor(private categoryService: CategoriesService) { }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(dataArray => {
      this.categoryArray = dataArray.map(item => {
        const category = item.data as Category;
        category.id = item.id;
        return category;
      });
    });
  }

  onSubmit(formData: any) {
    let categoryData: Category = {
      category: formData.value.category
    };

    if (this.formStatus === 'Add') {
      this.categoryService.savedata(categoryData);
      formData.reset();
    } else if (this.formStatus === 'Edit') {
      this.categoryService.updateData(this.categoryId, categoryData);
      formData.reset();
      this.formStatus = 'Add';
    }
  }

  onEdit(category: string, id?: string) {
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = id;
  }

  onDelete(id:any ){
    this.categoryService.deleteData(id);
  }





}
