'use client';

import { useState } from 'react';
import { Product } from '@/mocks/payments';
import ProductListSection from './product-list-section';
import {
  SectionTopToolbar,
  BackButton,
  SectionTopButtonArea
} from '@/components/section';
import ProductDialog from './product-form-dialog';
import { Button } from '@/components/ui/button';

interface ProductManagementViewProps {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  goBack: () => void;
}

export default function ProductManagementView({
  products,
  addProduct,
  updateProduct,
  goBack
}: ProductManagementViewProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const onUpdateProduct = (product: Product) => {
    updateProduct(product);
    setSelectedProduct(null);
  };

  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>결제 목록</BackButton>
        <SectionTopButtonArea>
          <Button
            onClick={() => {
              setOpen(true);
              setSelectedProduct(null);
            }}
          >
            결제 항목 추가
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <ProductListSection products={products} selectProduct={selectProduct} />
      <ProductDialog
        addProduct={addProduct}
        updateProduct={onUpdateProduct}
        initialData={selectedProduct}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
