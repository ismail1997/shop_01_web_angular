import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageLoadingService {
  imagesToShow: { [key: number]: string } = {};

  constructor() { }

  createImageFromBlob(image: Blob, id: number): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imagesToShow[id] = reader.result as string;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
