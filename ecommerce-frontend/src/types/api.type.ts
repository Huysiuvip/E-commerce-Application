export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  phone?: string | null;
  emailVerified?: boolean;
  role?: string;
  isAnonymous?: boolean;
  birthday?: string | null;
  gender?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileAddress {
  id: number;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  district: string;
  ward: string;
  postalCode?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  user: User;
  addresses: ProfileAddress[];
}

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  image?: string;
  birthday?: string;
  gender?: string;
}

export interface CreateAddressDto {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  ward: string;
  postalCode?: string;
  isDefault?: boolean;
}

export type UpdateAddressDto = Partial<CreateAddressDto>;

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface ProductSearchQuery {
  query?: string;
  page?: number;
  limit?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating_desc' | 'name_asc' | 'name_desc' | 'created_desc';
}

export interface LocaleApiRow {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
  displayOrder: number;
}

export interface SupportedLocalesResponse {
  defaultLocale: string;
  locales: LocaleApiRow[];
}

export interface ProductTranslationRow {
  id: number;
  productId: number;
  locale: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
}

export interface CategoryTranslationRow {
  id: number;
  categoryId: number;
  locale: string;
  name: string;
  description?: string | null;
}

export interface ProductHighlight {
  name: string;
  shortDescription: string;
  description: string;
}

export interface ProductAttribute {
  id: number;
  key: string;
  value: string;
  group?: string | null;
  displayOrder?: number;
  isFilterable?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: number;
  categoryName: string;
  ratingAverage: number;
  reviewCount: number;
  score: number;
  highlights: ProductHighlight[];
  imageUrl?: string;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  options?: ProductOption[];
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductImage {
  id: number;
  productId: number;
  variantId?: number | null;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: string;
  orderId: number | null;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductDetail extends Product {
  images?: ProductImage[];
  reviews?: ProductReview[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  weight?: number;
  attributes?: ProductAttribute[];
}

export interface ProductPricing {
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  variantPricing: Array<{
    id: number;
    price: number;
    compareAtPrice: number | null;
    stockQuantity: number;
  }>;
}

export interface ProductOptionValue {
  id: number;
  value: string;
  label: string;
  priceModifier?: number;
  displayOrder?: number;
  metadata?: Record<string, unknown> | null;
  optionId?: number;
}

export interface ProductOption {
  id: number;
  name: string;
  type?: string;
  displayOrder?: number;
  values?: ProductOptionValue[];
}

export interface ProductVariantOptionSelection {
  option: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  slug?: string;
  barcode?: string;
  price?: number | null;
  compareAtPrice?: number | null;
  stockQuantity: number;
  lowStockThreshold?: number;
  weight?: number | null;
  imageUrl?: string | null;
  isActive: boolean;
  optionValues?: Array<{
    optionValue?: {
      id?: number;
      optionId?: number;
      value?: string;
      label?: string;
      priceModifier?: number;
      metadata?: Record<string, unknown> | null;
      option?: {
        id?: number;
        name?: string;
      };
    };
  }>;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateOrderItemDto {
  productId: number;
  variantId?: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  billingAddress?: string;
  customerNote?: string;
  couponId?: number;
  items?: CreateOrderItemDto[];
}

export interface OrderItemProductSnapshot {
  id: number;
  name?: string;
  slug?: string;
  sku?: string;
  imageUrl?: string;
  compareAtPrice?: number | null;
  images?: ProductImage[];
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName?: string;
  productSku?: string;
  productImage?: string;
  variantId?: number | null;
  variantTitle?: string | null;
  optionSnapshot?: ProductVariantOptionSelection[];
  quantity: number;
  price: number;
  subtotal?: number;
  product?: OrderItemProductSnapshot | Product | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderCouponSummary {
  id: number;
  code: string;
  description?: string | null;
  discountType?: string;
  discountValue?: number;
}

export interface Order {
  id: number;
  userId?: string;
  orderNumber?: string;
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  taxAmount?: number;
  totalAmount?: number;
  status?: string;
  paymentStatus?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  billingAddress?: string;
  customerNote?: string;
  adminNote?: string;
  couponId?: number;
  coupon?: OrderCouponSummary | null;
  confirmedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  orderItems?: OrderItem[];
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface UpdateOrderDto {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  billingAddress?: string;
  customerNote?: string;
  couponId?: number;
}

export interface UpdateOrderItemDto {
  quantity: number;
}

export interface OrderHistoryPage {
  items: Order[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface WorkflowStep {
  id: number;
  status: string;
  note?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OrderDetailedResponse {
  order: Order;
  products: OrderItem[];
  payment?: Payment;
  workflow?: WorkflowStep[];
}

export interface OrderDetailed extends Order {
  workflow?: WorkflowStep[];
}

export type PaymentMethod =
  | 'cod'
  | 'bank_transfer'
  | 'vnpay'
  | 'momo'
  | 'zalopay';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface Payment {
  id: number;
  orderId: number;
  status: PaymentStatus;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  payosOrderCode?: number;
  paymentLinkUrl?: string;
  qrCode?: string;
  bankBin?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  orderId: number;
  paymentMethod: PaymentMethod;
  amount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  billingAddress?: string;
  customerNote?: string;
}

export interface PaymentStatusResponse {
  id: number;
  orderId?: number;
  status: PaymentStatus;
  amount: number;
  payosMetadata?: {
    orderCode?: number;
    status?: string;
    checkoutUrl?: string;
    amount?: number;
  };
}