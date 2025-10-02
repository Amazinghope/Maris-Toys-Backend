import mongoose from "mongoose";
import Product from "../models/product";
import User from "../models/user";
import { dbConnect } from "../config/dbConnection";
import dotenv from 'dotenv'
import httpStatus from 'http-status'

dotenv.config()
dbConnect()

const products = [
    {
    name: "STEM Builder Kit",
    price: 19999,
    category: "STEM",
    ageRange: "6-9",
    stock: 20,
    skills: ["Problem Solving", "Engineering"],
    description: "Learn physics while building fun machines!",
    image: "https://example.com/images/stem-kit.jpg"
  },
  {
    name: "Math Puzzle Box",
    price: 14999,
    category: "Math",
    ageRange: "4-7",
    stock: 15,
    skills: ["Logic", "Critical Thinking"],
    description: "A fun way to improve math skills!",
    image: "https://example.com/images/math-puzzle.jpg"
  },
    {
    name: "STEM Builder Kit",
    image: "https://images.unsplash.com/photo-1596495578065-9c9ae2f2b2b1",
    description: "Hands-on kit for kids to explore levers, pulleys, and gears.",
    category: "STEM",
    age: "6-9",
    skills: ["Problem Solving", "Engineering"],
    price: 19999,
    stock: 25
  },
  {
id: "ma-002",
name: "Math Blocks 100",
price: 8999,
rating: 4.5,
stock: 48,
age: "3-6",
category: "Math",
skills: ["Counting", "Patterns", "Fine Motor"],
short: "Colorful blocks for counting, grouping & patterns.",
description:
"100 durable counting blocks with activity cards. Great for early numeracy and color sorting.",
image:
"https://images.unsplash.com/photo-1596464716121-abd93c6d1a5b?q=80&w=1200&auto=format&fit=crop",
},
{
id: "ar-003",
name: "Art & Craft Box",
price: 12999,
rating: 4.6,
stock: 32,
age: "4-8",
category: "Art",
skills: ["Creativity", "Design", "Focus"],
short: "All-in-one craft set to spark imagination.",
description:
"Paper, stickers, safe scissors, glue, and templates for 30+ creative projects.",
image:
"https://images.unsplash.com/photo-1525362081669-2b476bb628c9?q=80&w=1200&auto=format&fit=crop",
},
{
id: "pu-004",
name: "Logic Puzzle Set",
price: 10999,
rating: 4.4,
stock: 50,
age: "6-10",
category: "Puzzles",
skills: ["Logic", "Spatial Reasoning"],
short: "Progressive challenges build grit and logic.",
description:
"50 puzzle cards from easy to expert. Self-check solutions included.",
image:
"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
},
{
id: "sc-005",
name: "Junior Science Lab",
price: 23999,
rating: 4.8,
stock: 18,
age: "8-12",
category: "Science",
skills: ["Experimentation", "Observation"],
short: "Microscope, slides & 20 safe experiments.",
description:
"Starter lab with magnification, dyes, and illustrated instructions for budding scientists.",
image:
"https://images.unsplash.com/photo-1559757175-08fda9d7d9f4?q=80&w=1200&auto=format&fit=crop",
},

    {
    
    name: 'Alphabet Puzzle',
    price: '15.90',
    image: '/assets/alphabet.jpeg',
    description: 'A fun puzzle that helps kids learn the alphabet!'
    },

    {
    
    name: 'Math Blocks',
    price: '20.90',
    image: '/assets/building-block.jpg',
    description: 'Blocks with numbers to help early math learning'
    },

    {
    
    name: 'Science Kit',
    price: '40.90',
    image: '/src/assets/maths.jpeg',
    description: 'A basic science experiment kit for young explorers.'
    },

    {
    
    name: 'Alphabet Puzzle',
    price: '15.90',
    image: '/src/assets/alphabet.jpeg',
    description: 'A fun puzzle that helps kids learn the alphabet!'
    },

    {
    
    name: 'Math Blocks',
    price: '20.90',
    image: '/src/assets/maths.jpeg',
    description: 'Blocks with numbers to help early math learning'
    },

    {
    
    name: 'Science Kit',
    price: '40.90',
    image: '/src/assets/alphabet.jpeg',
    description: 'A basic science experiment kit for young explorers.'
    },

    {
    
    name: 'Alphabet Puzzle',
    price: '15.90',
    image: '/src/assets/alphabet.jpeg',
    description: 'A fun puzzle that helps kids learn the alphabet!'
    },

    {
    
    name: 'Math Blocks',
    price: '20.90',
    image: '/src/assets/maths.jpeg',
    description: 'Blocks with numbers to help early math learning'
    },

    {
    
    name: 'Science Kit',
    price: '40.90',
    image: '/src/assets/building-block.jpg',
    description: 'A basic science experiment kit for young explorers.'
    },

    {
    
    name: 'Alphabet Puzzle',
    price: '15.90',
    image: '/src/assets/building-block.jpg',
    description: 'A fun puzzle that helps kids learn the alphabet!'
    },

    {
    
    name: 'Math Blocks',
    price: '20.90',
    image: '/src/assets/maths.jpeg',
    description: 'Blocks with numbers to help early math learning'
    },

    {
    
    name: 'Science Kit',
    price: '40.90',
    image: '/src/assets/maths.jpeg',
    description: 'A basic science experiment kit for young explorers.'
    },
];

const data  = async(req, res) => {
try {
    await Product.deleteMany()
    // await User.deleteMany()

    await Product.insertMany(products)

    const admin = await User.create({
        name: 'Hope',
        email: 'hopply395@gmail.com',
        password: '12345',
    });
    
    res.status(httpStatus.CREATED).json({
        status: 'success',
    })
    process.exit()
} catch (error) {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    status: 'Failed to create product'
  })  
}
process.exit(1)
}

data()