import ProductDetails from "@/components/products/ProductDetails";

const ProductDetailsPage = async ({params}: {params: Promise<{ id: string }>}) => {
  const productId = (await params).id;

  return <ProductDetails productId={productId} />;
};

export default ProductDetailsPage;
