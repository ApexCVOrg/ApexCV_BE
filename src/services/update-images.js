const { exec } = require('child_process');
const path = require('path');

console.log('🔄 Starting product image updates...');

// Run the TypeScript file using ts-node
const scriptPath = path.join(__dirname, 'src/scripts/updateProductImages.ts');

exec(`npx ts-node ${scriptPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error running image update script:', error);
    return;
  }
  
  if (stderr) {
    console.error('⚠️ Script warnings:', stderr);
  }
  
  console.log('✅ Image update script completed successfully');
  console.log('📝 Output:', stdout);
}); 