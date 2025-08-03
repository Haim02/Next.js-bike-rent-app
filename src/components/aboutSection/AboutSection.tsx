import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/button/Button';
import bike from '../../../public/images/aboutBike.png'


const AboutSection = () => {
  return (
    <section className="w-full px-6 md:px-12 py-14 bg-white">
      <div className="flex flex-col md:flex-row-reverse items-center gap-10">
        <div className="w-full md:w-1/2 text-right">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            ברוכים הבאים לאתר שלנו!
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            היעד האולטימטיבי לשכור ולהשכיר אופניים וקורקינט חשמליים! הפלטפורמה שלנו מציעה פתרון נוח וידידותי לסביבה לצרכי התחבורה שלך.
            בין אם אתם מחפשים לחקור את העיר, לנסוע לעבודה, או ליהנות מרכיבה נינוחה – אנחנו מבטיחים לכם, עם מבחר האופניים והקורקינטים החשמליים שלנו, תוכלו לבחור את הכלי המושלם המתאים לסגנון החיים שלכם.
            האתר ידידותי למשתמש ומאפשר לדפדף במבחר הרחב, להשוות דגמים ולבצע הזמנות מקוונות בקלות.
            חוו את הריגוש של נסיעה חלקה ומודעת לסביבה – השכירו אופניים או קורקינט חשמלי עוד היום!
          </p>
          <Link href="/products">
            <Button text="לעיון במבחר" />
          </Link>
        </div>

        <div className="w-full md:w-1/2 relative h-[280px] md:h-[360px]">
          <Image
            src={bike}
            alt="אופניים חשמליים"
            fill
            className="object-fill rounded-xl shadow-md"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
