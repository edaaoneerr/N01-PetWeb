const { SitemapStream, streamToPromise } = require('sitemap');
const fs = require('fs');
const path = require('path');

async function generateSitemap() {
    const smStream = new SitemapStream({ hostname: 'http://localhost:3000' });

    // Define your URLs here
    const urls = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/blog', changefreq: 'daily', priority: 1.0 },
        { url: '/category/:categoryId', changefreq: 'weekly', priority: 0.8 },
        { url: '/article/:articleId', changefreq: 'weekly', priority: 0.8 },
        { url: '/:articleId/category/:categoryId', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/slug/:slug', changefreq: 'weekly', priority: 0.8 },
        { url: '/article/slug/:slug', changefreq: 'weekly', priority: 0.8 },
        { url: '/product-detail/:productId', changefreq: 'weekly', priority: 0.8 },
        { url: '/product-detail/slug/:slug', changefreq: 'weekly', priority: 0.8 }
    ];

    // Add URLs to the sitemap stream
    urls.forEach(url => smStream.write(url));

    // End the stream
    smStream.end();

    // Convert stream to promise
    const sitemapBuffer = await streamToPromise(smStream);
    const sitemapXml = sitemapBuffer.toString();

    // Ensure newlines are properly formatted
    const formattedSitemapXml = sitemapXml.split('><').join('>\n<');

    // Define the path for the sitemap
    const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, formattedSitemapXml);

    console.log('Sitemap generated at:', sitemapPath);
}

// Call the function to generate the sitemap
generateSitemap().catch(console.error);

