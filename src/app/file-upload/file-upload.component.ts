import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { TasksService } from '../tasks/tasks.service';
import * as XLSX from 'xlsx';
import { UserService } from '../user/user.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnDestroy,OnInit {
  userId$ = new BehaviorSubject<string>('');
  private userIdSubscription: Subscription | undefined;
  uploadInProgress = false;
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  constructor(private taskService: TasksService, private user: UserService) {
    this.user.getUserId().subscribe(
      userId => {
        console.log('Received userId:', userId);
        if (userId) {
          this.userId$.next(userId);
        }
      },
      error => {
        console.error('Error retrieving user ID:', error);
      }
    );
  }
  ngOnInit(): void {
   
  }
 

  ngOnDestroy() {
    this.userIdSubscription?.unsubscribe();
  }

  onUpload() {
    const fileInput = this.fileInputRef?.nativeElement;
    if (!fileInput) {
      console.error('File input element not found.');
      return;
    }

    const file = fileInput?.files?.[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }

   
    const templateNameRegex = /^nomad_(\w+)_template\.xlsx$/;
    const match = file.name.match(templateNameRegex);

    if (!match) {
      console.error('Invalid file name. File name should match the template name pattern (e.g., nomad_abc_template.xlsx).');
      return;
    }

    const expectedUserId = match[1];
    this.uploadInProgress = true;
    this.validateFileAndUpload(file, expectedUserId);
  }

  private validateFileAndUpload(file: File, expectedUserId: string) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result as string;
  
     
      if (!this.isTemplateValid(fileData)) {
        console.error('Invalid template format or data. Please ensure all fields contain strings.');
        return;
      }
  
      
      const workbook: XLSX.WorkBook = XLSX.read(fileData, { type: 'binary' });
      const worksheet: XLSX.WorkSheet = workbook.Sheets['template'];
  
      
      const range = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
      const rows: string[][] = [];
      for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        const row: string[] = [];
        for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
          const address = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
          const cellValue = (worksheet[address] ? worksheet[address].v : undefined) as string;
          row.push(cellValue);
        }
        rows.push(row);
      }
      const rowsJSON = JSON.stringify(rows);

      console.log(rowsJSON);
  
      
      const userIdColumn = rows.map(row => row[0]);
      console.log(userIdColumn);
     
      const filteredUserIdColumn = userIdColumn.filter((userId) => typeof userId === 'string' && userId.trim() !== '');
      console.log(filteredUserIdColumn);
      console.log(expectedUserId);

      if (!filteredUserIdColumn.some((userId) => userId === expectedUserId)) {
        console.error('Uploaded file does not match the expected user ID.');
        return;
      }
  
     
      const formData = new FormData();
      formData.append('file', file, file.name);
      console.log('FormData for file upload:', formData);
      console.log(file);
      this.taskService.uploadBulkData(formData).pipe(
        take(1),
        catchError(error => {
          console.error('Error uploading file:', error);
          
          return [];
        })
      ).subscribe(
        () => {
          console.log('File uploaded successfully.');
        
      
          this.uploadInProgress = false;
          this.ngOnInit;
        },
        error => {
          console.error('Error uploading file:', error);
         
          this.uploadInProgress = false; 
        }
      );
    };
  
    reader.readAsBinaryString(file);
  }
  
  
  
  
  private isTemplateValid(fileData: string): boolean {
    const expectedHeaders = ['UserID', 'Title', 'Content', 'Status'];
    const workbook: XLSX.WorkBook = XLSX.read(fileData, { type: 'binary' });
    const worksheet: XLSX.WorkSheet = workbook.Sheets['template'];
    const headers: string[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
    for (const header of expectedHeaders) {
      if (!headers.includes(header)) {
        return false;
      }
    }
    const dataRows: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 }) as string[][];
    for (const row of dataRows) {
      for (let i = 1; i < row.length; i++) {
        if (typeof row[i] !== 'string') {
          return false;
        }
      }
    }
  
    return true;
  }

  async onDownloadTemplate() {
    const templateData = [
      ['UserID', 'Title', 'Content', 'Status'],
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'template');
    const userId = this.userId$.getValue();
    XLSX.writeFile(workbook, `nomad_${userId}_template.xlsx`);
  }
}
