import book from '../assets/photos/book.jpg'
import coding from '../assets/photos/coding.jpg'
import design from '../assets/photos/design.jpg'
import light from '../assets/photos/i see the light.jpg'
import laptop from '../assets/photos/laptop.jpg'
import microphone from '../assets/photos/microphone.jpg'
import place from '../assets/photos/place.jpg'
import smile from '../assets/photos/smile.jpg'
import worker from '../assets/photos/worker.jpg'

const gallary = [
    { id: 1, image: book, price: 400, category: "latest" },
    { id: 6, image: design, price: 400, category: "latest" },
    { id: 5, image: coding, price: 400, category: "latest" },
    { id: 2, image: light, price: 500, category: "products" },
    { id: 3, image: laptop, price: 350, category: "products" },
    { id: 11, image: laptop, price: 350, category: "products" },
    { id: 4, image: microphone, price: 600, category: "products" },
    { id: 7, image: place, price: 500, category: "services" },
    { id: 8, image: smile, price: 350, category: "services" },
    { id: 12, image: smile, price: 350, category: "services" },
    { id: 10, image: worker, price: 600, category: "latest" },
];

const GalleryCard = ({ item }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:shadow-xl">
    <img
      className="w-full h-72 sm:h-80 lg:h-[30rem] object-cover transition-transform duration-700 group-hover:scale-110"
      src={item.image}
      alt={item.category}
    />
    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
      <div className="text-white w-full flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <span className="text-lg font-semibold uppercase tracking-wider">{item.category}</span>
        <span className="bg-secondary px-4 py-1 rounded-full text-sm font-bold">KES {item.price}</span>
      </div>
    </div>
  </div>
);

const GallerySection = ({ title, subtitle, items }) => (
  <section className="mb-16">
    <div className="flex flex-col mb-8">
      <h2 className="text-4xl md:text-5xl text-primary font-bold">{title}</h2>
      {subtitle && <h3 className="text-secondary text-xl md:text-2xl mt-2 font-medium">{subtitle}</h3>}
      <div className="h-1 w-20 bg-secondary mt-4 rounded-full"></div>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} />
      ))}
    </div>
  </section>
);

function Body() {
  const sortedLatest = gallary.filter((p) => p.category === "latest");
  const sortedProducts = gallary.filter((p) => p.category === "products");
  const sortedService = gallary.filter((p) => p.category === "services");

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <GallerySection title="Latest Work" items={sortedLatest} />
      <GallerySection title="Products" subtitle="Premium Templates" items={sortedProducts} />
      <GallerySection title="Our Services" subtitle="Custom Designs" items={sortedService} />
    </main>
  );
}

export default Body;