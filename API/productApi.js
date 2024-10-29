const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../config/db');



router.get('/all-products', async (req, res) => {
  try {
    console.log("calling...........")
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit to 10
    const db = await connectToDatabase(); // Reuse the existing database instance
    const productsCollection = db.collection('products'); // Replace with your collection name
    
    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the starting index
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch products from the database
    const products = await productsCollection.find({}).skip(skip).limit(limitNumber).toArray();
    
    // Fetch total count of products for pagination
    const totalProducts = await productsCollection.countDocuments();

    res.json({
      products,
      totalProducts, // Send total products count for pagination
    });
  } catch (error) {
    console.error('Failed to retrieve products', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});


router.get('/view-product', async(req, res) => {
     const { productID, pincode } = req.query;
     console.log("object ",productID," ",pincode)
     const db = await connectToDatabase(); // Reuse the existing database instance
     const stockCollection = db.collection('stock')
     const pincodesCollection = db.collection('pincodes')

     const resultfromStock = await stockCollection.findOne({ 'Product ID': Number(productID) });
     console.log("resfrom stk ", resultfromStock)
     if(!resultfromStock['Stock Available']){
       return res.status(500).json({ message: 'Stock not available' });
     }

     const resFromPincodes = await pincodesCollection.findOne({Pincode: Number(pincode)})
     if(!resFromPincodes){
      return res.status(404).json({ message: 'Pincode not found' });
    }
   
     if(resFromPincodes['Logistics Provider'] === 'Provider A'){
        return res.status(200).json({message: 'Stock available', payload: {provider: 'Provider A'}})
     }else if(resFromPincodes['Logistics Provider'] === 'Provider B'){
      return res.status(200).json({message: 'Stock available', payload: {provider: 'Provider B'}})
     }else{
      return res.status(200).json({message: 'Stock available', payload: {provider: 'General Partner'}})
     }
   
})

router.get('/order', async (req, res) => {
  try {
    const { pincode,productID } = req.query; // Change this to access query parameters
    console.log("object: ",pincode);
    const db = await connectToDatabase(); // Reuse the existing database instance
    const pincodesCollection = db.collection('pincodes');
    const stcockCollection = db.collection('stock')

    const result = await pincodesCollection.findOne({ Pincode: Number(pincode) });
    console.log("pin : ", result)

    if(!result){
      return res.status(404).json({ message: 'Pincode not found' });
    }

    const resultfromStock = await stcockCollection.findOne({ 'Product ID': Number(productID) });
    console.log("resfrom stk ", resultfromStock)
    if(!resultfromStock['Stock Available']){
      return res.status(500).json({ message: 'Stock not available' });
    }

    if(res['Logistics Provider'] === 'Provider A'){

    }else if(res['Logistics Provider'] === 'Provider B'){

    }else{

    }
    
  } catch (error) {
    console.error('Failed to retrieve products', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});


module.exports = router;
