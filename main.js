// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // إنشاء نافذة المتصفح.
    const mainWindow = new BrowserWindow({
        width: 1000, // عرض النافذة الافتراضي
        height: 800, // ارتفاع النافذة الافتراضي
        minWidth: 800, // الحد الأدنى لعرض النافذة
        minHeight: 600, // الحد الأدنى لارتفاع النافذة
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // ملف preload (يمكن أن يكون فارغًا إذا لم تكن هناك حاجة لـ Node.js APIs في Renderer)
            nodeIntegration: false, // تعطيل دمج Node.js في Renderer للحماية
            contextIsolation: true, // عزل السياق لزيادة الأمان
            enableRemoteModule: false // تعطيل وحدة remote للحماية
        }
    });

    // تحميل ملف index.html الخاص بالتطبيق.
    mainWindow.loadFile('index.html');

    // فتح أدوات المطور (DevTools) بشكل اختياري.
    // mainWindow.webContents.openDevTools();
}

// سيتم استدعاء هذه الميثود عندما ينتهي Electron من التهيئة
// وجاهز لإنشاء نوافذ المتصفح.
// بعض واجهات برمجة التطبيقات يمكن استخدامها فقط بعد حدوث هذا الحدث.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // في نظام macOS، من الشائع إعادة إنشاء نافذة في التطبيق
        // عندما يتم النقر على أيقونة الدوك ولا توجد نوافذ أخرى مفتوحة.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// إنهاء التطبيق عندما يتم إغلاق جميع النوافذ، باستثناء macOS.
// في نظام macOS، تظل التطبيقات عادة نشطة حتى يقوم المستخدم بـ Cmd + Q بشكل صريح.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// يمكنك إضافة المزيد من منطق Electron هنا، مثل IPC (الاتصال بين العمليات)
// إذا كنت بحاجة إلى التفاعل بين عملية main و renderer.
