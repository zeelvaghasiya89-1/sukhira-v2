const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

async function uploadFileBuffer(buffer, fileName, contentType) {
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT;
  const bucketName = process.env.R2_BUCKET_NAME || 'sukhira-media';
  const customDomain = process.env.R2_CUSTOM_DOMAIN;

  if (!accessKey || !secretKey || !endpoint) {
    // Simulator Mode: Save file locally in the backend public uploads directory
    console.log('[R2 Simulator] Saving file locally on Express server:', fileName);
    
    const fileBaseName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const relativePath = `/uploads/${fileBaseName}`;
    
    // Save inside backend public/uploads
    const targetDir = path.join(__dirname, '../../public/uploads');
    
    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, fileBaseName), buffer);
    } catch (err) {
      console.error(`Failed to write local mock upload:`, err.message);
    }

    return relativePath;
  }

  // Live R2 Mode
  try {
    const s3 = new S3Client({
      endpoint,
      region: 'auto',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      }
    });

    const key = `products/${Date.now()}_${fileName}`;
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType
    }));

    if (customDomain) {
      return `${customDomain.replace(/\/$/, '')}/${key}`;
    }
    return `${endpoint.replace(/\/$/, '')}/${bucketName}/${key}`;
  } catch (err) {
    console.error('R2 live upload error:', err);
    throw err;
  }
}

module.exports = {
  uploadFileBuffer
};
