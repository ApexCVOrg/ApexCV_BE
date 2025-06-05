// check-env.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('=== KIỂM TRA BIẾN MÔI TRƯỜNG ===');
console.log('Thư mục hiện tại:', process.cwd());
console.log('File .env tồn tại:', fs.existsSync('.env'));

if (fs.existsSync('.env')) {
    console.log('✅ File .env được tìm thấy');
    const content = fs.readFileSync('.env', 'utf8');
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log('Số dòng cấu hình:', lines.length);
} else {
    console.log('❌ File .env KHÔNG tồn tại');
    console.log('Tạo file .env trong thư mục này!');
}

console.log('\n=== BIẾN MÔI TRƯỜNG ===');
console.log('GMAIL_USER:', process.env.GMAIL_USER || 'CHƯA ĐẶT');
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? 'ĐÃ ĐẶT' : 'CHƯA ĐẶT');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'ĐÃ ĐẶT' : 'CHƯA ĐẶT');
