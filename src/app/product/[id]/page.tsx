import ProductDetails from "@/components/products/ProductDetails";

const ProductDetailsPage = async ({params}: {params: { id: string }}) => {
  const productId = params.id;

  return <ProductDetails productId={productId} />;
};

export default ProductDetailsPage;
