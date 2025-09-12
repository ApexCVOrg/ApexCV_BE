/**
 * Script test API Sepay
 * Chạy: node test-sepay.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/sepay`;

// Test data
const testData = {
  amount: 10000,
  description: 'Test Sepay Payment'
};

async function testSepayAPI() {
  console.log('🧪 Testing Sepay API...\n');

  try {
    // Test 1: Create payment (cần token thực)
    console.log('1️⃣ Testing create payment...');
    try {
      const createResponse = await axios.post(`${API_URL}/create`, testData, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE' // Uncomment và thêm token thực
        }
      });
      console.log('✅ Create payment success:', createResponse.data);
    } catch (error) {
      console.log('❌ Create payment failed:', error.response?.data || error.message);
    }

    // Test 2: Confirm payment
    console.log('\n2️⃣ Testing confirm payment...');
    try {
      const confirmData = {
        sessionId: 'test_session_123',
        transactionId: 'TXN_TEST_123456',
        amount: 10000
      };
      
      const confirmResponse = await axios.post(`${API_URL}/confirm`, confirmData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Confirm payment success:', confirmResponse.data);
    } catch (error) {
      console.log('❌ Confirm payment failed:', error.response?.data || error.message);
    }

    // Test 3: Get user points (cần token thực)
    console.log('\n3️⃣ Testing get user points...');
    try {
      const pointsResponse = await axios.get(`${API_URL}/points`, {
        headers: {
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE' // Uncomment và thêm token thực
        }
      });
      console.log('✅ Get user points success:', pointsResponse.data);
    } catch (error) {
      console.log('❌ Get user points failed:', error.response?.data || error.message);
    }

    // Test 4: Get points history (cần token thực)
    console.log('\n4️⃣ Testing get points history...');
    try {
      const historyResponse = await axios.get(`${API_URL}/points/history`, {
        headers: {
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE' // Uncomment và thêm token thực
        }
      });
      console.log('✅ Get points history success:', historyResponse.data);
    } catch (error) {
      console.log('❌ Get points history failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

// Test QR code generation
function testQRCodeGeneration() {
  console.log('\n🔗 Testing QR code generation...');
  
  const amount = 10000;
  const description = 'Test payment';
  const qrCodeUrl = `https://qr.sepay.vn/img?bank=MBBank&acc=0949064234&template=compact&amount=${amount}&des=${encodeURIComponent(description)}`;
  
  console.log('QR Code URL:', qrCodeUrl);
  console.log('✅ QR code URL generated successfully');
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Sepay API Tests\n');
  console.log('📝 Note: Some tests require authentication token');
  console.log('📝 Add your token to the Authorization header in the script\n');
  
  await testSepayAPI();
  testQRCodeGeneration();
  
  console.log('\n✨ Tests completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the backend server: npm run dev');
  console.log('2. Start the frontend server: npm run dev');
  console.log('3. Visit: http://localhost:3000/sepay-demo');
  console.log('4. Test the full payment flow');
}

runTests();
