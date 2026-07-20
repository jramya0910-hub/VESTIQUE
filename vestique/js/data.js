/* ============================================================
   VESTIQUE – Application Data (Mock Database)
   ============================================================ */

const DATA = {

  // ── Categories ────────────────────────────────────────────
  categories: [
    { id: 'sarees',     label: 'Sarees',       icon: '🥻' },
    { id: 'lehengas',   label: 'Lehengas',      icon: '👗' },
    { id: 'gowns',      label: 'Gowns',         icon: '🩱' },
    { id: 'blouses',    label: 'Blouses',        icon: '👚' },
    { id: 'jewelry',    label: 'Jewelry',        icon: '💍' },
    { id: 'footwear',   label: 'Footwear',       icon: '👡' },
    { id: 'hair',       label: 'Hair Acc.',      icon: '👑' },
    { id: 'groom',      label: 'Groom Wear',     icon: '🤵' },
    { id: 'couple',     label: 'Couple Wear',    icon: '💑' },
  ],

  // ── Cultural Traditions ───────────────────────────────────
  traditions: [
    { id: 'telugu-brahmin', label: 'Telugu Brahmin',   emoji: '🌸', color: '#8B2252', count: 48 },
    { id: 'tamil-brahmin',  label: 'Tamil Brahmin',    emoji: '🌺', color: '#722F37', count: 42 },
    { id: 'kerala',         label: 'Kerala Wedding',   emoji: '🌴', color: '#2D6A4F', count: 37 },
    { id: 'muslim',         label: 'Muslim Wedding',   emoji: '🌙', color: '#1B4F72', count: 55 },
    { id: 'christian',      label: 'Christian Wedding',emoji: '⛪', color: '#2C3E50', count: 60 },
    { id: 'sikh',           label: 'Sikh Wedding',     emoji: '🙏', color: '#C0392B', count: 44 },
    { id: 'bengali',        label: 'Bengali Wedding',  emoji: '🪷', color: '#D35400', count: 39 },
    { id: 'gujarati',       label: 'Gujarati Wedding', emoji: '💛', color: '#B7950B', count: 41 },
    { id: 'maharashtrian',  label: 'Maharashtrian',    emoji: '🟢', color: '#1E8449', count: 35 },
    { id: 'north-indian',   label: 'North Indian',     emoji: '🏵️', color: '#6C3483', count: 58 },
    { id: 'south-indian',   label: 'South Indian',     emoji: '🌻', color: '#784212', count: 50 },
    { id: 'korean',         label: 'Korean Wedding',   emoji: '🎎', color: '#1A5276', count: 28 },
  ],

  // ── Dresses ───────────────────────────────────────────────
  dresses: [
    {
      id: 'd001', name: 'Crimson Kanjivaram Silk Saree',
      category: 'sarees', tradition: 'south-indian',
      price: 24500, originalPrice: 28000, designer: 'Meenakshi Couture',
      designerId: 'des001', description: 'A breathtaking Kanjivaram silk saree in deep crimson with intricate gold zari work. Perfect for South Indian weddings.',
      fabric: 'Pure Silk', embroidery: 'Zari Weaving', rating: 4.8, reviews: 128,
      colors: ['#8B0000','#C41E3A','#722F37'], sizes: ['XS','S','M','L','XL','XXL'],
      images: ['👘','🥻','👗'], badge: 'Bestseller', available: true
    },
    {
      id: 'd002', name: 'Royal Banarasi Lehenga',
      category: 'lehengas', tradition: 'north-indian',
      price: 45000, originalPrice: 52000, designer: 'Ritu Kumar Studios',
      designerId: 'des002', description: 'Opulent Banarasi silk lehenga with hand-embroidered motifs and a matching dupatta. Ideal for grand North Indian weddings.',
      fabric: 'Banarasi Silk', embroidery: 'Brocade Weaving', rating: 4.9, reviews: 95,
      colors: ['#800020','#FFD700','#CC7722'], sizes: ['S','M','L','XL'],
      images: ['👗','🥻','✨'], badge: 'New', available: true
    },
    {
      id: 'd003', name: 'Ivory Cathedral Gown',
      category: 'gowns', tradition: 'christian',
      price: 38000, originalPrice: 42000, designer: 'Elysian Bridal',
      designerId: 'des003', description: 'An ethereal ivory cathedral gown with intricate lace appliqué and a dramatic train. Perfect for church ceremonies.',
      fabric: 'Imported Lace over Satin', embroidery: 'Lace Appliqué', rating: 4.7, reviews: 72,
      colors: ['#FFFFF0','#F5F5DC','#FAF0E6'], sizes: ['XS','S','M','L'],
      images: ['👰','✨','🌸'], badge: 'Premium Pick', available: true
    },
    {
      id: 'd004', name: 'Pastel Pathani Anarkali',
      category: 'lehengas', tradition: 'muslim',
      price: 18500, originalPrice: 22000, designer: 'Zara Noor Collection',
      designerId: 'des004', description: 'A graceful pastel anarkali suit with delicate mirror work and chikankari embroidery. Perfect for Nikah ceremonies.',
      fabric: 'Georgette', embroidery: 'Chikankari + Mirror Work', rating: 4.6, reviews: 110,
      colors: ['#FFB6C1','#E6E6FA','#98FB98'], sizes: ['S','M','L','XL','XXL'],
      images: ['👗','🌸','💐'], badge: null, available: true
    },
    {
      id: 'd005', name: 'Kasavu Kerala Saree',
      category: 'sarees', tradition: 'kerala',
      price: 12000, originalPrice: 14000, designer: 'Kottayam Handlooms',
      designerId: 'des005', description: 'Traditional Kasavu saree in pristine off-white with elegant golden border. A must-have for Kerala weddings.',
      fabric: 'Cotton-Silk Blend', embroidery: 'Kasavu Weaving', rating: 4.9, reviews: 201,
      colors: ['#FFFFF0','#FFF8DC'], sizes: ['Free Size'],
      images: ['🥻','✨','🌿'], badge: 'Most Loved', available: true
    },
    {
      id: 'd006', name: 'Bengali Tant Benarasi Saree',
      category: 'sarees', tradition: 'bengali',
      price: 16000, originalPrice: 19500, designer: 'Dhaker Kantha',
      designerId: 'des006', description: 'Traditional Bengali Tant saree with intricate motifs and a rich red-gold combination perfect for Bengali wedding rituals.',
      fabric: 'Tant (Cotton)', embroidery: 'Jamdani Weaving', rating: 4.7, reviews: 88,
      colors: ['#DC143C','#FFD700','#8B0000'], sizes: ['Free Size'],
      images: ['🥻','🌺','💛'], badge: null, available: true
    },
    {
      id: 'd007', name: 'Gulab Silk Patola Saree',
      category: 'sarees', tradition: 'gujarati',
      price: 31000, originalPrice: 36000, designer: 'Patan Patola House',
      designerId: 'des007', description: 'Exquisite double ikat Patola saree from Patan with vibrant geometric patterns. A Gujarati wedding treasure.',
      fabric: 'Pure Silk', embroidery: 'Double Ikat Weaving', rating: 4.8, reviews: 64,
      colors: ['#FF69B4','#FF4500','#228B22'], sizes: ['Free Size'],
      images: ['🥻','🎨','💎'], badge: 'Limited Edition', available: true
    },
    {
      id: 'd008', name: 'Champagne Embellished Lehenga',
      category: 'lehengas', tradition: 'sikh',
      price: 52000, originalPrice: 60000, designer: 'Manish Malhotra Inspired',
      designerId: 'des001', description: 'A stunning champagne lehenga adorned with heavy sequin and zari embroidery. Ideal for Sikh anand karaj ceremonies.',
      fabric: 'Net + Raw Silk', embroidery: 'Heavy Zari + Sequin', rating: 4.9, reviews: 43,
      colors: ['#FAD5A5','#E8C89D','#D4AF37'], sizes: ['S','M','L'],
      images: ['👗','✨','💍'], badge: 'Trending', available: true
    },
    {
      id: 'd009', name: 'Nauvari Paithani Saree',
      category: 'sarees', tradition: 'maharashtrian',
      price: 22000, originalPrice: 26000, designer: 'Yeola Paithani',
      designerId: 'des003', description: 'Authentic nine-yard Nauvari Paithani saree with peacock motifs and rich silk weaving. Traditional Maharashtrian bridal wear.',
      fabric: 'Pure Silk', embroidery: 'Paithani Weaving', rating: 4.8, reviews: 92,
      colors: ['#7B68EE','#FFD700','#228B22'], sizes: ['Free Size'],
      images: ['🥻','🦚','💛'], badge: null, available: true
    },
    {
      id: 'd010', name: 'Hanbok Bridal Set',
      category: 'gowns', tradition: 'korean',
      price: 29000, originalPrice: 34000, designer: 'Seoul Bridal Studio',
      designerId: 'des004', description: 'Authentic Korean bridal Hanbok in vibrant jewel tones with embroidered floral motifs. Perfect for Korean wedding ceremonies.',
      fabric: 'Traditional Silk', embroidery: 'Hand Embroidery', rating: 4.6, reviews: 29,
      colors: ['#FF4500','#4169E1','#228B22'], sizes: ['S','M','L','XL'],
      images: ['👘','🎎','🌸'], badge: 'Rare Find', available: true
    },
    {
      id: 'd011', name: 'Gold Tissue Saree',
      category: 'sarees', tradition: 'telugu-brahmin',
      price: 19000, originalPrice: 23000, designer: 'Pochampally Silks',
      designerId: 'des002', description: 'Resplendent gold tissue saree with traditional Telugu motifs. Perfect for Telugu Brahmin wedding ceremonies.',
      fabric: 'Tissue Silk', embroidery: 'Zari Work', rating: 4.7, reviews: 156,
      colors: ['#FFD700','#DAA520','#B8860B'], sizes: ['Free Size'],
      images: ['🥻','✨','🌟'], badge: 'Popular', available: true
    },
    {
      id: 'd012', name: 'Bridal Sherwani',
      category: 'groom', tradition: 'north-indian',
      price: 35000, originalPrice: 40000, designer: 'Manyavar Inspired',
      designerId: 'des005', description: 'Royal ivory sherwani with gold thread embroidery and a matching kalgi and dupatta set. Perfect for the groom.',
      fabric: 'Raw Silk', embroidery: 'Goldwork Embroidery', rating: 4.8, reviews: 77,
      colors: ['#FFFFF0','#FAD5A5','#DC143C'], sizes: ['S','M','L','XL','XXL'],
      images: ['🤵','👑','✨'], badge: 'Top Pick', available: true
    },
  ],

  // ── Accessories ───────────────────────────────────────────
  accessories: [
    { id: 'a001', name: 'Kundan Bridal Necklace Set', category: 'jewelry', price: 8500, icon: '📿', rating: 4.7 },
    { id: 'a002', name: 'Gold Maang Tikka', category: 'jewelry', price: 2200, icon: '💎', rating: 4.6 },
    { id: 'a003', name: 'Bridal Jhumka Earrings', category: 'jewelry', price: 3400, icon: '✨', rating: 4.8 },
    { id: 'a004', name: 'Embroidered Bridal Potli', category: 'footwear', price: 1800, icon: '👜', rating: 4.5 },
    { id: 'a005', name: 'Gold Payals (Anklets)', category: 'jewelry', price: 2800, icon: '💛', rating: 4.4 },
    { id: 'a006', name: 'Bridal Mojari Footwear', category: 'footwear', price: 3200, icon: '👡', rating: 4.6 },
    { id: 'a007', name: 'Floral Hair Wreath', category: 'hair', price: 1500, icon: '💐', rating: 4.9 },
    { id: 'a008', name: 'Pearl Hair Pin Set', category: 'hair', price: 950, icon: '👑', rating: 4.5 },
  ],

  // ── Inspiration Photos ────────────────────────────────────
  inspirations: [
    { id: 'i001', title: 'South Indian Bride', emoji: '🌺', likes: 342, tradition: 'south-indian', saved: false },
    { id: 'i002', title: 'Royal Lehenga Look', emoji: '✨', likes: 518, tradition: 'north-indian', saved: false },
    { id: 'i003', title: 'Korean Hanbok Beauty', emoji: '🎎', likes: 189, tradition: 'korean', saved: false },
    { id: 'i004', title: 'Kasavu Elegance', emoji: '🌿', likes: 274, tradition: 'kerala', saved: false },
    { id: 'i005', title: 'Cathedral Gown Dreams', emoji: '⛪', likes: 633, tradition: 'christian', saved: false },
    { id: 'i006', title: 'Bengali Bride in Red', emoji: '🔴', likes: 291, tradition: 'bengali', saved: false },
    { id: 'i007', title: 'Sikh Anand Karaj', emoji: '🙏', likes: 445, tradition: 'sikh', saved: false },
    { id: 'i008', title: 'Gujarati Patola Pride', emoji: '🎨', likes: 167, tradition: 'gujarati', saved: false },
    { id: 'i009', title: 'Muslim Nikah Grace', emoji: '🌙', likes: 388, tradition: 'muslim', saved: false },
    { id: 'i010', title: 'Maharashtrian Nauvari', emoji: '🦚', likes: 203, tradition: 'maharashtrian', saved: false },
  ],

  // ── Reviews ───────────────────────────────────────────────
  reviews: {
    'd001': [
      { name: 'Ananya S.', avatar: 'A', rating: 5, date: '15 Jan 2025', text: 'Absolutely stunning saree! The silk quality is outstanding and the zari work is exquisite. Got so many compliments at my wedding.' },
      { name: 'Priya M.', avatar: 'P', rating: 5, date: '02 Jan 2025', text: 'Perfect for our South Indian wedding. The colors are vibrant and the drape is beautiful.' },
      { name: 'Sunitha R.', avatar: 'S', rating: 4, date: '28 Dec 2024', text: 'Lovely saree, true to description. Slight delay in delivery but worth the wait.' },
    ],
    'd002': [
      { name: 'Ritika J.', avatar: 'R', rating: 5, date: '20 Jan 2025', text: 'The most beautiful lehenga I have ever worn. The brocade work is absolutely divine.' },
      { name: 'Meera K.', avatar: 'M', rating: 5, date: '10 Jan 2025', text: 'Perfect fit and stunning embroidery. Made my wedding day extra special.' },
    ],
    'd003': [
      { name: 'Sarah T.', avatar: 'S', rating: 5, date: '18 Jan 2025', text: 'A dream come true! The lace is intricate and the train is breathtaking.' },
      { name: 'Jessica P.', avatar: 'J', rating: 4, date: '05 Jan 2025', text: 'Beautiful gown, exactly as shown. The cathedral length is perfect.' },
    ],
  },

  // ── Notifications (sample) ────────────────────────────────
  notifications: [
    { id: 'n001', type: 'order', icon: '📦', title: 'Order Shipped!', desc: 'Your Crimson Kanjivaram Saree is on its way', time: '2 hours ago', unread: true },
    { id: 'n002', type: 'new', icon: '✨', title: 'New Collection Arrived', desc: 'Korean Wedding Collection 2025 is now live', time: '5 hours ago', unread: true },
    { id: 'n003', type: 'price', icon: '💰', title: 'Price Drop Alert!', desc: 'Royal Banarasi Lehenga is now ₹45,000', time: '1 day ago', unread: true },
    { id: 'n004', type: 'festival', icon: '🎉', title: 'Festival Collection', desc: 'Exclusive Diwali bridal collection available now', time: '2 days ago', unread: false },
    { id: 'n005', type: 'designer', icon: '👗', title: 'Designer Upload', desc: 'Meenakshi Couture added 12 new designs', time: '3 days ago', unread: false },
    { id: 'n006', type: 'wishlist', icon: '❤️', title: 'Wishlist Update', desc: 'Ivory Cathedral Gown is back in stock', time: '4 days ago', unread: false },
  ],

  // ── Designers ─────────────────────────────────────────────
  designers: [
    { id: 'des001', name: 'Meenakshi Couture', location: 'Chennai', speciality: 'South Indian Silk', products: 28, rating: 4.8 },
    { id: 'des002', name: 'Ritu Kumar Studios', location: 'Delhi', speciality: 'Banarasi & Mughal', products: 35, rating: 4.9 },
    { id: 'des003', name: 'Elysian Bridal', location: 'Mumbai', speciality: 'Western Gowns', products: 22, rating: 4.7 },
    { id: 'des004', name: 'Zara Noor Collection', location: 'Hyderabad', speciality: 'Anarkali & Sharara', products: 31, rating: 4.6 },
    { id: 'des005', name: 'Kottayam Handlooms', location: 'Kochi', speciality: 'Kerala Traditions', products: 18, rating: 4.9 },
  ],

  // ── Customize Options ─────────────────────────────────────
  customizeOptions: {
    sleeveStyle: ['Sleeveless','Half Sleeve','Three-Quarter','Full Sleeve','Bell Sleeve','Puff Sleeve'],
    neckDesign: ['Round Neck','V-Neck','Square Neck','Sweetheart','Halter','Off-Shoulder'],
    dressLength: ['Mini','Knee-Length','Midi','Floor-Length','Cathedral Train'],
    borderStyle: ['Solid Gold','Zari Floral','Zigzag','Plain','Beaded'],
    embroideryPattern: ['Floral','Peacock','Mango Paisley','Geometric','Minimal','Heavy Bridal'],
    stoneWork: ['No Stones','Kundan','Swarovski','Polki','Mirror Work'],
    laceDesign: ['No Lace','French Lace','Guipure','Chantilly','Venise'],
    blouseNeckFront: ['Round','V-Neck','U-Neck','Sweetheart','Square','Boat Neck'],
    blouseNeckBack: ['Low Back','Deep V','Keyhole','Straight','Bow'],
    blouseSleeve: ['Sleeveless','Short','Elbow Length','Long','Bishop'],
  },

  // ── Banners ───────────────────────────────────────────────
  banners: [
    { id: 'b001', label: 'New Collection 2025', title: 'Wedding Collections', subtitle: 'Discover Your Dream Look', emoji: '💍', cta: 'Shop Now', gradient: 'linear-gradient(135deg, #722F37, #1a0a10)' },
    { id: 'b002', label: 'Most Popular', title: 'Trending Styles', subtitle: 'What Brides Love This Season', emoji: '🌟', cta: 'Explore', gradient: 'linear-gradient(135deg, #1B4F72, #0a0a1a)' },
    { id: 'b003', label: 'Festival Special', title: 'Festival Collections', subtitle: 'Celebrate in Style', emoji: '🎉', cta: 'View All', gradient: 'linear-gradient(135deg, #B7950B, #3d2a00)' },
    { id: 'b004', label: 'Featured Designers', title: 'Designer Highlights', subtitle: 'Curated by Top Bridal Designers', emoji: '✨', cta: 'Meet Designers', gradient: 'linear-gradient(135deg, #6C3483, #1a001a)' },
  ],
};
