# RapidAPI Test Client

Test your API as if you were a RapidAPI client! This test suite simulates requests with proper RapidAPI headers.

## 🚀 Quick Start

### Option A: Interactive Setup (Recommended)

```bash
cd test-client
npm install
./setup.sh
```

This will guide you through configuring for either:
- 💻 **Local development** (localhost)
- 🚀 **Production testing** (your deployed RapidAPI)

### Option B: Manual Setup

#### For Local Development:

```bash
cd test-client
npm install
cp .env.example .env
# .env will have local defaults
```

#### For Production (RapidAPI) Testing:

```bash
cd test-client
npm install
cp .env.example .env
```

Then edit `.env`:
```env
TEST_API_URL=https://your-app.herokuapp.com
RAPIDAPI_PROXY_SECRET=your-actual-secret-from-rapidapi
NODE_ENV=production
```

**📖 See [RAPIDAPI-SETUP.md](RAPIDAPI-SETUP.md) for detailed instructions on getting your RapidAPI credentials!**

### 3. Prepare Test Images (Optional)

Add sample images to the `test-images/` folder:
- `sample.jpg` - For image processing tests
- `qrcode-sample.png` - For QR code decoding tests

You can download sample images or use your own.

### 4. Start Your API

Make sure your API is running:
```bash
cd ..
npm run dev
```

### 5. Run Tests

**Command Line Test Suite:**
```bash
npm test                  # Run all tests
npm run test:health       # Test health endpoint only
npm run test:qrcode       # Test QR code generation
npm run test:image        # Test image resize
```

**Web Browser Interface:**
```bash
npm run web               # Opens web-tester.html in browser
# Or manually open: test-client/web-tester.html
```

## 📁 Project Structure

```
test-client/
├── test-client.js        # Node.js CLI test script
├── web-tester.html       # Browser-based test interface
├── package.json          # Dependencies
├── .env.example          # Example configuration
├── .env                  # Your configuration (create this)
├── test-images/          # Sample images for testing
│   ├── sample.jpg
│   └── qrcode-sample.png
├── output/               # Test results saved here
└── README.md            # This file
```

## 🧪 Available Tests

### Health Check
Tests if the API is running and responding correctly.

**CLI:**
```bash
node test-client.js health
```

**Web:** Click "Test Health" button

---

### QR Code Generation
Generates a QR code from text/URL data.

**CLI:**
```bash
node test-client.js qrcode-generate
```

**Web:** Enter data and click "Generate QR Code"

**Response:** Returns base64-encoded PNG image

---

### QR Code Decode
Decodes a QR code from an uploaded image.

**CLI:**
```bash
# Requires test-images/qrcode-sample.png
node test-client.js qrcode-decode
```

**Web:** Upload image and click "Decode QR Code"

---

### Image Resize
Resizes an image to specified dimensions.

**CLI:**
```bash
# Requires test-images/sample.jpg
node test-client.js image-resize
```

**Web:** Upload image, set dimensions, click "Resize Image"

---

### Image Convert
Converts an image to a different format.

**CLI:**
```bash
# Requires test-images/sample.jpg
node test-client.js image-convert
```

**Web:** Upload image, select format, click "Convert Image"

## 🔑 RapidAPI Headers

All requests include these headers to simulate RapidAPI:

```javascript
{
  'X-RapidAPI-Proxy-Secret': 'your-secret',
  'X-RapidAPI-User': 'user-id',
  'X-RapidAPI-Subscription': 'BASIC|PRO|ULTRA'
}
```

## 🌐 Testing Production

To test your deployed API:

1. Update `.env`:
```env
TEST_API_URL=https://your-api.herokuapp.com
RAPIDAPI_PROXY_SECRET=your-actual-secret
NODE_ENV=production
```

2. Run tests:
```bash
npm test
```

## 📊 Output Files

Generated files are saved to `output/`:
- `test-qrcode.png` - Generated QR codes
- `test-resized.jpg` - Resized images
- `test-converted.png` - Converted images

## 🎨 Web Interface Features

The web tester (`web-tester.html`) provides:

- ✅ Visual interface for all endpoints
- ✅ Real-time response display
- ✅ Image preview for results
- ✅ Easy header configuration
- ✅ No backend required - runs in browser!

## 🐛 Troubleshooting

**"ECONNREFUSED" error:**
- Make sure your API is running (`npm run dev`)
- Check that `TEST_API_URL` matches your server

**"401 Unauthorized" in production:**
- Verify `RAPIDAPI_PROXY_SECRET` matches your API's secret
- Check that `NODE_ENV=production` in `.env`

**Image tests skipped:**
- Add sample images to `test-images/` folder
- Ensure images are valid JPEG/PNG files

**Web interface CORS errors:**
- CORS is enabled for development
- For production, update CORS settings in `src/app.js`

## 💡 Tips

- Use the web interface for quick manual testing
- Use CLI for automated testing and CI/CD
- Check `output/` folder for generated files
- Monitor your API logs while testing
- Test both development and production modes

## 📝 Example Usage

```bash
# Install and setup
cd test-client
npm install
cp .env.example .env

# Add some test images
mkdir -p test-images
# (download or copy test images)

# Run all tests
npm test

# Or use web interface
open web-tester.html
```

Happy testing! 🚀
