const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt  = require('jsonwebtoken');

// Middleware
app.use(express.json());



app.use(cors());  // Apply the updated corsOptions

// ✅ Database connection with MongoDB (with success/error message)
mongoose.connect("mongodb+srv://nafanjum2004:Nafreen%402004@cluster0.az5r3oz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { })
    .then(() => {
        console.log("✅ MongoDB connected");
    })
    .catch((error) => {
        console.log("❌ MongoDB connection error:", error);
    });

// Define port (changed from 3002 to 3001)
const port = 3001; 

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image storage Engine using multer
const storage = multer.diskStorage({
    destination: './upload/images', // Directory where the image will be stored
    filename: (req, file, cb) => {
        const uniqueName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// Endpoint to serve images
app.use('/images', express.static('upload/images'));

// Endpoint to upload image
app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}` // Return the URL of the uploaded image
    });
});

// Schema for creating Product
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Route to add product
app.post('/addproduct', async (req, res) => {
    const { name, image, category, new_price, old_price } = req.body;

    if (!name || !image || !category || !new_price || !old_price) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Find the last product ID to assign the next ID
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product = products[products.length - 1];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    // Create a new product
    const product = new Product({
        id: id,
        name,
        image,
        category,
        new_price,
        old_price,
        date: new Date(),  // ✅ Set current date here if needed
        available: true,    // ✅ Default available = true
    });

    try {
        await product.save();
        console.log("Product saved",product);

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ success: false, message: 'Error saving product', error: error.message });
    }
});

// Route for deleting a product
app.post('/removeproduct', async (req, res) => {
    const { id } = req.body;
    await Product.findOneAndDelete({ id });
    console.log("Product removed with ID:", id);

    res.json({
        success: true,
        id,
    });
});

// Route for getting all products
app.get('/allproducts', async (req, res) => {
    const products = await Product.find({});
    console.log("Fetched all products");
    res.send(products);
});


// schema creating for user model


const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Map,
    of: Number,
    default: {},
  }
});

module.exports = Users;

// creating end point for regiter of user
app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });  // fixed typo: 'chech' → 'check'
        if (check) {
            return res.status(400).json({ success: false, error: "Existing user found with same email ID" });  // fixed 'erroe' → 'error'
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, 'secret_ecom');
        res.json({
            success: true,  // fixed 'succcess' → 'success'
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// end point for userlogin

app.post('/login', async (req, res) => {
    try {
      const user = await Users.findOne({ email: req.body.email });
  
      if (!user) {
        return res.json({ success: false, errors: "Wrong Email" });
      }
  
      const passCompare = req.body.password === user.password;
  
      if (!passCompare) {
        return res.json({ success: false, errors: "Wrong Password" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      };
  
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

// creating  endpoint for new collection data
app.get('/newcollection', async (req, res) => {
    try {
        let products = await Product.find({}); // Changed 'findi' to 'find'
        let newcollection = products.slice(1).slice(-8);
        console.log("NewCollection Fetched");
        res.send(newcollection);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});
 //creating endpoint for popular in women section
 app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
});
// creating middleware to fetch user
 // make sure this is at the top

 

 const fetchUser = async (req, res, next) => {
   const token = req.header("auth-token");
 
   if (!token) {
     return res.status(401).json({ error: "Unauthorized: No token provided" });
   }
 
   try {
     const data = jwt.verify(token, 'secret_ecom'); // Replace 'secret_ecom' with your actual secret key
     req.user = data.user; // Attach user data to request object
     next(); // Proceed to the next middleware/route handler
   } catch (error) {
     console.error("JWT verification failed:", error);
     return res.status(401).json({ error: "Unauthorized: Invalid token" });
   }
 };
 

  

// creating endpoint for adding products in cartdata
// app.post('/addtocart', fetchUser,async (req, res) => {
//   let userData=await Users.findOne({_id:req.user.id});
//   userData.cartData[req.body.itemId]+=1;
//   await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
//   res.send("Added");
  
// });

app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    const itemId = String(req.body.itemId); 
    app.post('/addtocart', fetchUser, async (req, res) => {
      try {
        const itemId = String(req.body.itemId); // Ensure it's a string key
        console.log("Adding itemId:", itemId); // Log the itemId
    
        await Users.updateOne(
          { _id: req.user.id },
          { $inc: { [`cartData.${itemId}`]: 1 } }  // Increment the count
        );
    
        res.send("Added to cart");
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    });
    // Make sure it's a string key

    await Users.updateOne(
      { _id: req.user.id },
      { $inc: { [`cartData.${itemId}`]: 1 } }
    );

    res.send("Added to cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



  

  // remove from cart
  app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
      const itemId = String(req.body.itemId); // Ensure itemId is a string key
      console.log("Removing itemId:", itemId);
      await Users.updateOne(
        { _id: req.user.id },
        { $inc: { [`cartData.${itemId}`]: -1 } }  // Decrement instead of increment
      );
  
      res.send("Removed from cart");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });
  

  // cretaing end point to get data
  app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("getcart");
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);

  })
  
  
  
  

  


// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("🚀 Server Running on Port " + port);
    } else {
        console.log("❌ Server Error: " + error);
    }
});
