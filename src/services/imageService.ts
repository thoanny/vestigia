const URL = import.meta.env.VITE_API_URL;

class ImageService {
  getUrl(path: string): string {
    return `${URL}/uploads/api/vestigia${path}`;
  }
}

export const imageService = new ImageService();
