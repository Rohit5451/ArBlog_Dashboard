import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/app/Services/categories.service';
import { PostsService } from 'src/app/Services/posts.service';
import { Category } from 'src/app/models/category';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  imgSrc: any = '../../../assets/Image/jk-placeholder-image.jpg';
  selectedImg: any;
  categories: Category[] = [];
  postForm!: FormGroup;
  post : any;
  formStatus : string = 'Add New';
  docId : string = '';


  constructor(private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe(val => {

      this.docId = val['id'];

      if(this.docId){
        this.postService.loadOneData(val['id']).subscribe(post =>{

          this.post=post;
  
          this.postForm = this.fb.group({
            title: [this.post.title, [Validators.required, Validators.minLength(10)]],
            permalink: [this.post.permalink],
            excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(50)]],
            category: [`${this.post.category.categoryId}-${this.post.category.category}`, [Validators.required]],
            postImg: ['', [Validators.required]],
            content: [this.post.content, [Validators.required]]
          })
  
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit'
        })
      }else{
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: [''],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', [Validators.required]],
          postImg: ['', [Validators.required]],
          content: ['', [Validators.required]]
        })
      }
      
    });

    


    
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categories = val.map(categoryData => categoryData.data as Category);
    });
  }

  get fc() {
    return this.postForm.controls;
  }



  onTitleChanged($event: any) {
    let title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imgSrc = e.target.result;
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit() {
    console.log(this.postForm.value)


    let splitted = this.postForm.value.category.split('-');

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    }

    this.postService.uploadImage(this.selectedImg, postData,this.formStatus,this.docId);
    this.postForm.reset();
    this.imgSrc = '../../../assets/Image/jk-placeholder-image.jpg';
  }




}
