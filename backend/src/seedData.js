const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const foodPartnerModel = require('./models/foodpartner.model');
const foodModel = require('./models/food.model');
require('dotenv').config();

const sampleFoodPartners = [
    {
        name: "Tasty Bites Kitchen",
        contactName: "John Smith",
        phone: "+1-555-0101",
        address: "123 Main Street, Downtown, NY 10001",
        email: "tasty@foodloop.com",
        password: "foodloop123",
        bio: "Serving authentic cuisine with love since 2020",
        profilePicture: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
        website: "https://tastybites.com",
        openingHours: "Mon-Sun: 10AM-10PM"
    },
    {
        name: "Pizza Paradise",
        contactName: "Maria Rodriguez",
        phone: "+1-555-0202",
        address: "456 Pizza Avenue, Little Italy, NY 10002",
        email: "pizza@foodloop.com",
        password: "foodloop123",
        bio: "Best pizza in town - Wood-fired perfection",
        profilePicture: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=400",
        website: "https://pizzaparadise.com",
        openingHours: "Mon-Thu: 11AM-11PM, Fri-Sun: 11AM-12AM"
    },
    {
        name: "Burger Hub",
        contactName: "Mike Johnson",
        phone: "+1-555-0303",
        address: "789 Burger Lane, Midtown, NY 10003",
        email: "burger@foodloop.com",
        password: "foodloop123",
        bio: "Juicy burgers made fresh daily with premium ingredients",
        profilePicture: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
        website: "https://burgerhub.com",
        openingHours: "Daily: 11AM-10PM"
    }
];

const sampleFoods = [
    {
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil. Wood-fired to perfection! 🍕",
        category: "Pizza",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
        price: 12.99
    },
    {
        name: "Juicy Beef Burger",
        description: "Premium beef patty with cheese, lettuce, tomato, and our secret sauce. Simply irresistible! 🍔",
        category: "Burger",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        price: 10.99
    },
    {
        name: "Spicy Chicken Tacos",
        description: "Three soft tacos filled with grilled chicken, fresh salsa, and guacamole. Spice level: Medium 🌮",
        category: "Mexican",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
        price: 9.99
    },
    {
        name: "Creamy Pasta Carbonara",
        description: "Rich and creamy pasta with crispy bacon, parmesan, and black pepper. Authentic Roman recipe! 🍝",
        category: "Pasta",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500",
        price: 14.99
    },
    {
        name: "Sushi Platter",
        description: "Fresh assortment of nigiri and rolls with wasabi and soy sauce. Chef's special selection 🍱",
        category: "Sushi",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500",
        price: 24.99
    },
    {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream. Pure indulgence! 🍰",
        category: "Dessert",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500",
        price: 7.99
    },
    {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce, parmesan cheese, croutons, and classic Caesar dressing. Fresh and healthy! 🥗",
        category: "Salad",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500",
        price: 8.99
    },
    {
        name: "Pad Thai Noodles",
        description: "Stir-fried rice noodles with shrimp, peanuts, bean sprouts, and tamarind sauce. Authentic Thai flavor! 🍜",
        category: "Other",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500",
        price: 13.99
    },
    {
        name: "Butter Chicken",
        description: "Tender chicken in rich tomato and butter gravy with aromatic Indian spices. Served with naan! 🍛",
        category: "Indian",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500",
        price: 15.99
    },
    {
        name: "BBQ Ribs",
        description: "Fall-off-the-bone pork ribs glazed with smoky BBQ sauce. Comes with coleslaw and fries! 🍖",
        category: "Other",
        video: "https://ik.imagekit.io/demo/sample-video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
        price: 18.99
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await foodModel.deleteMany({});
        await foodPartnerModel.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create food partners
        const createdPartners = [];
        for (const partner of sampleFoodPartners) {
            const hashedPassword = await bcrypt.hash(partner.password, 10);
            const newPartner = await foodPartnerModel.create({
                ...partner,
                password: hashedPassword
            });
            createdPartners.push(newPartner);
            console.log(`✅ Created partner: ${partner.name}`);
        }

        // Create food items and assign to partners
        for (let i = 0; i < sampleFoods.length; i++) {
            const food = sampleFoods[i];
            const partner = createdPartners[i % createdPartners.length];
            
            await foodModel.create({
                ...food,
                foodPartner: partner._id,
                likeCount: Math.floor(Math.random() * 500) + 50,
                viewCount: Math.floor(Math.random() * 2000) + 100
            });
            console.log(`✅ Created food: ${food.name}`);
        }

        console.log('\\n🎉 Seed data created successfully!');
        console.log('\\n📝 Sample Food Partner Credentials:');
        console.log('   Email: tasty@foodloop.com');
        console.log('   Password: foodloop123');
        console.log('\\n✨ Visit your app to see the delicious content!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
