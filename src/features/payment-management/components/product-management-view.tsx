'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import ProductListSection from './product-list-section';
import ProductFormDialog from './product-form-dialog';
import { PayableItemRestResponse } from '@/lib/api/types.gen';

interface ProductManagementViewProps {
  products: PayableItemRestResponse[];
  addProduct: (product: PayableItemRestResponse) => void;
  updateProduct: (product: PayableItemRestResponse) => void;
  goBack: () => void;
}

export default function ProductManagementView({
  products,
  addProduct,
  updateProduct,
  goBack
}: ProductManagementViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<PayableItemRestResponse | null>(null);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleProductSelect = (product: PayableItemRestResponse) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Button variant='outline' onClick={goBack} className='mr-2'>
            뒤로 가기
          </Button>
          <Button onClick={handleAddClick}>결제 항목 추가</Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <ProductListSection
        products={products}
        selectProduct={handleProductSelect}
      />
      <ProductFormDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        addProduct={addProduct}
        updateProduct={updateProduct}
        initialData={selectedProduct}
      />
    </>
  );
}
