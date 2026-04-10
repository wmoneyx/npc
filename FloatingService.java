package com.example.auravpn;

import android.app.Service;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;

public class FloatingService extends Service {

    private WindowManager windowManager;
    private View floatingView;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        // Khởi tạo View từ layout
        floatingView = LayoutInflater.from(this).inflate(R.layout.layout_floating_widget, null);

        // Thiết lập thông số cho WindowManager
        int layoutFlag;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            layoutFlag = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            layoutFlag = WindowManager.LayoutParams.TYPE_PHONE;
        }

        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                layoutFlag,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT);

        // Vị trí ban đầu
        params.gravity = Gravity.TOP | Gravity.LEFT;
        params.x = 0;
        params.y = 100;

        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        windowManager.addView(floatingView, params);

        // Xử lý sự kiện chạm và kéo thả
        View rootContainer = floatingView.findViewById(R.id.root_container);
        rootContainer.setOnTouchListener(new View.OnTouchListener() {
            private int initialX;
            private int initialY;
            private float initialTouchX;
            private float initialTouchY;
            private boolean isClick;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x;
                        initialY = params.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        isClick = true;
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        // Tính toán khoảng cách di chuyển
                        int diffX = (int) (event.getRawX() - initialTouchX);
                        int diffY = (int) (event.getRawY() - initialTouchY);
                        
                        // Nếu di chuyển quá 10px thì không tính là click nữa
                        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
                            isClick = false;
                        }

                        // Cập nhật vị trí
                        params.x = initialX + diffX;
                        params.y = initialY + diffY;
                        windowManager.updateViewLayout(floatingView, params);
                        return true;

                    case MotionEvent.ACTION_UP:
                        if (isClick) {
                            // Xử lý sự kiện Click vào icon ở đây
                            Toast.makeText(FloatingService.this, "Đã bấm vào Tâm Ngắm!", Toast.LENGTH_SHORT).show();
                        }
                        return true;
                }
                return false;
            }
        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (floatingView != null) {
            windowManager.removeView(floatingView);
        }
    }
}
