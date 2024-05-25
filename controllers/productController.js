const connection = require("../server")
exports.getProducts = async (req, res) => {

    console.log(req.body)
    const { 
        productBrand, 
        productName,
        productPrice,
        productWeight,
        productSize,
        productCategory,
        productImagePath,
        productStockCode,
        productBarcode,
        productStarCount,
        productReviewCount,
        productDiscount,
        productInstallmentPrice } = req.body;

    console.log(productBrand, 
        productName,
        productPrice,
        productWeight,
        productSize,
        productCategory,
        productImagePath,
        productStockCode,
        productBarcode,
        productStarCount,
        productReviewCount,
        productDiscount,
        productInstallmentPrice)

        connection.query('SELECT * FROM products', async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: 'Database error occurred' });
            }
            res.json(await results);
        });
};

exports.getProduct = async (req, res) => {
    const { productId } = req.query;  // Get productId from query parameters
    console.log(productId);

    connection.query('SELECT * FROM products WHERE productId = ?', [productId], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error occurred' });
        }

        const product = results[0];
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('pages/product-detail', { product });
    });
};