package com.mwdhrmaaa.framera;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class FrameraNativeBridge {
    private final Context context;
    private final Handler mainHandler;

    public FrameraNativeBridge(Context context) {
        this.context = context;
        this.mainHandler = new Handler(Looper.getMainLooper());
    }

    @JavascriptInterface
    public boolean isNativeApp() {
        return true;
    }

    @JavascriptInterface
    public void saveImageToGallery(String base64Data, String filename) {
        if (base64Data == null || base64Data.isEmpty()) return;

        new Thread(() -> {
            try {
                String cleanBase64 = base64Data.contains(",")
                        ? base64Data.substring(base64Data.indexOf(",") + 1)
                        : base64Data;
                byte[] imageBytes = Base64.decode(cleanBase64, Base64.DEFAULT);

                String name = (filename != null && !filename.isEmpty()) ? filename : "framera-" + System.currentTimeMillis() + ".png";
                String mimeType = name.endsWith(".jpg") || name.endsWith(".jpeg") ? "image/jpeg" : "image/png";

                ContentResolver resolver = context.getContentResolver();
                ContentValues contentValues = new ContentValues();
                contentValues.put(MediaStore.Images.Media.DISPLAY_NAME, name);
                contentValues.put(MediaStore.Images.Media.MIME_TYPE, mimeType);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    contentValues.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/Framera");
                    contentValues.put(MediaStore.Images.Media.IS_PENDING, 1);
                }

                Uri uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues);
                if (uri != null) {
                    try (OutputStream out = resolver.openOutputStream(uri)) {
                        if (out != null) {
                            out.write(imageBytes);
                            out.flush();
                        }
                    }

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        contentValues.clear();
                        contentValues.put(MediaStore.Images.Media.IS_PENDING, 0);
                        resolver.update(uri, contentValues, null, null);
                    }

                    mainHandler.post(() -> Toast.makeText(context, "Saved to Gallery: " + name, Toast.LENGTH_SHORT).show());
                }
            } catch (Exception e) {
                mainHandler.post(() -> Toast.makeText(context, "Export failed: " + e.getMessage(), Toast.LENGTH_SHORT).show());
            }
        }).start();
    }

    @JavascriptInterface
    public void shareImage(String base64Data, String title) {
        if (base64Data == null || base64Data.isEmpty()) return;

        new Thread(() -> {
            try {
                String cleanBase64 = base64Data.contains(",")
                        ? base64Data.substring(base64Data.indexOf(",") + 1)
                        : base64Data;
                byte[] imageBytes = Base64.decode(cleanBase64, Base64.DEFAULT);

                File cachePath = new File(context.getCacheDir(), "images");
                if (!cachePath.exists()) cachePath.mkdirs();

                File file = new File(cachePath, "framera_share.png");
                try (FileOutputStream stream = new FileOutputStream(file)) {
                    stream.write(imageBytes);
                }

                Uri contentUri = androidx.core.content.FileProvider.getUriForFile(
                        context,
                        context.getPackageName() + ".fileprovider",
                        file
                );

                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType("image/png");
                shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                mainHandler.post(() -> {
                    Intent chooser = Intent.createChooser(shareIntent, title != null ? title : "Share Framera Photo");
                    chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(chooser);
                });
            } catch (Exception e) {
                mainHandler.post(() -> Toast.makeText(context, "Share failed: " + e.getMessage(), Toast.LENGTH_SHORT).show());
            }
        }).start();
    }
}
