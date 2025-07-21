const mongoose = require('mongoose');

async function testMongoConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test 1: MongoDB Atlas
    console.log('\n1. Testing MongoDB Atlas...');
    await mongoose.connect('mongodb+srv://nidasorgweb:Thithithi%400305@nidas.mrltlak.mongodb.net/nidas?retryWrites=true&w=majority');
    // MongoDB Atlas connected
    await mongoose.disconnect();
    
    // Test 2: MongoDB Atlas with simple connection
    console.log('\n2. Testing MongoDB Atlas (simple)...');
    await mongoose.connect('mongodb+srv://nidasorgweb:Thithithi%400305@nidas.mrltlak.mongodb.net/nidas?retryWrites=true&w=majority');
    // MongoDB Atlas connected
    await mongoose.disconnect();
    
    // Test 3: MongoDB Atlas with SSL options
    console.log('\n3. Testing MongoDB Atlas (with SSL options)...');
    await mongoose.connect('mongodb+srv://nidasorgweb:Thithithi%400305@nidas.mrltlak.mongodb.net/nidas?retryWrites=true&w=majority', {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority'
    });
    // MongoDB Atlas with SSL options connected
    await mongoose.disconnect();
    
    console.log('\n🎉 All MongoDB connection tests passed!');
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    process.exit(1);
  }
}

testMongoConnection(); 