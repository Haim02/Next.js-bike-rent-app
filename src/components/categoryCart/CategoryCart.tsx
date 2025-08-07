
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/button/Button";
import bike from "../../../public/images/bike.png";
import scooter from "../../../public/images/scooter.webp";

const CategoryCards = () => {
  const categories = [
    {
      title: "אופניים",
      image: bike,
      link: "/products",
    },
    {
      title: "קורקינטים",
      image: scooter,
      link: "/products",
    },
  ];

  return (
    <section className="w-full py-12 px-6 md:px-12">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        קטגוריות פופולריות
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category.title}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.03] focus-within:scale-[1.03]"
          >
            <div className="overflow-hidden">
              <Image
                priority
                src={category.image}
                alt={category.title}
                className="w-full h-65 object-center transform transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {category.title}
              </h3>
              <Link href={category.link}>
                <Button text="עוד" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
