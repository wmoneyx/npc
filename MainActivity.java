package com.example.auravpn;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.widget.Toast;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private static final int SYSTEM_ALERT_WINDOW_PERMISSION = 2084;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Kiểm tra quyền Display over other apps (từ Android 6.0 trở lên)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            askPermission();
        } else {
            startFloatingService();
        }
    }

    private void askPermission() {
        Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getPackageName()));
        startActivityForResult(intent, SYSTEM_ALERT_WINDOW_PERMISSION);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == SYSTEM_ALERT_WINDOW_PERMISSION) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && Settings.canDrawOverlays(this)) {
                startFloatingService();
            } else {
                Toast.makeText(this, "Cần cấp quyền để hiển thị Menu nổi!", Toast.LENGTH_SHORT).show();
                finish();
            }
        }
    }

    private void startFloatingService() {
        Intent intent = new Intent(MainActivity.this, FloatingService.class);
        startService(intent);
        // Đóng app chính sau khi bật service
        finish();
    }
}
