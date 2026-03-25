import http from 'http';

let products = [
  { id: 1, name: "Laptop", price: 999, stock: 10 },
  { id: 2, name: "Mouse", price: 29, stock: 50 }
];

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    if(req.url === '/products' && req.method === 'GET'){
        res.statusCode = 200;
        res.end(JSON.stringify({products}));
    } else if (req.url.startsWith('/products/') && req.method === 'GET'){
        const id = parseInt(req.url.split('/')[2]);
        const product = products.find(b => b.id === id);
        if(!product){
            res.statusCode = 404;
            res.end(JSON.stringify({error: 'product not found'}));
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify({product}));
        }
    } else if (req.url === '/products' && req.method === 'POST'){
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const newProduct = JSON.parse(body);
            if (newProduct.price <= 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Price must be greater than 0' }));
                return;
            }
            if (newProduct.stock < 0) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Stock must be greater or equals 0' }));
                return;
            }
            newProduct.id = products.length + 1;
            products.push(newProduct);

            res.statusCode = 201;
            res.end(JSON.stringify({
                message: 'product created',
                product: newProduct
            }));
        } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({error: 'Invalid JSON'}));
        }
    });
    return;
    } else if (req.url.startsWith('/products/') && req.method === 'PUT'){
        const id = parseInt(req.url.split('/')[2]);
        const index = products.findIndex(i => i.id === id);
        if (index === -1){
            res.statusCode = 404;
            res.end(JSON.stringify({error: 'product not found'}));
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updatedproduct = JSON.parse(body);
                if (updatedproduct.price <= 0) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Price must be greater than 0' }));
                    return;
                }
                if (updatedproduct.stock < 0) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Stock must be greater or equals 0' }));
                    return;
                }
                updatedproduct.id = id;
                products[index] = updatedproduct;
                res.statusCode = 200;
                res.end(JSON.stringify({
                    message: 'product updated',
                    product: updatedproduct
                }));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({error: 'Invalid JSON'}));
            }
        })
        return;
    } else if (req.url.startsWith('/products/') && req.method === 'DELETE'){
        const id = parseInt(req.url.split('/')[2]);
        const index = products.findIndex(b => b.id === id);
        if (index === -1){
            res.statusCode = 404;
            res.end(JSON.stringify({error: 'product not found'}));
        } else {
            const deletedproduct = products.splice(index,1)[0];
            res.statusCode = 200;
            res.end(JSON.stringify({
                message: 'product is deleted',
                product: deletedproduct
            }));
        }
        return;
    } else if (req.url.startsWith('/products/') && req.method === 'PATCH'){
        const id = parseInt(req.url.split('/')[2]);
        const product = products.find(b => b.id === id);
        if (!product){
            res.statusCode = 404;
            res.end(JSON.stringify({error: 'product not found'}));
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const updates = JSON.parse(body);
                if (updates.price <= 0) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Price must be greater than 0' }));
                    return;
                }
                if (updates.stock < 0) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Stock must be greater or equals 0' }));
                    return;
                }
                if(updates.name) product.name = updates.name;
                if(updates.price) product.price = updates.price;
                if(updates.stock) product.stock = updates.stock;
                res.statusCode = 200;
                res.end(JSON.stringify({
                    message: 'product partially updated',
                    product: product
                }));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({error: 'Invalid JSON'}));
            }
        })
        return;
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({error: 'Not found'}));
    }
})