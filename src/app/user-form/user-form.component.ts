import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import html2pdf from 'html2pdf.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import necessary modules
import { Router } from '@angular/router';
// import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';
// import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements AfterViewInit{
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  ngAfterViewInit() {
    this.hidePdfContent();
  }
  userForm: FormGroup; 
  showUserListModal = false;
  selectedUserForPrint: any;
  


  showUserList() {
    this.showUserListModal = true;
  }
  hideUserList() {
    this.showUserListModal = false;
  }

  selectUserForPrint(user: any) {
    this.selectedUserForPrint = { ...user };
    console.log(this.selectUserForPrint,">>>>>>>>>")
    this.hideUserList();
console.log("hi form print slected")
    this.generatePDF();
  }
  user = {

    name: '',
    dob: '',
    profession: '',
    hobbies: [],
    image: ''
  };

  constructor(private fb: FormBuilder, private Router:Router) {
    this.userForm = this.fb.group({
      name: [''], 
      dob: [''],
      profession: [''],
    });
  }
  usersArray: any[] = [];
  showEditModal = false;
  selectedUserForEdit: any;

  // @ViewChild('pdfContent') pdfContent!: ElementRef;

  onSubmit() {
    if (!this.userForm.valid) {
      console.warn('Form is invalid. Please fill in all required fields.');
      return;
    }

    this.usersArray.push({ ...this.user });
    this.resetForm();
    console.log('User saved:', this.usersArray);
    alert("User information saved successfully")
  }

  onFileChange(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === 'image/png' && file.size < 1024000) { 
      console.log('File selected:', file);
      this.user.image = file;
    } else {
      console.warn('Invalid file. Please select a PNG file with less than 10KB size.');
      fileInput.value = '';
    }
  }

  resetForm() {
    this.user = {
      name: '',
      dob: '',
      profession: '',
      hobbies: [],
      image: ''
    };

    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  showEditList() {
    this.showEditModal = true;
  }

  hideEditList() {
    this.showEditModal = false;
  }

  selectUserForEdit(user: any) {
    console.log("hello")
    console.log(user,"user")
    this.selectedUserForEdit = { ...user };
    console.log(this.selectedUserForEdit,"selectedUser")

  }

  generatePDF() {
    if (!this.selectedUserForPrint) {
      console.warn('No user selected for printing.');
      return;
    }
  
    const content = this.pdfContent.nativeElement;
    content.style.display = 'block';
  
    const pdfOptions = {
      margin: 10,
      filename: 'user_information.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true }, 
    };
  
    document.fonts.ready.then(() => {
      html2canvas(content, { scale: 2, useCORS: true }).then((canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, 210, 297);
        const hobbiesText = Array.isArray(this.selectedUserForPrint.hobbies)
        ? this.selectedUserForPrint.hobbies.join(', ')
        : 'N/A'; 
          const userText = `Name: ${this.selectedUserForPrint.name}\n` +
                         `Date of Birth: ${this.selectedUserForPrint.dob}\n` +
                         `Profession: ${this.selectedUserForPrint.profession}\n` +
                         `Hobbies: ${hobbiesText}`;
        pdf.text(userText, 15, 20);
  
        pdf.save(pdfOptions.filename);
  
        content.style.display = 'none';
        alert("User information PDF created successfully")
      });
    });
  }
  
   

  private hidePdfContent() {
    if (this.pdfContent) {
      const content = this.pdfContent.nativeElement;
      content.style.display = 'none';
    }
  }
  

  // updateUser() {
  //   console.log("in updateUser")
  //   const index = this.usersArray.findIndex(user => user.name === this.selectedUserForEdit.name);
  //   console.log(index,"index")
  //   console.log(this.selectedUserForEdit)
  //   if (index !== -1) {
  //     this.usersArray[index] = { ...this.selectedUserForEdit };
  //     console.log('User updated:', this.usersArray[index]);
  //     this.selectedUserForEdit = null;
  //     this.hideEditList();
  //     alert("User updated sucessfully")
  //     console.log("updated")
  //   }
  // }
  updateUser() {
    console.log("in updateUser");

    const index = this.usersArray.findIndex(user => user.name === this.selectedUserForEdit.name);
    console.log("Index:", index)

    console.log('Existing user:', this.usersArray[index]);
    console.log('Updated user data:', { ...this.selectedUserForEdit });
    this.usersArray[index] = { ...this.selectedUserForEdit };

    console.log('User updated:', this.usersArray[index]);

    this.selectedUserForEdit = null;
    this.hideEditList();

    alert("User updated successfully");
    console.log("Updated");
}


  onEditFileChange(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file && file.type === 'image/png' && file.size < 10240) {
      console.log('File selected for edit:', file);
      this.selectedUserForEdit.image = file;
    } else {
      console.warn('Invalid file for edit. Please select a PNG file with less than 10KB size.');
      fileInput.value = '';
    }
  }

  // generatePDF() {
  //   if (!this.selectedUserForEdit) {
  //     console.warn('No user selected for printing.');
  //     return;
  //   }
  
  //   const content = this.pdfContent.nativeElement;
  //   content.style.display = 'block';
  
  //   const options = {
  //     margin: 10,
  //     filename: 'user_information.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //   };
  
  //   html2pdf().from(content).set(options).outputPdf((pdf: any) => { // Explicitly declare the type of pdf
  //     content.style.display = 'none';
  //     pdf.save();
  //   });
  // }








private dataURLtoBlob(dataURL: string): Blob {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const byteCharacters = atob(parts[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
  
  
}
