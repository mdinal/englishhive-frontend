export type MaterialType = 'DIGITAL_PDF' | 'PHYSICAL_BOOK' | 'AUDIO_BANK';

export interface Material {
  id: number;
  title: string;
  category: string;
  materialType: MaterialType;
  description: string;
  price: number;
  coverImageUrl: string;
  samplePreviewUrl?: string;
}

export interface CartItem {
  itemType: 'COURSE' | 'MATERIAL';
  referenceId: number;
  itemTitle: string;
  price: number;
  thumbnailUrl?: string;
}

export interface OrderItem {
  id: number;
  itemType: string;
  referenceId: number;
  itemTitle: string;
  price: number;
}

export interface Order {
  id: number;
  studentId: number;
  studentEmail: string;
  totalAmount: number;
  discountAmount: number;
  promoCode?: string;
  status: string;
  transactionId: string;
  createdAt: string;
  items: OrderItem[];
}
