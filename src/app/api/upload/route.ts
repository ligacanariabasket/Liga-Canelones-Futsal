
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
// The SDK can read the CLOUDINARY_URL directly
cloudinary.config();

export async function POST(request: Request) {
  try {
    const fileBuffer = await request.arrayBuffer();
    const mime = request.headers.get('content-type') || 'application/octet-stream';

    if (!fileBuffer || fileBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'liga-futsal-blog',
    });

    return NextResponse.json({ url: result.secure_url }, { status: 200 });

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Failed to upload image.' },
      { status: 500 }
    );
  }
}
